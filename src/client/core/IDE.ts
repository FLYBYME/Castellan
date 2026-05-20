import { LayoutManager } from './LayoutManager.js';
import { CommandRegistry } from './CommandRegistry.js';
import { ExtensionManager } from './extensions/ExtensionManager.js';
import { ViewRegistry } from './extensions/ViewRegistry.js';
import { ActivityBarService } from './ActivityBarService.js';
import { ThemeService } from './ThemeService.js';
import { ShortcutManager } from './ShortcutManager.js';
import { DragDropManager } from './DragDropManager.js';
import { ServiceRegistry } from './ServiceRegistry.js';
import { CastellanClient } from '@sdk/CastellanClient.js';

import { TabService } from './TabService.js';

export const IDEEvents = {
    APP_READY: 'ide:app_ready',
}

export class IDE {

    public layout: LayoutManager;
    public commands: CommandRegistry;
    public extensions: ExtensionManager;
    public views: ViewRegistry;
    public activityBar: ActivityBarService;
    public tabs: TabService;
    public services: ServiceRegistry;
    public theme: ThemeService;
    public shortcuts: ShortcutManager;
    public dnd: DragDropManager;
    private initialized: boolean = false;
    private client: CastellanClient;

    constructor() {
        this.services = new ServiceRegistry();
        this.commands = new CommandRegistry(this);

        // Core API Client
        // In a real setup, apiBase might come from a static config or window global
        const apiBase = '/api/v2';
        this.client = new CastellanClient(apiBase);

        this.layout = new LayoutManager(this, document.getElementById('app')!);
        this.extensions = new ExtensionManager(this);
        this.views = new ViewRegistry(this);
        this.activityBar = new ActivityBarService(this);
        this.tabs = new TabService(this);
        this.theme = new ThemeService(this);
        this.shortcuts = new ShortcutManager(this);
        this.dnd = new DragDropManager(this);
    }

    public async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            // 1. Setup core services and layout
            this.layout.buildStructure();
            this.layout.initialize();
            this.layout.registerCommands();

            this.layout.statusBar.addItem('notification-status', { text: 'Initializing...' });

            // 2. Connect SDK and Bridge Events
            this.layout.statusBar.setMessage('Connecting to server...');
            await this.client.connect();
            
            // Bridge server events to internal EventBus
            this.client.onEvent((name, payload) => {
                this.commands.emit(name as any, payload);
            });

            this.layout.statusBar.setMessage('Loading extensions...');

            await this.extensions.activateAll();

            this.initialized = true;
            this.commands.emit(IDEEvents.APP_READY, { timestamp: Date.now() });
        } catch (error) {
            console.error('❌ Failed to initialize IDE:', error);
            throw error;
        }
    }

    public getClient(): CastellanClient {
        return this.client;
    }
}
