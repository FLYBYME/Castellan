import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { KanbanBoardView } from './views/KanbanBoardView.js';
import { TaskInspectorView } from './views/TaskInspectorView.js';

export class KanbanExtension implements Extension {
    public readonly id = 'kanban';
    public readonly name = 'Task Board';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        console.log('[KanbanExtension] Activating...');

        // Register Views
        context.ide.views.registerProvider('center-panel', new KanbanBoardView(context));
        context.ide.views.registerProvider('right-panel', new TaskInspectorView(context));

        // Register Activity Bar Item
        context.ide.activityBar.registerItem({
            id: 'kanban-board',
            icon: 'fas fa-columns',
            title: 'Task Board',
            location: 'center-panel',
            order: 160
        });
    }

    public deactivate(): void {
        console.log('[KanbanExtension] Deactivating...');
    }
}

export default new KanbanExtension();
