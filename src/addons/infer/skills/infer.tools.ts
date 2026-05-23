import { ISkillContext, parseToolKey } from 'castellan/core';
import { z } from 'zod';
import { ChatRequest, Message, Ollama, Tool, ToolCall } from 'ollama';
import {
    inferChatContract,
    inferRefreshInventoryContract,
    inferApproveToolContract,
    inferAcquireOllamaContract,
    inferReleaseOllamaContract,
    inferStructuredChatContract,
    inferRejectToolContract,
    toolCallCrud,
    inferQueueStatusContract
} from './infer.contract.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { agentStructuredInferContract } from 'src/addons/agents/skills/agent.contract.js';

import {
    OllamaInstanceSchema,
    ModelSchema,
    ThreadSchema,
    MessageSchema,
    ToolCallRecordSchema,
    InferQueueSchema
} from './infer.schema.js';

/**
 * getToolDefinition: Formats a standard platform tool into an Ollama Tool representation.
 */
export async function getToolDefinition(toolName: string, ctx: ISkillContext): Promise<Tool | null> {

    const { domain, action } = parseToolKey(toolName);
    const skill = ctx.skills.getSkill(domain);
    if (!skill) {
        console.error(`Skill ${domain} not found.`);
        return null;
    }

    const contract = skill.getContracts().find((c) => c.action === action);
    if (!contract) {
        console.error(`Contract ${action} not found in skill ${domain}.`);
        return null;
    }

    return {
        type: 'function',
        function: {
            name: toolName,
            description: contract.description,
            parameters: zodToJsonSchema(contract.inputSchema as any) as Record<string, unknown>,
        },
    };
}


type ToolCallSchemaType = z.infer<typeof toolCallCrud.baseSchema>;

/**
 * infer_chat: Stateful, throttled, and stateless-resumable reasoning.
 * DO NOT CHANGE THIS FUNCTION.
 */
