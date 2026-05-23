import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import type { KanbanTask } from '../../skills/kanban.schema.js';
import * as ui from '@ui-lib';

export class TaskInspectorView implements ViewProvider {
    public readonly id = 'kanban-inspector';
    public readonly name = 'Task Inspector';
    private container: HTMLElement | null = null;

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        this.container = container;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.padding = '12px';
        container.style.backgroundColor = 'var(--bg-primary)';

        const empty = new ui.EmptyStateView({
            icon: 'fas fa-tasks',
            title: 'No Task Selected',
            description: 'Click a task on the board to inspect it.',
        });
        container.appendChild(empty.getElement());

        const unsub = this.context.ide.commands.on('kanban:task_selected', (data: unknown) => {
            const d = data as { task: KanbanTask };
            this.renderInspector(d.task);
        });
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private renderInspector(task: KanbanTask): void {
        if (!this.container) return;
        this.container.innerHTML = '';

        const stack = new ui.Stack({ gap: 'md' });

        const title = new ui.Heading({ level: 3, text: task.title });
        stack.appendChildren(title);

        const propsStack = new ui.Stack({ gap: 'xs' });
        propsStack.appendChildren(
            this.renderProp('ID', (task as any).id),
            this.renderProp('Status', task.status),
            this.renderProp('Priority', task.priority),
            this.renderProp('Dependencies', task.dependencies.join(', ') || 'None')
        );
        stack.appendChildren(propsStack);

        const descStack = new ui.Stack({ gap: 'xs' });
        descStack.appendChildren(
            new ui.Text({ text: 'Description', size: 'xs', variant: 'muted', weight: 'bold' }),
            new ui.Text({ text: task.description, size: 'sm' })
        );
        stack.appendChildren(descStack);

        if (task.acceptanceCriteria.length > 0) {
            const criteriaStack = new ui.Stack({ gap: 'xs' });
            criteriaStack.appendChildren(new ui.Text({ text: 'Acceptance Criteria', size: 'xs', variant: 'muted', weight: 'bold' }));
            
            for (const c of task.acceptanceCriteria) {
                criteriaStack.appendChildren(new ui.Text({ text: `• ${c}`, size: 'xs' }));
            }
            stack.appendChildren(criteriaStack);
        }

        const deleteBtn = new ui.Button({
            label: 'Delete Task',
            variant: 'danger',
            size: 'small',
            onClick: async () => {
                if (confirm('Delete this task?')) {
                    const client = this.context.ide.getClient() as any;
                    await client.api.kanban_work_item.delete({ id: (task as any).id });
                    this.container!.innerHTML = 'Task deleted.';
                }
            }
        });
        stack.appendChildren(deleteBtn);

        this.container.appendChild(stack.getElement());
    }

    private renderProp(label: string, value: string): HTMLElement {
        const row = new ui.Row({ justify: 'space-between', align: 'center' });
        row.getElement().style.borderBottom = '1px solid var(--border)';
        row.getElement().style.paddingBottom = '4px';
        
        row.appendChildren(
            new ui.Text({ text: label, size: 'xs', variant: 'muted' }),
            new ui.Text({ text: value, size: 'xs', weight: 'bold' })
        );
        return row.getElement();
    }
}
