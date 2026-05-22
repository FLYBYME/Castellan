import { z } from 'zod';
import { ISkillContext } from 'castellan/core';
import {
    managerChatContract,
    managerPulseContract,
    managerInquireContract,
    managerExecuteContract,
    managerResearchContract,
    managerRunContract,
    managerListToolErrorsContract,
    managerAgentBootstrapContract,
    managerEvaluateApprovalContract
} from './manager.contract.js';
import { PulseReport } from './manager.schema.js';
import { agentCrud } from '../../agents/skills/agent.contract.js';
import zodToJsonSchema from 'zod-to-json-schema';



export const DefaultAgents = [
    {
        name: 'Castellan Orchestrator',
        description: '',
        tools: [
            "kanban_create",
            "kanban_find",
            "kanban_get",
            "kanban_move",
            "github_list_repos",
            "manager_inquire",
            "manager_execute",
            "manager_research",
            "journal_find",
            "journal_note",
            "journal_resolve",
            "sandbox_get",
            "sandbox_create",
            "sandbox_find",
            "sandbox_delete",
            "sandbox_set_active",
            "sandbox_fs_list",
            "sandbox_fs_read"
        ]
    },
    {
        name: 'Castellan Inquirer',
        description: '',
        tools: [
            "kanban_get",
            "sandbox_fs_list",
            "sandbox_fs_read",
            "github_list_repos",
            "github_get_repo",
            "journal_find",
            "journal_note",
            "journal_resolve"
        ]
    },
    {
        name: 'Castellan Engineer',
        description: '',
        tools: [
            "kanban_get",
            "sandbox_fs_read",
            "sandbox_fs_write",
            "sandbox_fs_list",
            "sandbox_fs_mkdir",
            "sandbox_fs_move",
            "sandbox_fs_remove",
            "sandbox_terminal_execute",
            "github_status",
            "journal_find",
            "journal_note",
            "journal_resolve"
        ]
    },
    {
        name: 'Castellan Researcher',
        description: '',
        tools: [
            "kanban_get",
            "sandbox_fs_read",
            "sandbox_fs_list",
            "web_list",
            "web_get",
            "web_create",
            "web_fetch_feed",
            "web_searxng_search",
            "journal_find",
            "journal_note",
            "journal_resolve"
        ]
    },

]

export const DefaultJudges = [
    {
        name: 'Security Judge',
        description: 'Audits pending tool calls for security risks, unauthorized data exfiltration, privilege escalation, and malicious code injection.',
        tools: []
    },
    {
        name: 'Skeptic Judge',
        description: 'Audits pending tool calls for logical correctness, validation gaps, unintended side effects, and edge cases.',
        tools: []
    },
    {
        name: 'Architect Judge',
        description: 'Audits pending tool calls for system architecture compliance, path correctness, file/directory boundary safety, and dependency hygiene.',
        tools: []
    },
    {
        name: 'Compliance Judge',
        description: 'Audits pending tool calls for license compliance, data privacy protection, regulatory policies, and user consent constraints.',
        tools: []
    },
    {
        name: 'Reliability Judge',
        description: 'Audits pending tool calls for resource usage, heavy side-effects, recursion risks, and timeout limits.',
        tools: []
    }
];

/**
 * getAgentByName: Helper to resolve agent ID by name.
 */
async function getAgentByName(name: string, ctx: ISkillContext): Promise<{ id: string }> {
    const agent = await ctx.api.agent.find_one({ query: { name } });
    if (!agent) throw new Error(`Agent with name "${name}" not found. Please provision agents using Manager Bootstrap.`);
    return agent;
}

/**
 * getOrCreateThread: Helper to resolve or create a thread.
 */
async function getOrCreateThread(title: string, ctx: ISkillContext, threadId?: string): Promise<{ id: string }> {
    if (threadId) {
        const thread = await ctx.api.threads.get({ id: threadId });
        if (thread) return thread;
    }
    return await ctx.api.threads.create({
        title,
        model: 'gemma4:e4b',
        status: 'active'
    });
}

/**
 * manager_chat: Directorate interaction entry point.
 */
