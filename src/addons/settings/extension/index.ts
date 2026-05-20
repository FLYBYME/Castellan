import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { ConfigurationRegistry } from './core/ConfigurationRegistry.js';
import { SettingsService } from './services/SettingsService.js';
import { SettingsViewProvider } from './views/SettingsViewProvider.js';

export class SettingsExtension implements Extension {
    public readonly id = 'settings';
    public readonly name = 'Settings';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        const registry = new ConfigurationRegistry();
        const service = new SettingsService(context.ide, registry);

        // Register core configuration schema
        registry.registerConfiguration({
            id: 'core',
            title: 'Core',
            properties: {
                'core.apiBase': {
                    type: 'string',
                    default: '/api/v2',
                    description: 'The base URL of the API server.',
                }
            },
        });

        // Register as global services
        context.registerService('configurationRegistry', registry);
        context.registerService('settings', service);

        // Register View (This overwrites the lazy stub)
        context.ide.views.registerProvider('left-panel', new SettingsViewProvider(context, registry, service));
    }
}

export default new SettingsExtension();
