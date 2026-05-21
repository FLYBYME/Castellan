/**
 * ext.castellan.audit — Safety & Evaluation extension with Triage Desk, Arena, and Scorecard.
 */
import type { ViewProvider } from '../../../client/core/extensions/ViewProvider.js';
import type { ExtensionContext } from '../../../client/core/extensions/Extension.js';
import type { Approval } from '../skills/approval.schema.js';
import * as ui from '../../../client/ui-lib/index.js';

// ─── Triage Desk View ──────────────────────────────────────────────────────────

class TriageDeskViewProvider implements ViewProvider {
    public readonly id = 'audit-triage';
    public readonly name = 'Triage Desk';

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.backgroundColor = 'var(--bg-primary)';

        const toolbar = new ui.Toolbar({
            items: [
                { id: 'triage-refresh', icon: 'fas fa-sync-alt', title: 'Refresh', onClick: () => this.refreshData() },
            ],
        });
        container.appendChild(toolbar.getElement());

        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.overflow = 'auto';
        content.style.padding = '8px';
        container.appendChild(content);

        // Fetch and initial render
        await this.refreshData(content);

        // Listen for data updates
        const unsub = this.context.ide.commands.on('data:updated', (payload: unknown) => {
            const p = payload as { domain: string };
            if (p.domain === 'approval') {
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
            const approvals = await client.api.approval.find({});
            this.renderApprovals(target, approvals);
        } catch (_err) {
            target.innerHTML = '<div style="color: var(--error); padding: 20px;">Failed to fetch approvals</div>';
        }
    }

    private renderApprovals(container: HTMLElement, approvals: Approval[]): void {
        container.innerHTML = '';

        const pending = approvals.filter(a => a.status === 'pending');
        const resolved = approvals.filter(a => a.status !== 'pending');

        if (pending.length > 0) {
            const heading = new ui.Text({ text: `⚠️ ${pending.length} Pending Approvals`, weight: 'bold', size: 'sm' });
            heading.getElement().style.color = 'var(--warning)';
            heading.getElement().style.marginBottom = '8px';
            container.appendChild(heading.getElement());

            for (const approval of pending) {
                container.appendChild(this.renderApprovalCard(approval, true));
            }
        }

        if (resolved.length > 0) {
            const heading = new ui.Text({ text: `History (${resolved.length})`, variant: 'muted', size: 'sm', weight: 'bold' });
            heading.getElement().style.marginTop = '16px';
            heading.getElement().style.marginBottom = '8px';
            container.appendChild(heading.getElement());

            for (const approval of resolved.slice(0, 10)) {
                container.appendChild(this.renderApprovalCard(approval, false));
            }
        }

        if (approvals.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-shield-alt',
                title: 'No Approvals',
                description: 'All tool calls are approved.',
            });
            container.appendChild(empty.getElement());
        }
    }

    private renderApprovalCard(approval: Approval, showActions: boolean): HTMLElement {
        const card = new ui.Card({
            padding: 'sm',
            variant: 'default',
        });
        
        card.getElement().style.marginBottom = '8px';
        if (approval.status === 'pending') {
            card.getElement().style.borderLeft = '3px solid var(--warning)';
        }

        const stack = new ui.Stack({ gap: 'xs' });

        const header = new ui.Row({ justify: 'space-between', align: 'center' });
        header.appendChildren(
            new ui.Text({ text: approval.toolName, weight: 'bold', size: 'sm' }),
            new ui.Badge({ 
                count: approval.status.toUpperCase(), 
                variant: approval.status === 'approved' ? 'success' : approval.status === 'denied' ? 'error' : 'warning',
                size: 'sm'
            })
        );
        
        const args = new ui.Text({ 
            text: JSON.stringify(approval.arguments, null, 2), 
            size: 'xs', 
            variant: 'muted' 
        });
        args.getElement().style.fontFamily = 'monospace';
        args.getElement().style.whiteSpace = 'pre-wrap';
        args.getElement().style.background = 'var(--bg-secondary)';
        args.getElement().style.padding = '6px';
        args.getElement().style.borderRadius = '4px';

        stack.appendChildren(header, args);

        if (approval.reason) {
            stack.appendChildren(new ui.Text({ text: `Reason: ${approval.reason}`, size: 'xs', variant: 'error' }));
        }

        if (showActions) {
            const actions = new ui.Row({ gap: 'sm' });
            actions.getElement().style.marginTop = '8px';
            
            actions.appendChildren(
                new ui.Button({
                    label: 'Approve',
                    variant: 'primary',
                    size: 'small',
                    onClick: () => this.resolve(approval as unknown as { id: string }, 'approved')
                }),
                new ui.Button({
                    label: 'Deny',
                    variant: 'danger',
                    size: 'small',
                    onClick: () => this.resolve(approval as unknown as { id: string }, 'denied')
                })
            );
            stack.appendChildren(actions);
        }

        card.appendChildren(stack);
        return card.getElement();
    }

    private async resolve(approval: { id: string }, action: 'approved' | 'denied') {
        const client = this.context.ide.getClient() as any;
        let reason: string | undefined;
        if (action === 'denied') {
            reason = window.prompt('Reason for denial:') || undefined;
        }
        await client.api.audit.approval_resolve({ id: approval.id, action, reason });
        this.refreshData();
    }
}

// ─── Regression Arena View ─────────────────────────────────────────────────────

class RegressionArenaViewProvider implements ViewProvider {
    public readonly id = 'audit-arena';
    public readonly name = 'Regression Arena';

    constructor(private context: ExtensionContext) {}

    public resolveView(container: HTMLElement): void {
        const empty = new ui.EmptyStateView({
            icon: 'fas fa-flask',
            title: 'Regression Arena',
            description: 'Automated agent evaluation engine coming soon.',
        });
        container.appendChild(empty.getElement());
    }
}

// ─── Scorecard View ────────────────────────────────────────────────────────────

class ScorecardViewProvider implements ViewProvider {
    public readonly id = 'audit-scorecard';
    public readonly name = 'Scorecard';

    constructor(private context: ExtensionContext) {}

    public resolveView(container: HTMLElement): void {
        const empty = new ui.EmptyStateView({
            icon: 'fas fa-chart-bar',
            title: 'Audit Scorecard',
            description: 'Multi-judge consensus results will appear here.',
        });
        container.appendChild(empty.getElement());
    }
}

// ─── Extension Definition ──────────────────────────────────────────────────────

class AuditExtension {
    public activate(context: ExtensionContext): void {
        // Register View Providers
        context.ide.views.registerProvider('left-panel', new TriageDeskViewProvider(context));
        context.ide.views.registerProvider('center-panel', new RegressionArenaViewProvider(context));
        context.ide.views.registerProvider('center-panel', new ScorecardViewProvider(context));

        context.ide.activityBar.registerItem({
            id: 'audit-view',
            icon: 'fas fa-shield-alt',
            title: 'Audit & Safety',
            location: 'left-panel',
            order: 200
        });
    }

    public deactivate(): void {
        console.log('[AuditExtension] Deactivated');
    }
}

export default new AuditExtension();