export async function manager_chat(
    input: z.infer<typeof managerChatContract.inputSchema>,
    ctx: ISkillContext
) {
    const thread = await getOrCreateThread(`Directorate: ${input.prompt.substring(0, 30)}...`, ctx, input.threadId);
    const orchestrator = await getAgentByName('Castellan Orchestrator', ctx);

    const result = await ctx.api.agent.run({
        threadId: thread.id,
        agentId: orchestrator.id,
        prompt: input.prompt,
        wait: input.wait
    });

    return {
        response: `Directorate mission initialized (Run ID: ${result.runId}). Follow the thread for SITREP updates.`,
        threadId: thread.id
    };
}

/**
 * manager_pulse: Autonomous system reconciliation.
 */
export async function manager_pulse(
    input: z.infer<typeof managerPulseContract.inputSchema>,
    ctx: ISkillContext
): Promise<PulseReport> {
    const pulseType = input.type || 'periodic';
    console.log(`[manager_pulse] Initiating ${pulseType} autonomous reconciliation...`);

    // 1. Telemetry Collection
    const [allTasks, allSandboxes] = await Promise.all([
        ctx.api.kanban.find({}),
        ctx.api.sandbox.find({})
    ]);

    const activeTasks = allTasks.filter(t => t.status === 'In Progress');
    const failedTasks = allTasks.filter(t => t.status === 'Backlog' && (t as { errorLog?: string[] }).errorLog?.length);

    // 2. Kanban Snapshot
    const kanbanSnapshot: Record<string, string[]> = {
        "Backlog": allTasks.filter(t => t.status === 'Backlog').map(t => t.title),
        "Ready": allTasks.filter(t => t.status === 'Ready').map(t => t.title),
        "In Progress": activeTasks.map(t => t.title),
        "Done": allTasks.filter(t => t.status === 'Done').map(t => t.title)
    };

    // 3. Active Missions
    const activeMissions = activeTasks.map(t => ({
        threadId: (t as { threadId?: string }).threadId || 'unknown',
        agentId: 'unknown',
        objective: t.title,
        status: t.status
    }));

    // 4. Generate Report Document
    const report: PulseReport = {
        timestamp: new Date(),
        summary: `Autonomous Pulse (${pulseType}) completed. System is stable.`,
        activeMissions,
        kanbanSnapshot,
        systemHealth: {
            sandboxes: allSandboxes.length,
            activeTasks: activeTasks.length,
            failedTasks: failedTasks.length
        }
    };

    console.log(`[manager_pulse] Reconciliation summary: ${report.summary}`);

    const savedReport = await ctx.api.pulse_report.create(report);
    return savedReport as PulseReport;
}

/**
 * manager_inquire: Discovery dispatch.
 */
export async function manager_inquire(
    input: z.infer<typeof managerInquireContract.inputSchema>,
    ctx: ISkillContext
) {
    const thread = await getOrCreateThread(`Discovery Mission for Kanban ID ${input.kanbanId}`, ctx);
    const inquirer = await getAgentByName('Castellan Inquirer', ctx);

    const result = await ctx.api.agent.run({
        threadId: thread.id,
        agentId: inquirer.id,
        prompt: `Discovery Mission for Kanban ID ${input.kanbanId}: ${input.question}`
    });

    return {
        threadId: thread.id,
        answer: `Inquirer dispatched (Run ID: ${result.runId}). Findings will be recorded in thread ${thread.id}.`
    };
}

/**
 * manager_execute: Mutation dispatch.
 */
export async function manager_execute(
    input: z.infer<typeof managerExecuteContract.inputSchema>,
    ctx: ISkillContext
) {
    const task = await ctx.api.kanban.get({ id: input.kanbanId });
    if (!task) throw new Error(`Kanban task '${input.kanbanId}' not found.`);

    const thread = await getOrCreateThread(`Execution Mission for Kanban ID ${input.kanbanId}`, ctx);

    await ctx.api.kanban.update({
        id: input.kanbanId,
        status: 'In Progress',
        threadId: thread.id,
    });

    const engineer = await getAgentByName('Castellan Engineer', ctx);

    const result = await ctx.api.agent.run({
        threadId: thread.id,
        agentId: engineer.id,
        prompt: `Execution Mission for Kanban ID ${input.kanbanId}: ${input.instruction}`
    });

    return {
        threadId: thread.id,
        status: 'Mission started.',
        response: `Engineer dispatched (Run ID: ${result.runId}). Progress tracked in thread ${thread.id}.`
    };
}

/**
 * manager_research: External research dispatch.
 */
