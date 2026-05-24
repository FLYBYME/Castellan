import { BaseSkillModule } from '@flybyme/castellan/core';
import { settingsGetContract, settingsUpdateContract, settingsGetAllContract } from './settings.contract.js';
import { settings_get, settings_update, settings_get_all } from './settings.tools.js';

/**
 * SettingsSkill: Core service for managing persistent IDE and agent configuration.
 */
export class SettingsSkill extends BaseSkillModule {
    public readonly domain = 'settings';

    constructor() {
        super();
        this.mountTool(settingsGetContract, settings_get);
        this.mountTool(settingsUpdateContract, settings_update);
        this.mountTool(settingsGetAllContract, settings_get_all);
    }
}
