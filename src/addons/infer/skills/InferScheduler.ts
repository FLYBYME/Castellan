import { ISkillContext } from 'castellan/core';
import { InferQueue, InferQueueSchema } from './infer.schema.js';

/**
 * InferScheduler: Orchestrates safe, throttled execution of inference requests.
 * Acts as a gatekeeper to ensure Ollama instances are not overloaded.
 */
export class InferScheduler {
    private interval: NodeJS.Timeout | null = null;
    private isTicking: boolean = false;
    private readonly POLL_INTERVAL_MS = 5000;

    constructor(private readonly context: ISkillContext) { }

    /**
     * start: Begins the queue polling loop.
     */
    public async start(): Promise<void> {
        if (this.interval) return;

        // Reset any items stuck in 'processing' from a previous crash
        await this.reclaimOrphans();

        console.log(`[InferScheduler] Starting background processor (poll: ${this.POLL_INTERVAL_MS}ms)`);
        this.interval = setInterval(() => this.tick(), this.POLL_INTERVAL_MS);
    }

    /**
     * stop: Gracefully halts the loop.
     */
    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    /**
     * reclaimOrphans: Resets processing items back to queued state.
     */
    private async reclaimOrphans(): Promise<void> {
        try {
            const orphans = await this.context.api.infer_queue.find({ query: { status: 'processing' } });
            if (orphans.length > 0) {
                console.warn(`[InferScheduler] Reclaiming ${orphans.length} orphaned inference tasks...`);
                for (const item of orphans) {
                    await this.context.api.infer_queue.update({ id: item.id, status: 'queued' });
                }
            }
        } catch (err) {
            console.error(`[InferScheduler] Orphan reclamation failed:`, err);
        }
    }

    /**
     * tick: Periodic check for queued items and resource availability.
     */
    private async tick(): Promise<void> {
        if (this.isTicking) return;
        this.isTicking = true;

        try {
            // 1. Fetch next queued item
            const queued = await this.context.api.infer_queue.find({
                query: { status: 'queued' },
                sort: ['createdAt'],
                limit: 1
            });

            const task = queued[0];
            if (!task) return;

            // 2. Attempt to acquire an Ollama instance
            // We use the existing acquire_ollama tool which respects instance-level concurrency.
            const { success, instance } = await this.context.api.infer.acquire_ollama({});

            if (!success || !instance) {
                // No nodes available. Task stays in 'queued'.
                return;
            }

            console.log(`[InferScheduler] Resource acquired. Processing task ${task.id} on instance ${instance.name}`);

            // 3. Execute immediately in background (non-blocking for the scheduler loop)
            void this.processTask(task, instance.id);

        } catch (err) {
            console.error(`[InferScheduler] Tick execution error:`, err);
        } finally {
            this.isTicking = false;
        }
    }

    /**
     * processTask: Manages the lifecycle of a single inference task.
     */
    private async processTask(task: InferQueue & { id: string }, instanceId: string): Promise<void> {
        try {
            // A. Mark as processing
            await this.context.api.infer_queue.update({ id: task.id, status: 'processing' });

            // B. Execute Chat turn
            // Note: We need to pass the instanceId to bypass internal acquisition in infer_chat.
            // We'll update the infer_chat signature in the next step.
            await this.context.api.infer.chat({
                threadId: task.threadId,
                instanceId: instanceId // This requires an update to the contract/tool
            });

            // C. Success
            await this.context.api.infer_queue.update({ id: task.id, status: 'completed' });

        } catch (err) {
            console.error(`[InferScheduler] Task ${task.id} failed:`, err);
            await this.context.api.infer_queue.update({
                id: task.id,
                status: 'failed',
                error: err instanceof Error ? err.message : String(err)
            });
        } finally {
            // D. CRITICAL: Always release the resource
            try {
                await this.context.api.infer.release_ollama({ instanceId });
            } catch (releaseErr) {
                console.error(`[InferScheduler] FAILED TO RELEASE INSTANCE ${instanceId}:`, releaseErr);
            }
        }
    }
}
