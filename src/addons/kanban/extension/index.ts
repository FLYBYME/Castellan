/**
 * ext.castellan.kanban — Task Board extension with drag-and-drop Kanban and Inspector.
 */
import type { ViewProvider } from '../../../client/core/extensions/ViewProvider.js';
import type { ExtensionContext } from '../../../client/core/extensions/Extension.js';
import type { KanbanTask, KanbanStage } from '../skills/kanban.schema.js';
import * as ui from '../../../client/ui-lib/index.js';

const STAGES: KanbanStage[] = ['Backlog', 'Ready', 'In Progress', 'Testing', 'Done'];
const STAGE_COLORS: Record<KanbanStage, string> = {
    'Backlog': '#607d8b',
    'Ready': '#2196f3',
    'In Progress': '#ff9800',
    'Testing': '#9c27b0',
    'Done': '#4caf50',
};

const PRIORITY_COLORS: Record<string, string> = {
    'Critical': '#f44336',
    'High': '#ff9800',
    'Medium': '#2196f3',
    'Low': '#4caf50',
};

// ─── Kanban Board View ─────────────────────────────────────────────────────────

class KanbanBoardViewProvider implements ViewProvider {
    public readonly id = 'kanban-board';
    public readonly name = 'Task Board';
    private container: HTMLElement | null = null;
    private selectedTaskId: string | null = null;
    private tasks: KanbanTask[] = [];

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        this.container = container;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.backgroundColor = 'var(--bg-primary)';

        const toolbar = new ui.Toolbar({
            items: [
                { id: 'kanban-create', icon: 'fas fa-plus', title: 'New Task', onClick: () => this.createTask() },
                { id: 'kanban-refresh', icon: 'fas fa-sync-alt', title: 'Refresh', onClick: () => this.refreshData() },
            ],
        });
        container.appendChild(toolbar.getElement());

        const board = document.createElement('div');
        board.id = 'kanban-board-container';
        Object.assign(board.style, {
            flex: '1',
            display: 'flex',
            gap: '8px',
            padding: '8px',
            overflow: 'auto',
        });
        container.appendChild(board);

        await this.refreshData();

        const unsub = this.context.ide.commands.on('data:updated', (payload: unknown) => {
            const p = payload as { domain: string };
            if (p.domain === 'kanban') {
                this.refreshData();
            }
        });
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private async refreshData() {
        try {
            const client = this.context.ide.getClient() as any;
            this.tasks = await client.api.kanban.find({});
            this.renderBoard();
        } catch (err) {
            console.error('[KanbanExtension] Failed to fetch tasks', err);
        }
    }

    private renderBoard(): void {
        const board = this.container?.querySelector('#kanban-board-container') as HTMLElement;
        if (!board) return;
        board.innerHTML = '';

        const columns = new Map<KanbanStage, KanbanTask[]>();
        for (const stage of STAGES) columns.set(stage, []);
        for (const task of this.tasks) {
            columns.get(task.status)?.push(task);
        }

        for (const stage of STAGES) {
            const tasks = columns.get(stage) ?? [];
            const column = this.renderColumn(stage, tasks);
            board.appendChild(column);
        }
    }

    private renderColumn(stage: KanbanStage, tasks: KanbanTask[]): HTMLElement {
        const column = document.createElement('div');
        Object.assign(column.style, {
            flex: '1',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--border)'
        });

