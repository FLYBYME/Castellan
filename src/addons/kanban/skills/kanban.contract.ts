import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import { 
    KanbanProjectSchema, 
    KanbanFeatureSchema, 
    KanbanWorkItemSchema, 
    KanbanStageSchema 
} from './kanban.schema.js';

export const domain = 'kanban';

/**
 * kanbanProjectCrud: Root projects linked to repositories.
 */
export const kanbanProjectCrud = defineCrud('kanban_project', KanbanProjectSchema, {
    pluralPath: 'kanban/projects',
    idField: 'id'
});

/**
 * kanbanFeatureCrud: High-level Epics/Features.
 */
export const kanbanFeatureCrud = defineCrud('kanban_feature', KanbanFeatureSchema, {
    pluralPath: 'kanban/features',
    idField: 'id'
});

/**
 * kanbanWorkItemCrud: Detailed technical tasks tied to Git branches.
 */
export const kanbanWorkItemCrud = defineCrud('kanban_work_item', KanbanWorkItemSchema, {
    pluralPath: 'kanban/work-items',
    idField: 'id'
});

/**
 * kanbanMoveContract: Specialized tool for state transitions.
 */
export const kanbanMoveContract = defineContract({
    domain: 'kanban',
    action: 'move',
    description: 'Transition a WorkItem or Feature through the Kanban lifecycle.',
    inputSchema: z.object({
        id: z.string().describe("The ID of the item to move."),
        type: z.enum(['feature', 'work_item']).describe("The type of the item."),
        stage: KanbanStageSchema.describe("The target stage (e.g., 'In Progress').")
    }),
    outputSchema: z.object({
        success: z.boolean(),
        title: z.string(),
        status: KanbanStageSchema
    }),
    rest: { method: 'POST', path: '/kanban/move' },
    destructive: true,
    print: (output) => `
### Task Transitioned
- **Title**: ${output.title}
- **New Status**: **${output.status}**
    `.trim()
});
