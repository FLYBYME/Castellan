import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import { 
    ApprovalSchema, 
    ApprovalResolveInputSchema,
    ScenarioSchema,
    EvaluationSchema
} from './approval.schema.js';

export const approvalCrud = defineCrud('approval', ApprovalSchema, {
    pluralPath: 'approvals'
});

export const scenarioCrud = defineCrud('scenario', ScenarioSchema, {
    pluralPath: 'scenarios'
});

export const evaluationCrud = defineCrud('evaluation', EvaluationSchema, {
    pluralPath: 'evaluations'
});

export const approvalResolveContract = defineContract({
    domain: 'audit',
    action: 'approval_resolve',
    description: 'Resolve a pending tool call approval request.',
    inputSchema: ApprovalResolveInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
    rest: { method: 'POST', path: '/approvals/:id/resolve' }
});

export const auditRunContract = defineContract({
    domain: 'audit',
    action: 'run',
    description: 'Trigger a multi-judge audit on a thread.',
    inputSchema: z.object({
        threadId: z.string().describe("The ID of the thread to audit")
    }),
    outputSchema: z.object({ 
        success: z.boolean(), 
        findings: z.record(z.string(), z.unknown()).optional(), 
        message: z.string().optional() 
    }),
    rest: { method: 'POST', path: '/audit/run' }
});

export const auditCreateTestbedContract = defineContract({
    domain: 'audit',
    action: 'create_testbed',
    description: 'Spawn a fresh sandbox and clone a git repository to create a consistent world state for testing.',
    inputSchema: z.object({
        gitUrl: z.string().describe("The repository to clone"),
        commitHash: z.string().optional().describe("The exact commit to checkout")
    }),
    outputSchema: z.object({ 
        success: z.boolean(), 
        sandboxId: z.string().describe("The ID of the newly created testbed sandbox") 
    }),
    rest: { method: 'POST', path: '/audit/testbed' }
});

export const auditGenerateScenarioContract = defineContract({
    domain: 'audit',
    action: 'generate_scenario',
    description: 'Analyze a historical failure and generate a gold-standard Scenario for regression testing.',
    inputSchema: z.object({
        threadId: z.string().describe("The ID of the thread containing the failure"),
        name: z.string().describe("Name for the generated scenario")
    }),
    outputSchema: z.object({ 
        success: z.boolean(), 
        scenario: ScenarioSchema.optional() 
    }),
    rest: { method: 'POST', path: '/audit/generate-scenario' }
});

export const auditEvaluateTriadContract = defineContract({
    domain: 'audit',
    action: 'evaluate_triad',
    description: 'Run a triad (Manager/Thinker/Doer) simulation against a Scenario and grade the autonomy and accuracy.',
    inputSchema: z.object({
        scenarioId: z.string().describe("The ID of the scenario to test against"),
        agentId: z.string().describe("The agent to evaluate")
    }),
    outputSchema: z.object({ 
        success: z.boolean(), 
        evaluation: EvaluationSchema.optional() 
    }),
    rest: { method: 'POST', path: '/audit/evaluate-triad' }
});

export const auditEvaluateApprovalContract = defineContract({
    domain: 'audit',
    action: 'evaluate_approval',
    description: 'Trigger a multi-judge safety audit on a pending tool call approval request.',
    inputSchema: z.object({
        id: z.string().describe("The ID of the pending approval request document"),
        rules: z.string().optional().describe("Dynamic rules or constraints to evaluate this approval request against")
    }),
    outputSchema: z.object({
        success: z.boolean(),
        approved: z.boolean().describe("Whether all judges agreed that this action is safe to run"),
        consensusCritique: z.string().describe("Synthesized consensus critique or summary of concerns"),
        judges: z.array(z.object({
            judge: z.string(),
            approved: z.boolean(),
            critique: z.string()
        })).describe("Individual judge verdicts")
    }),
    rest: { method: 'POST', path: '/audit/evaluate-approval' }
});
