import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';

export interface CardProps {
    title?: string;
    subtitle?: string;
    headerIcon?: string;
    children?: (BaseComponent<any> | HTMLElement | string)[];
    footer?: (BaseComponent<any> | HTMLElement | string)[];
    variant?: 'default' | 'elevated' | 'ghost' | 'glass';
    padding?: keyof typeof Theme.spacing | string;
    width?: string;
    hoverable?: boolean;
    onClick?: (e: MouseEvent) => void;
}

export class Card extends BaseComponent<CardProps> {
    constructor(props: CardProps) {
        super('div', props);
        this.render();
    }

    public render(): void {
        const { 
            title, 
            subtitle, 
            headerIcon, 
            children = [], 
            footer, 
            variant = 'default', 
            padding = 'md', 
            width,
            hoverable = false,
            onClick
        } = this.props;

        const isGlass = variant === 'glass';

        this.applyStyles({
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isGlass ? Theme.colors.glassBg : (variant === 'ghost' ? 'transparent' : Theme.colors.bgSecondary),
            backdropFilter: isGlass ? Theme.colors.blur : 'none',
            border: variant === 'elevated' ? 'none' : `1px solid ${isGlass ? Theme.colors.glassBorder : Theme.colors.border}`,
            borderRadius: Theme.radius.lg,
            boxShadow: isGlass ? Theme.colors.glassShadow : (variant === 'elevated' ? '0 8px 24px rgba(0, 0, 0, 0.2)' : 'none'),
            overflow: 'hidden',
            width: width || 'auto',
            fontFamily: Theme.font.family,
            transition: Theme.transitions.smooth,
            cursor: onClick ? 'pointer' : 'default',
            position: 'relative'
        });

        if (hoverable || onClick) {
            this.element.onmouseenter = () => {
                this.applyStyles({ 
                    transform: 'translateY(-2px)',
                    borderColor: Theme.colors.accent,
                    boxShadow: isGlass ? `0 12px 40px 0 ${Theme.colors.accent}22` : Theme.colors.glassShadow
                });
            };
            this.element.onmouseleave = () => {
                this.render(); // Re-apply base styles
            };
        }

        if (onClick) {
            this.element.onclick = (e) => onClick(e);
        }

        this.element.innerHTML = '';

        // Header
        if (title || subtitle || headerIcon) {
            const header = document.createElement('div');
            Object.assign(header.style, {
                padding: '12px 16px',
                borderBottom: `1px solid ${isGlass ? Theme.colors.glassBorder : Theme.colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
            });

            if (title) {
                const titleEl = document.createElement('div');
                Object.assign(titleEl.style, {
                    fontSize: '11px',
                    fontWeight: '800',
                    color: Theme.colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                });

                if (headerIcon) {
                    const icon = document.createElement('i');
                    icon.className = headerIcon;
                    titleEl.appendChild(icon);
                }

                const text = document.createElement('span');
                text.textContent = title;
                titleEl.appendChild(text);
                header.appendChild(titleEl);
            }

            if (subtitle) {
                const subEl = document.createElement('div');
                Object.assign(subEl.style, {
                    fontSize: '14px',
                    color: Theme.colors.textHeading,
                    fontWeight: '600',
                });
                subEl.textContent = subtitle;
                header.appendChild(subEl);
            }

            this.element.appendChild(header);
        }

        // Body
        const body = document.createElement('div');
        const pVal = (Theme.spacing as Record<string, string>)[padding] || padding;
        Object.assign(body.style, {
            padding: pVal,
            display: 'flex',
            flexDirection: 'column',
            gap: Theme.spacing.sm,
            flex: '1'
        });

        this.appendChildrenToElement(body, children);
        this.element.appendChild(body);

        // Footer
        if (footer && footer.length > 0) {
            const footerEl = document.createElement('div');
            Object.assign(footerEl.style, {
                padding: '8px 16px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderTop: `1px solid ${isGlass ? Theme.colors.glassBorder : Theme.colors.border}`,
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end',
                alignItems: 'center'
            });

            this.appendChildrenToElement(footerEl, footer);
            this.element.appendChild(footerEl);
        }
    }

    private appendChildrenToElement(el: HTMLElement, children: (BaseComponent<any> | HTMLElement | string)[]): void {
        children.forEach(child => {
            if (!child) return;
            if (child instanceof BaseComponent) {
                el.appendChild(child.getElement());
            } else if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(child);
            }
        });
    }
}
