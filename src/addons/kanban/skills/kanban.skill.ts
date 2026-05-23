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
        this.mountCrud(contract.kanbanProjectCrud);
        this.mountCrud(contract.kanbanFeatureCrud);
        this.mountCrud(contract.kanbanWorkItemCrud);

        // 3. Mount Lifecycle Hooks
        this.mountCrudHook('kanban_feature', 'create', {
            before: tools.kanban_feature_before_create
        });

        this.mountCrudHook('kanban_work_item', 'create', {
            before: tools.kanban_work_item_before_create,
            after: tools.kanban_work_item_after_create
        });

        this.mountCrudHook('kanban_work_item', 'delete', {
            after: tools.kanban_work_item_after_delete
        });
    }

    async getSkillContext(ctx: ISkillContext<ContextApi>): Promise<string> {
        // High-level context for the Orchestrator
        const activeWorkItems = await ctx.api.kanban_work_item.find({ query: { status: 'In Progress' } });
        const readyFeatures = await ctx.api.kanban_feature.find({ query: { status: 'Ready' } });
        
        return `
### Git Flow Kanban Board
Manage the software lifecycle through Projects, Features, and WorkItems.
- **Projects**: Define repositories and environments.
- **Features**: Group WorkItems into logical releases or epics.
- **WorkItems**: Map directly to Git branches. Creating a WorkItem automatically provisions a sandbox and checks out the branch.

#### Active Context
- **MISSIONS**: ${activeWorkItems.length > 0 ? activeWorkItems.map(w => `[${w.id}] ${w.title} (${w.branchName})`).join(', ') : 'None'}
- **READY FEATURES**: ${readyFeatures.length > 0 ? readyFeatures.map(f => `[${f.id}] ${f.name}`).join(', ') : 'None'}
        `.trim();
    }
}
