import { z } from 'zod';

/**
 * PulseReport: A structured summary of the system state generated during autonomous wake-ups.
 */
export const PulseReportSchema = z.object({
    timestamp: z.coerce.date().describe("When the pulse occurred."),
    summary: z.string().describe("A high-level summary of the system state."),
    activeMissions: z.array(z.object({
        threadId: z.string(),
        agentId: z.string(),
        objective: z.string(),
        status: z.string()
    })).describe("List of currently active agent missions."),
    kanbanSnapshot: z.record(z.array(z.string())).describe("A summary of the Kanban board at the time of the pulse."),
    systemHealth: z.object({
        sandboxes: z.number(),
        activeTasks: z.number(),
        failedTasks: z.number()
    }).describe("Key system telemetry."),
    reconciliationDetails: z.string().optional().describe("Dynamic observations and actions taken by the Central Directorate orchestrator during autonomous reconciliation.")
});

export type PulseReport = z.infer<typeof PulseReportSchema>;
