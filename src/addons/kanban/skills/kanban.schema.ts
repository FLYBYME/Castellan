import { z } from 'zod';

/**
 * Shared Lifecycle Definitions
 */
export const KanbanStageSchema = z.enum(["Backlog", "Ready", "In Progress", "Testing", "Done"]);
export type KanbanStage = z.infer<typeof KanbanStageSchema>;

export const PriorityLevelSchema = z.enum(["Critical", "High", "Medium", "Low"]);
export type PriorityLevel = z.infer<typeof PriorityLevelSchema>;

/**
 * KanbanProject: The root entity representing a repository.
 */
export const KanbanProjectSchema = z.object({
    name: z.string().describe("Human-readable name of the project."),
    description: z.string().describe("Concise project overview."),
    gitUrl: z.string().describe("The Git repository URL (Internal source of truth)."),
    defaultBranch: z.string().default("main").describe("The base branch for all features."),
    sandboxImage: z.string().default("node:18").describe("Docker image for this project's environments."),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional()
});
export type KanbanProject = z.infer<typeof KanbanProjectSchema>;

/**
 * KanbanFeature: A high-level goal or Epic (e.g. 'User Authentication').
 */
export const KanbanFeatureSchema = z.object({
    projectId: z.string().describe("The ID of the parent project."),
    name: z.string().describe("Title of the feature/epic."),
    description: z.string().describe("Detailed functional requirements."),
    status: KanbanStageSchema.describe("High-level feature status."),
    priority: PriorityLevelSchema.describe("Urgency of the feature."),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional()
});
export type KanbanFeature = z.infer<typeof KanbanFeatureSchema>;

/**
 * KanbanWorkItem: A specific actionable task tied to a git branch.
 */
export const KanbanWorkItemSchema = z.object({
    featureId: z.string().describe("The ID of the parent feature."),
    title: z.string().describe("Concise work item title."),
    description: z.string().describe("Specific technical instruction."),
    status: KanbanStageSchema.describe("Detailed task status."),
    priority: PriorityLevelSchema.describe("Urgency of this specific item."),
    branchName: z.string().describe("The git branch where this work occurs."),
    acceptanceCriteria: z.array(z.string()).describe("Specific goals that must be met for completion."),
    dependencies: z.array(z.string()).describe("IDs of other WorkItems that must be completed first."),
    targetFiles: z.array(z.string()).optional().describe("Files identified as relevant for this task."),
    errorLog: z.array(z.string()).optional().describe("Persistent record of failures or blockers."),
    threadId: z.string().nullish().describe("The Mission Thread associated with this item."),
    sandboxId: z.string().nullish().describe("Internal ID of the provisioned sandbox linked to this work item."),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional()
});
export type KanbanWorkItem = z.infer<typeof KanbanWorkItemSchema>;

/**
 * Legacy Support: KanbanTask is now KanbanWorkItem.
 */
export type KanbanTask = KanbanWorkItem;

