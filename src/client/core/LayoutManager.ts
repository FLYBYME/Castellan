/**
 * LayoutManager - Manages DOM grid areas and panel resizing
 * Controls the IDE's visual structure
 */

import { IDE } from "./IDE";
import * as ui from "../ui-lib";

export interface PanelToggleCommand {
    panelId: string;
}

export interface PanelResizeCommand {
    panelId: string;
    size: number;
}

export const PanelEvents = {
    PANEL_TOGGLE: 'panel.toggle',
    PANEL_RESIZE: 'panel.resize',
    PANEL_VISIBILITY_CHANGE: 'panel.visibility.change',
    PANEL_STATE_CHANGE: 'panel.state.change',
    PANEL_FOCUS_CHANGED: 'panel.focus.changed',
};

/**
 * LayoutState with versioning for safe hydration
 */
export interface LayoutState {
    version: number;
    leftPanelWidth: number;
    rightPanelWidth: number;
    bottomPanelHeight: number;
    leftPanelVisible: boolean;
    rightPanelVisible: boolean;
    bottomPanelVisible: boolean;
    activePanelId: string | null;
}

export interface PanelConfig {
    id: string;
    element: HTMLElement;
    minSize: number;
    maxSize: number;
    defaultSize: number;
    visible: boolean;
    position: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

export class LayoutManager {
    private panels: Map<string, PanelConfig> = new Map();
    private state: LayoutState;
    private resizing: boolean = false;
    private readonly storageKey = 'ide-layout-state';
    private readonly currentVersion = 2;
    private ide: IDE;
    private container: HTMLElement;

    // Components
    public header: ui.Header;
    public statusBar: ui.StatusBar;
    private sandboxWrapper: HTMLElement;
    
    // Performance: Resize throttling
    private animationFrameId: number | null = null;

    // Default panel sizes
    private static readonly DEFAULTS: LayoutState = {
        version: 2,
        leftPanelWidth: 300,
        rightPanelWidth: 350,
        bottomPanelHeight: 200,
        leftPanelVisible: true,
        rightPanelVisible: false,
        bottomPanelVisible: true,
        activePanelId: 'center-panel',
    };

    constructor(ide: IDE, container: HTMLElement) {
        this.ide = ide;
        this.container = container;
        this.state = this.loadState();

        this.setupSettingsSync();

        this.header = new ui.Header();
        this.statusBar = new ui.StatusBar();
        this.sandboxWrapper = document.createElement('div');
        this.sandboxWrapper.className = 'sandbox-wrapper';
    }

    /**
     * Initialize the layout with DOM structure and handlers
     */
    public initialize(): void {
        this.setupResizeHandlers();
        this.applyAllPanels();
        this.setupFocusTracking();
    }

    /**
     * Build the IDE DOM structure as a "Slot Provider"
     */
    public buildStructure(): void {
        this.container.innerHTML = '';

        // 1. Header Slot
        this.container.appendChild(this.header.getElement());

        // 2. Sandbox Wrapper (Slot container for middle areas)
        this.container.appendChild(this.sandboxWrapper);

        // 3. Create Sandbox Panels (Left, Center, Right)
        this.createSandboxPanels();

        // 4. Bottom Panel Resize Handle
        const bottomHandle = this.createResizeHandle('bottom-panel', true);
        this.container.appendChild(bottomHandle);

        // 5. Bottom Panel Slot
        const bottomPanel = this.createSlot('bottom-panel', 'bottom');
        
        // Add Activity Bar Horizontal slot
        const bottomActivityBar = document.createElement('div');
        bottomActivityBar.className = 'activity-bar activity-bar-horizontal slot-activity-bar';
        bottomPanel.appendChild(bottomActivityBar);
        this.ide.activityBar.mount('bottom-panel', bottomActivityBar);

        // Add Main Content slot
        const bottomContent = document.createElement('div');
        bottomContent.className = 'bottom-panel-content slot-content';
        bottomContent.style.flex = '1';
        bottomContent.style.overflow = 'hidden';
        bottomPanel.appendChild(bottomContent);

        this.registerPanel({
            id: 'bottom-panel',
            element: bottomPanel,
            minSize: 100,
            maxSize: 600,
            defaultSize: 200,
            visible: this.state.bottomPanelVisible,
            position: 'bottom'
        });

        // 6. Status Bar Slot
        this.container.appendChild(this.statusBar.getElement());
    }

