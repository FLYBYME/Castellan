import { Extension, ExtensionContext, ExtensionManifest } from './Extension.js';
import { IDE } from '../IDE.js';
import { ViewProvider } from './ViewProvider.js';

export class ExtensionManager {
    private ide: IDE;
    private extensions: Map<string, Extension> = new Map();
    private activeContexts: Map<string, ExtensionContext> = new Map();
    private manifests: Map<string, ExtensionManifest> = new Map();

    constructor(ide: IDE) {
        this.ide = ide;
    }

    /**
     * Get all registered extension manifests for introspection.
     */
    public getRegistered(): ExtensionManifest[] {
        return Array.from(this.manifests.values());
    }

    /**
     * Register a new extension with the IDE.
     */
    public register(extension: Extension): void {
        if (this.extensions.has(extension.id)) {
            console.warn(`ExtensionManager: Extension "${extension.id}" is already registered.`);
            return;
        }
        this.extensions.set(extension.id, extension);
        this.ide.layout.statusBar.setMessage(`Registered extension: ${extension.name} v${extension.version}`);
    }

    /**
     * Bootstrap the IDE with declarative contributions from the master manifest.
     */
    public async bootstrap(manifests: ExtensionManifest[]): Promise<void> {
        for (const manifest of manifests) {
            this.manifests.set(manifest.id, manifest);
            this.registerDeclarativeContributions(manifest);
            
            // 3. Selective Eager Loading
            if (manifest.startup) {
                console.log(`[ExtensionManager] Eagerly activating startup extension: ${manifest.id}`);
                void this.ensureActivated(manifest.id).then(() => {
                    // After eager activation, if it contributes views, render the first one for each panel
                    if (manifest.contributes && manifest.contributes.views) {
                        const locations = new Set(manifest.contributes.views.map(v => v.location));
                        locations.forEach(loc => {
                            const firstView = manifest.contributes!.views!.find(v => v.location === loc);
                            if (firstView) {
                                console.log(`[ExtensionManager] Rendering default view ${firstView.id} for ${loc}`);
                                this.ide.views.renderView(loc, firstView.id);
                            }
                        });
                    }
                });
            }
        }
    }

    /**
     * Register UI elements (Activity Bar, Menu) without loading the bundle.
     */
    private registerDeclarativeContributions(manifest: ExtensionManifest): void {
        const { contributes } = manifest;
        if (!contributes) return;

        // 1. Register Views (as Lazy Stubs)
        if (contributes.views) {
            contributes.views.forEach(view => {
                // Register an activity bar item that triggers loading
                this.ide.activityBar.registerItem({
                    id: view.id,
                    location: view.location,
                    icon: view.icon,
                    title: view.title,
                    order: view.order,
                    onClick: () => {
                        this.ensureActivated(manifest.id).then(() => {
                            this.ide.views.renderView(view.location, view.id);
                        });
                    }
                });

                // Register a "Stub" ViewProvider that triggers loading if rendered by command
                const stub: ViewProvider = {
                    id: view.id,
                    name: view.title,
                    resolveView: async (container) => {
                        await this.ensureActivated(manifest.id);
                        const provider = this.ide.views.getProvider(view.location, view.id);
                        if (provider && provider !== stub) {
                            await provider.resolveView(container, []);
                        }
                    }
                };
                this.ide.views.registerProvider(view.location, stub);
            });
        }

        // 2. Register Menus
        if (contributes.menus) {
            contributes.menus.forEach(menu => {
                this.ide.layout.header.menuBar.addMenuItem(menu);
            });
        }
    }

    /**
     * Ensure an extension is loaded and activated.
     */
    private async ensureActivated(id: string): Promise<void> {
        if (this.activeContexts.has(id)) return;
        
        const manifest = this.manifests.get(id);
        if (!manifest) throw new Error(`Extension ${id} not found in manifest.`);

        await this.loadFromUrl(`/extensions/${manifest.entry}`);
        await this.activate(id);
    }

