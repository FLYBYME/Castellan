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
    rest: { method: 'POST', path: '/notifications/send' },
    print: (output) => `
### Notification Sent
- **ID**: ${output.id}
- **Type**: ${output.type}

**Message**:
> ${output.message}
    `.trim()
});

export const notificationsListContract = defineContract({
    domain: 'notifications',
    action: 'list',
    description: 'List recent notifications',
    inputSchema: z.object({
        limit: z.number().optional().default(50)
    }),
    outputSchema: z.array(NotificationSchema),
    rest: { method: 'GET', path: '/notifications/list' },
    print: (output) => {
        if (output.length === 0) return "No recent notifications.";
        const rows = output.map(n => `| ${new Date(n.timestamp!).toISOString()} | ${n.type} | ${n.message.substring(0, 50)}${n.message.length > 50 ? '...' : ''} |`).join('\n');
        return `
### Notification History
| Timestamp | Type | Message |
| :--- | :--- | :--- |
${rows}
        `.trim();
    }
});
