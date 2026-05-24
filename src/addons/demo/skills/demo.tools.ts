import { ISkillContext } from '@flybyme/castellan/core';
import { z } from 'zod';
import {
    demoHelloContract,
    demoStatusContract,
    demoNotifyContract
} from './demo.contract.js';

export async function demo_hello(
    input: z.infer<typeof demoHelloContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof demoHelloContract.outputSchema>> {

    // 1. Create a demo record using the Unified API
    const doc = await ctx.api.demo.create({
        name: input.name,
        value: 100
    });

    // 2. Dispatch a strictly-typed custom event
    // The event name 'demo:hello_sent' is autocompleted and payload is type-checked
    // because of the module augmentation in demo.contract.ts
    await ctx.events.dispatch('demo:hello_sent', ctx.correlationId, {
        name: input.name,
        timestamp: new Date()
    });

    // 3. Perform other DB operations
    const docs = await ctx.api.demo.find({ limit: 10 });
    const single = await ctx.api.demo.find_one({ query: { name: input.name } });
    const count = await ctx.api.demo.count({ query: {} });

    // Cleanup: demo deleting
    for (const d of docs) {
        if (d.id !== doc.id) {
            void ctx.api.demo.delete({ id: d.id });
        }
    }

    return {
        message: `Hello, ${input.name}! Created ID: ${doc.id}, found ${single?.id}, total count ${count}. Event dispatched!`
    };
}

export async function demo_status(
    input: z.infer<typeof demoStatusContract.inputSchema>,
    _ctx: ISkillContext
): Promise<z.infer<typeof demoStatusContract.outputSchema>> {
    return {
        message: `Status check for ${input.name}: Engine is Healthy.`
    };
}

export async function demo_notify(
    input: z.infer<typeof demoNotifyContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof demoNotifyContract.outputSchema>> {
    // Leverage the system notifications service via the Unified API
    await ctx.api.notifications.send({
        message: `[${input.title}] ${input.message}`,
        type: input.type as 'info' | 'success' | 'warning' | 'error'
    });

    return { success: true };
}
