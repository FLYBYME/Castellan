import { z } from 'zod';
import { nanoid } from 'nanoid';
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
import { MessageSchema } from '../../infer/skills/infer.schema.js';

/**
 * manager_chat: Directorate interaction entry point.
 */
export async function manager_chat(
    input: z.infer<typeof managerChatContract.inputSchema>,
    ctx: ISkillContext
) {
    const threadId = input.threadId || `directorate_${nanoid(8)}`;

    // Ensure thread exists
    let thread = await ctx.api.threads.get({ id: threadId });
    if (!thread) {
        thread = await ctx.api.threads.create({
            title: `Directorate: ${input.prompt.substring(0, 30)}...`,
            model: 'gpt-oss:20b',
            status: 'active'
        });
    }

    const result = await ctx.api.agent.run({
        threadId,
        agentId: 'castellan.orchestrator',
        prompt: input.prompt
    });

    // In the new architecture, agent.run returns immediately with runId.
    // The chat response will be streamed or available via messages once the turn completes.
    return {
        response: `Directorate mission initialized (Run ID: ${result.runId}). Follow the thread for SITREP updates.`,
        threadId
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

    // 5. Wake up Orchestrator for deep reconciliation (if daily or forced)
    // For now, we'll just log it.
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
    const threadId = `discovery_${nanoid(8)}`;

    const result = await ctx.api.agent.run({
        threadId,
        agentId: 'castellan.inquirer',
        prompt: `Discovery Mission for Kanban ID ${input.kanbanId}: ${input.question}`
    });

    return {
        threadId,
        answer: `Inquirer dispatched (Run ID: ${result.runId}). Findings will be recorded in thread ${threadId}.`
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

    const threadId = `execution_${nanoid(8)}`;

    await ctx.api.kanban.update({
        id: input.kanbanId,
        status: 'In Progress',
        threadId,
    });

    const result = await ctx.api.agent.run({
        threadId,
        agentId: 'castellan.engineer',
        prompt: `Execution Mission for Kanban ID ${input.kanbanId}: ${input.instruction}`
    });

    return {
        threadId,
        status: 'Mission started.',
        response: `Engineer dispatched (Run ID: ${result.runId}). Progress tracked in thread ${threadId}.`
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

    const threadId = `research_${nanoid(8)}`;

    await ctx.api.kanban.update({
        id: input.kanbanId,
        status: 'In Progress',
        threadId,
    });

    const result = await ctx.api.agent.run({
        threadId,
        agentId: 'castellan.researcher',
        prompt: `Research Mission for Kanban ID ${input.kanbanId}: ${input.topic}`
    });

    return {
        threadId,
        status: 'Research started.',
        response: `Researcher dispatched (Run ID: ${result.runId}). Findings will be in thread ${threadId}.`
    };
}

/**
 * manager_run: Unified execution entry point.
 */
export async function manager_run(
    input: z.infer<typeof managerRunContract.inputSchema>,
    ctx: ISkillContext
) {
    const threadId = input.threadId || `directorate_${nanoid(8)}`;

    const result = await ctx.api.agent.run({
        threadId,
        agentId: 'castellan.orchestrator',
        prompt: input.prompt
    });

    return {
        threadId,
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
