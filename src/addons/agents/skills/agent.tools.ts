import { globalContractRegistry, ISkillContext, parseToolKey } from '@flybyme/castellan/core';
import { z } from 'zod';
import {
    agentRunContract,
} from './agent.contract.js';
import { toolCallCrud } from 'src/addons/infer/skills/infer.contract.js';

export const pendingRunPromises = new Map<string, { resolve: () => void; reject: (err: Error) => void }>();

/**
 * agent_run: Starts an autonomous turn for an agent.
 */
export async function agent_run(
    input: z.infer<typeof agentRunContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof agentRunContract.outputSchema>> {

    // 1. Validate Agent & Thread
    const agent = await ctx.api.agent.get({ id: input.agentId });
    if (!agent) throw new Error(`Agent ${input.agentId} not found`);

    const thread = await ctx.api.threads.get({ id: input.threadId });
    if (!thread) throw new Error(`Thread ${input.threadId} not found`);


    // 3. Ensure System Prompt is in the thread
    const systemMessage = await ctx.api.messages.find_one({
        query: { threadId: input.threadId, role: 'system' },
        sort: ['-createdAt']
    });

    if (!systemMessage) {
        await ctx.api.messages.create({
            threadId: input.threadId,
            role: 'system',
            content: agent.systemPrompt
        });
    }

    // 4. Sync Agent Tools to Thread
    await ctx.api.threads.update({
        id: input.threadId,
        tools: agent.tools
    });

    // 5. Optional User Prompt
    if (input.prompt) {
        await ctx.api.messages.create({
            threadId: input.threadId,
            role: 'user',
            content: input.prompt
        });
    }

    // 6. Enqueue inference
    const queue = await ctx.api.infer_queue.create({ threadId: input.threadId, status: 'queued' });

    // 2. Create Run Record
    const run = await ctx.api.agent_run.create({
        agentId: input.agentId,
        threadId: input.threadId,
        queueId: queue.id,
        status: 'running',
        options: { autoApprove: input.autoApprove }
    });

    if (input.wait) {
        await new Promise<void>((resolve, reject) => {
            pendingRunPromises.set(run.id, { resolve, reject });
        });
    }

    return { runId: run.id };
}

/**
 * handle_tool_approval: Logic for auto-approving or waiting for human sign-off.
 */
export async function handle_tool_approval(
    toolCallId: string,
    ctx: ISkillContext
): Promise<void> {
    const call = await ctx.api.tool_calls.get({ id: toolCallId });
    if (!call) return;

    // Check if there is an active run for this thread
    const activeRuns = await ctx.api.agent_run.find({
        query: { threadId: call.threadId, status: 'running' },
        sort: ['-createdAt']
    });
    const run = activeRuns[0];

    if (run?.options?.autoApprove) {
        console.log(`[AgentSkill] Auto-approving tool call ${toolCallId}`);
        await ctx.api.infer.approve_tool({ toolCallId });
    } else {
        // Run status transitions to 'waiting_for_approval'
        if (run && run.status !== 'waiting_for_approval') {
            await ctx.api.agent_run.update({ id: run.id, status: 'waiting_for_approval' });
        }
    }
}

type ToolCallSchemaType = z.infer<typeof toolCallCrud.baseSchema>;
/**
 * handle_tool_completion: Executes the tool and continues the loop if necessary.
 */
export async function handle_tool_completion(
    toolCallId: string,
    ctx: ISkillContext
): Promise<void> {
    const call = await ctx.api.tool_calls.get({ id: toolCallId });
    if (!call) return;

    // 1. Get all sibling tool calls for this message
    const siblingCalls = await ctx.api.tool_calls.find({ query: { messageId: call.messageId } });

    // 2. Check if any tool call is still pending user approval/rejection
    const anyPending = siblingCalls.some(c => c.status === 'pending_approval');
    if (anyPending) {
        console.log(`[AgentSkill] Message ${call.messageId} still has pending tool calls. Waiting...`);
        return;
    }


    // 3. If we get here, all tool calls in the message are resolved.
    // Transition run back to 'running' if it was waiting
    const runs = await ctx.api.agent_run.find({ query: { threadId: call.threadId, status: 'waiting_for_approval' } });
    for (const run of runs) {
        await ctx.api.agent_run.update({ id: run.id, status: 'running' });
    }

    // 4. Find any tool calls that are approved and need execution
    const approvedCalls = siblingCalls.filter(c => c.status === 'approved');
    if (approvedCalls.length > 0) {
        console.log(`///////////////////////////////////////////////////`)
        for (const approvedCall of approvedCalls) {
            // Execute Tool
            await ctx.api.tool_calls.update({ id: approvedCall.id, status: 'executing' });

            try {
                const tool = ctx.skills.getTool(approvedCall.name);
                const toolContract = globalContractRegistry.get(approvedCall.name);

                if (!tool || !toolContract) {
                    console.log(`Tool ${approvedCall.name} not found`);
                    await ctx.api.tool_calls.update({
                        id: approvedCall.id,
                        status: 'failed',
                        error: `Tool ${approvedCall.name} not found`
                    });
                } else {
                    const skill = await ctx.skills.getSkill(toolContract.domain);
                    if (!skill) {
                        console.log(`Skill ${toolContract.domain} not found`);
                        await ctx.api.tool_calls.update({
                            id: approvedCall.id,
                            status: 'failed',
                            error: `Skill ${toolContract.domain} not found`
                        });
                        continue;
                    }

                    console.log(`Executing tool ${approvedCall.name}`);
                    const parsedArgs = toolContract.inputSchema.safeParse(approvedCall.arguments);
                    if (!parsedArgs.success) {
                        await ctx.api.tool_calls.update({
                            id: approvedCall.id,
                            status: 'failed',
                            error: `Invalid arguments: ${parsedArgs.error.message}`
                        });
                        continue;
                    }

                    // Execute tool
                    const apiDomain = (ctx.api as unknown as Record<string, Record<string, (args: unknown) => Promise<unknown>>>)[toolContract.domain];
                    const apiAction = apiDomain?.[toolContract.action];

                    const executePromise = apiAction
                        ? apiAction(parsedArgs.data)
                        : skill.execute(toolContract.domain, toolContract.action, parsedArgs.data, ctx);

                    await executePromise
                        .then(async (res) => {
                            const string = await toolContract.print(res);
                            console.log(`Tool ${approvedCall.name} completed`);
                            console.log(`Result: ${string}`);
                            await ctx.api.tool_calls.update({
                                id: approvedCall.id,
                                status: 'completed',
                                result: string
                            });
                            await ctx.events.dispatch('infer:tool_call_completed', approvedCall.messageId, {
                                threadId: approvedCall.threadId,
                                id: approvedCall.id,
                                success: true,
                            });
                        }).catch(async (err) => {
                            console.log(`Tool ${approvedCall.name} failed`);
                            console.log(`Error: ${err}`);
                            await ctx.api.tool_calls.update({
                                id: approvedCall.id,
                                status: 'failed',
                                error: err instanceof Error ? err.message : String(err)
                            });
                            await ctx.events.dispatch('infer:tool_call_failed', approvedCall.messageId, {
                                threadId: approvedCall.threadId,
                                toolCallId: approvedCall.id,
                                error: err instanceof Error ? err.message : String(err),
                            });
                        });

                }

            } catch (err) {
                console.log(`Tool ${approvedCall.name} failed`);
                console.log(`Error: ${err}`);
                await ctx.api.tool_calls.update({
                    id: approvedCall.id,
                    status: 'failed',
                    error: err instanceof Error ? err.message : String(err)
                });
            }
        }
    } else {
        // 5. If there are no approved calls to run, check if all calls are in their final state.
        // If they are all done, we enqueue the follow-up inference.
        const allDone = siblingCalls.every(c => ['completed', 'failed', 'rejected'].includes(c.status));
        if (allDone) {
            // Check if the message is actually finished (to avoid race conditions during creation)
            const msg = await ctx.api.messages.get({ id: call.messageId });
            if (msg?.status === 'done') {
                console.log(`[AgentSkill] Message ${call.messageId} turn complete. Enqueueing follow-up inference.`);
                await ctx.api.infer_queue.create({ threadId: call.threadId, status: 'queued' });
            }
        }
    }
}

/**
 * handle_inference_completion: Marks run as finished if no tool calls were made.
 */
export async function handle_inference_completion(
    threadId: string,
    messageId: string,
    ctx: ISkillContext
): Promise<void> {
    const activeRuns = await ctx.api.agent_run.find({ query: { threadId, status: 'running' } });
    const run = activeRuns[0];
    if (!run) return;

    const messageCalls = await ctx.api.tool_calls.find({ query: { messageId } });
    if (messageCalls.length === 0) {
        console.log(`[AgentSkill] Run ${run.id} finished (Assistant responded without tools).`);
        await ctx.api.agent_run.update({ id: run.id, status: 'finished' });
    } else {
        // If there ARE tool calls, check if they are all already terminal (e.g. failed/rejected)
        const allDone = messageCalls.every(c => ['completed', 'failed', 'rejected'].includes(c.status));
        if (allDone) {
            console.log(`[AgentSkill] Message ${messageId} turn complete (all tools terminal). Enqueueing follow-up.`);
            await ctx.api.infer_queue.create({ threadId, status: 'queued' });
        }
    }
}
