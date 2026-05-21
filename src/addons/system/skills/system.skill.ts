import { BaseSkillModule } from 'castellan/core';
import { genesisContract, bootstrapContract, resetContract } from './system.contract.js';
import { genesis, bootstrap, reset } from './system.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * SystemSkill: Core platform capabilities like Genesis and Health.
 */
export class SystemSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'system';

    public async getSkillContext(): Promise<string> {
        return `
## System Core
The fundamental capabilities of the Castellan platform.
- **GENESIS**: The process of initializing or refitting the system's identity and workforce.
- **BOOTSTRAP**: Interactively assign tools to agents.
- **RESET**: Wipe all system data and start over.
        `.trim();
    }

    constructor() {
        super();
        this.mountTool(genesisContract, genesis);
        this.mountTool(bootstrapContract, bootstrap);
        this.mountTool(resetContract, reset);
    }
}
