import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { NotificationService } from './services/NotificationService.js';
import { NotificationCenterView } from './views/NotificationCenterView.js';

export class NotificationExtension implements Extension {
    public readonly id = 'notifications';
    public readonly name = 'Notifications';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        const service = new NotificationService(context);

        // Register as global service
        context.registerService('notifications', service);

        // Register View (Bottom Panel for History - overwrites stub)
        context.ide.views.registerProvider('bottom-panel', new NotificationCenterView(context, service));
    }
}

export default new NotificationExtension();
