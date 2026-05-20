import { IDE } from './IDE.js';

export interface TabConfig {
    id: string;
    title: string;
    icon?: string;
    providerId?: string;
    active?: boolean;
}

export const TabEvents = {
    TAB_OPENED: 'tab.opened',
    TAB_CLOSED: 'tab.closed',
    TAB_ACTIVE_CHANGED: 'tab.active_changed',
};

export class TabService {
    private ide: IDE;
    private tabs: Map<string, TabConfig> = new Map();
    private activeTabId: string | null = null;
    private container: HTMLElement | null = null;
    private tabBar: HTMLElement | null = null;
    private contentArea: HTMLElement | null = null;

    constructor(ide: IDE) {
        this.ide = ide;
    }

    /**
     * Mount the tab system into a container
     */
    public mount(container: HTMLElement): void {
        this.container = container;
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';

        // 1. Create Tab Bar
        this.tabBar = document.createElement('div');
        this.tabBar.className = 'tab-bar';
        this.tabBar.style.display = 'flex';
        this.tabBar.style.height = '35px';
        this.tabBar.style.backgroundColor = 'var(--bg-secondary)';
        this.tabBar.style.borderBottom = '1px solid var(--border-color)';
        this.tabBar.style.overflowX = 'auto';
        this.tabBar.style.overflowY = 'hidden';
        this.container.appendChild(this.tabBar);

        // 2. Create Content Area
        this.contentArea = document.createElement('div');
        this.contentArea.className = 'tab-content-area';
        this.contentArea.style.flex = '1';
        this.contentArea.style.position = 'relative';
        this.contentArea.style.overflow = 'hidden';
        this.container.appendChild(this.contentArea);

        this.render();
    }

    /**
     * Open a new tab or activate if already open
     */
    public openTab(config: TabConfig): void {
        if (this.tabs.has(config.id)) {
            this.setActiveTab(config.id);
            return;
        }

        this.tabs.set(config.id, config);

        // Create a content container for this tab
        const contentPanel = document.createElement('div');
        contentPanel.className = 'tab-content-panel';
        contentPanel.id = `tab-content-${config.id}`;
        contentPanel.style.width = '100%';
        contentPanel.style.height = '100%';
        contentPanel.style.position = 'absolute';
        contentPanel.style.top = '0';
        contentPanel.style.left = '0';
        contentPanel.style.display = 'none';
        
        if (this.contentArea) {
            this.contentArea.appendChild(contentPanel);
        }

        this.ide.commands.emit(TabEvents.TAB_OPENED, { 
            tabId: config.id, 
            config,
            contentPanel 
        });

        this.setActiveTab(config.id);
    }

    /**
     * Close a tab
     */
    public closeTab(tabId: string): void {
        const tab = this.tabs.get(tabId);
        if (!tab) return;

        // Remove content panel
        const contentPanel = document.getElementById(`tab-content-${tabId}`);
        if (contentPanel && contentPanel.parentElement) {
            contentPanel.parentElement.removeChild(contentPanel);
        }

        this.tabs.delete(tabId);
        
        if (this.activeTabId === tabId) {
            const keys = Array.from(this.tabs.keys());
            this.setActiveTab(keys.length > 0 ? keys[keys.length - 1] : null);
        } else {
            this.render();
        }

        this.ide.commands.emit(TabEvents.TAB_CLOSED, { tabId });
    }

    /**
     * Set the active tab
     */
    public setActiveTab(tabId: string | null): void {
        if (tabId && !this.tabs.has(tabId)) return;
        if (this.activeTabId === tabId) return;

        this.activeTabId = tabId;

        // Update content panel visibility
        if (this.contentArea) {
            const panels = this.contentArea.querySelectorAll('.tab-content-panel');
            panels.forEach(p => {
                if (p instanceof HTMLElement) {
                    p.style.display = p.id === `tab-content-${tabId}` ? 'block' : 'none';
                }
            });
        }

        this.render();
        
        if (tabId) {
            this.ide.commands.emit(TabEvents.TAB_ACTIVE_CHANGED, { tabId });
        }
    }

    /**
     * Get the content panel for a specific tab
     */
    public getContentPanel(tabId: string): HTMLElement | null {
        return document.getElementById(`tab-content-${tabId}`);
    }

    /**
     * Render the tab bar
     */
    private render(): void {
        if (!this.tabBar) return;

        this.tabBar.innerHTML = '';

        this.tabs.forEach((tab, id) => {
            const tabEl = document.createElement('div');
            tabEl.className = 'tab-item' + (id === this.activeTabId ? ' active' : '');
            tabEl.style.display = 'flex';
            tabEl.style.alignItems = 'center';
            tabEl.style.padding = '0 15px';
            tabEl.style.height = '100%';
            tabEl.style.borderRight = '1px solid var(--border-color)';
            tabEl.style.cursor = 'pointer';
            tabEl.style.fontSize = '13px';
            tabEl.style.userSelect = 'none';
            tabEl.style.whiteSpace = 'nowrap';
            tabEl.style.backgroundColor = id === this.activeTabId ? 'var(--bg-primary)' : 'transparent';
            tabEl.style.color = id === this.activeTabId ? 'var(--text-primary)' : 'var(--text-secondary)';

            // Icon
            if (tab.icon) {
                const icon = document.createElement('i');
                icon.className = tab.icon;
                icon.style.marginRight = '8px';
                tabEl.appendChild(icon);
            }

            // Title
            const title = document.createElement('span');
            title.textContent = tab.title;
            tabEl.appendChild(title);

            // Close button
            const closeBtn = document.createElement('i');
            closeBtn.className = 'fas fa-times';
            closeBtn.style.marginLeft = '10px';
            closeBtn.style.fontSize = '10px';
            closeBtn.style.opacity = '0.5';
            closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
            closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.5');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeTab(id);
            });
            tabEl.appendChild(closeBtn);

            tabEl.addEventListener('click', () => {
                this.setActiveTab(id);
            });

            this.tabBar!.appendChild(tabEl);
        });
    }
}
