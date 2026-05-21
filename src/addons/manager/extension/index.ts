import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { GenesisDashboardView } from './views/GenesisDashboardView.js';

export class ManagerExtension implements Extension {
    public readonly id = 'manager';
    public readonly name = 'Central Directorate';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        console.log('[ManagerExtension] Activating...');

        // Register Views
        context.ide.views.registerProvider('left-panel', new GenesisDashboardView(context));

        // Register Activity Bar Item
        context.ide.activityBar.registerItem({
            id: 'genesis-dashboard',
            icon: 'fas fa-dna',
            title: 'Genesis',
            location: 'left-panel',
            order: 100
        });
    }

    public deactivate(): void {
        console.log('[ManagerExtension] Deactivating...');
    }
}

export default new ManagerExtension();
