import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';

export class SandboxExtension implements Extension {
    public readonly id = 'sandbox';
    public readonly name = 'Sandbox Extension';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        console.log('[SandboxExtension] Activating...');
    }

    public deactivate(): void {
        console.log('[SandboxExtension] Deactivating...');
    }
}

export default new SandboxExtension();
