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
    managerLoadPromptsContract,
    managerEvaluateApprovalContract,
    DefaultAgents
} from './manager.contract.js';
import { PulseReport } from './manager.schema.js';
import { agentCrud } from '../../agents/skills/agent.contract.js';
import zodToJsonSchema from 'zod-to-json-schema';
import fs from 'fs/promises';
import path from 'path';



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

    await ctx.api.agent.run({
        threadId: thread.id,
        agentId: orchestrator.id,
        prompt: input.prompt,
        wait: input.wait
    });

    if (input.wait) {
        const messages = await ctx.api.messages.find({
            query: { threadId: thread.id, role: 'assistant' },
            sort: ['-createdAt'],
            limit: 1
        });
        return {
            response: messages[0]?.content || "Directorate mission completed, but no response was captured.",
            threadId: thread.id
        };
    }

    return {
        response: `Directorate mission initialized. Follow the thread for SITREP updates.`,
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
    const [allWorkItems, allSandboxes] = await Promise.all([
        ctx.api.kanban_work_item.find({ limit: 100 }),
        ctx.api.sandbox.find({ limit: 100 })
    ]);

    const activeMissions = allWorkItems.filter(w => w.status === 'In Progress');
    const failedCount = allWorkItems.filter(w => (w as any).errorLog?.length).length;

    // 2. Kanban Snapshot
    const kanbanSnapshot: Record<string, string[]> = {
        "Backlog": allWorkItems.filter(t => t.status === 'Backlog').map(t => t.title),
        "Ready": allWorkItems.filter(t => t.status === 'Ready').map(t => t.title),
        "In Progress": activeMissions.map(t => t.title),
        "Done": allWorkItems.filter(t => t.status === 'Done').map(t => t.title)
    };

    // 3. Active Missions
    const reportMissions = activeMissions.map(t => ({
        threadId: t.threadId || 'unknown',
        agentId: 'unknown',
        objective: t.title,
        status: t.status
    }));

    // 4. Generate Report Document
    const report: PulseReport = {
        timestamp: new Date(),
        summary: `Autonomous Pulse (${pulseType}) completed. System is stable.`,
        activeMissions: reportMissions,
        kanbanSnapshot,
        systemHealth: {
            sandboxes: allSandboxes.length,
            activeTasks: activeMissions.length,
            failedTasks: failedCount
        }
    };

    console.log(`[manager_pulse] Reconciliation summary: ${report.summary}`);

    const savedReport = await ctx.api.pulse_report.create(report);
    return savedReport as PulseReport;
}

/**
 * manager_inquire: Discovery dispatch with auto-sandbox.
 */
export async function manager_inquire(
    input: z.infer<typeof managerInquireContract.inputSchema>,
    ctx: ISkillContext
) {
    // 1. Resolve WorkItem & Sandbox
    const workItem = await ctx.api.kanban_work_item.get({ id: input.workItemId });
    if (!workItem) throw new Error(`WorkItem '${input.workItemId}' not found.`);

    if (workItem.sandboxId) {
        console.log(`[Manager] Auto-switching to Sandbox: ${workItem.sandboxId}`);
        await ctx.api.settings.update({ key: 'active_sandbox', value: workItem.sandboxId });
    }

    const thread = await getOrCreateThread(`Inquiry: ${workItem.title}`, ctx, workItem.threadId || undefined);
    const inquirer = await getAgentByName('Castellan Inquirer', ctx);

    await ctx.api.agent.run({
        threadId: thread.id,
        agentId: inquirer.id,
        prompt: `Inquiry for WorkItem ${input.workItemId} [${workItem.title}]: ${input.question}`,
        wait: true
    });

    const messages = await ctx.api.messages.find({
        query: { threadId: thread.id, role: 'assistant' },
        sort: ['-createdAt'],
        limit: 1
    });

    return {
        threadId: thread.id,
        answer: messages[0]?.content || "Inquirer mission completed, but no response was captured."
    };
}

/**
 * manager_execute: Mutation dispatch with auto-sandbox.
 */
