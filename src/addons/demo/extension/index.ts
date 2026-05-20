import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import * as ui from '@ui-lib';

class DemoViewProvider implements ViewProvider {
    public readonly id = 'demo-view';
    public readonly name = 'Demo View';

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, _disposables: { dispose: () => void }[]): Promise<void> {
        const mainStack = new ui.Stack({
            direction: 'column',
            gap: 'md',
            padding: 'md',
            fill: true,
            backgroundColor: 'var(--bg-primary)'
        });

        // 1. Service Consumption
        const settings = this.context.getService<any>('settings');
        const apiBase = settings ? settings.get('core.apiBase') : 'Unknown';

        const header = new ui.Column({ gap: 'xs' });
        header.appendChildren(
            new ui.Heading({ level: 3, text: 'Enterprise Demo' }),
            new ui.Text({ text: `API Endpoint: ${apiBase}`, variant: 'muted', size: 'xs' })
        );

        const infoCard = new ui.Card({
            padding: 'md',
            children: [
                new ui.Text({ text: 'Connected to Castellan Microkernel', weight: 'bold' }),
                new ui.Text({ text: 'This extension demonstrates service discovery and cross-skill communication.', size: 'sm' })
            ]
        });

        // 2. Notification Trigger
        const actionStack = new ui.Stack({ direction: 'column', gap: 'sm' });
        
        const notifyBtn = new ui.Button({
            label: 'Dispatch System Alert',
            icon: 'fas fa-bell',
            variant: 'primary',
            width: '100%',
            onClick: async () => {
                notifyBtn.updateProps({ label: 'Dispatching...', disabled: true });
                try {
                    await (this.context.ide.getClient() as any).api.demo.notify({
                        title: 'Enterprise Alert',
                        message: 'Cross-skill notification successful.',
                        type: 'success'
                    });
                    notifyBtn.updateProps({ label: 'Alert Sent!' });
                } catch (err) {
                    notifyBtn.updateProps({ label: 'Failed' });
                } finally {
                    setTimeout(() => notifyBtn.updateProps({ label: 'Dispatch System Alert', disabled: false }), 2000);
                }
            }
        });

        const tabBtn = new ui.Button({
            label: 'Open Workspace Tab',
            icon: 'fas fa-external-link-alt',
            variant: 'secondary',
            width: '100%',
            onClick: () => {
                this.context.ide.tabs.openTab({
                    id: 'demo-tab-' + Date.now(),
                    title: 'Enterprise Workspace',
                    icon: 'fas fa-flask'
                });
            }
        });

        actionStack.appendChildren(notifyBtn, tabBtn);
        
        mainStack.appendChildren(header, infoCard, actionStack);
        container.appendChild(mainStack.getElement());
    }
}

export class DemoExtension implements Extension {
    public readonly id = 'demo';
    public readonly name = 'Demo Extension';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        console.log('[DemoExtension] Activating...');

        // Register View Provider
        context.ide.views.registerProvider('left-panel', new DemoViewProvider(context));

        // Listen for internal notification bridge
        context.ide.commands.on('view:notification:demo-view', (notification: any) => {
            console.log('[DemoExtension] Received targeted notification:', notification);
            context.ide.layout.statusBar.setMessage(`Demo targeted: ${notification.message}`);
        });

        // Listen for tab events
        context.ide.commands.on('tab.opened', (data: any) => {
            const { tabId, contentPanel } = data;
            if (tabId.startsWith('demo-tab-')) {
                this.renderTabContent(contentPanel);
            }
        });
    }

    private renderTabContent(container: HTMLElement): void {
        const view = new ui.Stack({
            direction: 'column',
            align: 'center',
            justify: 'center',
            fill: true,
            gap: 'lg',
            padding: 'xl'
        });

        view.appendChildren(
            new ui.Icon({ icon: 'fas fa-flask', size: 'xl', color: 'var(--accent)' }),
            new ui.Heading({ level: 1, text: 'Enterprise Workspace' }),
            new ui.Text({ text: 'This content is dynamically rendered by the Demo Extension using the shared UI library.', variant: 'muted' }),
            new ui.ProgressBar({ value: 65, label: 'Optimization in progress...' })
        );

        container.appendChild(view.getElement());
    }

    public deactivate(): void {
        console.log('[DemoExtension] Deactivating...');
    }
}

export default new DemoExtension();