    private createSandboxPanels(): void {
        // --- Left Panel Slot ---
        const leftPanel = this.createSlot('left-panel', 'left');
        
        const leftActivityBar = document.createElement('div');
        leftActivityBar.className = 'activity-bar slot-activity-bar';
        leftPanel.appendChild(leftActivityBar);
        this.ide.activityBar.mount('left-panel', leftActivityBar);

        const leftContent = document.createElement('div');
        leftContent.className = 'sidebar-content slot-content';
        leftPanel.appendChild(leftContent);

        this.registerPanel({
            id: 'left-panel',
            element: leftPanel,
            minSize: 200,
            maxSize: 600,
            defaultSize: 300,
            visible: this.state.leftPanelVisible,
            position: 'left'
        });
        this.sandboxWrapper.appendChild(leftPanel);

        // Left Resize Handle
        this.sandboxWrapper.appendChild(this.createResizeHandle('left-panel', false));

        // --- Center Panel Slot (Future Split-Grid Container) ---
        const centerPanel = this.createSlot('center-panel', 'center');
        // The TabService (or future EditorGroupManager) mounts here
        this.ide.tabs.mount(centerPanel);
        
        this.registerPanel({
            id: 'center-panel',
            element: centerPanel,
            minSize: 200,
            maxSize: Infinity,
            defaultSize: 800,
            visible: true,
            position: 'center'
        });
        this.sandboxWrapper.appendChild(centerPanel);

        // Right Resize Handle
        this.sandboxWrapper.appendChild(this.createResizeHandle('right-panel', false));

        // --- Right Panel Slot ---
        const rightPanel = this.createSlot('right-panel', 'right');
        
        const rightActivityBar = document.createElement('div');
        rightActivityBar.className = 'activity-bar slot-activity-bar';
        rightPanel.appendChild(rightActivityBar);
        this.ide.activityBar.mount('right-panel', rightActivityBar);

        const rightContent = document.createElement('div');
        rightContent.className = 'sidebar-content slot-content';
        rightPanel.appendChild(rightContent);

        this.registerPanel({
            id: 'right-panel',
            element: rightPanel,
            minSize: 150,
            maxSize: 800,
            defaultSize: 350,
            visible: this.state.rightPanelVisible,
            position: 'right'
        });
        this.sandboxWrapper.appendChild(rightPanel);
    }

    private createSlot(id: string, position: string): HTMLElement {
        const slot = document.createElement('div');
        slot.id = id;
        slot.className = `layout-slot layout-slot-${position}`;
        slot.tabIndex = -1; // Make it focusable for active context tracking
        return slot;
    }

