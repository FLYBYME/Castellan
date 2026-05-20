/**
 * CASTELLAN — AI Assistant Sandbox
 * Initializes the IDE shell and agent extensions.
 */

import { IDE } from './core/IDE';
import { initialize } from '@codingame/monaco-vscode-api';
import 'vscode/localExtensionHost';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor';

// Import styles
import './css/main.css';
import './css/agent-theme.css';
import './css/layout.css';

// Expose dependencies to the global window object for dynamically loaded extensions
declare global {
    interface Window {
        __IDE_REACT__: typeof React;
        __IDE_REACT_DOM__: typeof ReactDOM;
        __IDE_MONACO__: typeof monaco;
    }
}

window.__IDE_REACT__ = React;
window.__IDE_REACT_DOM__ = ReactDOM;
window.__IDE_MONACO__ = monaco;

/**
 * Main application initialization
 */
async function initializeApp(): Promise<void> {
    try {
        // Initialize VSCode services required by monaco-languageclient v10+
        await initialize({});

        const ide = new IDE();
        (window as any).ide = ide;

        // ── Phase 1: Foundation ──────────────────────────────────────────
        await ide.initialize();

        // ── Phase 2: Dynamic Extensions ──────────────────────────────────
        try {
            const response = await fetch('/api/system/extensions');
            if (response.ok) {
                const manifests: any[] = await response.json();
                console.log(`[IDE] Discovered ${manifests.length} extensions.`);
                
                // Bootstrap declarative contributions (Activity Bar, Menus)
                await ide.extensions.bootstrap(manifests);

                // For core essential extensions, we might want to activate them immediately
                // but for now, we rely on lazy loading via Activity Bar clicks.
            }
        } catch (err) {
            console.error('[IDE] Failed to fetch extension manifest:', err);
        }

        hideLoadingScreen();
        console.log('✅ Castellan Assistant initialized');
    } catch (error) {
        hideLoadingScreen(); // Hide it even on error so user can see error screen
        console.error('❌ Failed to initialize application:', error);
        showErrorScreen(error as Error);
    }
}

/**
 * Hide loading screen with fade effect
 */
function hideLoadingScreen(): void {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500); // UI transition duration
    }
}

/**
 * Show error screen if initialization fails
 */
function showErrorScreen(error: Error): void {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #1e1e1e; color: #fff;">
                <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: #f44336; margin-bottom: 20px;"></i>
                <h1 style="margin: 0 0 10px;">Failed to Initialize</h1>
                <p style="color: #888; margin: 0 0 20px;">${error.message}</p>
                <button onclick="location.reload()" style="background: #007acc; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                    Reload Application
                </button>
            </div>
        `;
    }
}

// Start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
