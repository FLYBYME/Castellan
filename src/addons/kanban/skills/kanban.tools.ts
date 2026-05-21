import { z } from 'zod';
import { ISkillContext } from 'castellan/core';
import { kanbanMoveContract } from './kanban.contract.js';
import { KanbanTask } from './kanban.schema.js';

/**
 * kanban_move: Enforcing lifecycle transitions.
 */
export async function kanban_move(
    input: z.infer<typeof kanbanMoveContract.inputSchema>,
    ctx: ISkillContext
): Promise<KanbanTask> {
    const task = await ctx.api.kanban.get({ id: input.taskId });
    if (!task) throw new Error(`Task not found: ${input.taskId}`);

    // Transition Rules
    const VALID_TRANSITIONS: Record<string, string[]> = {
        "Backlog":     ["Ready"],
        "Ready":       ["In Progress", "Backlog"],
        "In Progress": ["Testing", "Ready"],
        "Testing":     ["Done", "In Progress"],
        "Done":        ["Backlog"]
    };

    const allowed = VALID_TRANSITIONS[task.status];
    if (!allowed || !allowed.includes(input.stage)) {
        throw new Error(`Invalid transition: ${task.status} -> ${input.stage}`);
    }

    const updated = await ctx.api.kanban.update({
        id: input.taskId,
        status: input.stage,
    });

    return updated as KanbanTask;
}
