import { z } from 'zod';
import { ICastellanApi } from '../api.js';
import { ISkillContext } from '@castellan/core/index.js';
import { ToolExecutor } from '@castellan/engine/core/ToolExecutor.js';
import * as Contract_0 from '../../addons/agents/skills/agent.contract.js';
import * as Contract_1 from '../../addons/audit/skills/approval.contract.js';
import * as Contract_2 from '../../addons/cron/skills/cron.contract.js';
import * as Contract_3 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_4 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_5 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_6 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_7 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_8 from '../../addons/settings/skills/settings.contract.js';

export class ContextApi implements ICastellanApi {
    constructor(private executor: ToolExecutor<ContextApi>, private context: ISkillContext<ContextApi>) {}

    public readonly agent = {
        run: (args: z.input<typeof Contract_0.agentRunContract['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunContract['outputSchema']>>('agent', 'run', args, this.context),
        create: (args: z.input<typeof Contract_0.agentCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentCrud['create']['outputSchema']>>('agent', 'create', args, this.context),
        find: (args: z.input<typeof Contract_0.agentCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentCrud['find']['outputSchema']>>('agent', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_0.agentCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentCrud['findOne']['outputSchema']>>('agent', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_0.agentCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentCrud['count']['outputSchema']>>('agent', 'count', args, this.context),
        get: (args: z.input<typeof Contract_0.agentCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentCrud['get']['outputSchema']>>('agent', 'get', args, this.context),
        update: (args: z.input<typeof Contract_0.agentCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentCrud['update']['outputSchema']>>('agent', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_0.agentCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentCrud['delete']['outputSchema']>>('agent', 'delete', args, this.context),
    };
    public readonly agent_run = {
        create: (args: z.input<typeof Contract_0.agentRunCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunCrud['create']['outputSchema']>>('agent_run', 'create', args, this.context),
        find: (args: z.input<typeof Contract_0.agentRunCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunCrud['find']['outputSchema']>>('agent_run', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_0.agentRunCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunCrud['findOne']['outputSchema']>>('agent_run', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_0.agentRunCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunCrud['count']['outputSchema']>>('agent_run', 'count', args, this.context),
        get: (args: z.input<typeof Contract_0.agentRunCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunCrud['get']['outputSchema']>>('agent_run', 'get', args, this.context),
        update: (args: z.input<typeof Contract_0.agentRunCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunCrud['update']['outputSchema']>>('agent_run', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_0.agentRunCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunCrud['delete']['outputSchema']>>('agent_run', 'delete', args, this.context),
    };
    public readonly audit = {
        approval_resolve: (args: z.input<typeof Contract_1.approvalResolveContract['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalResolveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalResolveContract['outputSchema']>>('audit', 'approval_resolve', args, this.context),
        run: (args: z.input<typeof Contract_1.auditRunContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditRunContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.auditRunContract['outputSchema']>>('audit', 'run', args, this.context),
        create_testbed: (args: z.input<typeof Contract_1.auditCreateTestbedContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditCreateTestbedContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.auditCreateTestbedContract['outputSchema']>>('audit', 'create_testbed', args, this.context),
        generate_scenario: (args: z.input<typeof Contract_1.auditGenerateScenarioContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditGenerateScenarioContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.auditGenerateScenarioContract['outputSchema']>>('audit', 'generate_scenario', args, this.context),
        evaluate_triad: (args: z.input<typeof Contract_1.auditEvaluateTriadContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditEvaluateTriadContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.auditEvaluateTriadContract['outputSchema']>>('audit', 'evaluate_triad', args, this.context),
        evaluate_approval: (args: z.input<typeof Contract_1.auditEvaluateApprovalContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditEvaluateApprovalContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.auditEvaluateApprovalContract['outputSchema']>>('audit', 'evaluate_approval', args, this.context),
    };
    public readonly approval = {
        create: (args: z.input<typeof Contract_1.approvalCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalCrud['create']['outputSchema']>>('approval', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.approvalCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalCrud['find']['outputSchema']>>('approval', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.approvalCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalCrud['findOne']['outputSchema']>>('approval', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.approvalCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalCrud['count']['outputSchema']>>('approval', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.approvalCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalCrud['get']['outputSchema']>>('approval', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.approvalCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalCrud['update']['outputSchema']>>('approval', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.approvalCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.approvalCrud['delete']['outputSchema']>>('approval', 'delete', args, this.context),
    };
    public readonly scenario = {
        create: (args: z.input<typeof Contract_1.scenarioCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.scenarioCrud['create']['outputSchema']>>('scenario', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.scenarioCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.scenarioCrud['find']['outputSchema']>>('scenario', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.scenarioCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.scenarioCrud['findOne']['outputSchema']>>('scenario', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.scenarioCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.scenarioCrud['count']['outputSchema']>>('scenario', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.scenarioCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.scenarioCrud['get']['outputSchema']>>('scenario', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.scenarioCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.scenarioCrud['update']['outputSchema']>>('scenario', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.scenarioCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.scenarioCrud['delete']['outputSchema']>>('scenario', 'delete', args, this.context),
    };
    public readonly evaluation = {
        create: (args: z.input<typeof Contract_1.evaluationCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.evaluationCrud['create']['outputSchema']>>('evaluation', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.evaluationCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.evaluationCrud['find']['outputSchema']>>('evaluation', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.evaluationCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.evaluationCrud['findOne']['outputSchema']>>('evaluation', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.evaluationCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.evaluationCrud['count']['outputSchema']>>('evaluation', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.evaluationCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.evaluationCrud['get']['outputSchema']>>('evaluation', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.evaluationCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.evaluationCrud['update']['outputSchema']>>('evaluation', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.evaluationCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.evaluationCrud['delete']['outputSchema']>>('evaluation', 'delete', args, this.context),
    };
    public readonly cron = {
        trigger: (args: z.input<typeof Contract_2.cronTriggerContract['inputSchema']>): Promise<z.infer<typeof Contract_2.cronTriggerContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronTriggerContract['outputSchema']>>('cron', 'trigger', args, this.context),
        reset: (args: z.input<typeof Contract_2.cronResetContract['inputSchema']>): Promise<z.infer<typeof Contract_2.cronResetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronResetContract['outputSchema']>>('cron', 'reset', args, this.context),
        status: (args: z.input<typeof Contract_2.cronStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_2.cronStatusContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronStatusContract['outputSchema']>>('cron', 'status', args, this.context),
        create: (args: z.input<typeof Contract_2.cronJobCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobCrud['create']['outputSchema']>>('cron', 'create', args, this.context),
        find: (args: z.input<typeof Contract_2.cronJobCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobCrud['find']['outputSchema']>>('cron', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_2.cronJobCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobCrud['findOne']['outputSchema']>>('cron', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_2.cronJobCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobCrud['count']['outputSchema']>>('cron', 'count', args, this.context),
        get: (args: z.input<typeof Contract_2.cronJobCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobCrud['get']['outputSchema']>>('cron', 'get', args, this.context),
        update: (args: z.input<typeof Contract_2.cronJobCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobCrud['update']['outputSchema']>>('cron', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_2.cronJobCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobCrud['delete']['outputSchema']>>('cron', 'delete', args, this.context),
    };
    public readonly cron_runs = {
        create: (args: z.input<typeof Contract_2.cronJobRunCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobRunCrud['create']['outputSchema']>>('cron_runs', 'create', args, this.context),
        find: (args: z.input<typeof Contract_2.cronJobRunCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobRunCrud['find']['outputSchema']>>('cron_runs', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_2.cronJobRunCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobRunCrud['findOne']['outputSchema']>>('cron_runs', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_2.cronJobRunCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobRunCrud['count']['outputSchema']>>('cron_runs', 'count', args, this.context),
        get: (args: z.input<typeof Contract_2.cronJobRunCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobRunCrud['get']['outputSchema']>>('cron_runs', 'get', args, this.context),
        update: (args: z.input<typeof Contract_2.cronJobRunCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobRunCrud['update']['outputSchema']>>('cron_runs', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_2.cronJobRunCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.cronJobRunCrud['delete']['outputSchema']>>('cron_runs', 'delete', args, this.context),
    };
    public readonly demo = {
        hello: (args: z.input<typeof Contract_3.demoHelloContract['inputSchema']>): Promise<z.infer<typeof Contract_3.demoHelloContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoHelloContract['outputSchema']>>('demo', 'hello', args, this.context),
        status: (args: z.input<typeof Contract_3.demoStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_3.demoStatusContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoStatusContract['outputSchema']>>('demo', 'status', args, this.context),
        notify: (args: z.input<typeof Contract_3.demoNotifyContract['inputSchema']>): Promise<z.infer<typeof Contract_3.demoNotifyContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoNotifyContract['outputSchema']>>('demo', 'notify', args, this.context),
        create: (args: z.input<typeof Contract_3.demoCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoCrud['create']['outputSchema']>>('demo', 'create', args, this.context),
        find: (args: z.input<typeof Contract_3.demoCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoCrud['find']['outputSchema']>>('demo', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_3.demoCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoCrud['findOne']['outputSchema']>>('demo', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_3.demoCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoCrud['count']['outputSchema']>>('demo', 'count', args, this.context),
        get: (args: z.input<typeof Contract_3.demoCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoCrud['get']['outputSchema']>>('demo', 'get', args, this.context),
        update: (args: z.input<typeof Contract_3.demoCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoCrud['update']['outputSchema']>>('demo', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_3.demoCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.demoCrud['delete']['outputSchema']>>('demo', 'delete', args, this.context),
    };
    public readonly infer = {
        chat: (args: z.input<typeof Contract_4.inferChatContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.inferChatContract['outputSchema']>>('infer', 'chat', args, this.context),
        approve_tool: (args: z.input<typeof Contract_4.inferApproveToolContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferApproveToolContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.inferApproveToolContract['outputSchema']>>('infer', 'approve_tool', args, this.context),
        refresh_inventory: (args: z.input<typeof Contract_4.inferRefreshInventoryContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferRefreshInventoryContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.inferRefreshInventoryContract['outputSchema']>>('infer', 'refresh_inventory', args, this.context),
        acquire_ollama: (args: z.input<typeof Contract_4.inferAcquireOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferAcquireOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.inferAcquireOllamaContract['outputSchema']>>('infer', 'acquire_ollama', args, this.context),
        release_ollama: (args: z.input<typeof Contract_4.inferReleaseOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferReleaseOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.inferReleaseOllamaContract['outputSchema']>>('infer', 'release_ollama', args, this.context),
    };
    public readonly ollama = {
        create: (args: z.input<typeof Contract_4.ollamaCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.ollamaCrud['create']['outputSchema']>>('ollama', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.ollamaCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.ollamaCrud['find']['outputSchema']>>('ollama', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.ollamaCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.ollamaCrud['findOne']['outputSchema']>>('ollama', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.ollamaCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.ollamaCrud['count']['outputSchema']>>('ollama', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.ollamaCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.ollamaCrud['get']['outputSchema']>>('ollama', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.ollamaCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.ollamaCrud['update']['outputSchema']>>('ollama', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.ollamaCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.ollamaCrud['delete']['outputSchema']>>('ollama', 'delete', args, this.context),
    };
    public readonly models = {
        create: (args: z.input<typeof Contract_4.modelCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.modelCrud['create']['outputSchema']>>('models', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.modelCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.modelCrud['find']['outputSchema']>>('models', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.modelCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.modelCrud['findOne']['outputSchema']>>('models', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.modelCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.modelCrud['count']['outputSchema']>>('models', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.modelCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.modelCrud['get']['outputSchema']>>('models', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.modelCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.modelCrud['update']['outputSchema']>>('models', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.modelCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.modelCrud['delete']['outputSchema']>>('models', 'delete', args, this.context),
    };
    public readonly threads = {
        create: (args: z.input<typeof Contract_4.threadCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.threadCrud['create']['outputSchema']>>('threads', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.threadCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.threadCrud['find']['outputSchema']>>('threads', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.threadCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.threadCrud['findOne']['outputSchema']>>('threads', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.threadCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.threadCrud['count']['outputSchema']>>('threads', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.threadCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.threadCrud['get']['outputSchema']>>('threads', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.threadCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.threadCrud['update']['outputSchema']>>('threads', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.threadCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.threadCrud['delete']['outputSchema']>>('threads', 'delete', args, this.context),
    };
    public readonly messages = {
        create: (args: z.input<typeof Contract_4.messageCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.messageCrud['create']['outputSchema']>>('messages', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.messageCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.messageCrud['find']['outputSchema']>>('messages', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.messageCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.messageCrud['findOne']['outputSchema']>>('messages', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.messageCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.messageCrud['count']['outputSchema']>>('messages', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.messageCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.messageCrud['get']['outputSchema']>>('messages', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.messageCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.messageCrud['update']['outputSchema']>>('messages', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.messageCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.messageCrud['delete']['outputSchema']>>('messages', 'delete', args, this.context),
    };
    public readonly tool_calls = {
        create: (args: z.input<typeof Contract_4.toolCallCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.toolCallCrud['create']['outputSchema']>>('tool_calls', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.toolCallCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.toolCallCrud['find']['outputSchema']>>('tool_calls', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.toolCallCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.toolCallCrud['findOne']['outputSchema']>>('tool_calls', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.toolCallCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.toolCallCrud['count']['outputSchema']>>('tool_calls', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.toolCallCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.toolCallCrud['get']['outputSchema']>>('tool_calls', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.toolCallCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.toolCallCrud['update']['outputSchema']>>('tool_calls', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.toolCallCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.toolCallCrud['delete']['outputSchema']>>('tool_calls', 'delete', args, this.context),
    };
    public readonly marketplace = {
        list: (args: z.input<typeof Contract_5.marketplaceListContract['inputSchema']>): Promise<z.infer<typeof Contract_5.marketplaceListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.marketplaceListContract['outputSchema']>>('marketplace', 'list', args, this.context),
        install: (args: z.input<typeof Contract_5.marketplaceInstallContract['inputSchema']>): Promise<z.infer<typeof Contract_5.marketplaceInstallContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.marketplaceInstallContract['outputSchema']>>('marketplace', 'install', args, this.context),
    };
    public readonly notifications = {
        send: (args: z.input<typeof Contract_6.notificationsSendContract['inputSchema']>): Promise<z.infer<typeof Contract_6.notificationsSendContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.notificationsSendContract['outputSchema']>>('notifications', 'send', args, this.context),
        list: (args: z.input<typeof Contract_6.notificationsListContract['inputSchema']>): Promise<z.infer<typeof Contract_6.notificationsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.notificationsListContract['outputSchema']>>('notifications', 'list', args, this.context),
    };
    public readonly sandbox = {
        set_active: (args: z.input<typeof Contract_7.sandboxSetActiveContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxSetActiveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxSetActiveContract['outputSchema']>>('sandbox', 'set_active', args, this.context),
        prune: (args: z.input<typeof Contract_7.sandboxPruneContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxPruneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxPruneContract['outputSchema']>>('sandbox', 'prune', args, this.context),
        fs_read: (args: z.input<typeof Contract_7.sandboxFsReadContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsReadContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxFsReadContract['outputSchema']>>('sandbox', 'fs_read', args, this.context),
        fs_write: (args: z.input<typeof Contract_7.sandboxFsWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxFsWriteContract['outputSchema']>>('sandbox', 'fs_write', args, this.context),
        fs_list: (args: z.input<typeof Contract_7.sandboxFsListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxFsListContract['outputSchema']>>('sandbox', 'fs_list', args, this.context),
        fs_patch: (args: z.input<typeof Contract_7.sandboxFsPatchContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsPatchContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxFsPatchContract['outputSchema']>>('sandbox', 'fs_patch', args, this.context),
        fs_remove: (args: z.input<typeof Contract_7.sandboxFsRemoveContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsRemoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxFsRemoveContract['outputSchema']>>('sandbox', 'fs_remove', args, this.context),
        fs_mkdir: (args: z.input<typeof Contract_7.sandboxFsMkdirContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsMkdirContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxFsMkdirContract['outputSchema']>>('sandbox', 'fs_mkdir', args, this.context),
        fs_move: (args: z.input<typeof Contract_7.sandboxFsMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsMoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxFsMoveContract['outputSchema']>>('sandbox', 'fs_move', args, this.context),
        terminal_execute: (args: z.input<typeof Contract_7.sandboxTerminalExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalExecuteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalExecuteContract['outputSchema']>>('sandbox', 'terminal_execute', args, this.context),
        terminal_spawn: (args: z.input<typeof Contract_7.sandboxTerminalSpawnContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSpawnContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalSpawnContract['outputSchema']>>('sandbox', 'terminal_spawn', args, this.context),
        terminal_list: (args: z.input<typeof Contract_7.sandboxTerminalListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalListContract['outputSchema']>>('sandbox', 'terminal_list', args, this.context),
        terminal_kill: (args: z.input<typeof Contract_7.sandboxTerminalKillContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalKillContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalKillContract['outputSchema']>>('sandbox', 'terminal_kill', args, this.context),
        terminal_logs: (args: z.input<typeof Contract_7.sandboxTerminalLogsContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalLogsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalLogsContract['outputSchema']>>('sandbox', 'terminal_logs', args, this.context),
        terminal_session_open: (args: z.input<typeof Contract_7.sandboxTerminalSessionOpenContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionOpenContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalSessionOpenContract['outputSchema']>>('sandbox', 'terminal_session_open', args, this.context),
        terminal_session_list: (args: z.input<typeof Contract_7.sandboxTerminalSessionListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalSessionListContract['outputSchema']>>('sandbox', 'terminal_session_list', args, this.context),
        terminal_session_write: (args: z.input<typeof Contract_7.sandboxTerminalSessionWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalSessionWriteContract['outputSchema']>>('sandbox', 'terminal_session_write', args, this.context),
        terminal_session_resize: (args: z.input<typeof Contract_7.sandboxTerminalSessionResizeContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionResizeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxTerminalSessionResizeContract['outputSchema']>>('sandbox', 'terminal_session_resize', args, this.context),
        network_expose: (args: z.input<typeof Contract_7.sandboxNetworkExposeContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkExposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxNetworkExposeContract['outputSchema']>>('sandbox', 'network_expose', args, this.context),
        network_unexpose: (args: z.input<typeof Contract_7.sandboxNetworkUnexposeContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkUnexposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxNetworkUnexposeContract['outputSchema']>>('sandbox', 'network_unexpose', args, this.context),
        network_list: (args: z.input<typeof Contract_7.sandboxNetworkListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxNetworkListContract['outputSchema']>>('sandbox', 'network_list', args, this.context),
        network_set_policy: (args: z.input<typeof Contract_7.sandboxNetworkSetPolicyContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkSetPolicyContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxNetworkSetPolicyContract['outputSchema']>>('sandbox', 'network_set_policy', args, this.context),
        env_set: (args: z.input<typeof Contract_7.sandboxEnvSetContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxEnvSetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxEnvSetContract['outputSchema']>>('sandbox', 'env_set', args, this.context),
        env_set_secret: (args: z.input<typeof Contract_7.sandboxEnvSetSecretContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxEnvSetSecretContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxEnvSetSecretContract['outputSchema']>>('sandbox', 'env_set_secret', args, this.context),
        env_list: (args: z.input<typeof Contract_7.sandboxEnvListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxEnvListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxEnvListContract['outputSchema']>>('sandbox', 'env_list', args, this.context),
        resource_update_limits: (args: z.input<typeof Contract_7.sandboxResourceUpdateLimitsContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxResourceUpdateLimitsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxResourceUpdateLimitsContract['outputSchema']>>('sandbox', 'resource_update_limits', args, this.context),
        resource_get_stats: (args: z.input<typeof Contract_7.sandboxResourceGetStatsContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxResourceGetStatsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxResourceGetStatsContract['outputSchema']>>('sandbox', 'resource_get_stats', args, this.context),
        state_commit: (args: z.input<typeof Contract_7.sandboxStateCommitContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxStateCommitContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxStateCommitContract['outputSchema']>>('sandbox', 'state_commit', args, this.context),
        state_clone: (args: z.input<typeof Contract_7.sandboxStateCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxStateCloneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxStateCloneContract['outputSchema']>>('sandbox', 'state_clone', args, this.context),
        create: (args: z.input<typeof Contract_7.sandboxCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxCrud['create']['outputSchema']>>('sandbox', 'create', args, this.context),
        find: (args: z.input<typeof Contract_7.sandboxCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxCrud['find']['outputSchema']>>('sandbox', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_7.sandboxCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxCrud['findOne']['outputSchema']>>('sandbox', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_7.sandboxCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxCrud['count']['outputSchema']>>('sandbox', 'count', args, this.context),
        get: (args: z.input<typeof Contract_7.sandboxCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxCrud['get']['outputSchema']>>('sandbox', 'get', args, this.context),
        update: (args: z.input<typeof Contract_7.sandboxCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxCrud['update']['outputSchema']>>('sandbox', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_7.sandboxCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.sandboxCrud['delete']['outputSchema']>>('sandbox', 'delete', args, this.context),
    };
    public readonly settings = {
        get: (args: z.input<typeof Contract_8.settingsGetContract['inputSchema']>): Promise<z.infer<typeof Contract_8.settingsGetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.settingsGetContract['outputSchema']>>('settings', 'get', args, this.context),
        update: (args: z.input<typeof Contract_8.settingsUpdateContract['inputSchema']>): Promise<z.infer<typeof Contract_8.settingsUpdateContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.settingsUpdateContract['outputSchema']>>('settings', 'update', args, this.context),
        getAll: (args: z.input<typeof Contract_8.settingsGetAllContract['inputSchema']>): Promise<z.infer<typeof Contract_8.settingsGetAllContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.settingsGetAllContract['outputSchema']>>('settings', 'getAll', args, this.context),
    };
}
