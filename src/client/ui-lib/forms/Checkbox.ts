// ui-lib/forms/Checkbox.ts

import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';
import { Row } from '../layout/Row';
import { Text } from '../typography/Text';

export interface CheckboxProps {
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}

export class Checkbox extends BaseComponent<CheckboxProps> {
    private inputElement: HTMLInputElement;

    constructor(props: CheckboxProps) {
        // We use a 'label' element as the root container to make the text clickable
        super('label', props);
        this.inputElement = document.createElement('input');
        this.render();
    }

    public render(): void {
        const { label, checked = false, disabled = false, onChange } = this.props;

        this.applyStyles({
            display: 'flex',
            alignItems: 'center',
            gap: label ? Theme.spacing.sm : '0',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? '0.6' : '1',
            userSelect: 'none'
        });

        this.inputElement.type = 'checkbox';
        this.inputElement.checked = checked;
        this.inputElement.disabled = disabled;

        this.inputElement.style.margin = '0'; // Reset browser margins
        this.inputElement.style.cursor = disabled ? 'not-allowed' : 'pointer';

        this.inputElement.onchange = (e) => {
            if (e.target instanceof HTMLInputElement) {
                if (onChange) onChange(e.target.checked);
            }
        };

        // Append input and text
        this.element.innerHTML = '';
        this.appendChildren(this.inputElement);
        if (label) {
            this.appendChildren(new Text({ text: label, size: 'base' }));
        }
    }

    public isChecked(): boolean {
        return this.inputElement.checked;
    }

    public setChecked(val: boolean): void {
        this.inputElement.checked = val;
    }
}