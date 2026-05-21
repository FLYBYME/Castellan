import { z } from 'zod';

export const ApprovalStatusSchema = z.enum(['pending', 'approved', 'denied', 'refine']).describe("The current state of the approval request");

export const ApprovalSchema = z.object({
    threadId: z.string().describe("The conversation thread where this tool call originated"),
    toolName: z.string().describe("The name of the tool that was intercepted"),
    arguments: z.record(z.string(), z.unknown()).describe("The arguments passed to the tool"),
    reason: z.string().nullish().describe("The reason why this call was flagged for approval"),
    status: ApprovalStatusSchema.describe("The current resolution status"),
    feedback: z.string().nullish().describe("Human feedback provided during refinement or denial"),
    refinedArguments: z.record(z.string(), z.unknown()).nullish().describe("Updated arguments if refinement was requested"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
}).describe("A stateful record of an intercepted tool call requiring human sign-off");

export type Approval = z.infer<typeof ApprovalSchema>;

export const ApprovalResolveInputSchema = z.object({
    id: z.string().describe("The ID of the approval to resolve"),
    action: z.enum(['approved', 'denied', 'refine']).describe("The human decision"),
    reason: z.string().optional().describe("Feedback or reason for the decision"),
    refinedArguments: z.record(z.string(), z.unknown()).optional().describe("Modified arguments for refinement")
});

export const ScenarioSchema = z.object({
    name: z.string().describe("Human-readable name for the test case"),
    gitUrl: z.string().describe("The repository serving as the 'world'"),
    commitHash: z.string().describe("The exact version of the repository"),
    vaguePrompt: z.string().describe("The minimal context user prompt (e.g., 'where are we?')"),
    goldStandardSITREP: z.array(z.string()).describe("Knowledge points the agent MUST discover"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
}).describe("A snapshot of a specific environment state used for testing.");

export type Scenario = z.infer<typeof ScenarioSchema>;

export const EvaluationSchema = z.object({
    scenarioId: z.string().describe("Link to the Scenario tested"),
    agentId: z.string().describe("The agent being tested"),
    scores: z.object({
        manager: z.number().describe("Context Resolution score"),
        thinker: z.number().describe("Investigative Planning score"),
        doer: z.number().describe("Execution Accuracy score"),
        overall: z.number()
    }),
    consensusCritique: z.string().describe("The merged reasoning from the multi-judge ensemble"),
    testThreadId: z.string().describe("The isolated sandbox thread where the test occurred"),
    createdAt: z.coerce.date(),
}).describe("A grading record created when an agent is tested against a Scenario.");

export type Evaluation = z.infer<typeof EvaluationSchema>;
