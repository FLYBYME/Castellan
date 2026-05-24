import { BaseSkillModule, ISkillContext } from '@flybyme/castellan/core';
import { cronJobCrud, cronJobRunCrud, cronTriggerContract, cronResetContract, cronStatusContract } from './cron.contract.js';
import { cron_trigger, cron_reset, cron_status } from './cron.tools.js';
import { CronJob } from './cron.schema.js';
import { CronScheduler } from './CronScheduler.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * --- Event Augmentation ---
 */
declare module '../../../core/events.js' {
    interface EventRegistry {
        'cron:job_completed': {
            id: string;
            success: boolean;
            job: CronJob & { id: string };
            result?: any;
            error?: string;
        };
    }
}

/**
 * CronSkill: Manages background automation and scheduled cron jobs.
 */
export class CronSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'cron';
    private scheduler?: CronScheduler;

    constructor() {
        super();

        // 1. Mount Persistence
        this.mountCrud(cronJobCrud);
        this.mountCrud(cronJobRunCrud);

        // 2. Mount Tools
        this.mountTool(cronTriggerContract, cron_trigger);
        this.mountTool(cronResetContract, cron_reset);
        this.mountTool(cronStatusContract, cron_status);
    }

    public async postInit(context: ISkillContext<ContextApi>): Promise<void> {
        // Initialize and start the background scheduler
        this.scheduler = new CronScheduler(context);
        void this.scheduler.start();
    }
}
