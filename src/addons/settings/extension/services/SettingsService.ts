import { IDE } from '@castellan/client/IDE.js';
import { ConfigurationRegistry } from '../core/ConfigurationRegistry.js';

export const ConfigurationEvents = {
    CHANGED: 'configuration.changed',
};

export class SettingsService {
    private userSettings: Record<string, any> = {};

    constructor(private ide: IDE, private registry: ConfigurationRegistry) {
        this.loadInitialSettings();
    }

    private async loadInitialSettings() {
        try {
            const allSettings = await this.ide.getClient().api.settings.getAll({});
            this.userSettings = allSettings;
        } catch (err) {
            console.error('[SettingsService] Failed to load settings from server', err);
        }
    }

    public get<T>(key: string): T {
        if (key in this.userSettings) {
            return this.userSettings[key] as T;
        }
        const defaults = this.registry.getDefaults();
        return defaults[key] as T;
    }

    public async update(key: string, value: any): Promise<void> {
        const error = this.registry.validate(key, value);
        if (error) {
            throw new Error(error);
        }

        const oldValue = this.get(key);
        if (oldValue === value) return;

        try {
            await this.ide.getClient().api.settings.update({ key, value });
            this.userSettings[key] = value;

            this.ide.commands.emit(ConfigurationEvents.CHANGED, {
                key,
                value,
                oldValue,
            });
        } catch (err) {
            console.error('[SettingsService] Failed to update setting', err);
            throw err;
        }
    }

    public getAllResolved(): Record<string, any> {
        return { ...this.registry.getDefaults(), ...this.userSettings };
    }
}
