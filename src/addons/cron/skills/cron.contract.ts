import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import { CronJobSchema, CronJobRunSchema } from './cron.schema.js';

/**
 * Cron Job CRUD: APIs for managing automated background jobs.
 */
export const cronJobCrud = defineCrud('cron', CronJobSchema, {
    pluralPath: 'cron'
});

/**
 * Cron Run CRUD: APIs for viewing execution history and metrics.
 */
export const cronJobRunCrud = defineCrud('cron_runs', CronJobRunSchema, {
    pluralPath: 'cron-runs'
});

/**
 * Cron Trigger: Manually fire a job regardless of schedule.
 */
export const cronTriggerContract = defineContract({
    domain: 'cron',
    action: 'trigger',
    description: 'Manually trigger a scheduled cron job to run as soon as possible.',
    inputSchema: z.object({
        id: z.string().describe("The ID of the cron job to trigger"),
        wait: z.boolean().default(false).describe("Whether to wait until the execution is completed (success or failure)")
    }),
    outputSchema: z.object({
        success: z.boolean().describe("Whether the job was successfully triggered"),
        job: CronJobSchema.optional().describe("The final state of the job if wait was true"),
        run: CronJobRunSchema.optional().describe("The metrics for this specific run if wait was true"),
        result: z.unknown().optional().describe("The result data returned by the tool (if wait was true)"),
        error: z.string().optional().describe("The error message if the tool failed (if wait was true)")
    }),
    rest: { method: 'POST', path: '/cron/:id/trigger' },
    destructive: true
});

/**
 * Cron Reset: Reset a stuck job to queued or failed state.
 */
export const cronResetContract = defineContract({
    domain: 'cron',
    action: 'reset',
    description: 'Reset a stuck or running cron job to queued state so it can be picked up by the scheduler again.',
    inputSchema: z.object({
        id: z.string().describe("The ID of the cron job to reset"),
        status: z.enum(['queued', 'failed']).default('queued').describe("The target status (default: queued)")
    }),
    outputSchema: z.object({
        success: z.boolean(),
        job: CronJobSchema
    }),
    rest: { method: 'POST', path: '/cron/:id/reset' },
    destructive: true
});

/**
 * Cron Status: Get a high-level overview of the scheduler queue.
 */
export const cronStatusContract = defineContract({
    domain: 'cron',
    action: 'status',
    description: 'Get a summary of the cron scheduler status, including running jobs and queue depth.',
    inputSchema: z.object({}),
    outputSchema: z.object({
        runningCount: z.number(),
        queuedCount: z.number(),
        failedCount: z.number(),
        groupConcurrency: z.record(z.string(), z.number())
    }),
    rest: { method: 'GET', path: '/cron/status' },
    destructive: false
});
