import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import * as ui from '@ui-lib';

export class InferenceManagerView implements ViewProvider {
    public readonly id = 'infer-manager';
    public readonly name = 'Inference Engine';

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.padding = '16px';
        container.style.gap = '20px';
        container.style.backgroundColor = 'var(--bg-primary)';

        // 1. Engine SITREP Card (Enterprise look from legacy code)
        const sitrep = new ui.Card({
            variant: 'glass',
            padding: 'md',
            title: 'ENGINE SITREP',
            headerIcon: 'fas fa-satellite-dish',
        });

        const sitrepContent = new ui.Column({ gap: 'sm' });
        
        const statusRow = new ui.Row({ justify: 'space-between', align: 'center' });
        statusRow.appendChildren(
            new ui.Text({ text: 'Inference Mesh', size: 'xs', variant: 'muted' }),
            new ui.Badge({ count: 'ONLINE', variant: 'success', size: 'sm' })
        );

        const metricsGrid = new ui.Column({ gap: 'xs' });
        metricsGrid.appendChildren(
            this.createMetricRow('Active Nodes', 'node-count', '0', 'fas fa-network-wired'),
            this.createMetricRow('Total Models', 'model-count', '0', 'fas fa-brain'),
            this.createMetricRow('Uptime', 'uptime-val', '99.9%', 'fas fa-clock')
        );

        sitrepContent.appendChildren(statusRow, metricsGrid);
        sitrep.appendChildren(sitrepContent);
        container.appendChild(sitrep.getElement());

        // 2. Instances List
        const listHeader = new ui.Row({ justify: 'space-between', align: 'center' });
        listHeader.appendChildren(
            new ui.Heading({ level: 4, text: 'Managed Nodes' }),
            new ui.Button({ icon: 'fas fa-sync-alt', variant: 'ghost', size: 'small', onClick: () => this.refreshData() })
        );
        container.appendChild(listHeader.getElement());

        const listContainer = document.createElement('div');
        listContainer.style.flex = '1';
        listContainer.style.overflowY = 'auto';
        listContainer.className = 'instance-list';
        container.appendChild(listContainer);

        this.renderInstanceList(listContainer);

        // 3. Global Actions
        const actions = new ui.Stack({ direction: 'column', gap: 'sm' });
        actions.appendChildren(
            new ui.Button({ label: 'Register Node', icon: 'fas fa-plus', variant: 'primary', width: '100%', onClick: () => this.showAddInstanceDialog() }),
            new ui.Button({ label: 'Open Model Inventory', icon: 'fas fa-database', variant: 'secondary', width: '100%', onClick: () => this.context.ide.views.renderView('center-panel', 'model-inventory') })
        );
        container.appendChild(actions.getElement());

        // Subscriptions
        const sub = this.context.ide.commands.on('infer:inventory_updated', () => this.refreshData());
        disposables.push({ dispose: () => this.context.ide.commands.off(sub) });
    }

    private createMetricRow(label: string, id: string, val: string, icon: string): ui.Row {
        const row = new ui.Row({ justify: 'space-between', align: 'center' });
        const left = new ui.Row({ gap: 'sm', align: 'center' });
        left.appendChildren(new ui.Icon({ icon, size: 'sm', color: 'var(--text-muted)' }), new ui.Text({ text: label, size: 'xs', variant: 'muted' }));
        row.appendChildren(left, new ui.Text({ text: val, size: 'xs', weight: 'bold' }));
        return row;
    }

    private async renderInstanceList(container: HTMLElement) {
        container.innerHTML = '';
        try {
            const client = this.context.ide.getClient() as any;
            const instances = await client.api.ollama.find({});
            const models = await client.api.models.find({});

            // Update SITREP counters
            const nodesEl = document.querySelector('#node-count');
            if (nodesEl) nodesEl.textContent = String(instances.length);
            const modelsEl = document.querySelector('#model-count');
            if (modelsEl) modelsEl.textContent = String(models.length);

            if (instances.length === 0) {
                container.appendChild(new ui.EmptyStateView({ 
                    title: 'No Managed Nodes', 
                    description: 'Add an Ollama instance to the mesh.', 
                    icon: 'fas fa-microchip' 
                }).getElement());
                return;
            }

            instances.forEach((inst: any) => {
                const card = new ui.Card({ 
                    variant: 'default', 
                    padding: 'sm', 
                    hoverable: true,
                    onClick: () => this.showInstanceDetails(inst)
                });
                
                const instModels = models.filter((m: any) => m.instanceId === inst.id);

                const row = new ui.Row({ justify: 'space-between', align: 'center' });
                const info = new ui.Column({ gap: 'xs' });
                info.appendChildren(
                    new ui.Text({ text: inst.name, weight: 'bold', size: 'sm' }),
                    new ui.Text({ text: inst.url, size: 'xs', variant: 'muted' })
                );

                const status = new ui.Column({ align: 'flex-end', gap: 'xs' });
                status.appendChildren(
                    new ui.Badge({ count: inst.status.toUpperCase(), variant: inst.status as any, size: 'sm' }),
                    new ui.Text({ text: `${instModels.length} models`, size: 'xs', variant: 'muted' })
                );

                row.appendChildren(info, status);
                card.appendChildren(row);
                container.appendChild(card.getElement());
            });
        } catch (err) {
            container.innerHTML = '<div style="color: var(--error); font-size: 11px;">Mesh Connection Error</div>';
        }
    }

    private async refreshData() {
        const list = document.querySelector('.instance-list') as HTMLElement;
        if (list) await this.renderInstanceList(list);
    }

    private async showAddInstanceDialog() {
        const values = await ui.FormDialog.show({
            title: 'Provision New Node',
            message: 'Connect a high-performance inference node to the Castellan mesh.',
            okLabel: 'Provision',
            fields: [
                { id: 'name', label: 'Node Alias', placeholder: 'e.g. TITAN-RTX-01', required: true },
                { id: 'url', label: 'Uplink URL', placeholder: 'http://192.168.1.50:11434', required: true },
            ]
        });

        if (values) {
            const client = this.context.ide.getClient() as any;
            await client.api.ollama.create({
                name: String(values.name),
                url: String(values.url),
                status: 'online'
            });
            await client.api.infer.refresh_inventory({});
            this.refreshData();
        }
    }

    private showInstanceDetails(instance: any) {
        this.context.ide.layout.statusBar.setMessage(`Inspecting Node: ${instance.name}`);
    }
}
