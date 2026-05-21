/**
 * ext.castellan.journal — Memory Ledger extension with Journal and Directive views.
 */
import type { ViewProvider } from '../../../client/core/extensions/ViewProvider.js';
import type { ExtensionContext } from '../../../client/core/extensions/Extension.js';
import type { JournalEntry, Directive } from '../skills/journal.schema.js';
import * as ui from '../../../client/ui-lib/index.js';

// ─── Ledger View ───────────────────────────────────────────────────────────────

class LedgerViewProvider implements ViewProvider {
    public readonly id = 'journal-ledger';
    public readonly name = 'Memory Ledger';
    private container: HTMLElement | null = null;
    private filterType: string = 'all';
    private filterStatus: string = 'all';
    private entries: JournalEntry[] = [];

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        this.container = container;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.backgroundColor = 'var(--bg-primary)';

        // Toolbar
        const toolbar = document.createElement('div');
        Object.assign(toolbar.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap',
        });

        // Type filter
        const typeSelect = document.createElement('select');
        Object.assign(typeSelect.style, {
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            padding: '4px 6px',
            borderRadius: '4px',
            fontSize: '11px',
        });
        for (const opt of ['all', 'observation', 'reasoning', 'proposal']) {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
            typeSelect.appendChild(option);
        }
        typeSelect.onchange = () => {
            this.filterType = typeSelect.value;
            this.render();
        };
        toolbar.appendChild(typeSelect);

        // Status filter
        const statusSelect = document.createElement('select');
        Object.assign(statusSelect.style, {
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            padding: '4px 6px',
            borderRadius: '4px',
            fontSize: '11px',
        });
        for (const opt of ['all', 'noted', 'pending', 'approved', 'rejected', 'completed']) {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
            statusSelect.appendChild(option);
        }
        statusSelect.onchange = () => {
            this.filterStatus = statusSelect.value;
            this.render();
        };
        toolbar.appendChild(statusSelect);

        const refreshBtn = new ui.Button({
            icon: 'fas fa-sync-alt',
            variant: 'ghost',
            size: 'small',
            onClick: () => this.refreshData(),
        });
        toolbar.appendChild(refreshBtn.getElement());

        const compressBtn = new ui.Button({
            label: 'Sleep Cycle',
            icon: 'fas fa-moon',
            variant: 'secondary',
            size: 'small',
            onClick: () => this.compress(),
        });
        toolbar.appendChild(compressBtn.getElement());

        container.appendChild(toolbar);

        // Entries list
        const content = document.createElement('div');
        content.id = 'ledger-content';
        content.style.flex = '1';
        content.style.overflow = 'auto';
        content.style.padding = '8px';
        container.appendChild(content);

        await this.refreshData();

        const unsub = this.context.ide.commands.on('data:updated', (payload: unknown) => {
            const p = payload as { domain: string };
            if (p.domain === 'journal') {
                this.refreshData();
            }
        });
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private async refreshData() {
        try {
            const client = this.context.ide.getClient() as any;
            this.entries = await client.api.journal.find({ sort: ['-timestamp'] });
            this.render();
        } catch (err) {
            console.error('[JournalExtension] Failed to fetch entries', err);
        }
    }

    private async compress() {
        try {
            const client = this.context.ide.getClient() as any;
            await client.api.journal.compress({});
            this.refreshData();
        } catch (err) {
            console.error('[JournalExtension] Failed to compress', err);
        }
    }

    private render(): void {
        const content = this.container?.querySelector('#ledger-content') as HTMLElement;
        if (!content) return;
        content.innerHTML = '';

        let filtered = this.entries;

        if (this.filterType !== 'all') {
            filtered = filtered.filter(e => e.type === this.filterType);
        }
        if (this.filterStatus !== 'all') {
            filtered = filtered.filter(e => e.status === this.filterStatus);
        }

        if (filtered.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-book',
                title: 'No Entries',
                description: 'The memory ledger is empty.',
            });
            content.appendChild(empty.getElement());
            return;
        }

        for (const entry of filtered) {
            content.appendChild(this.renderEntry(entry));
        }
    }

    private renderEntry(entry: JournalEntry): HTMLElement {
        const card = new ui.Card({
            padding: 'sm',
            variant: 'default',
        });
        card.getElement().style.marginBottom = '6px';
        if (entry.status === 'pending') {
            card.getElement().style.borderColor = '#ff980033';
        }

        const stack = new ui.Stack({ gap: 'xs' });

        const header = new ui.Row({ justify: 'space-between', align: 'center' });
        
        const typeBadge = new ui.Badge({ 
            count: entry.type.toUpperCase(), 
            variant: this.getTypeVariant(entry.type),
            size: 'sm'
        });
        
        const statusBadge = new ui.Badge({ 
            count: entry.status.toUpperCase(), 
            variant: this.getStatusVariant(entry.status),
            size: 'sm'
        });

        const leftHeader = new ui.Row({ gap: 'sm', align: 'center' });
        leftHeader.appendChildren(typeBadge, statusBadge);

        header.appendChildren(leftHeader, new ui.Text({ text: new Date(entry.timestamp).toLocaleTimeString(), size: 'xs', variant: 'muted' }));

        const contentEl = new ui.Text({ text: entry.content, size: 'sm' });
        
        stack.appendChildren(header, contentEl);

        if (entry.status === 'pending' && entry.type === 'proposal') {
            const actions = new ui.Row({ gap: 'sm' });
            actions.getElement().style.marginTop = '8px';

            actions.appendChildren(
                new ui.Button({
                    label: 'Approve',
                    variant: 'primary',
                    size: 'small',
                    icon: 'fas fa-check',
                    onClick: () => this.resolve((entry as unknown as { id: string }).id, 'approved'),
                }),
                new ui.Button({
                    label: 'Reject',
                    variant: 'danger',
                    size: 'small',
                    icon: 'fas fa-times',
                    onClick: async () => {
                        const correction = prompt('Reason for rejection:');
                        if (correction !== null) {
                            await this.resolve((entry as unknown as { id: string }).id, 'rejected', correction);
                        }
                    },
                })
            );
            stack.appendChildren(actions);
        }

        if (entry.correction) {
            const correction = new ui.Text({ text: `Correction: ${entry.correction}`, size: 'xs', variant: 'error' });
            correction.getElement().style.background = 'rgba(244, 67, 54, 0.1)';
            correction.getElement().style.padding = '4px 8px';
            correction.getElement().style.borderRadius = '4px';
            stack.appendChildren(correction);
        }

        card.appendChildren(stack);
        return card.getElement();
    }

    private getTypeVariant(type: string): any {
        switch (type) {
            case 'observation': return 'accent';
            case 'reasoning': return 'muted';
            case 'proposal': return 'warning';
            default: return 'default';
        }
    }

    private getStatusVariant(status: string): any {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'muted';
        }
    }

    private async resolve(entryId: string, status: 'approved' | 'rejected', correction?: string) {
        try {
            const client = this.context.ide.getClient() as any;
            await client.api.journal.resolve({ entryId, status, correction });
            this.refreshData();
        } catch (err) {
            console.error('[JournalExtension] Failed to resolve', err);
        }
    }
}

