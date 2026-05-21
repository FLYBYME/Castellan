import { z } from 'zod';
import { ISkillContext } from 'castellan/core';
import { 
    managerChatContract, 
    managerPulseContract, 
    managerInquireContract, 
    managerExecuteContract, 
    managerResearchContract, 
    managerRunContract,
    managerListToolErrorsContract
} from './manager.contract.js';
import { PulseReport } from './manager.schema.js';

/**
 * getAgentByName: Helper to resolve agent ID by name.
 */
async function getAgentByName(name: string, ctx: ISkillContext): Promise<{ id: string }> {
    const agent = await ctx.api.agent.find_one({ query: { name } });
    if (!agent) throw new Error(`Agent with name "${name}" not found. Please provision agents using System Genesis.`);
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
