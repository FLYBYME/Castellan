import { z } from 'zod';

export const NotificationTargetSchema = z.string().describe("Target delivery: 'toast', 'status-bar', 'center', or a specific view ID");
export type NotificationTarget = z.infer<typeof NotificationTargetSchema>;

export const NotificationTypeSchema = z.enum(['info', 'success', 'warning', 'error']);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationSchema = z.object({
    id: z.string().describe("Unique identifier for the notification"),
    message: z.string().describe("The notification message text"),
    type: NotificationTypeSchema.describe("Message severity level"),
    target: NotificationTargetSchema.describe("Target delivery: 'toast', 'status-bar', 'center', or a specific view ID"),
    timestamp: z.coerce.date().describe("When the notification was triggered"),
    read: z.boolean().describe("Whether the notification has been seen"),
    action: z.string().optional().describe("Optional command to execute on click")
});
export type Notification = z.infer<typeof NotificationSchema>;

export const NotificationSendInputSchema = z.object({
    message: z.string().describe("The message to notify"),
    type: NotificationTypeSchema.optional().default('info'),
    target: NotificationTargetSchema.optional().default('toast'),
    action: z.string().optional()
});
export type NotificationSendInput = z.infer<typeof NotificationSendInputSchema>;
