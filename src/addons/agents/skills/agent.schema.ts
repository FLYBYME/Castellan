import { z } from 'zod';

/**
 * Agent: Configuration for a specialized AI persona.
 */
export const AgentSchema = z.object({
    name: z.string().describe("Friendly name of the agent"),
    systemPrompt: z.string().describe("The operational mandate for the LLM"),
    model: z.string().describe("Model name or identifier to use (e.g. gemma4:e4b)"),
    config: z.object({
        temperature: z.number().optional().default(0.1),
        maxTokens: z.number().optional().default(4096),
    }).optional(),
    tools: z.array(z.string()).describe("List of tool names this agent is authorized to use (domain_action)"),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Agent = z.infer<typeof AgentSchema>;

/**
 * AgentRun: Tracks the lifecycle of an autonomous execution turn.
 */
export const AgentRunSchema = z.object({
    agentId: z.string().describe("The agent performing the run"),
    threadId: z.string().describe("The conversation context"),
    status: z.enum(['running', 'waiting_for_approval', 'finished', 'failed']),
    options: z.object({
        autoApprove: z.boolean().default(false).describe("If true, all tools are auto-approved"),
    }).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type AgentRun = z.infer<typeof AgentRunSchema>;
