import { z } from 'zod';

/**
 * KanbanTask: A high-level objective managed by the Directorate.
 */
export const KanbanStageSchema = z.enum(["Backlog", "Ready", "In Progress", "Testing", "Done"]);
export type KanbanStage = z.infer<typeof KanbanStageSchema>;

export const PriorityLevelSchema = z.enum(["Critical", "High", "Medium", "Low"]);
export type PriorityLevel = z.infer<typeof PriorityLevelSchema>;

export const KanbanTaskSchema = z.object({
    title: z.string().describe("Concise title of the objective."),
    description: z.string().describe("Detailed description of the mission."),
    status: KanbanStageSchema.describe("Current stage in the lifecycle."),
    priority: PriorityLevelSchema.describe("Urgency of the task."),
    acceptanceCriteria: z.array(z.string()).describe("Specific goals that must be met for completion."),
    dependencies: z.array(z.string()).describe("IDs of tasks that must be completed first."),
    targetFiles: z.array(z.string()).optional().describe("Files identified as relevant for this task."),
    errorLog: z.array(z.string()).optional().describe("Persistent record of failures or blockers."),
    threadId: z.string().nullish().describe("The Mission Thread associated with this task (if In Progress)."),
    createdAt: z.coerce.date().optional().describe("Creation timestamp."),
    updatedAt: z.coerce.date().optional().describe("Last modification timestamp.")
});

export type KanbanTask = z.infer<typeof KanbanTaskSchema>;