export async function infer_chat(
    input: z.infer<typeof inferChatContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferChatContract.outputSchema>> {
    // 1. Initialize/Retrieve Thread
    const thread = await ctx.api.threads.get({ id: input.threadId });
    if (!thread) {
        throw new Error(`Thread ${input.threadId} not found.`);
    }

    if (thread.status === 'completed') {
        throw new Error(`Thread ${input.threadId} is completed.`);
    }

    //Get messages and tool calls

    const messages = await ctx.api.messages.find({ query: { threadId: input.threadId } });
    const toolcalls = await ctx.api.tool_calls.find({ query: { threadId: input.threadId } });
    // Get the latest system message
    const systemMessage = await ctx.api.messages.find_one({
        query: {
            threadId: input.threadId, role: 'system'
        },
        sort: 'createdAt:desc'
    });

    const constructedHistory: Message[] = [];

    if (systemMessage) {
        constructedHistory.push({
            role: 'system',
            content: systemMessage.content
        });
    }

    for (const m of messages) {
        if (m.role === 'system') continue;
        const messageId = m.id;
        const message: Message = {
            role: m.role,
            content: m.content,
            thinking: m.thinking,
            tool_calls: []
        };
        constructedHistory.push(message);

        for (const t of toolcalls) {
            if (t.messageId === messageId) {
                message.tool_calls?.push({
                    function: {
                        name: t.name,
                        arguments: t.arguments
                    }
                });
                constructedHistory.push({
                    role: "tool",
                    content: t.result ? t.result : t.error ?? 'No result or error provided'
                });
            }
        };
    }

    const ollamaConfig: ChatRequest & {
        stream: true;
    } = {
        model: thread.model,
        messages: constructedHistory,
        options: thread.options,
        stream: true,
    };


    if (!thread.format && thread.tools) {
        const tools: Tool[] = [];
        for (const toolName of thread.tools) {
            const toolDefinition = await getToolDefinition(toolName, ctx);
            if (!toolDefinition) {
                console.error(`Tool ${toolName} not found.`);
                continue;
            }
            console.log(`Tool ${toolName} found.`);

            tools.push(toolDefinition);
        }
        ollamaConfig.tools = tools;
    } else {
        // This is where the structured data is being requested
        ollamaConfig.format = thread.format;
    }

    // Resolve the Ollama instance base URL dynamically
    let instance;
    let shouldRelease = false;

    if (input.instanceId) {
        instance = await ctx.api.ollama.get({ id: input.instanceId });
        if (!instance) throw new Error(`Provided Ollama instance ${input.instanceId} not found.`);
    } else {
        const result = await ctx.api.infer.acquire_ollama({});
        instance = result.instance;
        shouldRelease = true;
    }

    if (!instance?.url) {
        throw new Error("Failed to acquire Ollama instance.");
    }

    const ollama = new Ollama({ host: instance.url });

    let fullContent = '';
    let fullThinking = '';

    const message = await ctx.api.messages.create({
        threadId: input.threadId,
        role: 'assistant',
        content: '',
        thinking: '',
        status: 'processing'
    });

    const response = await ollama.chat(ollamaConfig);

    const toolCalls = [];

    for await (const part of response) {
        if (ctx.signal?.aborted) {
            await ctx.api.messages.update({
                id: message.id,
                content: fullContent,
                thinking: fullThinking,
                status: 'aborted',
            });
            await ctx.events.dispatch('infer:aborted', message.id, {
                threadId: input.threadId,
                messageId: message.id
            });
            response.abort();
            break;
        }

        if (part.message?.thinking) {
            fullThinking += part.message.thinking;
            await ctx.events.dispatch('infer:thinking_chunk', message.id, {
                threadId: input.threadId,
                delta: part.message.thinking
            });
        }

        if (part.message?.content) {
            fullContent += part.message.content;
            ctx.events.dispatch('infer:content_chunk', message.id, {
                threadId: input.threadId,
                delta: part.message.content
            });
        }

        if (part.message?.tool_calls) {
            for (const t of part.message.tool_calls) {
                const toolCallConfig: ToolCallSchemaType = {
                    threadId: input.threadId,
                    messageId: message.id,
                    name: t.function.name,
                    arguments: t.function.arguments,
                    status: 'pending_approval'
                };
                const tool = await ctx.skills.getTool(toolCallConfig.name);

                if (!tool) {
                    toolCallConfig.status = 'failed';
                    toolCallConfig.error = 'Tool not found.';
                } else {
                    try {
                        const parsed = tool.inputSchema.safeParse(t.function.arguments);
                        if (!parsed.success) {
                            toolCallConfig.status = 'failed';
                            toolCallConfig.error = parsed.error.message;
                        } else {
                            toolCallConfig.arguments = parsed.data;

                            if (tool.destructive && !thread.autoApproveDestructiveTools) {
                                toolCallConfig.status = 'pending_approval';
                            } else {
                                toolCallConfig.status = 'approved';
                            }

                        }
                    } catch (error) {
                        toolCallConfig.status = 'failed';
                        toolCallConfig.error = error as string;
                    }
                }


                const toolCall = await ctx.api.tool_calls.create(toolCallConfig);
                toolCalls.push(toolCall);

                if (toolCallConfig.status === 'pending_approval') {
                    await ctx.events.dispatch('infer:tool_call_requested', message.id, {
                        threadId: input.threadId,
                        toolCallId: toolCall.id
                    });
                }
                else if (toolCallConfig.status === 'failed') {
                    await ctx.events.dispatch('infer:tool_call_failed', message.id, {
                        threadId: input.threadId,
                        toolCallId: toolCall.id,
                        error: toolCallConfig.error
                    });
                } else {
                    await ctx.events.dispatch('infer:tool_call_auto_approved', message.id, {
                        threadId: input.threadId,
                        toolCallId: toolCall.id,
                    });
                }
            }
        }

        if (part.done) {
            if (shouldRelease) {
                await ctx.api.infer.release_ollama({ instanceId: instance.id });
            }
            const metrics = {
                total_duration: part.total_duration,
                load_duration: part.load_duration,
                prompt_eval_count: part.prompt_eval_count,
                prompt_eval_duration: part.prompt_eval_duration,
                eval_count: part.eval_count,
                eval_duration: part.eval_duration,
            };

            await ctx.api.messages.update({
                id: message.id,
                content: fullContent,
                thinking: fullThinking,
                status: 'done',
                toolCallCount: toolCalls.length,
                metrics,
            });

            await ctx.api.threads.update({
                id: input.threadId,
                metrics: {
                    total_duration: (thread.metrics?.total_duration ?? 0) + (metrics.total_duration ?? 0),
                    load_duration: (thread.metrics?.load_duration ?? 0) + (metrics.load_duration ?? 0),
                    prompt_eval_count: (thread.metrics?.prompt_eval_count ?? 0) + (metrics.prompt_eval_count ?? 0),
                    prompt_eval_duration: (thread.metrics?.prompt_eval_duration ?? 0) + (metrics.prompt_eval_duration ?? 0),
                    eval_count: (thread.metrics?.eval_count ?? 0) + (metrics.eval_count ?? 0),
                    eval_duration: (thread.metrics?.eval_duration ?? 0) + (metrics.eval_duration ?? 0),
                }
            });
            await ctx.events.dispatch('infer:completed', message.id, {
                threadId: input.threadId,
                messageId: message.id
            });
        }
    }



    return { messageId: message.id };
}

/**
/**
 * agent_structured_infer: High-level structured inference for agents.
 */
export async function agent_structured_infer(
    input: z.infer<typeof agentStructuredInferContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof agentStructuredInferContract.outputSchema>> {
    throw new Error('Deprecated use agent_infer instead');
}


export async function refresh_inventory(
    input: z.infer<typeof inferRefreshInventoryContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferRefreshInventoryContract.outputSchema>> {
    const query = input.instanceId ? { id: input.instanceId } : {};
    const instances = await ctx.api.ollama.find({ query });
    let updatedInstances = 0;

    for (const inst of instances) {
        try {
            const client = new Ollama({ host: inst.url });
            const resp = await client.list();

            await ctx.api.ollama.update({ id: inst.id, status: 'online', lastSeen: new Date() });

            for (const m of resp.models) {
                const existing = await ctx.api.models.find_one({
                    query: {
                        instanceId: inst.id,
                        name: m.name
                    }
                });

                if (existing) {
                    await ctx.api.models.update({
                        id: existing.id,
                        size: m.size,
                        digest: m.digest,
                        format: m.details.format,
                        family: m.details.family,
                        parameterSize: m.details.parameter_size,
                        quantizationLevel: m.details.quantization_level,
                    });
                } else {
                    await ctx.api.models.create({
                        instanceId: inst.id,
                        name: m.name,
                        size: m.size,
                        digest: m.digest,
                        format: m.details.format,
                        family: m.details.family,
                        parameterSize: m.details.parameter_size,
                        quantizationLevel: m.details.quantization_level,
                    });
                }
            }
            updatedInstances++;
        } catch (err) {
            await ctx.api.ollama.update({ id: inst.id, status: 'error' });
        }
    }
    return { success: true, updatedInstances };
}

export async function approve_tool(
    input: z.infer<typeof inferApproveToolContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferApproveToolContract.outputSchema>> {
    const call = await ctx.api.tool_calls.find_one({ query: { id: input.toolCallId } });
    if (!call) throw new Error("Tool call not found");

    await ctx.api.tool_calls.update({ id: call.id, status: 'approved' });

    // In a stateless system, this tool simply marks approval.
    // The "Resumption" is handled by the agent loop or a background worker
    // that watches for 'approved' tool calls.

    return { success: true };
}

export async function reject_tool(
    input: z.infer<typeof inferRejectToolContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferRejectToolContract.outputSchema>> {
    const call = await ctx.api.tool_calls.find_one({ query: { id: input.toolCallId } });
    if (!call) throw new Error("Tool call not found");

    await ctx.api.tool_calls.update({
        id: call.id,
        status: 'rejected',
        error: input.reason ?? 'Rejected by user'
    });

    return { success: true };
}


export async function acquire_ollama(
    input: z.infer<typeof inferAcquireOllamaContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferAcquireOllamaContract.outputSchema>> {
    const instances = await ctx.api.ollama.find({ query: { status: 'online' } });
    console.log("instances", instances);
    for (const inst of instances) {
        const active = inst.activeRequests || 0;
        if (active < 10) {
            // Attempt to claim the node by updating its activeRequests count
            const updated = await ctx.api.ollama.update({
                id: inst.id,
                activeRequests: 1
            });
            if (updated && updated.activeRequests === 1) {
                return {
                    success: true,
                    instance: updated,
                    message: `Successfully acquired Ollama node: ${updated.name}`
                };
            }
        }
    }

    return {
        success: false,
        message: "All registered Ollama instances are currently busy."
    };
}

export async function release_ollama(
    input: z.infer<typeof inferReleaseOllamaContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferReleaseOllamaContract.outputSchema>> {
    await ctx.api.ollama.update({
        id: input.instanceId,
        activeRequests: 0
    });
    return { success: true };
}

/**
 * process_infer_queue: Picks up a queued request and executes it.
 */
export async function process_infer_queue(
    queueId: string,
    ctx: ISkillContext
): Promise<void> {
    const item = await ctx.api.infer_queue.get({ id: queueId });
    if (!item || item.status !== 'queued') return;

    // 1. Mark as processing
    await ctx.api.infer_queue.update({ id: item.id, status: 'processing' });

    try {
        // 2. Acquire Ollama instance
        const { success, instance } = await ctx.api.infer.acquire_ollama({});
        if (!success || !instance) {
            // No resources, put back in queue
            await ctx.api.infer_queue.update({ id: item.id, status: 'queued' });
            return;
        }

        try {
            // 3. Execute Chat
            console.log(`[InferSkill] Processing queued inference for thread: ${item.threadId} on instance ${instance.name}`);
            await infer_chat({
                threadId: item.threadId,
                instanceId: instance.id
            }, ctx);

            // 4. Mark as completed
            await ctx.api.infer_queue.update({ id: item.id, status: 'completed' });

        } finally {
            // 5. Always release the instance
            await ctx.api.infer.release_ollama({ instanceId: instance.id });
        }

    } catch (err) {
        console.error(`[InferSkill] Queue processing failed for ${queueId}:`, err);
        await ctx.api.infer_queue.update({
            id: item.id,
            status: 'failed',
            error: err instanceof Error ? err.message : String(err)
        });
    }
}

/**
 * queue_status: Returns the status counts of the inference queue.
 */
export async function queue_status(
    _input: z.infer<typeof inferQueueStatusContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferQueueStatusContract.outputSchema>> {
    const queuedCount = await ctx.api.infer_queue.count({ query: { status: 'queued' } });
    const processingCount = await ctx.api.infer_queue.count({ query: { status: 'processing' } });
    const completedCount = await ctx.api.infer_queue.count({ query: { status: 'completed' } });
    const failedCount = await ctx.api.infer_queue.count({ query: { status: 'failed' } });
    const totalCount = await ctx.api.infer_queue.count({ query: {} });

    return {
        queued: queuedCount,
        processing: processingCount,
        completed: completedCount,
        failed: failedCount,
        total: totalCount
    };
}
