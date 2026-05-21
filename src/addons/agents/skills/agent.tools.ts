import { ISkillContext, parseToolKey } from 'castellan/core';
import { z } from 'zod';
import { 
    agentRunContract,
} from './agent.contract.js';
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
        if (run) {
            await ctx.api.agent_run.update({ id: run.id, status: 'waiting_for_approval' });
        }
    }
}

/**
 * handle_tool_completion: Executes the tool and continues the loop if necessary.
 */
export async function handle_tool_completion(
    toolCallId: string,
    ctx: ISkillContext
): Promise<void> {
    const call = await ctx.api.tool_calls.get({ id: toolCallId });
    if (!call) return;

    if (call.status === 'approved') {
        // Transition run back to 'running' if it was waiting
        const runs = await ctx.api.agent_run.find({ query: { threadId: call.threadId, status: 'waiting_for_approval' } });
        for (const run of runs) {
            await ctx.api.agent_run.update({ id: run.id, status: 'running' });
        }

        // Execute Tool
        await ctx.api.tool_calls.update({ id: call.id, status: 'executing' });

        try {
            const { domain, action } = parseToolKey(call.name);

            const skill = ctx.skills.getSkill(domain);
            if (!skill) throw new Error(`Domain ${domain} not found`);

            const result = await skill.execute(domain, action, call.arguments, ctx);

            let finalizedResult: string;
            if (typeof result === 'string') {
                finalizedResult = result;
            } else if (result && typeof result === 'object' && Symbol.asyncIterator in result) {
                // Collect stream
                let full = '';
                for await (const chunk of result as AsyncIterable<unknown>) {
                    full += typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
                }
                finalizedResult = full;
            } else {
                finalizedResult = JSON.stringify(result, null, 2);
            }

            await ctx.api.tool_calls.update({
                id: call.id,
                status: 'completed',
                result: finalizedResult
            });

        } catch (err) {
            await ctx.api.tool_calls.update({
                id: call.id,
                status: 'failed',
                error: err instanceof Error ? err.message : String(err)
            });
        }
    } else if (call.status === 'completed' || call.status === 'failed' || call.status === 'rejected') {
        // Check message completion
        const siblingCalls = await ctx.api.tool_calls.find({ query: { messageId: call.messageId } });
        const allDone = siblingCalls.every(c => ['completed', 'failed', 'rejected'].includes(c.status));

        if (allDone) {
            console.log(`[AgentSkill] Message ${call.messageId} turn complete. Enqueueing follow-up inference.`);
            await ctx.api.infer_queue.create({ threadId: call.threadId, status: 'queued' });
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
    }
}
