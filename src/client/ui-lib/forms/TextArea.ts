// ui-lib/forms/TextArea.ts

import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';

export interface TextAreaProps {
    value?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

export class TextArea extends BaseComponent<TextAreaProps> {
    constructor(props: TextAreaProps) {
        super('textarea', props);
        this.render();
    }

    private get textarea(): HTMLTextAreaElement {
        return this.element as HTMLTextAreaElement;
    }

    public render(): void {
        const {
            value = '',
            placeholder = '',
            rows = 3,
            disabled = false,
            onChange
        } = this.props;

        const el = this.textarea;

        el.value = value;
        el.placeholder = placeholder;
        el.rows = rows;
        el.disabled = disabled;

        this.applyStyles({
            width: '100%',
            boxSizing: 'border-box',
            padding: `${Theme.spacing.xs} ${Theme.spacing.sm}`,
            backgroundColor: Theme.colors.bgTertiary,
            color: Theme.colors.textMain,
            border: `1px solid ${Theme.colors.border}`,
            borderRadius: Theme.radius.md,
            fontSize: Theme.font?.sizeBase || '13px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.1s',
            resize: 'vertical',
            minHeight: '60px'
        });

        el.onfocus = () => this.applyStyles({ border: `1px solid ${Theme.colors.accent}` });
        el.onblur = () => this.applyStyles({ border: `1px solid ${Theme.colors.border}` });

        el.oninput = (e) => {
            const target = e.target;
            if (target instanceof HTMLTextAreaElement && onChange) {
                onChange(target.value);
            }
        };
    }

    public getValue(): string {
        return this.textarea.value;
    }

    public setValue(value: string): void {
        this.textarea.value = value;
    }
}
