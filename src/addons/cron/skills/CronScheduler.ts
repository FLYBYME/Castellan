import parser from 'cron-parser';
import { ISkillContext, parseToolKey } from 'castellan/core';
import { CronJob, CronJobRun } from './cron.schema.js';

/**
 * CronScheduler: The engine responsible for executing scheduled cron jobs.
 */
export class CronScheduler {
    private interval: NodeJS.Timeout | null = null;
    private runningJobsCount = new Map<string, number>(); // group -> count
    private readonly GLOBAL_MAX_CONCURRENCY = 1;
    private currentTick: number = 0;

    constructor(private readonly context: ISkillContext) { }

    /**
     * start: Begins the polling loop.
     */
    public async start(pollIntervalMs: number = 10000): Promise<void> {
        if (this.interval) return;
        
        // 1. Reclaim Orphans (Jobs stuck in 'running' from a previous boot)
        await this.reclaimOrphans();

        console.log(`[CronScheduler] Starting background runner (poll: ${pollIntervalMs}ms, GLOBAL_LOCK=1)`);
        this.interval = setInterval(() => this.tick(), pollIntervalMs);
    }

    /**
     * stop: Gracefully halts the runner.
     */
    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    /**
     * reclaimOrphans: Resets any jobs that were left in 'running' state.
     */
    private async reclaimOrphans(): Promise<void> {
        try {
            const orphaned = await this.context.api.cron.find({ query: { status: 'running' } });
            
            if (orphaned.length > 0) {
                console.warn(`[CronScheduler] Reclaiming ${orphaned.length} orphaned jobs...`);
                for (const job of orphaned) {
                    await this.context.api.cron.update({ 
                        id: job.id,
                        status: 'failed', 
                        error: 'Process terminated unexpectedly (orphaned job reclaimed on boot).' 
                    });
                }
            }
        } catch (error) {
            console.error(`[CronScheduler] Failed to reclaim orphans:`, error);
        }
    }

    public getRunningCount(): number {
        let total = 0;
        for (const count of this.runningJobsCount.values()) {
            total += count;
        }
        return total;
    }

    public getGroupConcurrency(): Record<string, number> {
        return Object.fromEntries(this.runningJobsCount.entries());
    }

    /**
     * tick: Polls for due jobs and executes them.
     */
    private async tick(): Promise<void> {
        this.currentTick++;
        try {
            // STRICT CONCURRENCY CHECK: If anyone is running, we wait.
            if (this.getRunningCount() >= this.GLOBAL_MAX_CONCURRENCY) {
                return; 
            }

            const now = new Date();

            // 1. Fetch all due jobs
            const dueJobs = await this.context.api.cron.find({
                query: {
                    status: 'queued',
                    nextRun: { $lte: now }
                }
            });

            if (dueJobs.length === 0) {
                return;
            }

            console.log(`[CronScheduler] Found ${dueJobs.length} due jobs.`);

            // Since we only run one job, we only pick the first one from the due list.
            const job = dueJobs[0];
            if (!job) return;

            const group = job.group || 'default';
            
            console.log(`[CronScheduler] Triggering job ${job.name} (${job.id}).`);

            // 3. Atomically pick up the job
            this.runningJobsCount.set(group, (this.runningJobsCount.get(group) || 0) + 1);

            // Execute immediately.
            void this.executeJob(job);

        } catch (error: unknown) {
            console.error(`[CronScheduler] Tick Error:`, error);
        }
    }

    /**
     * executeJob: Handles the full lifecycle of a single job execution.
     */
    private async executeJob(job: CronJob & { id: string }): Promise<void> {
        const group = job.group || 'default';
        const startTime = new Date();
        let runRecord: (CronJobRun & { id: string }) | undefined;

        try {
            // 1. Mark Job as running
            await this.context.api.cron.update({ id: job.id, status: 'running' });

            // 2. Create Run Record
            runRecord = await this.context.api.cron_runs.create({
                jobId: job.id,
                status: 'running',
                startTime
            });

            console.log(`[CronScheduler] Executing Job: ${job.name} (${job.id}). Run: ${runRecord.id}`);

            // 3. Invoke tool
            const { domain, action } = parseToolKey(job.tool);
            if (!domain || !action) throw new Error(`Invalid tool key: ${job.tool}`);

            const skill = this.context.skills.getSkill(domain);
            if (!skill) throw new Error(`Skill domain not found: ${domain}`);

            const apiDomain = (this.context.api as unknown as Record<string, Record<string, (args: unknown) => Promise<unknown>>>)[domain];
            const apiAction = apiDomain?.[action];

            const executePromise = apiAction
                ? apiAction(job.params)
                : skill.execute(domain, action, job.params, this.context);

            const result = await executePromise;
            
            const endTime = new Date();
            const durationMs = endTime.getTime() - startTime.getTime();

            // 4. Update Run Record (Success)
            await this.context.api.cron_runs.update({
                id: runRecord.id,
                status: 'completed',
                endTime,
                durationMs,
                result
            });

            // 5. Success Recovery & Scheduling
            const parserObj = parser as unknown as { parse: (s: string) => { next: () => { toDate: () => Date } } };
            const interval = parserObj.parse(job.schedule);
            const nextRun = interval.next().toDate();

            const updatedJob = await this.context.api.cron.update({
                id: job.id,
                status: 'queued',
                lastRun: new Date(),
                nextRun,
                lastDurationMs: durationMs,
                runCount: (job.runCount || 0) + 1,
                lastRunId: runRecord.id,
                retries: 0,
                error: null
            });

            await this.context.events.dispatch('cron:job_completed', this.context.correlationId, { 
                id: job.id, 
                success: true, 
                job: updatedJob, 
                result 
            });
            console.log(`[CronScheduler] Job Success: ${job.name}. Next run: ${nextRun.toISOString()}`);

        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            const endTime = new Date();
            const durationMs = endTime.getTime() - startTime.getTime();
            console.error(`[CronScheduler] Job Failed: ${job.name} (${job.id}) - ${err.message}`);

            // Update Run Record (Failure)
            if (runRecord) {
                await this.context.api.cron_runs.update({
                    id: runRecord.id,
                    status: 'failed',
                    endTime,
                    durationMs,
                    error: err.message
                });
            }

            // SMART FAILURE RECOVERY
            const retries = job.retries + 1;
            let finalJob: CronJob & { id: string };

            if (retries <= job.maxRetries) {
                const backoffMs = Math.pow(2, retries) * 60000;
                const nextRun = new Date(Date.now() + backoffMs);

                finalJob = await this.context.api.cron.update({
                    id: job.id,
                    status: 'queued',
                    retries,
                    nextRun,
                    lastDurationMs: durationMs,
                    runCount: (job.runCount || 0) + 1,
                    lastRunId: runRecord?.id,
                    error: err.message
                });
                console.warn(`[CronScheduler] Job ${job.name} queued for retry in ${Math.pow(2, retries)} mins.`);
            } else {
                finalJob = await this.context.api.cron.update({
                    id: job.id,
                    status: 'failed',
                    retries,
                    lastDurationMs: durationMs,
                    runCount: (job.runCount || 0) + 1,
                    lastRunId: runRecord?.id,
                    error: err.message
                });
            }

            await this.context.events.dispatch('cron:job_completed', this.context.correlationId, { 
                id: job.id, 
                success: false, 
                error: err.message, 
                job: finalJob
            });
        } finally {
            // Decr concurrency
            const current = this.runningJobsCount.get(group) || 1;
            this.runningJobsCount.set(group, Math.max(0, current - 1));
        }
    }
}