export async function manager_research(
    input: z.infer<typeof managerResearchContract.inputSchema>,
    ctx: ISkillContext
) {
    const task = await ctx.api.kanban.get({ id: input.kanbanId });
    if (!task) throw new Error(`Kanban task '${input.kanbanId}' not found.`);

    const thread = await getOrCreateThread(`Research Mission for Kanban ID ${input.kanbanId}`, ctx);

    await ctx.api.kanban.update({
        id: input.kanbanId,
        status: 'In Progress',
        threadId: thread.id,
    });

    const researcher = await getAgentByName('Castellan Researcher', ctx);

    const result = await ctx.api.agent.run({
        threadId: thread.id,
        agentId: researcher.id,
        prompt: `Research Mission for Kanban ID ${input.kanbanId}: ${input.topic}`
    });

    return {
        threadId: thread.id,
        status: 'Research started.',
        response: `Researcher dispatched (Run ID: ${result.runId}). Findings will be in thread ${thread.id}.`
    };
}

/**
 * manager_run: Unified execution entry point.
 */
export async function manager_run(
    input: z.infer<typeof managerRunContract.inputSchema>,
    ctx: ISkillContext
) {
    const thread = await getOrCreateThread(`Directorate Mission`, ctx, input.threadId);
    const orchestrator = await getAgentByName('Castellan Orchestrator', ctx);

    const result = await ctx.api.agent.run({
        threadId: thread.id,
        agentId: orchestrator.id,
        prompt: input.prompt
    });

    return {
        threadId: thread.id,
        response: `Directorate mission started (Run ID: ${result.runId}).`
    };
}

/**
 * manager_list_tool_errors: Error diagnostic tool.
 */
export async function manager_list_tool_errors(
    input: z.infer<typeof managerListToolErrorsContract.inputSchema>,
    ctx: ISkillContext
) {
    const query: Record<string, unknown> = { role: 'tool' };
    if (input.threadId) query.threadId = input.threadId;

    const messages = await ctx.api.messages.find({ query });

    const errors = messages.filter(m => m.content?.toLowerCase().includes('error'));

    return {
        messages: errors.slice(0, input.limit).map(m => ({
            id: m.id,
            threadId: m.threadId,
            role: m.role,
            content: m.content,
            tool_call_id: (m as { tool_call_id?: string }).tool_call_id || null,
            createdAt: m.createdAt
        }))
    };
}


type AgentSchemaType = z.infer<typeof agentCrud.outputSchema>;

const GeneratedAgentSchema = z.object({
    agents: z.array(z.object({
        id: z.string().describe('The exact agent ID'),
        name: z.string().describe('The friendly display name of the agent'),
        systemPrompt: z.string().describe('The complete compiled Operational Mandate matching the guidelines.')
    })).describe('The generated agents')
})

/**
 * Agent bootstrapper
 */
/**
 * Agent bootstrapper (Two Passes: Pass 1 for normal agents, Pass 2 for safety judges)
 */