    /**
     * Dynamically fetch and evaluate an extension bundle from a URL.
     */
    public async loadFromUrl(url: string): Promise<Extension> {
        let fullUrl = url;
        if (url.startsWith('/')) {
            const settings = this.ide.services.getService<any>('settings');
            const apiBase = settings ? settings.get('core.apiBase') : '/api/v2';
            let root = '';
            if (apiBase && (apiBase.startsWith('http://') || apiBase.startsWith('https://'))) {
                root = new URL(apiBase).origin;
            } else {
                root = window.location.origin;
            }
            fullUrl = `${root}${url}`;
        }

        this.ide.layout.statusBar.setMessage(`Loading extension from ${fullUrl}...`);
        try {
            const importUrl = fullUrl.includes('?') ? `${fullUrl}&t=${Date.now()}` : `${fullUrl}?t=${Date.now()}`;
            const module = await import(/* @vite-ignore */ importUrl);

            let extData: Extension | undefined;
            if (module.default && typeof module.default.id === 'string' && typeof module.default.activate === 'function') {
                extData = module.default;
            } else {
                for (const key of Object.keys(module)) {
                    if (module[key] && typeof module[key].id === 'string' && typeof module[key].activate === 'function') {
                        extData = module[key];
                        break;
                    }
                }
            }

            if (!extData) {
                throw new Error(`Module loaded from ${url} does not export a valid Extension interface.`);
            }

            let extInstance: Extension;
            if (typeof extData === 'function') {
                const ExtClass = extData as new () => Extension;
                extInstance = new ExtClass();
            } else {
                extInstance = extData;
            }

            this.register(extInstance);
            this.ide.layout.statusBar.setMessage(`Loaded extension dynamically: ${extInstance.name}`);
            return extInstance;

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`❌ Failed to load extension from ${url}:`, error);
            this.ide.layout.statusBar.setMessage(`Extension load failed: ${message}`);
            throw error;
        }
    }

    /**
     * Activate all registered extensions.
     */
    public async activateAll(): Promise<void> {
        for (const id of this.extensions.keys()) {
            await this.activate(id);
        }
    }

    /**
     * Activate a specific extension by ID.
     */
    public async activate(id: string): Promise<void> {
        const extension = this.extensions.get(id);
        if (!extension || this.activeContexts.has(id)) return;

        // Unregister declarative stubs before activation to allow the real providers to register
        const manifest = this.manifests.get(id);
        if (manifest && manifest.contributes && manifest.contributes.views) {
            manifest.contributes.views.forEach(view => {
                this.ide.views.unregisterProvider(view.location, view.id);
            });
        }

        try {
            const context: ExtensionContext = {
                ide: this.ide,
                subscriptions: [],
                registerService: <T>(id: string, service: T) => {
                    this.ide.services.registerService(id, service);
                    context.subscriptions.push({
                        dispose: () => this.ide.services.unregisterService(id),
                    });
                },
                getService: <T>(id: string) => {
                    return this.ide.services.getService<T>(id);
                },
            };

            await extension.activate(context);
            this.activeContexts.set(id, context);
            this.ide.layout.statusBar.setMessage(`Activated extension: ${extension.name}`);
        } catch (error) {
            console.error(`❌ Failed to activate extension "${id}":`, error);
        }
    }

    /**
     * Deactivate a specific extension and clean up its resources.
     */
    public async deactivate(id: string): Promise<void> {
        const extension = this.extensions.get(id);
        const context = this.activeContexts.get(id);

        if (!extension || !context) return;

        try {
            if (extension.deactivate) {
                await extension.deactivate();
            }

            context.subscriptions.forEach(sub => sub.dispose());
            this.activeContexts.delete(id);
            this.extensions.delete(id); 
            this.ide.layout.statusBar.setMessage(`Deactivated extension: ${extension.name}`);
        } catch (error) {
            console.error(`❌ Error deactivating extension "${id}":`, error);
        }
    }
}