export async function manager_execute(
    input: z.infer<typeof managerExecuteContract.inputSchema>,
    ctx: ISkillContext
) {
    // 1. Resolve WorkItem & Sandbox
    const workItem = await ctx.api.kanban_work_item.get({ id: input.workItemId });
    if (!workItem) throw new Error(`WorkItem '${input.workItemId}' not found.`);

    if (workItem.sandboxId) {
        console.log(`[Manager] Auto-switching to Sandbox: ${workItem.sandboxId}`);
        await ctx.api.settings.update({ key: 'active_sandbox', value: workItem.sandboxId });
    }

    const thread = await getOrCreateThread(`Execution: ${workItem.title}`, ctx, workItem.threadId || undefined);

    // Ensure status is In Progress
    await ctx.api.kanban_work_item.update({
        id: input.workItemId,
        status: 'In Progress',
        threadId: thread.id,
    });

    const engineer = await getAgentByName('Castellan Engineer', ctx);

    await ctx.api.agent.run({
        threadId: thread.id,
        agentId: engineer.id,
        prompt: `Execution for WorkItem ${input.workItemId} [${workItem.title}]: ${input.instruction}`,
        wait: true
    });

    const messages = await ctx.api.messages.find({
        query: { threadId: thread.id, role: 'assistant' },
        sort: ['-createdAt'],
        limit: 1
    });

    return {
        threadId: thread.id,
        status: 'Mission completed.',
        response: messages[0]?.content || "Engineer mission completed, but no response was captured."
    };
}

/**
 * manager_research: Research dispatch with auto-sandbox.
 */
export async function manager_research(
    input: z.infer<typeof managerResearchContract.inputSchema>,
    ctx: ISkillContext
) {
    // 1. Resolve WorkItem & Sandbox
    const workItem = await ctx.api.kanban_work_item.get({ id: input.workItemId });
    if (!workItem) throw new Error(`WorkItem '${input.workItemId}' not found.`);

    if (workItem.sandboxId) {
        console.log(`[Manager] Auto-switching to Sandbox: ${workItem.sandboxId}`);
        await ctx.api.settings.update({ key: 'active_sandbox', value: workItem.sandboxId });
    }

    const thread = await getOrCreateThread(`Research: ${workItem.title}`, ctx, workItem.threadId || undefined);

    await ctx.api.kanban_work_item.update({
        id: input.workItemId,
        status: 'In Progress',
        threadId: thread.id,
    });

    const researcher = await getAgentByName('Castellan Researcher', ctx);

    await ctx.api.agent.run({
        threadId: thread.id,
        agentId: researcher.id,
        prompt: `Research for WorkItem ${input.workItemId} [${workItem.title}]: ${input.topic}`,
        wait: true
    });

    const messages = await ctx.api.messages.find({
        query: { threadId: thread.id, role: 'assistant' },
        sort: ['-createdAt'],
        limit: 1
    });

    return {
        threadId: thread.id,
        status: 'Research completed.',
        response: messages[0]?.content || "Researcher mission completed, but no response was captured."
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

    await ctx.api.agent.run({
        threadId: thread.id,
        agentId: orchestrator.id,
        prompt: input.prompt,
        wait: true
    });

    const messages = await ctx.api.messages.find({
        query: { threadId: thread.id, role: 'assistant' },
        sort: ['-createdAt'],
        limit: 1
    });

    return {
        threadId: thread.id,
        response: messages[0]?.content || "Directorate mission completed, but no response was captured."
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
 * manager_load_prompts: Loads system prompts from Markdown files in config/prompts and update/create agents in the database.
 */
export async function manager_load_prompts(
    _input: z.infer<typeof managerLoadPromptsContract.inputSchema>,
    ctx: ISkillContext
) {
    const promptsDir = path.resolve('config/prompts');
    const files = await fs.readdir(promptsDir);
    const loaded = [];

    const allDefinitions = [...DefaultAgents, ...DefaultJudges];

    for (const def of allDefinitions) {
        const fileName = def.name.replace(/\s+/g, '-') + '.md';
        const filePath = path.join(promptsDir, fileName);

        let content = '';
        try {
            content = await fs.readFile(filePath, 'utf-8');
        } catch (err) {
            // Fallback: check for files without hyphens or other variations if needed
            // But we created them with hyphens.
            console.warn(`[manager_load_prompts] No markdown file found for ${def.name} at ${filePath}`);
            continue;
        }

        // Find existing agent
        const agents = await ctx.api.agent.find({ query: {} });
        const agent = agents.find(a => a.name.toLowerCase() === def.name.toLowerCase());

        if (agent) {
            await ctx.api.agent.update({
                id: agent.id,
                systemPrompt: content,
                tools: def.tools
            });
        } else {
            await ctx.api.agent.create({
                name: def.name,
                systemPrompt: content,
                tools: def.tools,
                model: 'gpt-oss:20b'
            });
        }
        loaded.push(def.name);
    }

    return {
        success: true,
        loaded
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
                model: 'gpt-oss:20b',
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
            model: 'gpt-oss:20b',
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
