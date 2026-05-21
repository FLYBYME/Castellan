/**
 * ext.castellan.cron — Job Scheduler extension with CRUD and run history.
 */
import type { ViewProvider } from '../../../client/core/extensions/ViewProvider.js';
import type { ExtensionContext } from '../../../client/core/extensions/Extension.js';
import type { CronJob } from '../skills/cron.schema.js';
import * as ui from '../../../client/ui-lib/index.js';

// ─── Job Scheduler View ───────────────────────────────────────────────────────

class JobSchedulerViewProvider implements ViewProvider {
    public readonly id = 'cron-scheduler';
    public readonly name = 'Job Scheduler';

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.backgroundColor = 'var(--bg-primary)';

        const toolbar = new ui.Toolbar({
            items: [
                { id: 'cron-create', icon: 'fas fa-plus', title: 'New Job', onClick: () => this.createJob() },
                { id: 'cron-refresh', icon: 'fas fa-sync-alt', title: 'Refresh', onClick: () => this.refreshData() },
            ],
        });
        container.appendChild(toolbar.getElement());

        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.overflow = 'auto';
        content.style.padding = '8px';
        container.appendChild(content);

        await this.refreshData(content);
// Listen for data updates
const unsub = this.context.ide.commands.on('data:updated', (payload: unknown) => {
    const p = payload as { domain: string };
    if (p.domain === 'cron') {
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
    const jobs = await client.api.cron.find({});
    this.renderJobs(target, jobs);
} catch (_err) {
    target.innerHTML = '<div style="color: var(--error); padding: 20px;">Failed to fetch cron jobs</div>';
}
}

    private renderJobs(container: HTMLElement, jobs: CronJob[]): void {
        container.innerHTML = '';

        if (jobs.length === 0) {
            const empty = new ui.EmptyStateView({
                icon: 'fas fa-clock',
                title: 'No Scheduled Jobs',
                description: 'Create cron jobs to automate tasks.',
            });
            container.appendChild(empty.getElement());
            return;
        }

        for (const job of jobs) {
            const card = new ui.Card({ padding: 'sm' });
            card.getElement().style.marginBottom = '8px';

            const stack = new ui.Stack({ gap: 'xs' });

            const header = new ui.Row({ justify: 'space-between', align: 'center' });
            header.appendChildren(
                new ui.Text({ text: job.name, weight: 'bold', size: 'sm' }),
                new ui.Badge({ 
                    count: job.status.toUpperCase(), 
                    variant: this.getStatusVariant(job.status),
                    size: 'sm' 
                })
            );

            const details = new ui.Stack({ gap: 'none' });
            details.appendChildren(
                new ui.Text({ text: `Schedule: ${job.schedule}`, size: 'xs', variant: 'muted' }),
                new ui.Text({ text: `Tool: ${job.tool}`, size: 'xs', variant: 'muted' })
            );

            if ((job as { nextRun?: Date }).nextRun) {
                details.appendChildren(new ui.Text({ text: `Next run: ${new Date((job as { nextRun: Date }).nextRun).toLocaleString()}`, size: 'xs', variant: 'muted' }));
            }

            const actions = new ui.Row({ gap: 'sm' });
            actions.getElement().style.marginTop = '8px';
            actions.appendChildren(
                new ui.Button({
                    label: 'Trigger',
                    variant: 'primary',
                    size: 'small',
                    onClick: () => this.triggerJob(job as unknown as { id: string })
                }),
                new ui.Button({
                    label: 'Delete',
                    variant: 'danger',
                    size: 'small',
                    onClick: () => this.deleteJob(job as unknown as { id: string })
                })
            );

            stack.appendChildren(header, details, actions);
            card.appendChildren(stack);
            container.appendChild(card.getElement());
        }
    }

    private getStatusVariant(status: string): 'accent' | 'error' | 'warning' | 'success' | undefined {
        switch (status) {
            case 'running': return 'warning';
            case 'completed': return 'success';
            case 'failed': return 'error';
            case 'queued': return 'accent';
            default: return undefined;
        }
    }

    private async createJob() {
        const name = window.prompt('Job name:');
        if (!name) return;
        const schedule = window.prompt('Cron schedule (e.g. 0 * * * *):');
        if (!schedule) return;
        const tool = window.prompt('Tool key (e.g. journal_compress):');
        if (!tool) return;

        const client = this.context.ide.getClient() as any;
        await client.api.cron.create({
            name,
            schedule,
            tool,
            params: {},
            status: 'queued'
        });
        this.refreshData();
    }

    private async triggerJob(job: { id: string }) {
        const client = this.context.ide.getClient() as any;
        await client.api.cron.trigger({ id: job.id, wait: false });
        this.refreshData();
    }

    private async deleteJob(job: { id: string }) {
        if (!confirm('Are you sure?')) return;
        const client = this.context.ide.getClient() as any;
        await client.api.cron.delete({ id: job.id });
        this.refreshData();
    }
}

// ─── Extension Definition ──────────────────────────────────────────────────────

class CronExtension {
    public activate(context: ExtensionContext): void {
        context.ide.views.registerProvider('bottom-panel', new JobSchedulerViewProvider(context));

        context.ide.activityBar.registerItem({
            id: 'cron-view',
            icon: 'fas fa-clock',
            title: 'Cron Scheduler',
            location: 'bottom-panel',
            order: 150
        });
    }

    public deactivate(): void {
        console.log('[CronExtension] Deactivated');
    }
}

export default new CronExtension();
