import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { MarketplaceViewProvider } from './views/MarketplaceViewProvider.js';

export class MarketplaceExtension implements Extension {
    public readonly id = 'marketplace';
    public readonly name = 'Marketplace';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        // Register View (This overwrites the lazy stub)
        context.ide.views.registerProvider('left-panel', new MarketplaceViewProvider(context));
    }
}

export default new MarketplaceExtension();
