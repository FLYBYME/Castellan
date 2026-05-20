import { z } from 'zod';
import { defineContract } from 'castellan/core';
import { NotificationSchema, NotificationSendInputSchema } from './notifications.schema.js';

/**
 * --- Event Augmentation ---
 */
declare module '../../../core/events.js' {
    interface EventRegistry {
        'notifications:new': z.infer<typeof NotificationSchema>;
    }
}

export const notificationsSendContract = defineContract({
    domain: 'notifications',
    action: 'send',
    description: 'Trigger a new system notification',
    inputSchema: NotificationSendInputSchema,
    outputSchema: NotificationSchema,
    rest: { method: 'POST', path: '/notifications/send' }
});

export const notificationsListContract = defineContract({
    domain: 'notifications',
    action: 'list',
    description: 'List recent notifications',
    inputSchema: z.object({
        limit: z.number().optional().default(50)
    }),
    outputSchema: z.array(NotificationSchema),
    rest: { method: 'GET', path: '/notifications/list' }
});
