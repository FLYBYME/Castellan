import { z } from 'zod';
import { defineContract, defineCrud, defaultPrint } from '@flybyme/castellan/core';
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
        job: CronJobSchema.extend({ id: z.string() }).optional().describe("The final state of the job if wait was true"),
        run: CronJobRunSchema.optional().describe("The metrics for this specific run if wait was true"),
        result: z.unknown().optional().describe("The result data returned by the tool (if wait was true)"),
        error: z.string().optional().describe("The error message if the tool failed (if wait was true)")
    }),
    rest: { method: 'POST', path: '/cron/:id/trigger' },
    destructive: true,
    print: (output) => {
        if (!output.success) return `❌ Failed to trigger cron job.`;
        if (!output.job) return `✅ Cron job triggered successfully (Async).`;
        
        const status = output.error ? '❌ FAILED' : '✅ SUCCESS';
        return `
### Cron Execution Result: ${status}
- **Job Name**: ${output.job.name}
- **Duration**: ${output.run?.durationMs || 0}ms

#### Result Data
\`\`\`json
${JSON.stringify(output.result || output.error || {}, null, 2)}
\`\`\`
        `.trim();
    }
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
    destructive: true,
    print: (output) => output.success ? `✅ Cron job **${output.job.name}** reset to **${output.job.status}**.` : `❌ Failed to reset cron job.`
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
    destructive: false,
    print: (output) => {
        const concurrencyRows = Object.entries(output.groupConcurrency).map(([group, count]) => `| ${group} | ${count} |`).join('\n');
        return `
### Cron Scheduler Status
- **Running Jobs**: ${output.runningCount}
- **Queued Jobs**: ${output.queuedCount}
- **Failed Jobs**: ${output.failedCount}

#### Group Concurrency
| Group | Active Count |
| :--- | :--- |
${concurrencyRows || '| (none) | 0 |'}
        `.trim();
    }
});
