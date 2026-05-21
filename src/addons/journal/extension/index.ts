import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { LedgerView } from './views/LedgerView.js';
import { DirectiveView } from './views/DirectiveView.js';

export class JournalExtension implements Extension {
    public readonly id = 'journal';
    public readonly name = 'Memory Ledger';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        console.log('[JournalExtension] Activating...');

        // Register Views
        context.ide.views.registerProvider('left-panel', new LedgerView(context));
        context.ide.views.registerProvider('center-panel', new DirectiveView(context));

        // Register Activity Bar Item
        context.ide.activityBar.registerItem({
            id: 'journal-ledger',
            icon: 'fas fa-book',
            title: 'Memory Ledger',
            location: 'left-panel',
            order: 170
        });
    }

    public deactivate(): void {
        console.log('[JournalExtension] Deactivating...');
    }
}

export default new JournalExtension();
