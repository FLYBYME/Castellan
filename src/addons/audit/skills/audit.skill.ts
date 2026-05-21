import { BaseSkillModule, ISkillContext } from 'castellan/core';
import { 
    approvalCrud, 
    approvalResolveContract,
    scenarioCrud,
    evaluationCrud,
    auditRunContract,
    auditCreateTestbedContract,
    auditGenerateScenarioContract,
    auditEvaluateTriadContract,
    auditEvaluateApprovalContract
} from './approval.contract.js';
import { 
    audit_run, 
    audit_create_testbed, 
    audit_generate_scenario, 
    audit_evaluate_triad, 
    audit_evaluate_approval,
    approval_resolve
} from './audit.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * AuditSkill: Safety & Evaluation engine.
 * Provides HITL approvals, regression testing, and multi-judge audits.
 */
export class AuditSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'audit';

    constructor() {
        super();

        // 1. Mount Persistence
        this.mountCrud(approvalCrud);
        this.mountCrud(scenarioCrud);
        this.mountCrud(evaluationCrud);

        // 2. Mount Tools
        this.mountTool(auditRunContract, audit_run);
        this.mountTool(auditCreateTestbedContract, audit_create_testbed);
        this.mountTool(auditGenerateScenarioContract, audit_generate_scenario);
        this.mountTool(auditEvaluateTriadContract, audit_evaluate_triad);
        this.mountTool(auditEvaluateApprovalContract, audit_evaluate_approval);
        this.mountTool(approvalResolveContract, approval_resolve);
    }
}
