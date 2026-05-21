import { z } from 'zod';
import { defineContract } from 'castellan/core';

export const GenesisInputSchema = z.object({
    prompt: z.string().optional().describe("Task request or system target context for prompt optimization."),
    threadId: z.string().optional().describe("Optional thread ID override for optimization database logs."),
    rounds: z.number().optional().describe("Number of evolutionary optimization rounds. Defaults to 3."),
    modelSmall: z.string().optional().describe("Ollama model for Small Advisor (e.g. qwen3.5:2b)."),
    modelMedium: z.string().optional().describe("Ollama model for Medium Advisor (e.g. gemma4:e4b)."),
    modelLarge: z.string().optional().describe("Ollama model for Large Advisor (e.g. llama3:8b).")
});

export const AdvisorCritiqueSchema = z.object({
    persona: z.string().describe("The name of the advisor persona."),
    observations: z.array(z.string()).describe("A list of concrete observation remarks regarding trace failures."),
    actionableSuggestions: z.array(z.string()).describe("A list of explicit prompt corrections or rule additions.")
});

export const OptimizationRoundSummarySchema = z.object({
    round: z.number().describe("The 1-indexed round number."),
    passRate: z.number().describe("Percentage of evaluation criteria met (0 to 100)."),
    failedCriteria: z.array(z.string()).describe("Details of specific criteria indices that failed."),
    critiques: z.array(AdvisorCritiqueSchema).describe("Structured critiques provided by the advisor panel."),
    refinedPrompt: z.string().describe("The improved, compiled system prompt produced in this round.")
});

export const GenesisOutputSchema = z.object({
    success: z.boolean().describe("Whether the evolutionary prompt optimization completed successfully."),
    initialPrompt: z.string().describe("The raw candidate prompt before the optimization loop."),
    finalPrompt: z.string().describe("The highly refined, optimized system prompt compiled after the final round."),
    history: z.array(OptimizationRoundSummarySchema).describe("Chronological logs of every evolutionary refinement round.")
});

export type GenesisInput = z.infer<typeof GenesisInputSchema>;
export type GenesisOutput = z.infer<typeof GenesisOutputSchema>;
export type AdvisorCritique = z.infer<typeof AdvisorCritiqueSchema>;
export type OptimizationRoundSummary = z.infer<typeof OptimizationRoundSummarySchema>;

export const genesisContract = defineContract({
    domain: 'system',
    action: 'genesis',
    description: 'Execute closed-loop evolutionary optimization of agent system prompts utilizing multi-model consensus critiques.',
    inputSchema: GenesisInputSchema,
    outputSchema: GenesisOutputSchema,
    rest: { method: 'POST', path: '/system/genesis' }
});

export const BootstrapInputSchema = z.object({});
export const BootstrapOutputSchema = z.object({
    success: z.boolean(),
    message: z.string()
});

export const bootstrapContract = defineContract({
    domain: 'system',
    action: 'bootstrap',
    description: 'Interactively assign tools to agents after the system soul has been generated.',
    inputSchema: BootstrapInputSchema,
    outputSchema: BootstrapOutputSchema,
    rest: { method: 'POST', path: '/system/bootstrap' }
});

export const ResetInputSchema = z.object({
    confirm: z.boolean().describe("Must be true to confirm system wipe.")
});

export const resetContract = defineContract({
    domain: 'system',
    action: 'reset',
    description: 'Wipe all system data and return to a clean slate.',
    inputSchema: ResetInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
    rest: { method: 'POST', path: '/system/reset' }
});