export async function manager_agent_bootstrap(
    input: z.infer<typeof managerAgentBootstrapContract.inputSchema>,
    ctx: ISkillContext
) {
    // 1. Core Agents creation/lookup
    const coreAgents: Array<AgentSchemaType> = [];
    for (const agent of DefaultAgents) {
        const foundAgent = await ctx.api.agent.find_one({ query: { name: agent.name } });
        if (!foundAgent) {
            console.log(`Creating core agent: ${agent.name}`);
            const createdAgent = await ctx.api.agent.create({
                name: agent.name,
                systemPrompt: 'Agent cold and deterministic. Operate strictly within tools.',
                tools: agent.tools,
                model: 'gpt-oss:120b'
            });
            coreAgents.push(createdAgent);
        } else {
            coreAgents.push(foundAgent);
        }
    }

    // 2. Safety Judges creation/lookup
    const safetyJudges: Array<AgentSchemaType> = [];
    for (const judge of DefaultJudges) {
        const foundJudge = await ctx.api.agent.find_one({ query: { name: judge.name } });
        if (!foundJudge) {
            console.log(`Creating safety judge agent: ${judge.name}`);
            const createdJudge = await ctx.api.agent.create({
                name: judge.name,
                systemPrompt: 'Safety Judge cold and analytical. Audit destructive tools.',
                tools: [],
                model: 'gpt-oss:120b'
            });
            safetyJudges.push(createdJudge);
        } else {
            safetyJudges.push(foundJudge);
        }
    }

    // Create a shared thread for both Passes
    const thread = await ctx.api.threads.create({
        title: `Two-Pass Agent Bootstrap: ${input.name}`,
        model: 'gemma4:e4b',
        status: 'active',
        format: zodToJsonSchema(GeneratedAgentSchema as any),
        options: {
            num_ctx: 10 * 1024
        }
    });

    const updatedAgents: Array<AgentSchemaType> = [];

    // ==========================================
    // PASS 1: NORMAL CORE AGENTS
    // ==========================================
    const ARCHITECT_SYSTEM_PROMPT = `
You are the Principal Systems Architect for the Castellan cognitive architecture.
Your task is to compile a rigid, high-fidelity Operational Mandate (System Prompt) for multiple specialized sub-agents at once.

Adhere to the Castellan philosophy: the agent is cold, deterministic, state-machine-driven, and must strictly operate within its authorized tools.

Below is the complete catalog of all available tools in the Castellan system:

${DefaultAgents.map(agent => `Name: ${agent.name}\nDescription: ${agent.description}\nTools: ${agent.tools.join(', ')}`).join('\n')}

Format each agent's system prompt EXACTLY according to the template guidelines:

# OPERATIONAL MANDATE: [Friendly Name]
Domain: [Archetype]
Archetype: [Archetype]

## 1. Core Directive
[A single, ruthless paragraph defining the exact purpose of this agent based on its tools.]

## 2. Rules of Engagement
- **Constraint 1:** Strictly operate only within your authorized tools: [List of Tools].
- **Constraint 2:** Never assume actions outside your domain.
- **Constraint 3:** Adhere strictly to clean execution and standard protocols.

## 3. Tool Utilization Strategy
[Sequence your tools appropriately. If the agent is the Orchestrator, explicitly mandate that it MUST use \`kanban_find\` to check for existing relevant tasks BEFORE defaulting to \`kanban_create\`.]

## 4. Failure Protocols
[Instructions on what to do when a tool fails or an invariant is breached.]

## 5. Kanban Governance & Coordination
[If the agent has 'kanban_create' and 'kanban_move' (e.g., the Orchestrator), include strict rules:
- **Kanban Board Authority:** All work, task flows, and operational goals MUST be managed, tracked, and synchronized through Kanban tasks. No modifications or systemic actions should occur outside this framework.
- **Task Discovery First:** The Orchestrator MUST use \`kanban_find\` to search the backlog and active boards for existing tasks matching the user's intent BEFORE creating a new one. Do not duplicate existing work.
- **Kanban Comes First Rule:** The Orchestrator is STRICTLY FORBIDDEN from calling delegation tools (\`manager_inquire\`, \`manager_execute\`, \`manager_research\`) using temporary, invalid, or placeholder Task IDs (like 'N/A', 'placeholder', or 'testing'). If a requested operation does not have a corresponding Kanban task, the Orchestrator MUST first find an existing one or create a valid Kanban task using \`kanban_create\`, move it to \`Ready\` or \`In Progress\` via \`kanban_move\`, and then pass the valid real task ID to the delegation tools!
- **Task ID Propagation:** The Orchestrator must pass the Kanban Task ID when it dispatches missions via \`manager_inquire\`, \`manager_execute\`, or \`manager_research\` to any sub-agent that has access to the \`kanban_get\` tool. This allows the receiving agent to execute \`kanban_get\` and fetch the complete task requirements.]
[If the agent only has 'kanban_get' (e.g., Researcher, Inquirer, Engineer), include strict instructions:
- Retrieve operational parameters using the Kanban ID provided to you via \`kanban_get\` and NEVER attempt to alter task states.]
[If the agent has no Kanban tools, include a brief note explaining that they operate under Kanban-driven instructions provided in their prompt, but do not have tools to manipulate or read the board directly.]

## 6. System Architecture Guidelines
- The Orchestrator must use manager_inquire to read local files/discovery, manager_research for external/web search, and manager_execute to execute changes in the sandbox.
- If the agent is the Orchestrator, explicitly map its delegation tools to the corresponding sub-agents in the Tool Utilization Strategy (e.g., "To delegate to the Engineer, use manager_execute. To delegate to the Researcher, use manager_research. To delegate to the Inquirer, use manager_inquire").
`.trim();

    await ctx.api.messages.create({
        threadId: thread.id,
        role: 'system',
        content: ARCHITECT_SYSTEM_PROMPT
    });

    const userPromptPass1 = `
Please compile the mandates for the following agents:
${coreAgents.map(a => `- Agent ID: ${a.id}
- Name: ${a.name}
- Tools: ${a.tools.join(', ')}`).join('\n\n')}
`.trim();

    await ctx.api.messages.create({
        threadId: thread.id,
        role: 'user',
        content: userPromptPass1
    });

    const runPass1 = await ctx.api.infer.chat({
        threadId: thread.id
    });

    const messagePass1 = await ctx.api.messages.get({
        id: runPass1.messageId
    });

    try {
        const jsonPass1 = JSON.parse(messagePass1?.content as string);
        const agentsListPass1 = GeneratedAgentSchema.parse(jsonPass1).agents;

        for (const agent of agentsListPass1) {
            const agentTools = DefaultAgents.find((a) => a.name === agent.name)?.tools || [];
            const updated = await ctx.api.agent.update({
                id: agent.id,
                systemPrompt: agent.systemPrompt,
                tools: agentTools
            });
            updatedAgents.push(updated);
        }
    } catch (err) {
        console.error("Failed compiling/parsing Pass 1 agents:", err);
    }

    // ==========================================
    // PASS 2: SAFETY JUDGES
    // ==========================================
    const JUDGES_ARCHITECT_SYSTEM_PROMPT = `
You are the Principal Security & Safety Architect for the Castellan cognitive architecture.
Your task is to compile a rigid, high-fidelity Safety Audit Mandate (System Prompt) for Safety Ensemble Judges.

Adhere to the Castellan safety philosophy: the safety judge is cold, analytical, deterministic, and highly focused on its specific safety domain.

Below is the catalog of safety judges to compile:
${DefaultJudges.map(j => `Name: ${j.name}\nFocus/Description: ${j.description}`).join('\n')}

Format each judge's system prompt EXACTLY according to the template guidelines:

# SAFETY AUDIT MANDATE: [Friendly Name]
Domain: Safety Ensemble Judge
Audit Focus: [Specific Safety focus area described in the catalog]

## 1. Safety Directive
[A single, ruthless paragraph defining the safety mission and specific focus area of this judge.]

## 2. Risk Assessment Invariants
- **Invariant 1: [Domain Isolation]** You are checking exclusively for risks in your specific focus area.
- **Invariant 2: [Domain Specific Constraint]** [Write a strict negative constraint specific to this judge's focus. e.g., for Security, 'Never approve path traversal.']
- **Invariant 3: [Fail-Safe Rule]** [Write a strict rule on when to automatically reject the call based on this judge's criteria.]

## 3. Evaluation Strategy
[Instructions on how to analyze the pending tool call's name, arguments, and optional custom rules to evaluate its safety.]
`.trim();

    await ctx.api.messages.create({
        threadId: thread.id,
        role: 'system',
        content: JUDGES_ARCHITECT_SYSTEM_PROMPT
    });

    const userPromptPass2 = `
Please compile the safety mandates for the following safety judges:
${safetyJudges.map(j => `- Agent ID: ${j.id}
- Name: ${j.name}`).join('\n\n')}
`.trim();

    await ctx.api.messages.create({
        threadId: thread.id,
        role: 'user',
        content: userPromptPass2
    });

    const runPass2 = await ctx.api.infer.chat({
        threadId: thread.id
    });

    const messagePass2 = await ctx.api.messages.get({
        id: runPass2.messageId
    });

    try {
        const jsonPass2 = JSON.parse(messagePass2?.content as string);
        const agentsListPass2 = GeneratedAgentSchema.parse(jsonPass2).agents;

        for (const judge of agentsListPass2) {
            const updated = await ctx.api.agent.update({
                id: judge.id,
                systemPrompt: judge.systemPrompt,
                tools: []
            });
            updatedAgents.push(updated);
        }
    } catch (err) {
        console.error("Failed compiling/parsing Pass 2 judges:", err);
    }

    return {
        threadId: thread.id,
        agents: updatedAgents,
        response: `Two-Pass agent and judge bootstrap session completed successfully.`
    };
}

