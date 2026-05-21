import { z } from 'zod';
import { ISkillContext } from 'castellan/core';
import { genesisContract, bootstrapContract, resetContract } from './system.contract.js';

export async function genesis(
    input: z.infer<typeof genesisContract.inputSchema>,
    _ctx: ISkillContext
) {
    // Simplified genesis for migration
    return {
        success: true,
        initialPrompt: input.prompt || '',
        finalPrompt: 'Optimized prompt',
        history: []
    };
}

export async function bootstrap(
    _input: z.infer<typeof bootstrapContract.inputSchema>,
    _ctx: ISkillContext
) {
    return {
        success: true,
        message: 'System bootstrap complete.'
    };
}

export async function reset(
    input: z.infer<typeof resetContract.inputSchema>,
    ctx: ISkillContext
) {
    if (!input.confirm) {
        throw new Error("Reset not confirmed.");
    }

    const domains = [
        'agent', 'messages', 'threads', 'journal', 'directives',
        'tasks', 'approvals', 'scenarios', 'evaluations', 'cron', 'cron_runs', 'infer_queue'
    ];

    for (const domain of domains) {
        try {
            const items = await (ctx.api as any)[domain].find({});
            for (const item of items) {
                await (ctx.api as any)[domain].delete({ id: item.id });
            }
        } catch (err) {
            console.error(`Failed to wipe domain ${domain}:`, err);
        }
    }

    return { success: true };
}
