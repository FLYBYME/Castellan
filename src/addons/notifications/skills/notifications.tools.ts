import { ISkillContext } from 'castellan/core';
import { z } from 'zod';
import {
    notificationsSendContract,
    notificationsListContract
} from './notifications.contract.js';

// In-memory store for notifications (enterprise would use DB)
const notificationHistory: z.infer<typeof notificationsSendContract.outputSchema>[] = [];

function log(ctx: ISkillContext, level: 'info' | 'error' | 'warn', message: string, meta?: any) {
    console.log(`[${level.toUpperCase()}] [${ctx.correlationId}] [NotificationsSkill] ${message}`, meta || '');
}

export async function notifications_send(
    input: z.infer<typeof notificationsSendContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof notificationsSendContract.outputSchema>> {
    log(ctx, 'info', `Sending notification to target: ${input.target}`);

    const notification: z.infer<typeof notificationsSendContract.outputSchema> = {
        id: Math.random().toString(36).substring(7), // Simple ID for now
        message: input.message,
        type: input.type || 'info',
        target: input.target || 'toast',
        timestamp: new Date(),
        read: false,
        action: input.action
    };

    notificationHistory.unshift(notification);
    if (notificationHistory.length > 100) notificationHistory.pop();

    // Dispatch event so frontend can listen in real-time
    await ctx.events.dispatch('notifications:new', ctx.correlationId, notification);

    return notification;
}

export async function notifications_list(
    input: z.infer<typeof notificationsListContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof notificationsListContract.outputSchema>> {
    log(ctx, 'info', 'Listing notifications history.');
    return notificationHistory.slice(0, input.limit);
}
