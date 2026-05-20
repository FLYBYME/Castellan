import { Extension, ExtensionContext } from '@castellan/client/extensions/Extension.js';
import { InferenceManagerView } from './views/InferenceManagerView.js';
import { ModelInventoryView } from './views/ModelInventoryView.js';

export class InferenceExtension implements Extension {
    public readonly id = 'infer';
    public readonly name = 'Inference Engine';
    public readonly version = '1.0.0';
    public readonly menus = [];

    public async activate(context: ExtensionContext): Promise<void> {
        console.log('[InferenceExtension] Activating...');

        // Register Views
        context.ide.views.registerProvider('left-panel', new InferenceManagerView(context));
        context.ide.views.registerProvider('center-panel', new ModelInventoryView(context));

        // Background logic: periodically refresh inventory if needed
        // this.startInventorySync(context);
    }

    public deactivate(): void {
        console.log('[InferenceExtension] Deactivating...');
    }
}

export default new InferenceExtension();
