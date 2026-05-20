import { IDE } from '../IDE.js';
import { MenuItemProps } from '../../ui-lib/index.js';
import { ViewLocation } from './ViewProvider.js';

export interface ViewContribution {
    id: string;
    location: ViewLocation;
    icon: string;
    title: string;
    order?: number;
}

export interface ExtensionManifest {
    id: string;
    name: string;
    version: string;
    description?: string;
    publisher?: string;
    entry: string; // The bundled JS file name
    startup?: boolean; // Whether the extension should be loaded immediately on startup
    contributes?: {
        views?: ViewContribution[];
        menus?: MenuItemProps[];
    };
}

/**
 * The context provided to an extension when it is activated.
 * Used to safely interact with the IDE and track disposable resources.
 */
export interface ExtensionContext {
    ide: IDE;
    subscriptions: { dispose: () => void }[]; // Array of cleanup functions
    /**
     * Register a global IDE service.
     */
    registerService: <T>(id: string, service: T) => void;
    /**
     * Retrieve a global IDE service.
     */
    getService: <T>(id: string) => T | undefined;
}

/**
 * The contract that every extension must fulfill.
 */
export interface Extension {
    id: string;
    name: string;
    version: string;

    /**
     * Declarative menu items that this extension contributes.
     */
    menus: MenuItemProps[];

    /**
     * Called when the extension is activated.
     */
    activate(context: ExtensionContext): void | Promise<void>;

    /**
     * Called when the extension is deactivated (e.g., when the IDE shuts down or extension is disabled).
     */
    deactivate?(): void | Promise<void>;
}
