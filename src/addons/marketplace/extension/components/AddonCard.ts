import { BaseComponent } from '@ui-lib';
import { Stack, Row, Text, Button, Badge, Card } from '@ui-lib';
import { Addon } from '../../skills/marketplace.schema.js';

export interface AddonCardProps {
    addon: Addon;
    onInstall?: (id: string) => void;
}

export class AddonCard extends BaseComponent<AddonCardProps> {
    constructor(props: AddonCardProps) {
        super('div', props);
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';
        
        const { addon } = this.props;

        const card = new Card({
            padding: 'md',
            width: '100%'
        });

        const mainStack = new Stack({ direction: 'column', gap: 'sm' });

        const headerRow = new Row({ justify: 'space-between', align: 'center' });
        headerRow.appendChildren(
            new Text({ text: addon.name, weight: 'bold', size: 'lg' }),
            new Badge({ 
                count: addon.installed ? 'Installed' : 'Available',
                variant: addon.installed ? 'success' : 'accent'
            })
        );

        mainStack.appendChildren(headerRow);

        if (addon.description) {
            mainStack.appendChildren(new Text({ 
                text: addon.description, 
                variant: 'muted',
                size: 'sm'
            }));
        }

        const footerRow = new Row({ justify: 'space-between', align: 'center' });
        footerRow.appendChildren(
            new Text({ text: `v${addon.version}`, size: 'xs', variant: 'muted' })
        );

        if (!addon.installed) {
            const installBtn = new Button({
                label: 'Install',
                variant: 'primary',
                size: 'small',
                onClick: () => this.props.onInstall?.(addon.id)
            });
            footerRow.appendChildren(installBtn);
        }

        mainStack.appendChildren(footerRow);
        card.appendChildren(mainStack);
        
        this.appendChildren(card);
    }
}
