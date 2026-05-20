import { ViewLocation } from './extensions/ViewProvider';
import { IDE, IDEEvents } from './IDE';

export interface ActivityBarItem {
    id: string;                  // Unique ID, usually matching the ViewProvider ID
    location: ViewLocation;      // 'left-panel' | 'right-panel' | 'bottom-panel'
    icon: string;                // FontAwesome class (e.g., 'fas fa-terminal')
    title: string;               // Tooltip text
    order?: number;              // For sorting icons (lower = first)
    badge?: number;              // Optional notification count
    onClick?: () => void;        // Optional custom handler. Defaults to toggling the view.
}

export class ActivityBarService {
    private ide: IDE;
    private items: Map<string, ActivityBarItem> = new Map();
    private containers: Map<ViewLocation, HTMLElement> = new Map();
    private activeViews: Map<ViewLocation, string | null> = new Map();
    private readonly storageKey = 'ide-active-views';

    constructor(ide: IDE) {
        this.ide = ide;

        // Automatically activate first items once the IDE is ready
        this.ide.commands.on(IDEEvents.APP_READY, () => {
            this.restoreActive('left-panel');
            this.restoreActive('right-panel');
            this.restoreActive('bottom-panel');
        });
    }

    /**
     * Restores the last active view for a specific location, or falls back to the first one.
     */
    private restoreActive(location: ViewLocation): void {
        const savedViews = this.getSavedViews();
        const savedId = savedViews[location];

        if (savedId && this.items.has(savedId)) {
            const item = this.items.get(savedId)!;
            if (item.onClick) {
                item.onClick();
            } else {
                this.ide.views.renderView(item.location, item.id);
            }
            return;
        }

        // Fallback to first item if no saved state or item no longer exists
        this.activateFirst(location);
    }

    /**
     * Finds and activates the first item for a specific location based on order.
     */
    private activateFirst(location: ViewLocation): void {
        const items = Array.from(this.items.values())
            .filter(item => item.location === location)
            .sort((a, b) => (a.order || 100) - (b.order || 100));

        const firstItem = items[0];
        if (firstItem) {
            if (firstItem.onClick) {
                firstItem.onClick();
            } else {
                this.ide.views.renderView(firstItem.location, firstItem.id);
            }
        }
    }

    /**
     * Called by LayoutManager to register a DOM container for an activity bar location.
     */
    public mount(location: ViewLocation, container: HTMLElement): void {
        this.containers.set(location, container);
        this.render(location);
    }

    /**
     * Register a new item in the activity bar.
     */
    public registerItem(item: ActivityBarItem): void {
        this.items.set(item.id, item);
        this.render(item.location);
    }

    /**
     * Unregister an item.
     */
    public unregisterItem(id: string): void {
        const item = this.items.get(id);
        if (item) {
            this.items.delete(id);
            this.render(item.location);
        }
    }

    /**
     * Retrieve an item by its ID.
     */
    public getItemById(id: string): ActivityBarItem | undefined {
        return this.items.get(id);
    }

    /**
     * Set the active (highlighted) state for an icon in a specific location.
     */
    public setActive(location: ViewLocation, activeId: string | null): void {
        this.activeViews.set(location, activeId);
        
        const container = this.containers.get(location);
        if (!container) return;

        container.querySelectorAll('i').forEach(icon => {
            const viewId = icon.getAttribute('data-view-id');
            if (viewId === activeId) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });

        // Save state
        if (activeId) {
            this.saveActiveView(location, activeId);
        }
    }

    /**
     * Updates the badge count for an item.
     */
    public setBadge(id: string, count: number): void {
        const item = this.items.get(id);
        if (item) {
            item.badge = count;
            this.render(item.location);
        }
    }

    private getSavedViews(): Record<string, string> {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (_e) {
            console.warn('ActivityBarService: Could not load saved views from localStorage');
            return {};
        }
    }

    private saveActiveView(location: ViewLocation, viewId: string): void {
        try {
            const saved = this.getSavedViews();
            saved[location] = viewId;
            localStorage.setItem(this.storageKey, JSON.stringify(saved));
        } catch (_e) {
            console.warn('ActivityBarService: Could not save active view to localStorage');
        }
    }

    /**
     * Render the items into the specified container.
     */
    private render(location: ViewLocation): void {
        const container = this.containers.get(location);
        if (!container) return;

        // Clear existing
        container.innerHTML = '';

        // Get items for this location and sort them
        const locationItems = Array.from(this.items.values())
            .filter(item => item.location === location)
            .sort((a, b) => (a.order || 100) - (b.order || 100));

        locationItems.forEach(item => {
            const icon = document.createElement('i');
            icon.className = `${item.icon}`;
            icon.title = item.title;
            icon.style.cursor = 'pointer';
            icon.setAttribute('data-view-id', item.id);

            if (this.activeViews.get(location) === item.id) {
                icon.classList.add('active');
            }

            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';
            wrapper.appendChild(icon);

            if (item.badge && item.badge > 0) {
                const badge = document.createElement('div');
                badge.className = 'activity-bar-badge';
                badge.textContent = item.badge > 99 ? '99+' : item.badge.toString();
                Object.assign(badge.style, {
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--error-color, #f44336)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    minWidth: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2px',
                    pointerEvents: 'none'
                });
                wrapper.appendChild(badge);
            }

            icon.addEventListener('click', (_e) => {
                if (item.onClick) {
                    item.onClick();
                } else {
                    this.ide.views.renderView(item.location, item.id);
                }
            });

            container.appendChild(wrapper);
        });
    }
}
