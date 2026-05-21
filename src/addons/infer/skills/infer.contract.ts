import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import {
    OllamaInstanceSchema,
    ModelSchema,
    ThreadSchema,
    MessageSchema,
    ToolCallRecordSchema,
    InferQueueSchema
} from './infer.schema.js';

/**
 * --- Event Augmentation ---
 */
declare module '../../../core/events.js' {
    interface EventRegistry {
        'infer:inventory_updated': { instanceId: string; modelCount: number };
        'infer:request_queued': { threadId: string; model: string };
        'infer:request_started': { model: string; instanceId: string };
        'infer:request_finished': { model: string; duration: number; tokens: number };
        'infer:tool_call_created': { id: string; threadId: string; name: string };
        'infer:tool_call_completed': { id: string; threadId: string; success: boolean };
        'infer:thinking_chunk': { threadId: string; delta: string };
        'infer:content_chunk': { threadId: string; delta: string };
        'infer:tool_call_requested': { threadId: string; toolCallId: string };
        'infer:completed': { threadId: string; messageId: string };
        'infer:aborted': { threadId: string; messageId: string };
        'infer:queue_item_created': { id: string; threadId: string };
    }
}

/**
 * --- CRUD Contracts ---
 */
export const ollamaCrud = defineCrud('ollama', OllamaInstanceSchema, {
    pluralPath: 'ollama_instances',
});

export const modelCrud = defineCrud('models', ModelSchema);

export const threadCrud = defineCrud('threads', ThreadSchema);

export const messageCrud = defineCrud('messages', MessageSchema);

export const toolCallCrud = defineCrud('tool_calls', ToolCallRecordSchema);

export const inferQueueCrud = defineCrud('infer_queue', InferQueueSchema, {
    pluralPath: 'infer_queue',
});

/**
 * --- Tool Contracts ---
 */

export const ChatInputSchema = z.object({
    threadId: z.string().describe("The thread context for this chat"),
    instanceId: z.string().optional().describe("Optional Ollama instance to use (bypasses automatic acquisition)"),
});

export const ChatOutputSchema = z.object({
    messageId: z.string().describe("The ID of the created message.")
});

export const inferChatContract = defineContract({
    domain: 'infer',
    action: 'chat',
    description: 'Perform stateful chat completion within a thread.',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
    rest: { method: 'POST', path: '/infer/chat' }
});

export const inferApproveToolContract = defineContract({
    domain: 'infer',
    action: 'approve_tool',
    description: 'Approve a pending tool call for execution.',
    inputSchema: z.object({
        toolCallId: z.string()
    }),
    outputSchema: z.object({ success: z.boolean() }),
    rest: { method: 'POST', path: '/infer/approve' }
});

export const inferRefreshInventoryContract = defineContract({
    domain: 'infer',
    action: 'refresh_inventory',
    description: 'Force a refresh of the model inventory from all registered Ollama instances.',
    inputSchema: z.object({
        instanceId: z.string().optional().describe("Optionally refresh only a specific instance")
    }),
    outputSchema: z.object({ success: z.boolean(), updatedInstances: z.number() }),
    rest: { method: 'POST', path: '/infer/refresh' }
});

export const inferAcquireOllamaContract = defineContract({
    domain: 'infer',
    action: 'acquire_ollama',
    description: 'Atomically acquire the next available online Ollama instance.',
    inputSchema: z.object({}),
    outputSchema: z.object({
        success: z.boolean(),
        instance: ollamaCrud.outputSchema.optional(),
        message: z.string()
    }),
    rest: { method: 'POST', path: '/infer/ollama/acquire' },
    destructive: true
});

export const inferReleaseOllamaContract = defineContract({
    domain: 'infer',
    action: 'release_ollama',
    description: 'Release an acquired Ollama instance, decrementing its active request count.',
    inputSchema: z.object({
        instanceId: z.string().describe("The ID of the Ollama instance to release")
    }),
    outputSchema: z.object({
        success: z.boolean()
    }),
    rest: { method: 'POST', path: '/infer/ollama/release' },
    destructive: true
});

export const StructuredChatInputSchema = z.object({
    threadId: z.string().describe("The thread context for this chat"),
    model: z.string().optional().describe("Override model to use"),
    format: z.record(z.string(), z.unknown()).describe("JSON schema for the output format")
});

export const StructuredChatOutputSchema = z.object({
    data: z.record(z.string(), z.unknown()).describe("The structured response data")
});

export const inferStructuredChatContract = defineContract({
    domain: 'infer',
    action: 'structured_chat',
    description: 'Perform a structured completion using a JSON schema format.',
    inputSchema: StructuredChatInputSchema,
    outputSchema: StructuredChatOutputSchema,
    rest: { method: 'POST', path: '/infer/structured' }
});
