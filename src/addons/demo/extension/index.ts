import * as ui from '../../../client/ui-lib/index.js';

class DemoExtension {
    public activate(context: any): void {
        console.log('[DemoExtension] Activating...');

        // 1. Register a status bar item
        context.ide.layout.statusBar.setMessage('Demo Active');

        // 2. Register a side bar view
        context.ide.layout.activityBar.registerProvider({
            id: 'demo-view',
            icon: 'fas fa-vial',
            label: 'Demo Extension',
            priority: 100,
            render: (container: HTMLElement) => this.renderDemoView(container)
        });
    }

    private renderDemoView(container: HTMLElement): void {
        const view = new ui.Stack({
            padding: 'md',
            gap: 'md',
            align: 'center',
            justify: 'center',
            fill: true
        });
        
        // Remove backgroundColor from StackProps and set it directly
        view.getElement().style.backgroundColor = 'var(--bg-primary)';

        view.appendChildren(
            new ui.Icon({ icon: 'fas fa-flask', size: 'lg', color: 'var(--accent)' }),
            new ui.Heading({ level: 1, text: 'Enterprise Workspace' }),
            new ui.Text({ text: 'This content is dynamically rendered by the Demo Extension using the shared UI library.', variant: 'muted' }),
            new ui.ProgressBar({ progress: 65 })
        );

        container.appendChild(view.getElement());
    }

    public deactivate(): void {
        console.log('[DemoExtension] Deactivating...');
    }
}

export default new DemoExtension();
