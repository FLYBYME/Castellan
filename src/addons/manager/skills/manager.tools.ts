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
    managerAgentBootstrapContract
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
        model: 'gpt-oss:20b',
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
        prompt: input.prompt
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
export async function manager_agent_bootstrap(
    input: z.infer<typeof managerAgentBootstrapContract.inputSchema>,
    ctx: ISkillContext
) {

    // Create any missing agents
    const agents: Array<AgentSchemaType> = [];
    for (const agent of DefaultAgents) {
        const foundAgent = await ctx.api.agent.find_one({ query: { name: agent.name } });
        if (!foundAgent) {
            console.log(`Creating agent: ${agent.name}`);
            const createdAgent = await ctx.api.agent.create({
                name: agent.name,
                systemPrompt: 'Agent cold and deterministic.  Operate strictly within tools.',
                tools: agent.tools,
                model: 'gpt-oss:120b'
            });
            agents.push(createdAgent);

        } else {
            agents.push(foundAgent);
        }
    }



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
[Sequence your tools appropriately.]

## 4. Failure Protocols
[Instructions on what to do when a tool fails or an invariant is breached.]

## 5. Kanban Governance & Coordination
- **Kanban Board Authority:** All work, task flows, and operational goals MUST be managed, tracked, and synchronized through Kanban tasks. No modifications or systemic actions should occur outside this framework.
- **Kanban Comes First Rule:** The Orchestrator is STRICTLY FORBIDDEN from calling delegation tools (\`manager_inquire\`, \`manager_execute\`, \`manager_research\`) using temporary, invalid, or placeholder Task IDs (like 'N/A', 'placeholder', or 'testing'). If a requested operation does not have a corresponding Kanban task, the Orchestrator MUST first create a valid Kanban task using \`kanban_create\`, move it to \`Ready\` or \`In Progress\` via \`kanban_move\`, and then pass the newly generated real task ID to the delegation tools!
- **Task ID Propagation:** The Orchestrator must pass the Kanban Task ID when it dispatches missions via \`manager_inquire\`, \`manager_execute\`, or \`manager_research\` to any sub-agent that has access to the \`kanban_get\` tool. This allows the receiving agent to execute \`kanban_get\` and fetch the complete task requirements.

## 6. System Architecture Guidelines
- Do not give any tool names or any references to tools in the system prompt itself.
- The Orchestrator must use \`manager_inquire\` to read local files/discovery, \`manager_research\` for external/web search, and \`manager_execute\` to execute changes in the sandbox.
            `.trim();


    const responseSchema = {
        type: 'object',
        properties: {
            agents: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'The exact agent ID (e.g. castellan.doer)' },
                        name: { type: 'string', description: 'The friendly display name of the agent (e.g. Castellan Doer)' },
                        systemPrompt: { type: 'string', description: 'The complete compiled Operational Mandate matching the guidelines.' }
                    },
                    required: ['id', 'name', 'systemPrompt']
                }
            }
        },
        required: ['agents']
    };
    // Create Thread
    const thread = await ctx.api.threads.create({
        title: `Agent Bootstrap: ${input.name}`,
        model: 'gpt-oss:20b',
        status: 'active',
        format: zodToJsonSchema(GeneratedAgentSchema as any)
    });

    await ctx.api.messages.create({
        threadId: thread.id,
        role: 'system',
        content: ARCHITECT_SYSTEM_PROMPT
    });

    const userPrompt = `
Please compile the mandates for the following agents:
${agents.map(a => `- Agent ID: ${a.id}
- Name: ${a.name}
- Tools: ${a.tools.join(', ')}`).join('\n\n')}
            `.trim();

    await ctx.api.messages.create({
        threadId: thread.id,
        role: 'user',
        content: userPrompt
    });

    const run = await ctx.api.infer.chat({
        threadId: thread.id
    });

    const message = await ctx.api.messages.get({
        id: run.messageId
    });

    console.log(message);

    const json = JSON.parse(message?.content as string);
    const agentsList = GeneratedAgentSchema.parse(json).agents;

    const updatedAgents: Array<AgentSchemaType> = [];

    for (const agent of agentsList) {
        const agentTools = DefaultAgents.find((a) => a.name === agent.name)?.tools || [];

        for (const tool of agentTools) {
            const foundTool = await ctx.skills.getTool(tool);
            if (!foundTool) {
                console.log(`Tool ${tool} not found`);
            }
        }

        const updatedAgent = await ctx.api.agent.update({
            id: agent.id,
            systemPrompt: agent.systemPrompt,
            tools: agentTools
        });

        updatedAgents.push(updatedAgent);
    }


    return {
        threadId: thread.id,
        agents: updatedAgents,
        response: `Agent ${input.name} created successfully.`
    };
}
