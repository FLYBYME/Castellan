import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import * as ui from '@ui-lib';

export class ModelInventoryView implements ViewProvider {
    public readonly id = 'model-inventory';
    public readonly name = 'Model Inventory';

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, _disposables: { dispose: () => void }[]): Promise<void> {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.padding = '24px';
        container.style.gap = '24px';
        container.style.backgroundColor = 'var(--bg-primary)';

        const header = new ui.Column({ gap: 'sm' });
        header.appendChildren(
            new ui.Heading({ level: 1, text: 'Global Model Inventory' }),
            new ui.Text({ 
                text: 'Detailed list of all LLM models available across your registered Ollama instances.',
                variant: 'muted'
            })
        );
        container.appendChild(header.getElement());

        const statsRow = new ui.Row({ gap: 'md' });
        container.appendChild(statsRow.getElement());

        const tableContainer = document.createElement('div');
        tableContainer.style.flex = '1';
        tableContainer.style.minHeight = '0';
        container.appendChild(tableContainer);

        await this.renderInventory(tableContainer, statsRow);
    }

    private async renderInventory(container: HTMLElement, statsRow: ui.Row) {
        container.innerHTML = '';
        
        try {
            const models = await this.context.ide.getClient().api.models.find({});
            const instances = await this.context.ide.getClient().api.ollama.find({});

            // Update stats
            statsRow.appendChildren(
                new ui.Card({ 
                    padding: 'md', 
                    children: [
                        new ui.Text({ text: 'Total Models', size: 'xs', variant: 'muted' }),
                        new ui.Heading({ level: 2, text: String(models.length) })
                    ]
                }),
                new ui.Card({ 
                    padding: 'md', 
                    children: [
                        new ui.Text({ text: 'Active Servers', size: 'xs', variant: 'muted' }),
                        new ui.Heading({ level: 2, text: String(instances.filter(i => i.status === 'online').length) })
                    ]
                })
            );

            const table = new ui.Table({
                data: models as any,
                height: '100%',
                stickyHeader: true,
                columns: [
                    {
                        key: 'name',
                        header: 'Model Name',
                        render: (m) => {
                            const wrapper = new ui.Row({ align: 'center', gap: 'sm' });
                            wrapper.appendChildren(
                                new ui.Icon({ icon: 'fas fa-brain', color: 'var(--accent)' }),
                                new ui.Text({ text: String(m.name), weight: 'bold' })
                            );
                            return wrapper.getElement();
                        }
                    },
                    {
                        key: 'instanceId',
                        header: 'Host Instance',
                        render: (m) => {
                            const inst = instances.find(i => i.id === m.instanceId);
                            return inst ? inst.name : String(m.instanceId);
                        }
                    },
                    {
                        key: 'size',
                        header: 'Size',
                        render: (m) => this.formatBytes(Number(m.size))
                    },
                    {
                        key: 'family',
                        header: 'Family',
                        render: (m) => new ui.Tag({ label: String(m.family || 'unknown'), variant: 'accent' }).getElement()
                    },
                    {
                        key: 'parameterSize',
                        header: 'Parameters',
                        render: (m) => String(m.parameterSize || 'N/A')
                    },
                    {
                        key: 'quantizationLevel',
                        header: 'Quantization',
                        render: (m) => String(m.quantizationLevel || 'N/A')
                    }
                ]
            });

            container.appendChild(table.getElement());

        } catch (error) {
            container.innerHTML = '<div style="color: red;">Failed to load model inventory</div>';
        }
    }

    private formatBytes(bytes: number, decimals = 2) {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
}
