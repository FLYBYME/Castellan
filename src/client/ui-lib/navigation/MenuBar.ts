// ui-lib/navigation/MenuBar.ts

import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';
import { MenuItem, MenuItemProps } from './MenuItem';

export class MenuBar extends BaseComponent<{}> {
    private items: MenuItem[] = [];

    constructor() {
        super('div', {});
        this.render();
    }

    public render(): void {
        this.applyStyles({
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0',
            gap: '0'
        });
        this.addClasses('menu-bar');

        this.element.innerHTML = '';
        this.items.forEach(item => {
            this.element.appendChild(item.getElement());
        });
    }

    public addMenuItem(props: MenuItemProps): MenuItem {
        // Merge or Replace existing item if ID matches to prevent duplicates and enable updates/contributions
        if (props.id) {
            const existingIndex = this.items.findIndex(item => item.props.id === props.id);
            if (existingIndex !== -1) {
                const oldItem = this.items[existingIndex];
                
                // If both have sub-items, merge them instead of replacing the whole menu
                if (props.items && props.items.length > 0 && oldItem.props.items && oldItem.props.items.length > 0) {
                    const mergedItems = [...oldItem.props.items, ...props.items];
                    oldItem.updateProps({ items: mergedItems });
                    return oldItem;
                }

                // Otherwise, replace existing item (original behavior)
                const newItem = new MenuItem(props);
                this.element.replaceChild(newItem.getElement(), oldItem.getElement());
                this.items[existingIndex] = newItem;
                this.setupItemListener(newItem);
                oldItem.dispose();
                return newItem;
            }
        }

        const item = new MenuItem(props);
        this.items.push(item);
        this.element.appendChild(item.getElement());
        this.setupItemListener(item);
        return item;
    }

    private activeItem: MenuItem | null = null;
    private isSticky: boolean = false;
    private hoverTimeout: number | null = null;

    private setupItemListener(item: MenuItem): void {
        const el = item.getElement();

        el.addEventListener('menu-item-click', (e: Event) => {
            const customEvent = e as CustomEvent;
            const { command, args } = customEvent.detail;
            if (command) {
                const event = new CustomEvent('menu-command', {
                    detail: { command, args },
                    bubbles: true
                });
                this.element.dispatchEvent(event);
            }
        });

        el.addEventListener('menu-open', (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.item !== item) return;
            if (this.hoverTimeout) {
                window.clearTimeout(this.hoverTimeout);
                this.hoverTimeout = null;
            }
            this.activeItem = item;
            this.isSticky = true;
        });

        el.addEventListener('menu-close', (e: Event) => {
            const customEvent = e as CustomEvent;
            if (!customEvent.detail || customEvent.detail.item !== item) return;
            if (this.hoverTimeout) {
                window.clearTimeout(this.hoverTimeout);
                this.hoverTimeout = null;
            }
            this.activeItem = null;
            this.isSticky = false;
        });

        el.addEventListener('menu-hover', (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.item !== item) return;
            const hoveredItem = customEvent.detail.item;
            
            if (this.isSticky && this.activeItem && this.activeItem !== hoveredItem) {
                if (this.hoverTimeout) {
                    window.clearTimeout(this.hoverTimeout);
                }

                this.hoverTimeout = window.setTimeout(() => {
                    if (this.activeItem) {
                        this.activeItem.close();
                    }
                    hoveredItem.open();
                    this.activeItem = hoveredItem;
                    this.hoverTimeout = null;
                }, 250);
            }
        });
    }

    public dispose(): void {
        if (this.hoverTimeout) {
            window.clearTimeout(this.hoverTimeout);
        }
        this.items.forEach(item => item.dispose());
        this.items = [];
        super.dispose();
    }
}
