/**
 * ext.castellan.github — Source Control extension with repo browser, issues, and PRs.
 */
import type { ViewProvider } from '../../../client/core/extensions/ViewProvider.js';
import type { ExtensionContext } from '../../../client/core/extensions/Extension.js';
import type { GitHubRepoSummary, GitHubIssue, GitHubPullRequest } from '../skills/github.schema.js';
import * as ui from '../../../client/ui-lib/index.js';

// ─── Source Control View ───────────────────────────────────────────────────────

class SourceControlViewProvider implements ViewProvider {
    public readonly id = 'source-control';
    public readonly name = 'Source Control';
    private container: HTMLElement | null = null;
    private activeSection: 'repos' | 'issues' | 'pulls' = 'repos';
    private selectedRepo: string | null = null;
    private tabsMap: Record<string, HTMLButtonElement> = {};
    private repos: GitHubRepoSummary[] = [];
    private issues: GitHubIssue[] = [];
    private pulls: GitHubPullRequest[] = [];
    private status: { authenticated: boolean, org: string, rateLimit: { remaining: number, limit: number } } | null = null;

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, _disposables: { dispose: () => void }[]): Promise<void> {
        this.container = container;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.backgroundColor = 'var(--bg-primary)';

        // Status bar
        const statusBar = document.createElement('div');
        Object.assign(statusBar.style, {
            padding: '6px 12px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        });
        statusBar.id = 'gh-status-bar';
        container.appendChild(statusBar);

        // Navigation tabs
        const tabBar = document.createElement('div');
        Object.assign(tabBar.style, {
            display: 'flex',
            borderBottom: '1px solid var(--border)',
        });

        const sections: Array<{ key: 'repos' | 'issues' | 'pulls'; label: string; icon: string }> = [
            { key: 'repos', label: 'Repos', icon: 'fas fa-book' },
            { key: 'issues', label: 'Issues', icon: 'fas fa-exclamation-circle' },
            { key: 'pulls', label: 'PRs', icon: 'fas fa-code-branch' },
        ];

        this.tabsMap = {};
        for (const section of sections) {
            const tab = document.createElement('button');
            this.tabsMap[section.key] = tab;
            Object.assign(tab.style, {
                flex: '1',
                background: 'none',
                border: 'none',
                borderBottom: this.activeSection === section.key ? '2px solid var(--accent)' : '2px solid transparent',
                color: this.activeSection === section.key ? 'var(--text-main)' : 'var(--text-muted)',
                padding: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: this.activeSection === section.key ? 'bold' : 'normal',
            });
            tab.innerHTML = `<i class="${section.icon}"></i> ${section.label}`;
            tab.onclick = () => {
                this.activeSection = section.key;
                this.render();
            };
            tabBar.appendChild(tab);
        }
        container.appendChild(tabBar);

        // Content area
        const content = document.createElement('div');
        content.id = 'gh-content';
        content.style.flex = '1';
        content.style.overflow = 'auto';
        content.style.padding = '8px';
        container.appendChild(content);

        // Initial Fetch
        await this.refreshAll();
    }

    private async refreshAll() {
        try {
            const client = this.context.ide.getClient() as any;
            this.status = await client.api.github.status({});
            this.repos = await client.api.github.list_repos({});
            
            const statusBar = this.container?.querySelector('#gh-status-bar');
            if (statusBar && this.status) {
                statusBar.innerHTML = `<i class="fas fa-circle" style="color: ${this.status.authenticated ? '#4caf50' : '#f44336'}; font-size: 8px;"></i> ${this.status.org} | Rate: ${this.status.rateLimit.remaining}/${this.status.rateLimit.limit}`;
            }
            
            this.render();
        } catch (err) {
            console.error('[GitHubExtension] Failed to refresh', err);
        }
    }

    private render(): void {
        const content = this.container?.querySelector('#gh-content') as HTMLElement;
        if (!content) return;
        content.innerHTML = '';

        // Dynamic tab style updates
        for (const key of Object.keys(this.tabsMap)) {
            const tabEl = this.tabsMap[key];
            if (tabEl) {
                const isSelected = key === this.activeSection;
                Object.assign(tabEl.style, {
                    borderBottom: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                    color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                    fontWeight: isSelected ? 'bold' : 'normal',
                });
            }
        }

        switch (this.activeSection) {
            case 'repos': this.renderRepos(content); break;
            case 'issues': this.renderIssues(content); break;
            case 'pulls': this.renderPulls(content); break;
        }
    }

    private renderRepos(container: HTMLElement): void {
        if (this.repos.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-book',
                title: 'No Repositories',
                description: 'Connect your GitHub integration to view repositories.',
            });
            container.appendChild(empty.getElement());
            return;
        }

        for (const repo of this.repos) {
            const card = new ui.Card({ padding: 'sm', hoverable: true });
            card.getElement().style.marginBottom = '6px';
            if (this.selectedRepo === repo.name) {
                card.getElement().style.borderColor = 'var(--accent)';
            }

            const stack = new ui.Stack({ gap: 'xs' });

            const header = new ui.Row({ justify: 'space-between', align: 'center' });
            const nameEl = new ui.Text({ text: repo.name, weight: 'bold', size: 'sm' });
            nameEl.getElement().style.color = 'var(--accent)';
            
            const leftHeader = new ui.Row({ gap: 'sm', align: 'center' });
            leftHeader.appendChildren(nameEl);

            if (repo.language) {
                leftHeader.appendChildren(new ui.Badge({ count: repo.language, variant: 'accent', size: 'sm' }));
            }

            header.appendChildren(leftHeader, new ui.Text({ text: `⭐ ${repo.stars}`, size: 'xs', variant: 'muted' }));

            stack.appendChildren(header);

            if (repo.description) {
                stack.appendChildren(new ui.Text({ text: repo.description, size: 'xs', variant: 'muted' }));
            }

            const actions = new ui.Row({ gap: 'sm' });
            actions.getElement().style.marginTop = '6px';

            actions.appendChildren(
                new ui.Button({
                    label: 'Clone',
                    variant: 'primary',
                    size: 'small',
                    onClick: () => this.cloneRepo(repo.name)
                }),
                new ui.Button({
                    label: 'Issues',
                    variant: 'secondary',
                    size: 'small',
                    onClick: () => {
                        this.selectedRepo = repo.name;
                        this.fetchIssues(repo.name);
                    }
                })
            );

            stack.appendChildren(actions);
            card.appendChildren(stack);
            container.appendChild(card.getElement());
        }
    }

    private async fetchIssues(repo: string) {
        try {
            const client = this.context.ide.getClient() as any;
            this.issues = await client.api.github.list_issues({ repo });
            this.activeSection = 'issues';
            this.render();
        } catch (err) {
            console.error('[GitHubExtension] Failed to fetch issues', err);
        }
    }

    private async fetchPulls(repo: string) {
        try {
            const client = this.context.ide.getClient() as any;
            this.pulls = await client.api.github.list_pulls({ repo });
            this.activeSection = 'pulls';
            this.render();
        } catch (err) {
            console.error('[GitHubExtension] Failed to fetch pulls', err);
        }
    }

    private async cloneRepo(repo: string) {
        try {
            const client = this.context.ide.getClient() as any;
            await client.api.github.clone({ repo });
            this.context.ide.layout.statusBar.setMessage(`Cloned ${repo} to sandbox`);
        } catch (err) {
            console.error('[GitHubExtension] Failed to clone', err);
        }
    }

    private renderIssues(container: HTMLElement): void {
        if (!this.selectedRepo) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-exclamation-circle',
                title: 'Select a Repository',
                description: 'Click on a repository to view its issues.',
            });
            container.appendChild(empty.getElement());
            return;
        }

        const heading = new ui.Text({ text: `Issues for ${this.selectedRepo}`, size: 'xs', variant: 'muted' });
        heading.getElement().style.marginBottom = '8px';
        container.appendChild(heading.getElement());

        if (this.issues.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-check-circle',
                title: 'No Open Issues',
                description: 'All clear!',
            });
            container.appendChild(empty.getElement());
            return;
        }

        for (const issue of this.issues) {
            const card = new ui.Card({ padding: 'xs' });
            card.getElement().style.marginBottom = '4px';

            const row = new ui.Row({ gap: 'sm', align: 'center' });
            
            const icon = document.createElement('i');
            icon.className = issue.state === 'open' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
            icon.style.color = issue.state === 'open' ? '#4caf50' : '#f44336';
            icon.style.fontSize = '12px';

            const title = new ui.Text({ text: `#${issue.number} ${issue.title}`, size: 'sm' });
            title.getElement().style.flex = '1';

            const author = new ui.Text({ text: issue.user.login, size: 'xs', variant: 'muted' });

            row.appendChildren(this.createIcon(icon.className, icon.style.color), title, author);
            
            for (const label of issue.labels) {
                row.appendChildren(new ui.Badge({ count: label.name, variant: 'accent', size: 'sm' }));
            }

            card.appendChildren(row);
            container.appendChild(card.getElement());
        }
    }

    private renderPulls(container: HTMLElement): void {
        if (!this.selectedRepo) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-code-branch',
                title: 'Select a Repository',
                description: 'Click on a repository to view its pull requests.',
            });
            container.appendChild(empty.getElement());
            return;
        }

        const heading = new ui.Text({ text: `Pull Requests for ${this.selectedRepo}`, size: 'xs', variant: 'muted' });
        heading.getElement().style.marginBottom = '8px';
        container.appendChild(heading.getElement());

        if (this.pulls.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-check',
                title: 'No Pull Requests',
                description: 'No open pull requests.',
            });
            container.appendChild(empty.getElement());
            return;
        }

        for (const pr of this.pulls) {
            const card = new ui.Card({ padding: 'xs' });
            card.getElement().style.marginBottom = '4px';

            const row = new ui.Row({ gap: 'sm', align: 'center' });

            const icon = document.createElement('i');
            icon.className = 'fas fa-code-branch';
            icon.style.color = pr.merged_at ? '#c678dd' : pr.state === 'open' ? '#4caf50' : '#f44336';
            icon.style.fontSize = '12px';

            const title = new ui.Text({ text: `#${pr.number} ${pr.title}`, size: 'sm' });
            title.getElement().style.flex = '1';

            const author = new ui.Text({ text: pr.user.login, size: 'xs', variant: 'muted' });

            row.appendChildren(this.createIcon(icon.className, icon.style.color), title, author);

            card.appendChildren(row);
            container.appendChild(card.getElement());
        }
    }

    private createIcon(className: string, color: string): HTMLElement {
        const icon = document.createElement('i');
        icon.className = className;
        icon.style.color = color;
        icon.style.fontSize = '12px';
        const wrapper = document.createElement('div');
        wrapper.appendChild(icon);
        return wrapper;
    }
}

// ─── Extension Definition ──────────────────────────────────────────────────────

class GitHubExtension {
    public activate(context: ExtensionContext): void {
        const scmView = new SourceControlViewProvider(context);

        context.ide.views.registerProvider('left-panel', scmView);

        context.ide.activityBar.registerItem({
            id: 'source-control',
            icon: 'fas fa-code-branch',
            title: 'Source Control',
            location: 'left-panel',
            order: 180
        });
    }

    public deactivate(): void {
        console.log('[GitHubExtension] Deactivated');
    }
}

export default new GitHubExtension();
