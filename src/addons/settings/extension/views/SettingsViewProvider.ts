import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { ConfigurationRegistry } from '../core/ConfigurationRegistry.js';
import { SettingsService } from '../services/SettingsService.js';
import { Stack, Heading, PropertyGrid, ScrollArea } from '@ui-lib';

export class SettingsViewProvider implements ViewProvider {
    public readonly id = 'settings-view';
    public readonly name = 'Settings';

    constructor(
        private context: ExtensionContext, 
        private registry: ConfigurationRegistry, 
        private service: SettingsService
    ) {}

    public async resolveView(container: HTMLElement): Promise<void> {
        container.style.height = '100%';
        
        const scrollArea = new ScrollArea({ 
            height: '100%',
            padding: 'md'
        });

        const mainStack = new Stack({ 
            direction: 'column', 
            gap: 'xl',
            width: '100%' 
        });

        mainStack.appendChildren(new Heading({ text: 'Settings', level: 2 }));

        const configGroups = this.registry.getAll();

        for (const group of configGroups) {
            const groupStack = new Stack({ direction: 'column', gap: 'md' });
            groupStack.appendChildren(new Heading({ text: group.title, level: 3 }));

            const items = Object.entries(group.properties).map(([key, prop]) => ({
                label: key,
                description: prop.description,
                key,
                type: prop.type,
                value: this.service.get<any>(key)
            }));

            const grid = new PropertyGrid({
                items,
                onChange: (key, value) => {
                    this.service.update(key, value);
                }
            });

            groupStack.appendChildren(grid);
            mainStack.appendChildren(groupStack);
        }

        scrollArea.appendChildren(mainStack);
        container.appendChild(scrollArea.getElement());
    }
}