    private createResizeHandle(panelId: string, vertical: boolean): HTMLElement {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${vertical ? 'resize-handle-v' : 'resize-handle-h'}`;
        handle.dataset.resize = panelId;
        return handle;
    }

    /**
     * Setup focus tracking for active context management
     */
    private setupFocusTracking(): void {
        this.panels.forEach((config, id) => {
            config.element.addEventListener('focusin', () => {
                this.setActivePanel(id);
            });
            
            // Mouse click also sets active context even if no focusable element is hit
            config.element.addEventListener('mousedown', () => {
                this.setActivePanel(id);
            });
        });
    }

    private setActivePanel(panelId: string): void {
        if (this.state.activePanelId === panelId) return;
        
        this.state.activePanelId = panelId;
        
        // Update UI styles
        this.panels.forEach((config, id) => {
            if (id === panelId) {
                config.element.classList.add('panel-focused');
            } else {
                config.element.classList.remove('panel-focused');
            }
        });

        this.ide.commands.emit(PanelEvents.PANEL_FOCUS_CHANGED, { panelId });
        this.saveState();
    }

    /**
     * Register commands
     */
    public registerCommands(): void {
        this.ide.commands.register({
            id: 'layout.togglePanel',
            label: 'Toggle Panel',
            handler: (panelId: string) => { this.togglePanel(panelId); }
        });
        this.ide.commands.register({
            id: 'layout.togglePrimarySidebar',
            label: 'Toggle Primary Sidebar',
            handler: () => { this.togglePanel('left-panel'); }
        });
        this.ide.commands.register({
            id: 'layout.toggleSecondarySidebar',
            label: 'Toggle Secondary Sidebar',
            handler: () => { this.togglePanel('right-panel'); }
        });
        this.ide.commands.register({
            id: 'layout.toggleBottomPanel',
            label: 'Toggle Bottom Panel',
            handler: () => { this.togglePanel('bottom-panel'); }
        });
        this.ide.commands.register({
            id: 'layout.resizePanel',
            label: 'Resize Panel',
            handler: (panelId: string, size: number) => this.resizePanel(panelId, size),
        });
        
        this.setupViewMenu();
    }

    private setupViewMenu(): void {
        this.header.menuBar.addMenuItem({
            label: 'View',
            id: 'menu.view',
            items: [
                {
                    label: 'Appearance',
                    id: 'menu.view.appearance',
                    items: [
                        { label: 'Primary Sidebar', id: 'menu.view.togglePrimarySidebar', command: 'layout.togglePrimarySidebar' },
                        { label: 'Secondary Sidebar', id: 'menu.view.toggleSecondarySidebar', command: 'layout.toggleSecondarySidebar' },
                        { label: 'Bottom Panel', id: 'menu.view.toggleBottomPanel', command: 'layout.toggleBottomPanel' },
                        { separator: true, id: 'sep1', label: '' },
                        { label: 'Reset Layout', id: 'menu.view.resetLayout', onClick: () => this.resetLayout() }
                    ]
                }
            ]
        });
    }

    private setupSettingsSync(): void {
        this.ide.commands.on('configuration.changed', (data: { key: string; value: unknown }) => {
            const { key, value } = data;
            if (key.startsWith('workbench.layout.') || key === 'workbench.statusBar.visible') {
                this.handleSettingChange(key, value);
            }
        });
    }

    private handleSettingChange(key: string, value: unknown): void {
        switch (key) {
            case 'workbench.layout.leftPanelVisible':
                if (typeof value === 'boolean') this.setPanelVisible('left-panel', value);
                break;
            case 'workbench.layout.rightPanelVisible':
                if (typeof value === 'boolean') this.setPanelVisible('right-panel', value);
                break;
            case 'workbench.layout.bottomPanelVisible':
                if (typeof value === 'boolean') this.setPanelVisible('bottom-panel', value);
                break;
            case 'workbench.statusBar.visible':
                this.statusBar.getElement().style.display = value ? '' : 'none';
                break;
        }
    }

    public registerPanel(config: PanelConfig): void {
        this.panels.set(config.id, config);
        if (!config.element.parentElement) {
            this.container.appendChild(config.element);
        }
        this.applyPanelState(config);
    }

    public togglePanel(panelId: string): boolean {
        const panel = this.panels.get(panelId);
        if (!panel) return false;

        return this.setPanelVisible(panelId, !panel.visible);
    }

    public setPanelVisible(panelId: string, visible: boolean): boolean {
        const panel = this.panels.get(panelId);
        if (!panel) return false;

        panel.visible = visible;
        this.applyPanelState(panel);
        this.updateLayoutState(panelId, visible);
        this.updateResizeHandleVisibility(panelId, visible);

        this.ide.commands.emit(PanelEvents.PANEL_TOGGLE, { panelId, visible });
        return visible;
    }

    private updateResizeHandleVisibility(panelId: string, visible: boolean): void {
        const handle = this.container.querySelector(`[data-resize="${panelId}"]`) as HTMLElement;
        if (handle) {
            handle.style.display = visible ? '' : 'none';
        }
    }

    /**
     * Resize a panel with immediate state update but buffered DOM application
     */
    public resizePanel(panelId: string, size: number): void {
        const panel = this.panels.get(panelId);
        if (!panel) return;

        const clampedSize = Math.max(panel.minSize, Math.min(panel.maxSize, size));

        switch (panel.position) {
            case 'left': this.state.leftPanelWidth = clampedSize; break;
            case 'right': this.state.rightPanelWidth = clampedSize; break;
            case 'bottom': this.state.bottomPanelHeight = clampedSize; break;
        }

        // Buffer the DOM update
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame(() => {
            this.applyPanelState(panel);
            this.saveState();
            this.ide.commands.emit(PanelEvents.PANEL_RESIZE, { panelId, size: clampedSize });
            this.animationFrameId = null;
        });
    }

    private setupResizeHandlers(): void {
        const handles = this.container.querySelectorAll('.resize-handle[data-resize]');
        handles.forEach((handle) => {
            const panelId = (handle as HTMLElement).dataset.resize;
            if (!panelId) return;
            const isVertical = handle.classList.contains('resize-handle-v');
            this.attachResizeHandleEvents(handle as HTMLElement, panelId, isVertical);
        });

        window.addEventListener('resize', () => {
            this.ide.commands.emit(PanelEvents.PANEL_RESIZE, { type: 'window-resize' });
        });
    }

    private attachResizeHandleEvents(handle: HTMLElement, panelId: string, isVertical: boolean): void {
        const onMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            this.resizing = true;
            handle.classList.add('active');
            document.body.classList.add('resizing', isVertical ? 'resizing-v' : 'resizing-h');

            const panel = this.panels.get(panelId);
            if (!panel) return;

            const startPos = isVertical ? e.clientY : e.clientX;
            const startSize = isVertical ? panel.element.offsetHeight : panel.element.offsetWidth;
            const isReverse = panel.position === 'right' || panel.position === 'bottom';

            const onMouseMove = (moveEvent: MouseEvent) => {
                if (!this.resizing) return;
                const currentPos = isVertical ? moveEvent.clientY : moveEvent.clientX;
                let delta = currentPos - startPos;
                if (isReverse) delta = -delta;
                this.resizePanel(panelId, startSize + delta);
            };

            const onMouseUp = () => {
                this.resizing = false;
                handle.classList.remove('active');
                document.body.classList.remove('resizing', 'resizing-h', 'resizing-v');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        handle.addEventListener('mousedown', onMouseDown);
    }

    private applyPanelState(panel: PanelConfig): void {
        if (panel.position === 'center') return;
        panel.element.style.display = panel.visible ? 'flex' : 'none';
        if (panel.visible) {
            if (panel.position === 'left') panel.element.style.width = `${this.state.leftPanelWidth}px`;
            if (panel.position === 'right') panel.element.style.width = `${this.state.rightPanelWidth}px`;
            if (panel.position === 'bottom') panel.element.style.height = `${this.state.bottomPanelHeight}px`;
        }
    }

    private applyAllPanels(): void {
        this.panels.forEach(p => this.applyPanelState(p));
        this.updateResizeHandleVisibility('left-panel', this.state.leftPanelVisible);
        this.updateResizeHandleVisibility('right-panel', this.state.rightPanelVisible);
        this.updateResizeHandleVisibility('bottom-panel', this.state.bottomPanelVisible);
    }

    private updateLayoutState(panelId: string, visible: boolean): void {
        switch (panelId) {
            case 'left-panel': this.state.leftPanelVisible = visible; break;
            case 'right-panel': this.state.rightPanelVisible = visible; break;
            case 'bottom-panel': this.state.bottomPanelVisible = visible; break;
        }
        this.saveState();
    }

    private saveState(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            this.ide.commands.emit('ui.saveState', { state: this.state });
        } catch (_e) {
            console.warn('LayoutManager: Could not save state');
        }
    }

    private loadState(): LayoutState {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // SAFE HYDRATION: Version check and migration
                if (!parsed.version || parsed.version < this.currentVersion) {
                    console.info('LayoutManager: Migrating layout state to version ' + this.currentVersion);
                    return { ...LayoutManager.DEFAULTS };
                }
                return { ...LayoutManager.DEFAULTS, ...parsed };
            }
        } catch (_e) {
            console.warn('LayoutManager: Could not load state');
        }
        return { ...LayoutManager.DEFAULTS };
    }

    public resetLayout(): void {
        this.state = { ...LayoutManager.DEFAULTS };
        this.applyAllPanels();
        this.saveState();
    }
}
