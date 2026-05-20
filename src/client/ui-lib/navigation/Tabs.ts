import { BaseComponent } from '../BaseComponent';
import { Row } from '../layout/Row';
import { Tab } from './Tab';

export interface TabsProps {
    items: { id: string; label: string; icon?: string }[];
    activeId?: string;
    onChange?: (id: string) => void;
}

export class Tabs extends BaseComponent<TabsProps> {
    private activeId: string;

    constructor(props: TabsProps) {
        super('div', props);
        this.activeId = props.activeId || (props.items.length > 0 ? props.items[0].id : '');
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';
        this.element.style.width = '100%';
        this.element.style.borderBottom = '1px solid var(--border-color, #333)';

        const row = new Row({ gap: 'none' });
        
        this.props.items.forEach(item => {
            const tab = new Tab({
                label: item.label,
                icon: item.icon,
                active: item.id === this.activeId,
                closable: false,
                onClick: () => {
                    this.activeId = item.id;
                    this.render();
                    if (this.props.onChange) this.props.onChange(item.id);
                }
            });
            row.appendChildren(tab);
        });

        row.mount(this.element);
    }
}
