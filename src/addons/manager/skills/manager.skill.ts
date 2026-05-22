import { BaseSkillModule } from 'castellan/core';
import { 
    managerChatContract, 
    managerPulseContract, 
    pulseReportCrud,
    managerInquireContract,
    managerExecuteContract,
    managerResearchContract,
    managerRunContract,
    managerListToolErrorsContract,
    managerAgentBootstrapContract,
    managerEvaluateApprovalContract
} from './manager.contract.js';
import { 
    manager_chat, 
    manager_pulse, 
    manager_inquire, 
    manager_execute, 
    manager_research, 
    manager_run,
    manager_list_tool_errors,
    manager_agent_bootstrap,
    manager_evaluate_approval
} from './manager.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

export class ManagerSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'manager';

    constructor() {
        super();

        // 1. Mount Persistence
        this.mountCrud(pulseReportCrud);

        // 2. Mount Tools
        this.mountTool(managerChatContract, manager_chat);
        this.mountTool(managerPulseContract, manager_pulse);
        this.mountTool(managerInquireContract, manager_inquire);
        this.mountTool(managerExecuteContract, manager_execute);
        this.mountTool(managerResearchContract, manager_research);
        this.mountTool(managerRunContract, manager_run);
        this.mountTool(managerListToolErrorsContract, manager_list_tool_errors);
        this.mountTool(managerAgentBootstrapContract, manager_agent_bootstrap);
        this.mountTool(managerEvaluateApprovalContract, manager_evaluate_approval);
    }
}
