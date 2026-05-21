import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import type { Directive } from '../../skills/journal.schema.js';
import * as ui from '@ui-lib';

export class DirectiveView implements ViewProvider {
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
        content.style.padding = '12px';
        content.id = 'directives-content';
        container.appendChild(content);

        await this.refreshData();

        const unsub = this.context.ide.commands.on('data:updated', (payload: unknown) => {
            const p = payload as { domain: string };
            if (p.domain === 'directive') {
                void this.refreshData();
            }
        });
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private async refreshData() {
        const target = document.querySelector('#directives-content') as HTMLElement;
        if (!target) return;

        try {
            const client = this.context.ide.getClient() as any;
            this.directives = await client.api.directive.find({});
            this.renderDirectives(target);
        } catch (err) {
            console.error('[JournalExtension] Failed to fetch directives', err);
        }
    }

    private renderDirectives(container: HTMLElement) {
        container.innerHTML = '';

        if (this.directives.length === 0) {
            container.appendChild(new ui.EmptyStateView({
                icon: 'fas fa-scroll',
                title: 'No Directives',
                description: 'Run a sleep cycle to extract directives from memory.',
            }).getElement());
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