/**
 * Multi-Judge Safety Ensemble Evaluation Tool
 */
export async function manager_evaluate_approval(
    input: z.infer<typeof managerEvaluateApprovalContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof managerEvaluateApprovalContract.outputSchema>> {
    // 1. Retrieve the pending tool call
    const call = await ctx.api.tool_calls.find_one({ query: { id: input.id } });
    if (!call) {
        throw new Error(`Tool call with ID '${input.id}' not found`);
    }

    const toolName = call.name;
    const argsStr = JSON.stringify(call.arguments, null, 2);

    // 2. Select safety judges from the database
    const allJudges = await ctx.api.agent.find({
        query: {
            name: { $in: ['Security Judge', 'Skeptic Judge', 'Architect Judge', 'Compliance Judge', 'Reliability Judge'] }
        }
    });

    const selectedJudges = allJudges.slice(0, input.judgesCount || 3);
    const individualFindings: { judge: string; approved: boolean; critique: string }[] = [];

    const rulesSection = input.rules
        ? `\n\nEVALUATION CONSTRAINTS (Rules to strictly respect):\n${input.rules}\n`
        : '';

    const JudgeFeedbackSchema = z.object({
        approved: z.boolean().describe("True if completely safe to execute without manual user confirmation, false if risky."),
        critique: z.string().describe("Detailed critique and safety concerns.")
    });

    // 3. Execute safety judges in parallel
    for (const judge of selectedJudges) {
        try {

            const thread = await ctx.api.threads.create({
                title: `Safety Audit: ${judge.name}`,
                model: 'gemma4:e4b',
                status: 'active',
                format: zodToJsonSchema(JudgeFeedbackSchema)
            });

            await ctx.api.messages.create({
                threadId: thread.id,
                role: 'system',
                content: judge.systemPrompt + rulesSection
            });

            await ctx.api.messages.create({
                threadId: thread.id,
                role: 'user',
                content: `Analyze this pending tool call for safety:
\`\`\`markdown
Tool Name: ${toolName}
Arguments: ${argsStr}
\`\`\`
Decide if this action is safe to execute without human manual review.`
            });

            const run = await ctx.api.infer.chat({ threadId: thread.id });
            const message = await ctx.api.messages.get({ id: run.messageId });

            const data = JSON.parse(message?.content || '{}');
            const parsed = JudgeFeedbackSchema.parse(data);
            individualFindings.push({
                judge: judge.name,
                approved: parsed.approved,
                critique: parsed.critique
            });
        } catch (err) {
            individualFindings.push({
                judge: judge.name,
                approved: false,
                critique: `Safety analysis failed to compile structured feedback: ${err instanceof Error ? err.message : String(err)}`
            });
        }
    }

    // 4. Consensus Synthesis
    const ConsensusFeedbackSchema = z.object({
        approved: z.boolean().describe("True if consensus is that this tool call is completely safe to run without human review, false otherwise."),
        consensusCritique: z.string().describe("Synthesized consensus critique or summary of concerns.")
    });

    let finalApproved = false;
    let finalCritique = 'Consensus merger failed to execute safely.';

    try {
        const consensusThread = await ctx.api.threads.create({
            title: `Consensus Safety Audit: ${toolName}`,
            model: 'gemma4:e4b',
            status: 'active',
            format: zodToJsonSchema(ConsensusFeedbackSchema)
        });

        await ctx.api.messages.create({
            threadId: consensusThread.id,
            role: 'system',
            content: `You are the Lead Safety Officer. Analyze these individual judge reports for the tool call '${toolName}' and synthesize a unified safety Consensus critique and final safety verdict.`
        });

        await ctx.api.messages.create({
            threadId: consensusThread.id,
            role: 'user',
            content: `Individual Safety Judge Reports:
${JSON.stringify(individualFindings, null, 2)}`
        });

        const consensusRun = await ctx.api.infer.chat({ threadId: consensusThread.id });
        const consensusMsg = await ctx.api.messages.get({ id: consensusRun.messageId });

        const consensusData = JSON.parse(consensusMsg?.content || '{}');
        const parsedConsensus = ConsensusFeedbackSchema.parse(consensusData);
        finalApproved = parsedConsensus.approved;
        finalCritique = parsedConsensus.consensusCritique;
    } catch (err) {
        finalCritique = `Consensus merger failed to compile structured feedback: ${err instanceof Error ? err.message : String(err)}`;
    }

    return {
        approved: finalApproved,
        consensusCritique: finalCritique,
        judges: individualFindings
    };
}
