import { z } from 'zod';

// --- Entity Schemas ---

export const CronJobStatusSchema = z.enum(['queued', 'running', 'failed', 'completed', 'paused']).describe("The current execution state of the cron job");

export const CronJobSchema = z.object({
    name: z.string().describe("Human-readable name for the task"),
    schedule: z.string().describe("Cron expression (e.g., '0 * * * *' for hourly)"),
    tool: z.string().describe("The target tool key to execute (domain_action)"),
    params: z.record(z.string(), z.unknown()).describe("Arguments to pass to the tool"),
    status: CronJobStatusSchema.default('queued'),
    group: z.string().default('default').describe("Concurrency group identifier"),
    lastRun: z.coerce.date().nullish().describe("Timestamp of the last successful execution"),
    nextRun: z.coerce.date().nullish().describe("Scheduled timestamp for the next execution"),
    lastDurationMs: z.number().nullish().describe("Execution time of the last run in milliseconds"),
    runCount: z.number().default(0).describe("Total number of times this job has been executed"),
    lastRunId: z.string().nullish().describe("The ID of the most recent execution (run record)"),
    retries: z.number().default(0).describe("Current number of consecutive failures"),
    maxRetries: z.number().default(3).describe("Maximum number of retries before marking as failed"),
    error: z.string().nullish().describe("Last error message if the job failed"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type CronJob = z.infer<typeof CronJobSchema>;

// --- IO Schemas ---

export const CronJobListInputSchema = z.object({
    status: CronJobStatusSchema.optional(),
    group: z.string().optional(),
});

// --- Task Run Schemas ---

export const CronJobRunSchema = z.object({
    jobId: z.string().describe("The ID of the parent cron job"),
    status: z.enum(['running', 'completed', 'failed']).describe("The final status of this specific run"),
    startTime: z.coerce.date().describe("When the execution started"),
    endTime: z.coerce.date().nullish().describe("When the execution finished"),
    durationMs: z.number().nullish().describe("Total execution time in milliseconds"),
    result: z.unknown().nullish().describe("The data returned by the tool (if successful)"),
    error: z.string().nullish().describe("The error message (if failed)"),
    createdAt: z.coerce.date(),
});

export type CronJobRun = z.infer<typeof CronJobRunSchema>;

export const CronJobRunListInputSchema = z.object({
    jobId: z.string().optional(),
    status: z.enum(['running', 'completed', 'failed']).optional(),
});