        // Column header
        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: `2px solid ${STAGE_COLORS[stage]}`,
            background: 'var(--bg-primary)'
        });

        const dot = document.createElement('div');
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.borderRadius = '50%';
        dot.style.background = STAGE_COLORS[stage];
        header.appendChild(dot);

        const title = new ui.Text({ text: stage, weight: 'bold', size: 'sm' });
        header.appendChild(title.getElement());

        const count = new ui.Text({ text: `${tasks.length}`, size: 'xs', variant: 'muted' });
        count.getElement().style.marginLeft = 'auto';
        header.appendChild(count.getElement());

        column.appendChild(header);

        // Cards container (drop zone)
        const cardsContainer = document.createElement('div');
        Object.assign(cardsContainer.style, {
            flex: '1',
            overflow: 'auto',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minHeight: '60px',
        });

        cardsContainer.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault();
            cardsContainer.style.background = `${STAGE_COLORS[stage]}22`;
        });
        cardsContainer.addEventListener('dragleave', () => {
            cardsContainer.style.background = 'transparent';
        });
        cardsContainer.addEventListener('drop', async (e: DragEvent) => {
            e.preventDefault();
            cardsContainer.style.background = 'transparent';
            const taskId = e.dataTransfer?.getData('text/plain');
            if (taskId) {
                await this.moveTask(taskId, stage);
            }
        });

        for (const task of tasks) {
            cardsContainer.appendChild(this.renderTaskCard(task));
        }

        column.appendChild(cardsContainer);
        return column;
    }

    private renderTaskCard(task: KanbanTask): HTMLElement {
        const card = new ui.Card({ padding: 'sm', hoverable: true });
        card.getElement().style.marginBottom = '4px';
        card.getElement().style.cursor = 'grab';
        if (this.selectedTaskId === (task as unknown as { id: string }).id) {
            card.getElement().style.borderColor = 'var(--accent)';
        }

        card.getElement().draggable = true;
        card.getElement().addEventListener('dragstart', (e: DragEvent) => {
            e.dataTransfer?.setData('text/plain', (task as unknown as { id: string }).id);
            card.getElement().style.opacity = '0.5';
        });
        card.getElement().addEventListener('dragend', () => {
            card.getElement().style.opacity = '1';
        });

        card.getElement().onclick = () => {
            this.selectedTaskId = (task as any).id;
            this.context.ide.commands.emit('kanban:task_selected', { task });
            this.renderBoard();
        };

        const stack = new ui.Stack({ gap: 'xs' });

        // Priority
        const priorityRow = new ui.Row({ gap: 'xs', align: 'center' });
        const dot = document.createElement('div');
        dot.style.width = '6px';
        dot.style.height = '6px';
        dot.style.borderRadius = '50%';
        dot.style.background = PRIORITY_COLORS[task.priority] ?? 'var(--text-muted)';
        
        const prioText = new ui.Text({ text: task.priority.toUpperCase(), size: 'xs', weight: 'bold' });
        prioText.getElement().style.color = PRIORITY_COLORS[task.priority] ?? 'var(--text-muted)';

        priorityRow.appendChildren(dot, prioText.getElement());

        const title = new ui.Text({ text: task.title, size: 'sm', weight: 'bold' });
        
        stack.appendChildren(priorityRow, title);

        if (task.description) {
            const desc = new ui.Text({ text: task.description, size: 'xs', variant: 'muted' });
            desc.getElement().style.maxHeight = '28px';
            desc.getElement().style.overflow = 'hidden';
            stack.appendChildren(desc);
        }

        card.appendChildren(stack);
        return card.getElement();
    }

    private async createTask(): Promise<void> {
        const title = window.prompt('Task title:');
        if (!title) return;
        const description = window.prompt('Description:') ?? '';
        
        try {
            const client = this.context.ide.getClient() as any;
            await client.api.kanban.create({ 
                title, 
                description, 
                status: 'Backlog',
                priority: 'Medium',
                acceptanceCriteria: [],
                dependencies: []
            });
            this.refreshData();
        } catch (err) {
            console.error('[KanbanExtension] Failed to create task', err);
        }
    }

    private async moveTask(taskId: string, stage: KanbanStage) {
        try {
            const client = this.context.ide.getClient() as any;
            await client.api.kanban.move({ taskId, stage });
            this.refreshData();
        } catch (err) {
            console.error('[KanbanExtension] Failed to move task', err);
        }
    }
}

// ─── Task Inspector View ───────────────────────────────────────────────────────

class TaskInspectorViewProvider implements ViewProvider {
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
            this.renderProp('ID', (task as unknown as { id: string }).id),
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
                    await client.api.kanban.delete({ id: (task as unknown as { id: string }).id });
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

// ─── Extension Definition ──────────────────────────────────────────────────────

class KanbanExtension {
    public activate(context: ExtensionContext): void {
        context.ide.views.registerProvider('center-panel', new KanbanBoardViewProvider(context));
        context.ide.views.registerProvider('right-panel', new TaskInspectorViewProvider(context));

        context.ide.activityBar.registerItem({
            id: 'kanban-view',
            icon: 'fas fa-columns',
            title: 'Task Board',
            location: 'center-panel',
            order: 160
        });
    }

    public deactivate(): void {
        console.log('[KanbanExtension] Deactivated');
    }
}

export default new KanbanExtension();
