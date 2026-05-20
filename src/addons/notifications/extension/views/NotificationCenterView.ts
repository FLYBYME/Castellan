import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { Stack, Row, Text, Badge, ScrollArea, Button } from '@ui-lib';
import { NotificationService } from '../services/NotificationService.js';
import { Notification } from '../../skills/notifications.schema.js';

export class NotificationCenterView implements ViewProvider {
    public readonly id = 'notification-center';
    public readonly name = 'Notifications';

    constructor(private context: ExtensionContext, private service: NotificationService) {}

    public async resolveView(container: HTMLElement): Promise<void> {
        container.style.height = '100%';
        
        const mainStack = new Stack({ direction: 'column', gap: 'md', width: '100%' });
        const listContainer = document.createElement('div');
        listContainer.style.flex = '1';
        listContainer.style.overflow = 'hidden';

        const header = new Row({ justify: 'space-between', align: 'center', padding: 'sm' });
        header.appendChildren(
            new Text({ text: 'Recent Activity', weight: 'bold' }),
            new Button({ 
                label: 'Clear All', 
                variant: 'ghost', 
                size: 'sm',
                onClick: () => this.service.clearHistory()
            })
        );

        mainStack.appendChildren(header, listContainer);
        container.appendChild(mainStack.getElement());

        this.renderList(listContainer);

        // Update UI when notifications change
        this.context.ide.commands.on('notifications:changed', () => {
            this.renderList(listContainer);
        });
    }

    private renderList(container: HTMLElement) {
        container.innerHTML = '';
        
        const scrollArea = new ScrollArea({ height: '100%' });
        const listStack = new Stack({ direction: 'column', gap: 'xs', width: '100%' });

        const history = this.service.getHistory();

        if (history.length === 0) {
            listStack.appendChildren(new Text({ text: 'No recent notifications.', variant: 'muted' }));
        } else {
            history.forEach(notif => {
                listStack.appendChildren(this.createItem(notif));
            });
        }

        scrollArea.appendChildren(listStack);
        container.appendChild(scrollArea.getElement());
    }

    private createItem(notif: Notification): HTMLElement {
        const row = new Row({ 
            padding: 'sm', 
            gap: 'sm',
            align: 'flex-start'
        });
        row.getElement().style.borderBottom = '1px solid var(--border-color)';

        const typeBadge = new Badge({ 
            count: notif.type.toUpperCase(),
            variant: notif.type as any,
            size: 'sm'
        });

        const textStack = new Stack({ direction: 'column', gap: 'xs' });
        textStack.appendChildren(
            new Text({ text: notif.message, size: 'sm' }),
            new Text({ text: notif.timestamp.toLocaleTimeString(), size: 'xs', variant: 'muted' })
        );

        row.appendChildren(typeBadge, textStack);
        return row.getElement();
    }
}
