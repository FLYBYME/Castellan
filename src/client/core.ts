/**
 * CASTELLAN - Core Public API
 * This file serves as the unified entry point for extensions to import core functionality.
 */

// --- UI Library ---
// Direct access to all UI components and theme utilities
export * from './ui-lib';

// --- Main IDE Sandbox ---
export { IDE, IDEEvents } from './core/IDE.js';
export { EventBus } from './core/EventBus.js';

// --- Extension System ---
export { Extension, ExtensionContext } from './core/extensions/Extension.js';
export { ViewProvider, ViewLocation } from './core/extensions/ViewProvider.js';
export { ViewRegistry } from './core/extensions/ViewRegistry.js';

// --- Registry & Service Sandbox ---
export { CommandRegistry } from './core/CommandRegistry.js';
export { ShortcutManager } from './core/ShortcutManager.js';
export { ServiceRegistry } from './core/ServiceRegistry.js';

// --- UI & Layout Services ---
export { LayoutManager } from './core/LayoutManager.js';
export { ActivityBarService } from './core/ActivityBarService.js';
export { ThemeService } from './core/ThemeService.js';
export { TabService, TabEvents, TabConfig } from './core/TabService.js';
