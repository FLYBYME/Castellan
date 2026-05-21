/**
 * ext.castellan.web — Web Data Sources extension with Feed Manager and Browser Preview.
 */
import type { ViewProvider } from '../../../client/core/extensions/ViewProvider.js';
import type { ExtensionContext } from '../../../client/core/extensions/Extension.js';
import type { RssFeed, WebFetchFeedOutput } from '../skills/web.schema.js';
import * as ui from '../../../client/ui-lib/index.js';

// ─── Search Console / Feed Manager View ────────────────────────────────────────

class SearchConsoleViewProvider implements ViewProvider {
    public readonly id = 'web-console';
    public readonly name = 'Data Sources';
    private container: HTMLElement | null = null;
    private feeds: RssFeed[] = [];

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        this.container = container;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.backgroundColor = 'var(--bg-primary)';

        const toolbar = new ui.Toolbar({
            items: [
                { id: 'web-create', icon: 'fas fa-plus', title: 'Add Feed', onClick: () => this.createFeed() },
                { id: 'web-refresh', icon: 'fas fa-sync-alt', title: 'Refresh', onClick: () => this.refreshData() },
            ],
        });
        container.appendChild(toolbar.getElement());

        const content = document.createElement('div');
        content.id = 'web-feeds-content';
        content.style.flex = '1';
        content.style.overflow = 'auto';
        content.style.padding = '8px';
        container.appendChild(content);

        await this.refreshData();

        const unsub = this.context.ide.commands.on('data:updated', (payload: unknown) => {
            const p = payload as { domain: string };
            if (p.domain === 'web') {
                this.refreshData();
            }
        });
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private async refreshData() {
        try {
            const client = this.context.ide.getClient() as any;
            this.feeds = await client.api.web.find({});
            this.renderFeeds();
        } catch (err) {
            console.error('[WebExtension] Failed to fetch feeds', err);
        }
    }

    private renderFeeds(): void {
        const content = this.container?.querySelector('#web-feeds-content') as HTMLElement;
        if (!content) return;
        content.innerHTML = '';

        if (this.feeds.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-rss',
                title: 'No Data Sources',
                description: 'Add RSS/JSON feeds to monitor.',
            });
            content.appendChild(empty.getElement());
            return;
        }

        for (const feed of this.feeds) {
            const card = new ui.Card({ padding: 'sm' });
            card.getElement().style.marginBottom = '6px';

            const stack = new ui.Stack({ gap: 'xs' });

            const header = new ui.Row({ justify: 'space-between', align: 'center' });
            header.appendChildren(
                new ui.Text({ text: feed.name, weight: 'bold', size: 'sm' }),
                new ui.Text({ text: feed.url, size: 'xs', variant: 'muted' })
            );

            const promptPreview = new ui.Text({ text: feed.extractionPrompt, size: 'xs', variant: 'muted' });
            promptPreview.getElement().style.maxHeight = '28px';
            promptPreview.getElement().style.overflow = 'hidden';

            const actions = new ui.Row({ gap: 'sm' });
            actions.getElement().style.marginTop = '8px';
            actions.appendChildren(
                new ui.Button({
                    label: 'Fetch Now',
                    variant: 'primary',
                    size: 'small',
                    onClick: () => this.fetchFeed((feed as any).id)
                }),
                new ui.Button({
                    label: 'Delete',
                    variant: 'danger',
                    size: 'small',
                    onClick: () => this.deleteFeed((feed as any).id)
                })
            );

            stack.appendChildren(header, promptPreview, actions);
            card.appendChildren(stack);
            content.appendChild(card.getElement());
        }
    }

    private async createFeed() {
        const name = prompt('Feed name:');
        if (!name) return;
        const url = prompt('Feed URL:');
        if (!url) return;
        
        try {
            const client = this.context.ide.getClient() as any;
            await client.api.web.create({ 
                name, 
                url, 
                extractionPrompt: 'Extract key events.' 
            });
            this.refreshData();
        } catch (err) {
            console.error('[WebExtension] Failed to create feed', err);
        }
    }

    private async fetchFeed(feedId: string) {
        try {
            const client = this.context.ide.getClient() as any;
            const result = await client.api.web.fetch_feed({ feedId });
            this.context.ide.commands.emit('web:feed_fetched', { result });
        } catch (err) {
            console.error('[WebExtension] Failed to fetch feed', err);
        }
    }

    private async deleteFeed(feedId: string) {
        if (!confirm('Delete this feed?')) return;
        try {
            const client = this.context.ide.getClient() as any;
            await client.api.web.delete({ id: feedId });
            this.refreshData();
        } catch (err) {
            console.error('[WebExtension] Failed to delete feed', err);
        }
    }
}

// ─── Browser Preview View ──────────────────────────────────────────────────────

class BrowserPreviewViewProvider implements ViewProvider {
    public readonly id = 'web-preview';
    public readonly name = 'Feed Preview';
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
            icon: 'fas fa-globe',
            title: 'No Feed Data',
            description: 'Fetch a feed to preview its contents here.',
        });
        container.appendChild(empty.getElement());

        const handler = (data: unknown) => {
            const d = data as { result: WebFetchFeedOutput };
            this.renderFeedData(d.result);
        };
        const unsub = this.context.ide.commands.on('web:feed_fetched', handler);
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private renderFeedData(result: WebFetchFeedOutput): void {
        if (!this.container) return;
        this.container.innerHTML = '';

        const stack = new ui.Stack({ gap: 'md' });

        const header = new ui.Column({ gap: 'xs' });
        header.appendChildren(
            new ui.Heading({ level: 3, text: result.feedName }),
            new ui.Text({ text: `Fetched: ${new Date(result.timestamp).toLocaleString()}`, size: 'xs', variant: 'muted' })
        );

        const dataContainer = document.createElement('pre');
        Object.assign(dataContainer.style, {
            flex: '1',
            overflow: 'auto',
            background: 'var(--bg-secondary)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: 'var(--text-main)',
            whiteSpace: 'pre-wrap',
            border: '1px solid var(--border)'
        });
        dataContainer.textContent = JSON.stringify(result.data, null, 2);

        stack.appendChildren(header, dataContainer);
        this.container.appendChild(stack.getElement());
    }
}

// ─── Extension Definition ──────────────────────────────────────────────────────

class WebExtension {
    public activate(context: ExtensionContext): void {
        context.ide.views.registerProvider('bottom-panel', new SearchConsoleViewProvider(context));
        context.ide.views.registerProvider('center-panel', new BrowserPreviewViewProvider(context));

        context.ide.activityBar.registerItem({
            id: 'web-view',
            icon: 'fas fa-globe',
            title: 'Web Data',
            location: 'bottom-panel',
            order: 140
        });
    }

    public deactivate(): void {
        console.log('[WebExtension] Deactivated');
    }
}

export default new WebExtension();
