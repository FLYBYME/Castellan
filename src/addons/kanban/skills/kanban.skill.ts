import { ISkillContext, BaseSkillModule } from 'castellan/core';
import * as contract from './kanban.contract.js';
import * as tools from './kanban.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

export class KanbanSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = contract.domain;

    constructor() {
        super();
        
        // 1. Mount Tactical Tools
        this.mountTool(contract.kanbanMoveContract, tools.kanban_move);
        
        // 2. Mount CRUD Ops
        this.mountCrud(contract.kanbanCrud);
    }

    async getSkillContext(ctx: ISkillContext<ContextApi>): Promise<string> {
        const readyTasks = await ctx.api.kanban.find({ query: { status: 'Ready' } });
        const inProgress = await ctx.api.kanban.find({ query: { status: 'In Progress' } });
        
        return `
### KANBAN MISSIONS
- **READY**: ${readyTasks.length > 0 ? readyTasks.map(t => `[${(t as any).id}] ${t.title}`).join(', ') : 'None'}
- **ACTIVE**: ${inProgress.length > 0 ? inProgress.map(t => `[${(t as any).id}] ${t.title}`).join(', ') : 'None'}
        `.trim();
    }
}
