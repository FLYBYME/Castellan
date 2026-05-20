import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { Notification } from '../../skills/notifications.schema.js';

export class NotificationService {
    private history: Notification[] = [];

    constructor(private context: ExtensionContext) {
        this.setupEventListeners();
        this.loadHistory();
    }

    private setupEventListeners() {
        // Listen for real-time notifications from the server
        this.context.ide.commands.on('notifications:new', (notification: Notification) => {
            this.handleIncomingNotification(notification);
        });
    }

    private async loadHistory() {
        try {
            const list = await this.context.ide.getClient().api.notifications.list({});
            this.history = list;
        } catch (err) {
            console.error('[NotificationService] Failed to load history', err);
        }
    }

    private handleIncomingNotification(notification: Notification) {
        this.history.unshift(notification);
        if (this.history.length > 100) this.history.pop();

        // 1. Route to Status Bar
        if (notification.target === 'status-bar') {
            this.context.ide.layout.statusBar.setMessage(notification.message);
        }

        // 2. Route to Toast (In a real system, there would be a Toast Manager)
        if (notification.target === 'toast') {
            console.info(`[TOAST] ${notification.type.toUpperCase()}: ${notification.message}`);
            // Fallback to status bar for now if no toast manager exists
            this.context.ide.layout.statusBar.setMessage(notification.message);
        }

        // 3. Specific View Targeting
        if (typeof notification.target === 'string' && !['toast', 'status-bar', 'center'].includes(notification.target)) {
            // Dispatch internal event for the specific view
            this.context.ide.commands.emit(`view:notification:${notification.target}`, notification);
        }

        // Emit general change for UI components (like the History View)
        this.context.ide.commands.emit('notifications:changed', this.history);
    }

    public getHistory(): Notification[] {
        return [...this.history];
    }

    public clearHistory() {
        this.history = [];
        this.context.ide.commands.emit('notifications:changed', this.history);
    }

    public setStatusMessage(message: string) {
        this.context.ide.layout.statusBar.setMessage(message);
    }
}
