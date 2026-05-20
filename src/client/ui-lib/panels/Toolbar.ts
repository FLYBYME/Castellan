// ui-lib/panels/Toolbar.ts

import { BaseComponent } from '../BaseComponent';
import { Button } from '../forms/Button';
import { Row } from '../layout/Row';
import { Theme } from '../theme';

export interface ToolbarItem {
    id: string;
    icon: string;
    title: string;
    onClick: () => void;
}

export interface ToolbarProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
    items?: ToolbarItem[];
    children?: (BaseComponent<unknown> | Node | string)[];
}

export class Toolbar extends BaseComponent<ToolbarProps> {
    constructor(props: ToolbarProps = {}) {
        super('div', props);
        this.render();
    }

    public render(): void {
        const { children = [], items = [], variant = 'primary' } = this.props;

        this.element.innerHTML = '';

        this.applyStyles({
            height: '35px',
            backgroundColor: variant === 'primary' ? Theme.colors.bgPrimary : variant === 'secondary' ? Theme.colors.bgSecondary : Theme.colors.bgTertiary,
            borderBottom: `1px solid ${Theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${Theme.spacing.sm}`,
            justifyContent: 'space-between',
            boxSizing: 'border-box'
        });

        const toolbarChildren = [...children];
        if (items.length > 0) {
            const itemButtons = items.map(item => new Button({
                icon: item.icon,
                label: item.title,
                onClick: item.onClick,
                variant: 'ghost',
                size: 'sm'
            }));
            toolbarChildren.unshift(...itemButtons);
        }

        const row = new Row({
            gap: 'xs',
            align: 'center',
            children: toolbarChildren
        });

        this.appendChildren(row);
    }
}
