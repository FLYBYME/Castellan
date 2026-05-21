import { z } from 'zod';
import { ISkillContext } from 'castellan/core';
import { cronTriggerContract, cronResetContract, cronStatusContract } from './cron.contract.js';

/**
 * cron_trigger: Manually fires a scheduled cron job.
 */
export async function cron_trigger(
    input: z.infer<typeof cronTriggerContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof cronTriggerContract.outputSchema>> {
    const job = await ctx.api.cron.get({ id: input.id });
    if (!job) throw new Error(`Cron job not found: ${input.id}`);

    // If we don't need to wait, just queue and return
    if (!input.wait) {
        await ctx.api.cron.update({
            id: input.id,
            nextRun: new Date(),
            status: 'queued'
        });
        return { success: true };
    }

    // If we DO need to wait, we subscribe to the event stream FIRST
    const resultPromise = new Promise<z.infer<typeof cronTriggerContract.outputSchema>>((resolve, reject) => {
        const timeout = setTimeout(() => {
            unsubscribe();
            reject(new Error(`Timed out waiting for cron job ${input.id} to complete.`));
        }, 300000); // 5 minute hard timeout

        const unsubscribe = ctx.events.subscribe('cron:job_completed', (payload) => {
            if (payload.id === input.id) {
                clearTimeout(timeout);
                unsubscribe();
                resolve({
                    success: payload.success,
                    job: payload.job,
                    result: payload.result,
                    error: payload.error
                });
            }
        });
    });

    // Now trigger it
    await ctx.api.cron.update({
        id: input.id,
        nextRun: new Date(),
        status: 'queued'
    });

    return await resultPromise;
}

/**
 * cron_reset: Forcefully resets a cron job status.
 */
export async function cron_reset(
    input: z.infer<typeof cronResetContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof cronResetContract.outputSchema>> {
    const job = await ctx.api.cron.get({ id: input.id });
    if (!job) throw new Error(`Cron job not found: ${input.id}`);

    const updated = await ctx.api.cron.update({
        id: input.id,
        status: input.status,
        error: input.status === 'failed' ? 'Job manually reset while in running state.' : null,
        nextRun: input.status === 'queued' ? new Date() : job.nextRun
    });

    return {
        success: true,
        job: updated
    };
}

/**
 * cron_status: Returns high-level metrics about the scheduler queue.
 */
export async function cron_status(
    _input: z.infer<typeof cronStatusContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof cronStatusContract.outputSchema>> {
    const allJobs = await ctx.api.cron.find({});

    const queuedCount = allJobs.filter(j => j.status === 'queued').length;
    const runningCount = allJobs.filter(j => j.status === 'running').length;
    const failedCount = allJobs.filter(j => j.status === 'failed').length;

    // In the new architecture, the scheduler might be part of the skill instance
    // which is not directly accessible here via ISkillContext. 
    // We'll rely on the DB status for now.
    
    return {
        runningCount,
        queuedCount,
        failedCount,
        groupConcurrency: {} // Calculated dynamically by the scheduler
    };
}
