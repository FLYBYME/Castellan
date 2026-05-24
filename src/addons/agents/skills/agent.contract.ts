import { z } from 'zod';
import { defineContract, defineCrud, defaultPrint } from '@flybyme/castellan/core';
import { AgentSchema, AgentRunSchema } from './agent.schema.js';

/**
 * --- CRUD Contracts ---
 */

export const agentCrud = defineCrud('agent', AgentSchema);

export const agentRunCrud = defineCrud('agent_run', AgentRunSchema, {
    pluralPath: 'agent_runs'
});

/**
 * --- Tool Contracts ---
 */

export const AgentRunInputSchema = z.object({
    agentId: z.string().describe("The agent to run"),
    threadId: z.string().describe("The thread to run in"),
    autoApprove: z.boolean().optional().default(false).describe("If true, all tools are auto-approved for this run"),
    prompt: z.string().optional().describe("Optional user prompt to seed the thread with"),
    wait: z.boolean().optional().default(false).describe("If true, wait for the run to complete before returning")
});

export const AgentRunOutputSchema = z.object({
    runId: z.string().describe("The ID of the created Agent Run record")
});

export const agentRunContract = defineContract({
    domain: 'agent',
    action: 'run',
    description: 'Start an autonomous execution turn for a specific agent.',
    inputSchema: AgentRunInputSchema,
    outputSchema: AgentRunOutputSchema,
    rest: { method: 'POST', path: '/agent/run' },
    print: (output) => `Autonomous agent run started. Run ID: **${output.runId}**`
});

export const AgentStructuredInferInputSchema = z.object({
    threadId: z.string().describe("The thread context"),
    model: z.string().optional().describe("Override model to use"),
    format: z.record(z.string(), z.unknown()).describe("JSON schema for the output format")
});

export const AgentStructuredInferOutputSchema = z.object({
    data: z.record(z.string(), z.unknown()).describe("The structured response data")
});

export const agentStructuredInferContract = defineContract({
    domain: 'agent',
    action: 'structured_infer',
    description: 'Perform a structured completion using a JSON schema format.',
    inputSchema: AgentStructuredInferInputSchema,
    outputSchema: AgentStructuredInferOutputSchema,
    rest: { method: 'POST', path: '/agent/structured' },
    print: (output) => `
### Structured Inference Result
\`\`\`json
${JSON.stringify(output.data, null, 2)}
\`\`\`
    `.trim()
});
