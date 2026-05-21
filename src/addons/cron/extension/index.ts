import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { JobSchedulerView } from './views/JobSchedulerView.js';

export class CronExtension implements Extension {
    public readonly id = 'cron';
    public readonly name = 'Cron Scheduler';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        console.log('[CronExtension] Activating...');

        // Register Views
        context.ide.views.registerProvider('bottom-panel', new JobSchedulerView(context));

        // Register Activity Bar Item
        context.ide.activityBar.registerItem({
            id: 'cron-scheduler',
            icon: 'fas fa-clock',
            title: 'Cron Scheduler',
            location: 'bottom-panel',
            order: 150
        });
    }

    public deactivate(): void {
        console.log('[CronExtension] Deactivating...');
    }
}

export default new CronExtension();
