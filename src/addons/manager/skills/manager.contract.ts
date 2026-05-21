import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import { PulseReportSchema } from './manager.schema.js';
import { agentCrud } from 'src/addons/agents/skills/agent.contract.js';

/**
 * Manager Ministry: The Central Directorate responsible for intent translation and agent delegation.
 */
export const domain = 'manager';

// ─── Core Interaction ────────────────────────────────────────────────────────

export const managerChatContract = defineContract({
    domain: 'manager',
    action: 'chat',
    description: 'The exclusive entry point for user interaction. Translates intent into agent missions.',
    inputSchema: z.object({
        prompt: z.string().describe("Your natural language request or instruction."),
        threadId: z.string().optional().describe("Persistent Directorate Thread ID.")
    }),
    outputSchema: z.object({
        response: z.string().describe("The Directorate's response or SITREP."),
        threadId: z.string()
    }),
    rest: { method: 'POST', path: '/manager/chat' },
    destructive: false
});

export const managerPulseContract = defineContract({
    domain: 'manager',
    action: 'pulse',
    description: 'Autonomous wake-up for system reconciliation and reporting.',
    inputSchema: z.object({
        force: z.boolean().optional().describe("Force a pulse regardless of schedule."),
        type: z.enum(['periodic', 'daily']).optional().default('periodic').describe("The type of pulse to perform: 'periodic' (standard telemetry check) or 'daily' (deep daily reconciliation)."),
        rules: z.string().optional().describe("Dynamic safety rules or constraints for this pulse run.")
    }),
    outputSchema: PulseReportSchema,
    rest: { method: 'POST', path: '/manager/pulse' },
    destructive: false
});

export const pulseReportCrud = defineCrud('pulse_report', PulseReportSchema, {
    pluralPath: 'pulse-reports'
});

export const managerInquireContract = defineContract({
    domain: 'manager',
    action: 'inquire',
    description: 'Ask the inquirer agent to perform a local read-only discovery or analysis on the repository.',
    inputSchema: z.object({
        kanbanId: z.string().describe("The Kanban Task ID associated with this inquiry."),
        question: z.string().describe("The specific discovery query to answer locally."),
        sandboxId: z.string().optional().describe("The target isolated sandbox environment ID (optional, defaults to active sandbox).")
    }),
    outputSchema: z.object({
        threadId: z.string().describe("The inquiry thread ID."),
        answer: z.string().describe("The inquirer agent's findings.")
    }),
    rest: { method: 'POST', path: '/manager/inquire' },
    destructive: false
});

export const managerExecuteContract = defineContract({
    domain: 'manager',
    action: 'execute',
    description: 'Dispatch the engineer agent to perform mutations, write code, or execute tests within a sandbox.',
    inputSchema: z.object({
        kanbanId: z.string().describe("The Kanban Task ID associated with this execution."),
        instruction: z.string().describe("Hyper-specific, immutable coding instruction or sandbox task."),
        sandboxId: z.string().optional().describe("The target isolated sandbox environment ID (optional, defaults to active sandbox).")
    }),
    outputSchema: z.object({
        threadId: z.string().describe("The execution thread ID."),
        status: z.string(),
        response: z.string().describe("The final response from the engineer agent.")
    }),
    rest: { method: 'POST', path: '/manager/execute' },
    destructive: true
});

export const managerResearchContract = defineContract({
    domain: 'manager',
    action: 'research',
    description: 'Instruct the researcher agent to perform external web searches or fetch technical documentation.',
    inputSchema: z.object({
        kanbanId: z.string().describe("The Kanban Task ID associated with this research."),
        topic: z.string().describe("The web search / external research topic or query."),
        sandboxId: z.string().optional().describe("The target isolated sandbox environment ID (optional, defaults to active sandbox).")
    }),
    outputSchema: z.object({
        threadId: z.string().describe("The research thread ID."),
        status: z.string(),
        response: z.string().describe("The final response from the researcher agent.")
    }),
    rest: { method: 'POST', path: '/manager/research' },
    destructive: false
});

export const managerRunContract = defineContract({
    domain: 'manager',
    action: 'run',
    description: 'Run the Central Directorate Orchestrator on a given mission or task (blocking).',
    inputSchema: z.object({
        prompt: z.string().describe("The mission or instruction for the Directorate."),
        threadId: z.string().optional().describe("Persistent Thread ID.")
    }),
    outputSchema: z.object({
        threadId: z.string(),
        response: z.string()
    }),
    rest: { method: 'POST', path: '/manager/run' },
    destructive: true
});

export const managerListToolErrorsContract = defineContract({
    domain: 'manager',
    action: 'list_tool_errors',
    description: 'Retrieve the last 50 tool result messages that generated execution errors.',
    inputSchema: z.object({
        limit: z.number().optional().default(50).describe("Maximum number of error messages to return (up to 50)."),
        threadId: z.string().optional().describe("Filter by a specific agent execution thread ID.")
    }),
    outputSchema: z.object({
        messages: z.array(z.object({
            id: z.string().describe("Unique identifier for the message"),
            threadId: z.string().describe("The thread this message belongs to"),
            role: z.string().describe("The role of the author (always 'tool')"),
            content: z.string().nullable().optional().describe("The error detail or content"),
            tool_call_id: z.string().nullable().optional().describe("The ID of the failed tool call"),
            createdAt: z.coerce.date().describe("Timestamp of the message creation")
        })).describe("The list of tool result messages that encountered execution errors.")
    }),
    rest: { method: 'GET', path: '/manager/tool-errors' },
    destructive: false
});

export const managerAgentBootstrapContract = defineContract({
    domain: 'manager',
    action: 'agent_bootstrap',
    description: 'Compile system prompts (Operational Mandates) for Castellan specialized sub-agents.',
    inputSchema: z.object({
        name: z.string().describe("The name identifier for the bootstrap session.")
    }),
    outputSchema: z.object({
        threadId: z.string().describe("The thread ID where the agent compilation took place."),
        response: z.string().describe("Bootstrap status message."),
        agents: z.array(agentCrud.outputSchema).describe("The agents that were created or updated.")
    }),
    rest: { method: 'POST', path: '/manager/agent-bootstrap' },
    destructive: true
});

