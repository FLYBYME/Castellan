import { BaseComponent } from '../BaseComponent';
import { ConfirmDialog, ConfirmDialogOptions } from './ConfirmDialog';
import { PromptDialog, PromptDialogOptions } from './PromptDialog';
import { FormDialog, FormDialogOptions } from './FormDialog';
import { QuickPickDialog, QuickPickItem, QuickPickOptions } from './QuickPickDialog';

export interface DialogMethods {
    confirm(options: ConfirmDialogOptions | string): Promise<boolean>;
    prompt(options: PromptDialogOptions | string): Promise<string | null>;
    form(options: FormDialogOptions): Promise<Record<string, unknown> | null>;
    quickPick<I extends QuickPickItem>(items: I[], options: QuickPickOptions): Promise<I | null>;
}

// Ensure the Base class constructor takes arguments to be flexible
type Constructor<T = unknown> = new (...args: unknown[]) => T;

export function withDialogs<T extends Constructor<BaseComponent<unknown>>>(Base: T): T & Constructor<DialogMethods> {
    const WithDialogs = class extends (Base as unknown as new (...args: unknown[]) => BaseComponent<unknown> & { render(): void }) implements DialogMethods {

        public async confirm(options: ConfirmDialogOptions | string): Promise<boolean> {
            const opts = typeof options === 'string' ? { message: options } : options;
            return ConfirmDialog.show(opts);
        }

        public async prompt(options: PromptDialogOptions | string): Promise<string | null> {
            const opts = typeof options === 'string' ? { message: options } : options;
            return PromptDialog.show(opts);
        }

        public async form(options: FormDialogOptions): Promise<Record<string, unknown> | null> {
            return FormDialog.show(options);
        }

        public async quickPick<I extends QuickPickItem>(items: I[], options: QuickPickOptions): Promise<I | null> {
            return QuickPickDialog.show(items, options);
        }
    };

    return WithDialogs as unknown as T & Constructor<DialogMethods>;
}
