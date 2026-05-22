import { z } from 'zod';

/**
 * OllamaInstance: Represents a connection to an Ollama server.
 */
export const OllamaInstanceSchema = z.object({
    url: z.string().url().describe("The base URL of the Ollama server"),
    name: z.string().describe("Human-readable name"),
    status: z.enum(['online', 'offline', 'error']).describe("Connection status"),
    lastSeen: z.coerce.date().optional(),
    activeRequests: z.number().optional().describe("Current concurrent requests (Hard limit: 1)"),
});
export type OllamaInstance = z.infer<typeof OllamaInstanceSchema>;

export const MetricsSchema = z.object({
    total_duration: z.preprocess((val) => val ?? 0, z.number().default(0)),
    load_duration: z.preprocess((val) => val ?? 0, z.number().default(0)),
    prompt_eval_count: z.preprocess((val) => val ?? 0, z.number().default(0)),
    prompt_eval_duration: z.preprocess((val) => val ?? 0, z.number().default(0)),
    eval_count: z.preprocess((val) => val ?? 0, z.number().default(0)),
    eval_duration: z.preprocess((val) => val ?? 0, z.number().default(0)),
});

/**
 * Thread: A session or high-level "run" container.
 */
export const ThreadSchema = z.object({
    title: z.string().optional(),
    status: z.enum(['active', 'paused', 'completed', 'failed']),
    model: z.string().describe("Model name or identifier used"),
    options: z.object({
        num_ctx: z.number().optional().default(16 * 1024).describe("Number of tokens to use as context"),
        temperature: z.number().optional().default(0.1).describe("Sampling temperature"),
    }).optional().describe("Model options"),
    tools: z.array(z.string()).optional().describe("List of tool names enabled"),
    format: z.any().optional().describe("Response format constraint (e.g. 'json')"),
    metrics: MetricsSchema.optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    autoApproveDestructiveTools: z.boolean().default(false).describe("Auto-approve destructive tools"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Thread = z.infer<typeof ThreadSchema>;

/**
 * Message: Pure communication records (no tool calls/results here).
 */
export const MessageSchema = z.object({
    threadId: z.string().describe("Parent thread"),
    role: z.enum(['system', 'user', 'assistant', 'thought']),
    content: z.string().describe("Text content"),
    thinking: z.string().optional().describe("Chain of thought"),
    status: z.enum(['processing', 'done', 'failed', 'aborted']).optional().describe("Execution status"),
    toolCallCount: z.number().optional().describe("Number of tool calls"),
    metrics: MetricsSchema.optional().describe("Inference performance metrics"),
    createdAt: z.coerce.date(),
});
export type Message = z.infer<typeof MessageSchema>;

/**
 * ToolCallRecord: Decoupled tool execution record.
 */
export const ToolCallRecordSchema = z.object({
    threadId: z.string().describe("Parent thread"),
    messageId: z.string().describe("Parent message ID"),
    name: z.string().describe("Target tool name"),
    arguments: z.record(z.string(), z.unknown()).describe("JSON arguments"),
    status: z.enum(['pending_approval', 'approved', 'rejected', 'executing', 'completed', 'failed']),
    result: z.string().optional().describe("Output of the tool"),
    metrics: z.object({
        duration: z.number().optional(),
        startedAt: z.coerce.date().optional(),
        finishedAt: z.coerce.date().optional(),
    }).optional(),
    error: z.string().optional(),
});
export type ToolCallRecord = z.infer<typeof ToolCallRecordSchema>;

/**
 * Model: Cached inventory.
 */
export const ModelSchema = z.object({
    instanceId: z.string(),
    name: z.string(),
    size: z.number(),
    digest: z.string(),
    format: z.string().optional(),
    family: z.string().optional(),
    parameterSize: z.string().optional(),
    quantizationLevel: z.string().optional(),
});
export type Model = z.infer<typeof ModelSchema>;

/**
 * InferQueue: Durably tracks pending inference requests.
 */
export const InferQueueStatusSchema = z.enum(['queued', 'processing', 'completed', 'failed']);

export const InferQueueSchema = z.object({
    threadId: z.string().describe("The conversation thread to run inference on"),
    status: InferQueueStatusSchema.default('queued').describe("Current status in the queue"),
    retryCount: z.number().default(0).describe("Number of times this has been retried"),
    error: z.string().optional().describe("Error message if failed"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type InferQueue = z.infer<typeof InferQueueSchema>;
