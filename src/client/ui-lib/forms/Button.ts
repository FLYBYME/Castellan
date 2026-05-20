import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';

export interface ButtonProps {
    label?: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
    onClick?: (e: MouseEvent) => void;
    disabled?: boolean;
    width?: string;
}

export class Button extends BaseComponent<ButtonProps> {
    constructor(props: ButtonProps) {
        super('button', props);
        this.render();
    }

    public render(): void {
        const { 
            label, 
            icon, 
            variant = 'secondary', 
            size = 'medium', 
            onClick, 
            disabled = false,
            width
        } = this.props;

        const isGhost = variant === 'ghost';
        const bgColor = this.getVariantColor(variant);

        this.applyStyles({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: size === 'small' ? '4px 12px' : (size === 'large' ? '12px 24px' : '8px 16px'),
            fontSize: size === 'small' ? '11px' : (size === 'large' ? '15px' : '13px'),
            fontWeight: '600',
            borderRadius: Theme.radius.md,
            border: isGhost ? '1px solid transparent' : `1px solid ${this.getBorderColor(variant)}`,
            backgroundColor: isGhost ? 'transparent' : bgColor,
            color: isGhost ? Theme.colors.textMain : (variant === 'primary' ? '#ffffff' : Theme.colors.textMain),
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? '0.5' : '1',
            transition: Theme.transitions.default,
            width: width || 'auto',
            fontFamily: Theme.font.family,
            outline: 'none'
        });

        if (!disabled) {
            this.element.onmouseenter = () => {
                this.applyStyles({
                    backgroundColor: isGhost ? 'rgba(255, 255, 255, 0.05)' : this.getHoverColor(variant),
                    borderColor: isGhost ? Theme.colors.border : this.getBorderColor(variant)
                });
            };
            this.element.onmouseleave = () => {
                this.render();
            };
        }

        if (onClick) {
            this.element.onclick = (e) => {
                if (!disabled) onClick(e);
            };
        }

        this.element.innerHTML = '';
        if (icon) {
            const i = document.createElement('i');
            i.className = icon;
            this.element.appendChild(i);
        }
        if (label) {
            const span = document.createElement('span');
            span.textContent = label;
            this.element.appendChild(span);
        }
    }

    private getVariantColor(variant: string): string {
        switch (variant) {
            case 'primary': return Theme.colors.accent;
            case 'success': return Theme.colors.success;
            case 'danger': return Theme.colors.error;
            case 'warning': return Theme.colors.warning;
            default: return Theme.colors.bgTertiary;
        }
    }

    private getBorderColor(variant: string): string {
        if (variant === 'secondary') return Theme.colors.border;
        return 'rgba(255, 255, 255, 0.1)';
    }

    private getHoverColor(variant: string): string {
        // Simple alpha overlay or lighten for hover
        return `rgba(255, 255, 255, 0.1)`;
    }
}
