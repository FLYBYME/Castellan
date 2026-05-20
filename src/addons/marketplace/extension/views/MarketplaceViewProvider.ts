import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { Stack, Heading, ScrollArea, Spinner, Text } from '@ui-lib';
import { AddonCard } from '../components/AddonCard.js';
import { Addon } from '../../skills/marketplace.schema.js';

export class MarketplaceViewProvider implements ViewProvider {
    public readonly id = 'marketplace-view';
    public readonly name = 'Marketplace';

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement): Promise<void> {
        container.style.height = '100%';
        
        const scrollArea = new ScrollArea({ 
            height: '100%',
            padding: 'md'
        });

        const mainStack = new Stack({ 
            direction: 'column', 
            gap: 'lg',
            width: '100%' 
        });

        mainStack.appendChildren(new Heading({ text: 'Addon Marketplace', level: 2 }));

        const listStack = new Stack({ direction: 'column', gap: 'md', width: '100%' });
        const loadingSpinner = new Spinner({ size: 'lg' });
        
        listStack.appendChildren(loadingSpinner);
        mainStack.appendChildren(listStack);
        scrollArea.appendChildren(mainStack);
        container.appendChild(scrollArea.getElement());

        try {
            const addons: Addon[] = await this.context.ide.getClient().api.marketplace.list({});
            listStack.getElement().innerHTML = '';
            
            if (addons.length === 0) {
                listStack.appendChildren(new Text({ text: 'No addons found.', variant: 'muted' }));
            } else {
                addons.forEach(addon => {
                    listStack.appendChildren(new AddonCard({
                        addon,
                        onInstall: (id) => this.installAddon(id)
                    }));
                });
            }
        } catch (err) {
            listStack.getElement().innerHTML = '';
            listStack.appendChildren(new Text({ text: 'Failed to load marketplace.', variant: 'error' }));
        }
    }

    private async installAddon(id: string) {
        try {
            const result = await this.context.ide.getClient().api.marketplace.install({ id });
            if (result.success) {
                const notifications = this.context.getService<any>('notifications');
                notifications?.setStatusMessage(`Installed ${id}`);
            } else {
                console.error(`[Marketplace] ${result.message}`);
            }
        } catch (err) {
            console.error('[Marketplace] Installation error', err);
        }
    }
}
