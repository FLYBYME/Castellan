import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import { KanbanTaskSchema, KanbanStageSchema } from './kanban.schema.js';

export const domain = 'kanban';

export const kanbanCrud = defineCrud('kanban', KanbanTaskSchema, {
    pluralPath: 'tasks'
});

export const kanbanMoveContract = defineContract({
    domain: 'kanban',
    action: 'move',
    description: 'Transition a mission through the Kanban lifecycle.',
    inputSchema: z.object({
        taskId: z.string().describe("The ID of the task to move."),
        stage: KanbanStageSchema.describe("The target stage (e.g., 'In Progress').")
    }),
    outputSchema: KanbanTaskSchema,
    rest: { method: 'POST', path: '/kanban/move' },
    destructive: true
});
