import { BaseSkillModule } from '@flybyme/castellan/core';
import { marketplaceListContract, marketplaceInstallContract } from './marketplace.contract.js';
import { marketplace_list, marketplace_install } from './marketplace.tools.js';

/**
 * MarketplaceSkill: System service for discovering and installing extensions.
 */
export class MarketplaceSkill extends BaseSkillModule {
    public readonly domain = 'marketplace';

    constructor() {
        super();
        this.mountTool(marketplaceListContract, marketplace_list);
        this.mountTool(marketplaceInstallContract, marketplace_install);
    }
}
