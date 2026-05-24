import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';

/**
 * Default Toolsets for Core Agents
 * (Reflects the Git Flow Kanban abstraction)
 */
export const DefaultAgents = [
    {
        name: 'Castellan Orchestrator',
        description: 'The high-level project manager responsible for Git Flow orchestration.',
        tools: [
            "kanban_project_create", "kanban_project_find", "kanban_project_get", "kanban_project_update",
            "kanban_feature_create", "kanban_feature_find", "kanban_feature_get", "kanban_feature_update",
            "kanban_work_item_create", "kanban_work_item_find", "kanban_work_item_get", "kanban_work_item_update",
            "kanban_move",
            "manager_inquire", "manager_execute", "manager_research",
            "journal_find", "journal_note", "journal_resolve"
        ]
    },
    {
        name: 'Castellan Inquirer',
        description: 'Diagnostic agent for exploring codebases within a jailed sandbox.',
        tools: [
            "kanban_work_item_get",
            "sandbox_fs_list", "sandbox_fs_read",
            "github_list_repos", "github_get_repo",
            "journal_find", "journal_note"
        ]
    },
    {
        name: 'Castellan Engineer',
        description: 'Implementation agent for modifying code and executing tests.',
        tools: [
            "kanban_work_item_get",
            "sandbox_fs_read", "sandbox_fs_write", "sandbox_fs_list", "sandbox_fs_mkdir", "sandbox_fs_move", "sandbox_fs_remove",
            "sandbox_terminal_execute",
            "github_status",
            "journal_find", "journal_note"
        ]
    },
    {
        name: 'Castellan Researcher',
        description: 'Information gathering agent for external technical research.',
        tools: [
            "kanban_work_item_get",
            "web_list", "web_get", "web_create", "web_fetch_feed", "web_searxng_search",
            "journal_find", "journal_note"
        ]
    }
];

export const domain = 'manager';

// ─── Core Interaction ────────────────────────────────────────────────────────

export const managerChatContract = defineContract({
    domain: 'manager',
    action: 'chat',
    description: 'The exclusive entry point for user interaction. Translates intent into Git Flow missions.',
    inputSchema: z.object({
        prompt: z.string().describe("Your natural language request or instruction."),
        threadId: z.string().optional().describe("Persistent Directorate Thread ID."),
        wait: z.boolean().optional().describe("If true, wait for the run to complete before returning")
    }),
    outputSchema: z.object({
        response: z.string().describe("The Directorate's response or SITREP."),
        threadId: z.string()
    }),
    rest: { method: 'POST', path: '/manager/chat' },
    destructive: false,
    print: (output) => `
### Directorate Response (Thread: ${output.threadId})
${output.response}
    `.trim()
});

export const managerPulseContract = defineContract({
    domain: 'manager',
    action: 'pulse',
    description: 'Autonomous wake-up for system reconciliation and reporting.',
    inputSchema: z.object({
        force: z.boolean().optional().describe("Force a pulse regardless of schedule."),
        type: z.enum(['periodic', 'daily']).optional().default('periodic'),
        rules: z.string().optional().describe("Dynamic safety rules.")
    }),
    outputSchema: PulseReportSchema,
    rest: { method: 'POST', path: '/manager/pulse' },
    destructive: false,
    print: (output) => `### System Pulse Recorded\n**Summary**: ${output.summary}`
});

export const pulseReportCrud = defineCrud('pulse_report', PulseReportSchema, {
    pluralPath: 'pulse-reports'
});

export const managerInquireContract = defineContract({
    domain: 'manager',
    action: 'inquire',
    description: 'Ask the inquirer agent to perform a local read-only discovery on a WorkItem.',
    inputSchema: z.object({
        workItemId: z.string().describe("The Kanban WorkItem ID."),
        question: z.string().describe("The specific discovery query.")
    }),
    outputSchema: z.object({
        threadId: z.string().describe("The inquiry thread ID."),
        answer: z.string().describe("The findings.")
    }),
    rest: { method: 'POST', path: '/manager/inquire' },
    destructive: false,
    print: (output) => `### Discovery Findings\n${output.answer}`
});

export const managerExecuteContract = defineContract({
    domain: 'manager',
    action: 'execute',
    description: 'Dispatch the engineer agent to modify code or execute tests for a WorkItem.',
    inputSchema: z.object({
        workItemId: z.string().describe("The Kanban WorkItem ID."),
        instruction: z.string().describe("Technical instruction.")
    }),
    outputSchema: z.object({
        threadId: z.string(),
        status: z.string(),
        response: z.string()
    }),
    rest: { method: 'POST', path: '/manager/execute' },
    destructive: true,
    print: (output) => `### Execution Result\n**Status**: ${output.status}\n\n${output.response}`
});

export const managerResearchContract = defineContract({
    domain: 'manager',
    action: 'research',
    description: 'Instruct the researcher agent to perform external research for a WorkItem.',
    inputSchema: z.object({
        workItemId: z.string().describe("The Kanban WorkItem ID."),
        topic: z.string().describe("The research topic.")
    }),
    outputSchema: z.object({
        threadId: z.string(),
        status: z.string(),
        response: z.string()
    }),
    rest: { method: 'POST', path: '/manager/research' },
    destructive: false,
    print: (output) => `### Research Findings\n${output.response}`
});

export const managerRunContract = defineContract({
    domain: 'manager',
    action: 'run',
    description: 'Run the Orchestrator on a mission (blocking).',
    inputSchema: z.object({
        prompt: z.string().describe("The mission instruction."),
        threadId: z.string().optional()
    }),
    outputSchema: z.object({
        threadId: z.string(),
        response: z.string()
    }),
    rest: { method: 'POST', path: '/manager/run' },
    destructive: true,
    print: (output) => `### Orchestration Run Complete\n${output.response}`
});

export const managerListToolErrorsContract = defineContract({
    domain: 'manager',
    action: 'list_tool_errors',
    description: 'Retrieve the last 50 execution errors.',
    inputSchema: z.object({
        limit: z.number().optional().default(50),
        threadId: z.string().optional()
    }),
    outputSchema: z.object({
        messages: z.array(z.any())
    }),
    rest: { method: 'GET', path: '/manager/tool-errors' },
    destructive: false,
    print: (output) => `Found ${output.messages.length} tool errors.`
});


export const managerLoadPromptsContract = defineContract({
    domain: 'manager',
    action: 'load_prompts',
    description: 'Sync system prompts from Markdown files.',
    inputSchema: z.object({}),
    outputSchema: z.object({
        success: z.boolean(),
        loaded: z.array(z.string())
    }),
    rest: { method: 'POST', path: '/manager/prompts/load' },
    destructive: true,
    print: (output) => `Loaded ${output.loaded.length} prompts.`
});

export const managerEvaluateApprovalContract = defineContract({
    domain: 'manager',
    action: 'evaluate_approval',
    description: 'Safety audit for a pending tool call.',
    inputSchema: z.object({
        id: z.string(),
        rules: z.string().optional(),
        judgesCount: z.number().optional().default(3),
    }),
    outputSchema: z.object({
        approved: z.boolean(),
        consensusCritique: z.string(),
        judges: z.array(z.any())
    }),
    rest: { method: 'POST', path: '/manager/evaluate-approval' },
    destructive: false,
    print: (output) => `Evaluation Result: ${output.approved ? 'APPROVED' : 'REJECTED'}`
});
