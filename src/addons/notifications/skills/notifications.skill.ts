import { BaseSkillModule } from 'castellan/core';
import { notificationsSendContract, notificationsListContract } from './notifications.contract.js';
import { notifications_send, notifications_list } from './notifications.tools.js';

/**
 * NotificationsSkill: System service for routing and tracking user notifications.
 */
export class NotificationsSkill extends BaseSkillModule {
    public readonly domain = 'notifications';

    constructor() {
        super();
        this.mountTool(notificationsSendContract, notifications_send);
        this.mountTool(notificationsListContract, notifications_list);
    }
}
