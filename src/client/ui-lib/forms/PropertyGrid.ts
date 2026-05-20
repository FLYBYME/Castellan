import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';
import { Row } from '../layout/Row';
import { Stack } from '../layout/Stack';
import { Text } from '../typography/Text';

export interface PropertyItem {
    label: string;
    description?: string;
    control?: BaseComponent<unknown> | HTMLElement;
    key?: string;
    type?: string;
    value?: string | number | boolean;
}

export interface PropertyGridProps {
    items?: PropertyItem[];
    fields?: PropertyItem[];
    onChange?: (key: string, value: string | number | boolean) => void;
}

export class PropertyGrid extends BaseComponent<PropertyGridProps> {
    constructor(props: PropertyGridProps) {
        super('div', props);
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';

        const container = new Stack({
            direction: 'column',
            gap: 'md',
            width: '100%'
        });

        const items = this.props.items || this.props.fields || [];

        items.forEach(item => {
            const row = new Row({
                align: 'center',
                justify: 'space-between',
                padding: 'none'
            });

            const labelStack = new Stack({ direction: 'column', gap: 'xs' });
            labelStack.appendChildren(new Text({ text: item.label, weight: '600' }));

            if (item.description) {
                labelStack.appendChildren(new Text({
                    text: item.description,
                    variant: 'muted',
                    size: 'sm'
                }));
            }

            const controlContainer = document.createElement('div');
            controlContainer.style.minWidth = '120px';
            controlContainer.style.display = 'flex';
            controlContainer.style.justifyContent = 'flex-end';

            if (item.control) {
                if (item.control instanceof BaseComponent) {
                    controlContainer.appendChild(item.control.getElement());
                } else {
                    controlContainer.appendChild(item.control);
                }
            } else if (item.key && item.type) {
                // Auto-generate control
                if (item.type === 'boolean') {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = !!item.value;
                    checkbox.onchange = () => {
                        if (this.props.onChange && item.key) this.props.onChange(item.key, checkbox.checked);
                    };
                    controlContainer.appendChild(checkbox);
                } else if (item.type === 'number') {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.value = String(item.value ?? 0);
                    input.style.width = '60px';
                    input.onchange = () => {
                        if (this.props.onChange && item.key) this.props.onChange(item.key, Number(input.value));
                    };
                    controlContainer.appendChild(input);
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = String(item.value ?? '');
                    input.style.width = '120px';
                    input.onchange = () => {
                        if (this.props.onChange && item.key) this.props.onChange(item.key, input.value);
                    };
                    controlContainer.appendChild(input);
                }
            }

            row.appendChildren(labelStack, controlContainer);
            container.appendChildren(row);
        });

        this.appendChildren(container);
    }
}