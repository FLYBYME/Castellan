import { ISkillContext } from 'castellan/core';
import { z } from 'zod';
import { ChatRequest, Message, Ollama, Tool, ToolCall } from 'ollama';
import {
    inferChatContract,
    inferRefreshInventoryContract,
    inferApproveToolContract,
    inferAcquireOllamaContract,
    inferReleaseOllamaContract
} from './infer.contract.js';
import { zodToJsonSchema } from 'zod-to-json-schema';


/**
 * getToolDefinition: Formats a standard platform tool into an Ollama Tool representation.
 */
export async function getToolDefinition(toolName: string, ctx: ISkillContext): Promise<Tool | null> {

    const [domain, ...actionParts] = toolName.split('_');
    const action = actionParts.join('_');
    const skill = ctx.skills.getSkill(domain);
    if (!skill) return null;

    const contract = skill.getContracts().find((c) => c.action === action);
    if (!contract) return null;

    return {
        type: 'function',
        function: {
            name: toolName,
            description: contract.description,
            parameters: zodToJsonSchema(contract.inputSchema as any) as Record<string, unknown>,
        },
    };
}

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
    const systemMessage = await ctx.api.messages.find_one({ query: { threadId: input.threadId, role: 'system' } });

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
                    content: t.result ?? "",
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
            if (!toolDefinition) continue;

            tools.push(toolDefinition);
        }
        ollamaConfig.tools = tools;
    } else {
        ollamaConfig.format = thread.format;
    }

    // Resolve the Ollama instance base URL dynamically
    const modelRecord = await ctx.api.models.find_one({ query: { name: thread.model } });
    const { instance } = await ctx.api.infer.acquire_ollama({});

    if (!instance?.url) {
        throw new Error("Failed to acquire Ollama instance.");
    }


    const ollama = new Ollama({ host: instance.url });
    const response = await ollama.chat(ollamaConfig);

    let fullContent = '';
    let fullThinking = '';

    const message = await ctx.api.messages.create({
        threadId: input.threadId,
        role: 'assistant',
        content: '',
        thinking: '',
        status: 'processing'
    });

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
                const toolCall = await ctx.api.tool_calls.create({
                    threadId: input.threadId,
                    messageId: message.id,
                    name: t.function.name,
                    arguments: t.function.arguments,
                    status: 'pending_approval'
                });
                toolCalls.push(toolCall);
                await ctx.events.dispatch('infer:tool_call_requested', message.id, {
                    threadId: input.threadId,
                    toolCallId: toolCall.id
                });
            }
        }

        if (part.done) {
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

    await ctx.api.infer.release_ollama({ instanceId: instance.id });


    return { messageId: message.id };
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

export async function acquire_ollama(
    input: z.infer<typeof inferAcquireOllamaContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof inferAcquireOllamaContract.outputSchema>> {
    const instances = await ctx.api.ollama.find({ query: { status: 'online' } });
    console.log("instances", instances);
    for (const inst of instances) {
        const active = inst.activeRequests || 0;
        if (active < 1) {
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