// ─── Directives View ───────────────────────────────────────────────────────────

class DirectiveViewProvider implements ViewProvider {
    public readonly id = 'journal-directives';
    public readonly name = 'Directives';
    private directives: Directive[] = [];

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.backgroundColor = 'var(--bg-primary)';

        const toolbar = new ui.Toolbar({
            items: [
                { id: 'dir-refresh', icon: 'fas fa-sync-alt', title: 'Refresh', onClick: () => this.refreshData() },
            ],
        });
        container.appendChild(toolbar.getElement());

        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.overflow = 'auto';
        content.style.padding = '8px';
        container.appendChild(content);

        await this.refreshData(content);

        const unsub = this.context.ide.commands.on('data:updated', (payload: unknown) => {
            const p = payload as { domain: string };
            if (p.domain === 'directive') {
                this.refreshData(content);
            }
        });
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private async refreshData(content?: HTMLElement) {
        const target = content || document.querySelector(`#${this.id}-content`) as HTMLElement;
        if (!target) return;

        try {
            const client = this.context.ide.getClient() as any;
            this.directives = await client.api.directive.find({});
            this.render(target);
        } catch (err) {
            console.error('[JournalExtension] Failed to fetch directives', err);
        }
    }

    private render(container: HTMLElement) {
        container.innerHTML = '';

        if (this.directives.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-scroll',
                title: 'No Directives',
                description: 'Run a sleep cycle to extract directives from memory.',
            });
            container.appendChild(empty.getElement());
            return;
        }

        for (const dir of this.directives) {
            const card = new ui.Card({ padding: 'sm' });
            card.getElement().style.marginBottom = '6px';

            const stack = new ui.Stack({ gap: 'xs' });
            stack.appendChildren(
                new ui.Text({ text: dir.rule, size: 'sm' }),
                new ui.Text({ text: `Created: ${new Date(dir.createdAt).toLocaleDateString()}`, size: 'xs', variant: 'muted' })
            );

            card.appendChildren(stack);
            container.appendChild(card.getElement());
        }
    }
}

// ─── Extension Definition ──────────────────────────────────────────────────────

class JournalExtension {
    public activate(context: ExtensionContext): void {
        context.ide.views.registerProvider('left-panel', new LedgerViewProvider(context));
        context.ide.views.registerProvider('center-panel', new DirectiveViewProvider(context));

        context.ide.activityBar.registerItem({
            id: 'journal-view',
            icon: 'fas fa-book',
            title: 'Memory Ledger',
            location: 'left-panel',
            order: 170
        });
    }

    public deactivate(): void {
        console.log('[JournalExtension] Deactivated');
    }
}

export default new JournalExtension();
