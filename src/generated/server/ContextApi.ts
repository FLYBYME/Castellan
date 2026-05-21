import { z } from 'zod';
import { ICastellanApi } from '../api.js';
import { ISkillContext } from '@castellan/core/index.js';
import { ToolExecutor } from '@castellan/engine/core/ToolExecutor.js';
import * as Contract_0 from '../../addons/agents/skills/agent.contract.js';
import * as Contract_1 from '../../addons/audit/skills/approval.contract.js';
import * as Contract_2 from '../../addons/cron/skills/cron.contract.js';
import * as Contract_3 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_4 from '../../addons/github/skills/github.contract.js';
import * as Contract_5 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_6 from '../../addons/journal/skills/journal.contract.js';
import * as Contract_7 from '../../addons/kanban/skills/kanban.contract.js';
import * as Contract_8 from '../../addons/manager/skills/manager.contract.js';
import * as Contract_9 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_10 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_11 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_12 from '../../addons/settings/skills/settings.contract.js';
import * as Contract_13 from '../../addons/system/skills/system.contract.js';
import * as Contract_14 from '../../addons/web/skills/web.contract.js';

export class ContextApi implements ICastellanApi {
    constructor(private executor: ToolExecutor<ContextApi>, private context: ISkillContext<ContextApi>) {}

    public readonly agent = {
        run: (args: z.input<typeof Contract_0.agentRunContract['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentRunContract['outputSchema']>>('agent', 'run', args, this.context),
        structured_infer: (args: z.input<typeof Contract_0.agentStructuredInferContract['inputSchema']>): Promise<z.infer<typeof Contract_0.agentStructuredInferContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.agentStructuredInferContract['outputSchema']>>('agent', 'structured_infer', args, this.context),
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
    public readonly github = {
        list_repos: (args: z.input<typeof Contract_4.githubListReposContract['inputSchema']>): Promise<z.infer<typeof Contract_4.githubListReposContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.githubListReposContract['outputSchema']>>('github', 'list_repos', args, this.context),
        get_repo: (args: z.input<typeof Contract_4.githubGetRepoContract['inputSchema']>): Promise<z.infer<typeof Contract_4.githubGetRepoContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.githubGetRepoContract['outputSchema']>>('github', 'get_repo', args, this.context),
        list_issues: (args: z.input<typeof Contract_4.githubListIssuesContract['inputSchema']>): Promise<z.infer<typeof Contract_4.githubListIssuesContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.githubListIssuesContract['outputSchema']>>('github', 'list_issues', args, this.context),
        list_pulls: (args: z.input<typeof Contract_4.githubListPullsContract['inputSchema']>): Promise<z.infer<typeof Contract_4.githubListPullsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.githubListPullsContract['outputSchema']>>('github', 'list_pulls', args, this.context),
        status: (args: z.input<typeof Contract_4.githubStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_4.githubStatusContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.githubStatusContract['outputSchema']>>('github', 'status', args, this.context),
        clone: (args: z.input<typeof Contract_4.githubCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_4.githubCloneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.githubCloneContract['outputSchema']>>('github', 'clone', args, this.context),
    };
    public readonly infer = {
        chat: (args: z.input<typeof Contract_5.inferChatContract['inputSchema']>): Promise<z.infer<typeof Contract_5.inferChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferChatContract['outputSchema']>>('infer', 'chat', args, this.context),
        approve_tool: (args: z.input<typeof Contract_5.inferApproveToolContract['inputSchema']>): Promise<z.infer<typeof Contract_5.inferApproveToolContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferApproveToolContract['outputSchema']>>('infer', 'approve_tool', args, this.context),
        refresh_inventory: (args: z.input<typeof Contract_5.inferRefreshInventoryContract['inputSchema']>): Promise<z.infer<typeof Contract_5.inferRefreshInventoryContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferRefreshInventoryContract['outputSchema']>>('infer', 'refresh_inventory', args, this.context),
        acquire_ollama: (args: z.input<typeof Contract_5.inferAcquireOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_5.inferAcquireOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferAcquireOllamaContract['outputSchema']>>('infer', 'acquire_ollama', args, this.context),
        release_ollama: (args: z.input<typeof Contract_5.inferReleaseOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_5.inferReleaseOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferReleaseOllamaContract['outputSchema']>>('infer', 'release_ollama', args, this.context),
        structured_chat: (args: z.input<typeof Contract_5.inferStructuredChatContract['inputSchema']>): Promise<z.infer<typeof Contract_5.inferStructuredChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferStructuredChatContract['outputSchema']>>('infer', 'structured_chat', args, this.context),
    };
    public readonly ollama = {
        create: (args: z.input<typeof Contract_5.ollamaCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.ollamaCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.ollamaCrud['create']['outputSchema']>>('ollama', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.ollamaCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.ollamaCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.ollamaCrud['find']['outputSchema']>>('ollama', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.ollamaCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.ollamaCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.ollamaCrud['findOne']['outputSchema']>>('ollama', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.ollamaCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.ollamaCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.ollamaCrud['count']['outputSchema']>>('ollama', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.ollamaCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.ollamaCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.ollamaCrud['get']['outputSchema']>>('ollama', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.ollamaCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.ollamaCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.ollamaCrud['update']['outputSchema']>>('ollama', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.ollamaCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.ollamaCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.ollamaCrud['delete']['outputSchema']>>('ollama', 'delete', args, this.context),
    };
    public readonly models = {
        create: (args: z.input<typeof Contract_5.modelCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.modelCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.modelCrud['create']['outputSchema']>>('models', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.modelCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.modelCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.modelCrud['find']['outputSchema']>>('models', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.modelCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.modelCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.modelCrud['findOne']['outputSchema']>>('models', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.modelCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.modelCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.modelCrud['count']['outputSchema']>>('models', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.modelCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.modelCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.modelCrud['get']['outputSchema']>>('models', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.modelCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.modelCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.modelCrud['update']['outputSchema']>>('models', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.modelCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.modelCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.modelCrud['delete']['outputSchema']>>('models', 'delete', args, this.context),
    };
    public readonly threads = {
        create: (args: z.input<typeof Contract_5.threadCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.threadCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.threadCrud['create']['outputSchema']>>('threads', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.threadCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.threadCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.threadCrud['find']['outputSchema']>>('threads', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.threadCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.threadCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.threadCrud['findOne']['outputSchema']>>('threads', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.threadCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.threadCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.threadCrud['count']['outputSchema']>>('threads', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.threadCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.threadCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.threadCrud['get']['outputSchema']>>('threads', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.threadCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.threadCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.threadCrud['update']['outputSchema']>>('threads', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.threadCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.threadCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.threadCrud['delete']['outputSchema']>>('threads', 'delete', args, this.context),
    };
    public readonly messages = {
        create: (args: z.input<typeof Contract_5.messageCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.messageCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.messageCrud['create']['outputSchema']>>('messages', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.messageCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.messageCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.messageCrud['find']['outputSchema']>>('messages', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.messageCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.messageCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.messageCrud['findOne']['outputSchema']>>('messages', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.messageCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.messageCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.messageCrud['count']['outputSchema']>>('messages', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.messageCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.messageCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.messageCrud['get']['outputSchema']>>('messages', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.messageCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.messageCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.messageCrud['update']['outputSchema']>>('messages', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.messageCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.messageCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.messageCrud['delete']['outputSchema']>>('messages', 'delete', args, this.context),
    };
    public readonly tool_calls = {
        create: (args: z.input<typeof Contract_5.toolCallCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.toolCallCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.toolCallCrud['create']['outputSchema']>>('tool_calls', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.toolCallCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.toolCallCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.toolCallCrud['find']['outputSchema']>>('tool_calls', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.toolCallCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.toolCallCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.toolCallCrud['findOne']['outputSchema']>>('tool_calls', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.toolCallCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.toolCallCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.toolCallCrud['count']['outputSchema']>>('tool_calls', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.toolCallCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.toolCallCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.toolCallCrud['get']['outputSchema']>>('tool_calls', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.toolCallCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.toolCallCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.toolCallCrud['update']['outputSchema']>>('tool_calls', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.toolCallCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.toolCallCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.toolCallCrud['delete']['outputSchema']>>('tool_calls', 'delete', args, this.context),
    };
    public readonly infer_queue = {
        create: (args: z.input<typeof Contract_5.inferQueueCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.inferQueueCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferQueueCrud['create']['outputSchema']>>('infer_queue', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.inferQueueCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.inferQueueCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferQueueCrud['find']['outputSchema']>>('infer_queue', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.inferQueueCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.inferQueueCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferQueueCrud['findOne']['outputSchema']>>('infer_queue', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.inferQueueCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.inferQueueCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferQueueCrud['count']['outputSchema']>>('infer_queue', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.inferQueueCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.inferQueueCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferQueueCrud['get']['outputSchema']>>('infer_queue', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.inferQueueCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.inferQueueCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferQueueCrud['update']['outputSchema']>>('infer_queue', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.inferQueueCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.inferQueueCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.inferQueueCrud['delete']['outputSchema']>>('infer_queue', 'delete', args, this.context),
    };
    public readonly journal = {
        note: (args: z.input<typeof Contract_6.journalNoteContract['inputSchema']>): Promise<z.infer<typeof Contract_6.journalNoteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalNoteContract['outputSchema']>>('journal', 'note', args, this.context),
        resolve: (args: z.input<typeof Contract_6.journalResolveContract['inputSchema']>): Promise<z.infer<typeof Contract_6.journalResolveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalResolveContract['outputSchema']>>('journal', 'resolve', args, this.context),
        compress: (args: z.input<typeof Contract_6.journalCompressContract['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCompressContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCompressContract['outputSchema']>>('journal', 'compress', args, this.context),
        create: (args: z.input<typeof Contract_6.journalCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCrud['create']['outputSchema']>>('journal', 'create', args, this.context),
        find: (args: z.input<typeof Contract_6.journalCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCrud['find']['outputSchema']>>('journal', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_6.journalCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCrud['findOne']['outputSchema']>>('journal', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_6.journalCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCrud['count']['outputSchema']>>('journal', 'count', args, this.context),
        get: (args: z.input<typeof Contract_6.journalCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCrud['get']['outputSchema']>>('journal', 'get', args, this.context),
        update: (args: z.input<typeof Contract_6.journalCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCrud['update']['outputSchema']>>('journal', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_6.journalCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_6.journalCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.journalCrud['delete']['outputSchema']>>('journal', 'delete', args, this.context),
    };
    public readonly directive = {
        create: (args: z.input<typeof Contract_6.directiveCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_6.directiveCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.directiveCrud['create']['outputSchema']>>('directive', 'create', args, this.context),
        find: (args: z.input<typeof Contract_6.directiveCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_6.directiveCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.directiveCrud['find']['outputSchema']>>('directive', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_6.directiveCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_6.directiveCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.directiveCrud['findOne']['outputSchema']>>('directive', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_6.directiveCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_6.directiveCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.directiveCrud['count']['outputSchema']>>('directive', 'count', args, this.context),
        get: (args: z.input<typeof Contract_6.directiveCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_6.directiveCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.directiveCrud['get']['outputSchema']>>('directive', 'get', args, this.context),
        update: (args: z.input<typeof Contract_6.directiveCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_6.directiveCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.directiveCrud['update']['outputSchema']>>('directive', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_6.directiveCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_6.directiveCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.directiveCrud['delete']['outputSchema']>>('directive', 'delete', args, this.context),
    };
    public readonly kanban = {
        move: (args: z.input<typeof Contract_7.kanbanMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanMoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanMoveContract['outputSchema']>>('kanban', 'move', args, this.context),
        create: (args: z.input<typeof Contract_7.kanbanCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanCrud['create']['outputSchema']>>('kanban', 'create', args, this.context),
        find: (args: z.input<typeof Contract_7.kanbanCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanCrud['find']['outputSchema']>>('kanban', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_7.kanbanCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanCrud['findOne']['outputSchema']>>('kanban', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_7.kanbanCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanCrud['count']['outputSchema']>>('kanban', 'count', args, this.context),
        get: (args: z.input<typeof Contract_7.kanbanCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanCrud['get']['outputSchema']>>('kanban', 'get', args, this.context),
        update: (args: z.input<typeof Contract_7.kanbanCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanCrud['update']['outputSchema']>>('kanban', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_7.kanbanCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_7.kanbanCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.kanbanCrud['delete']['outputSchema']>>('kanban', 'delete', args, this.context),
    };
    public readonly manager = {
        chat: (args: z.input<typeof Contract_8.managerChatContract['inputSchema']>): Promise<z.infer<typeof Contract_8.managerChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.managerChatContract['outputSchema']>>('manager', 'chat', args, this.context),
        pulse: (args: z.input<typeof Contract_8.managerPulseContract['inputSchema']>): Promise<z.infer<typeof Contract_8.managerPulseContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.managerPulseContract['outputSchema']>>('manager', 'pulse', args, this.context),
        inquire: (args: z.input<typeof Contract_8.managerInquireContract['inputSchema']>): Promise<z.infer<typeof Contract_8.managerInquireContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.managerInquireContract['outputSchema']>>('manager', 'inquire', args, this.context),
        execute: (args: z.input<typeof Contract_8.managerExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_8.managerExecuteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.managerExecuteContract['outputSchema']>>('manager', 'execute', args, this.context),
        research: (args: z.input<typeof Contract_8.managerResearchContract['inputSchema']>): Promise<z.infer<typeof Contract_8.managerResearchContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.managerResearchContract['outputSchema']>>('manager', 'research', args, this.context),
        run: (args: z.input<typeof Contract_8.managerRunContract['inputSchema']>): Promise<z.infer<typeof Contract_8.managerRunContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.managerRunContract['outputSchema']>>('manager', 'run', args, this.context),
        list_tool_errors: (args: z.input<typeof Contract_8.managerListToolErrorsContract['inputSchema']>): Promise<z.infer<typeof Contract_8.managerListToolErrorsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.managerListToolErrorsContract['outputSchema']>>('manager', 'list_tool_errors', args, this.context),
    };
    public readonly pulse_report = {
        create: (args: z.input<typeof Contract_8.pulseReportCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_8.pulseReportCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.pulseReportCrud['create']['outputSchema']>>('pulse_report', 'create', args, this.context),
        find: (args: z.input<typeof Contract_8.pulseReportCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_8.pulseReportCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.pulseReportCrud['find']['outputSchema']>>('pulse_report', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_8.pulseReportCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_8.pulseReportCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.pulseReportCrud['findOne']['outputSchema']>>('pulse_report', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_8.pulseReportCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_8.pulseReportCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.pulseReportCrud['count']['outputSchema']>>('pulse_report', 'count', args, this.context),
        get: (args: z.input<typeof Contract_8.pulseReportCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_8.pulseReportCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.pulseReportCrud['get']['outputSchema']>>('pulse_report', 'get', args, this.context),
        update: (args: z.input<typeof Contract_8.pulseReportCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_8.pulseReportCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.pulseReportCrud['update']['outputSchema']>>('pulse_report', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_8.pulseReportCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_8.pulseReportCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.pulseReportCrud['delete']['outputSchema']>>('pulse_report', 'delete', args, this.context),
    };
    public readonly marketplace = {
        list: (args: z.input<typeof Contract_9.marketplaceListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.marketplaceListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.marketplaceListContract['outputSchema']>>('marketplace', 'list', args, this.context),
        install: (args: z.input<typeof Contract_9.marketplaceInstallContract['inputSchema']>): Promise<z.infer<typeof Contract_9.marketplaceInstallContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.marketplaceInstallContract['outputSchema']>>('marketplace', 'install', args, this.context),
    };
    public readonly notifications = {
        send: (args: z.input<typeof Contract_10.notificationsSendContract['inputSchema']>): Promise<z.infer<typeof Contract_10.notificationsSendContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_10.notificationsSendContract['outputSchema']>>('notifications', 'send', args, this.context),
        list: (args: z.input<typeof Contract_10.notificationsListContract['inputSchema']>): Promise<z.infer<typeof Contract_10.notificationsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_10.notificationsListContract['outputSchema']>>('notifications', 'list', args, this.context),
    };
    public readonly sandbox = {
        set_active: (args: z.input<typeof Contract_11.sandboxSetActiveContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxSetActiveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxSetActiveContract['outputSchema']>>('sandbox', 'set_active', args, this.context),
        prune: (args: z.input<typeof Contract_11.sandboxPruneContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxPruneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxPruneContract['outputSchema']>>('sandbox', 'prune', args, this.context),
        fs_read: (args: z.input<typeof Contract_11.sandboxFsReadContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxFsReadContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxFsReadContract['outputSchema']>>('sandbox', 'fs_read', args, this.context),
        fs_write: (args: z.input<typeof Contract_11.sandboxFsWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxFsWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxFsWriteContract['outputSchema']>>('sandbox', 'fs_write', args, this.context),
        fs_list: (args: z.input<typeof Contract_11.sandboxFsListContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxFsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxFsListContract['outputSchema']>>('sandbox', 'fs_list', args, this.context),
        fs_patch: (args: z.input<typeof Contract_11.sandboxFsPatchContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxFsPatchContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxFsPatchContract['outputSchema']>>('sandbox', 'fs_patch', args, this.context),
        fs_remove: (args: z.input<typeof Contract_11.sandboxFsRemoveContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxFsRemoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxFsRemoveContract['outputSchema']>>('sandbox', 'fs_remove', args, this.context),
        fs_mkdir: (args: z.input<typeof Contract_11.sandboxFsMkdirContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxFsMkdirContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxFsMkdirContract['outputSchema']>>('sandbox', 'fs_mkdir', args, this.context),
        fs_move: (args: z.input<typeof Contract_11.sandboxFsMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxFsMoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxFsMoveContract['outputSchema']>>('sandbox', 'fs_move', args, this.context),
        terminal_execute: (args: z.input<typeof Contract_11.sandboxTerminalExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalExecuteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalExecuteContract['outputSchema']>>('sandbox', 'terminal_execute', args, this.context),
        terminal_spawn: (args: z.input<typeof Contract_11.sandboxTerminalSpawnContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalSpawnContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalSpawnContract['outputSchema']>>('sandbox', 'terminal_spawn', args, this.context),
        terminal_list: (args: z.input<typeof Contract_11.sandboxTerminalListContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalListContract['outputSchema']>>('sandbox', 'terminal_list', args, this.context),
        terminal_kill: (args: z.input<typeof Contract_11.sandboxTerminalKillContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalKillContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalKillContract['outputSchema']>>('sandbox', 'terminal_kill', args, this.context),
        terminal_logs: (args: z.input<typeof Contract_11.sandboxTerminalLogsContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalLogsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalLogsContract['outputSchema']>>('sandbox', 'terminal_logs', args, this.context),
        terminal_session_open: (args: z.input<typeof Contract_11.sandboxTerminalSessionOpenContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalSessionOpenContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalSessionOpenContract['outputSchema']>>('sandbox', 'terminal_session_open', args, this.context),
        terminal_session_list: (args: z.input<typeof Contract_11.sandboxTerminalSessionListContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalSessionListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalSessionListContract['outputSchema']>>('sandbox', 'terminal_session_list', args, this.context),
        terminal_session_write: (args: z.input<typeof Contract_11.sandboxTerminalSessionWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalSessionWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalSessionWriteContract['outputSchema']>>('sandbox', 'terminal_session_write', args, this.context),
        terminal_session_resize: (args: z.input<typeof Contract_11.sandboxTerminalSessionResizeContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxTerminalSessionResizeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxTerminalSessionResizeContract['outputSchema']>>('sandbox', 'terminal_session_resize', args, this.context),
        network_expose: (args: z.input<typeof Contract_11.sandboxNetworkExposeContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxNetworkExposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxNetworkExposeContract['outputSchema']>>('sandbox', 'network_expose', args, this.context),
        network_unexpose: (args: z.input<typeof Contract_11.sandboxNetworkUnexposeContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxNetworkUnexposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxNetworkUnexposeContract['outputSchema']>>('sandbox', 'network_unexpose', args, this.context),
        network_list: (args: z.input<typeof Contract_11.sandboxNetworkListContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxNetworkListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxNetworkListContract['outputSchema']>>('sandbox', 'network_list', args, this.context),
        network_set_policy: (args: z.input<typeof Contract_11.sandboxNetworkSetPolicyContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxNetworkSetPolicyContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxNetworkSetPolicyContract['outputSchema']>>('sandbox', 'network_set_policy', args, this.context),
        env_set: (args: z.input<typeof Contract_11.sandboxEnvSetContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxEnvSetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxEnvSetContract['outputSchema']>>('sandbox', 'env_set', args, this.context),
        env_set_secret: (args: z.input<typeof Contract_11.sandboxEnvSetSecretContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxEnvSetSecretContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxEnvSetSecretContract['outputSchema']>>('sandbox', 'env_set_secret', args, this.context),
        env_list: (args: z.input<typeof Contract_11.sandboxEnvListContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxEnvListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxEnvListContract['outputSchema']>>('sandbox', 'env_list', args, this.context),
        resource_update_limits: (args: z.input<typeof Contract_11.sandboxResourceUpdateLimitsContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxResourceUpdateLimitsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxResourceUpdateLimitsContract['outputSchema']>>('sandbox', 'resource_update_limits', args, this.context),
        resource_get_stats: (args: z.input<typeof Contract_11.sandboxResourceGetStatsContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxResourceGetStatsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxResourceGetStatsContract['outputSchema']>>('sandbox', 'resource_get_stats', args, this.context),
        state_commit: (args: z.input<typeof Contract_11.sandboxStateCommitContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxStateCommitContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxStateCommitContract['outputSchema']>>('sandbox', 'state_commit', args, this.context),
        state_clone: (args: z.input<typeof Contract_11.sandboxStateCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxStateCloneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxStateCloneContract['outputSchema']>>('sandbox', 'state_clone', args, this.context),
        create: (args: z.input<typeof Contract_11.sandboxCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxCrud['create']['outputSchema']>>('sandbox', 'create', args, this.context),
        find: (args: z.input<typeof Contract_11.sandboxCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxCrud['find']['outputSchema']>>('sandbox', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_11.sandboxCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxCrud['findOne']['outputSchema']>>('sandbox', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_11.sandboxCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxCrud['count']['outputSchema']>>('sandbox', 'count', args, this.context),
        get: (args: z.input<typeof Contract_11.sandboxCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxCrud['get']['outputSchema']>>('sandbox', 'get', args, this.context),
        update: (args: z.input<typeof Contract_11.sandboxCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxCrud['update']['outputSchema']>>('sandbox', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_11.sandboxCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_11.sandboxCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_11.sandboxCrud['delete']['outputSchema']>>('sandbox', 'delete', args, this.context),
    };
    public readonly settings = {
        get: (args: z.input<typeof Contract_12.settingsGetContract['inputSchema']>): Promise<z.infer<typeof Contract_12.settingsGetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_12.settingsGetContract['outputSchema']>>('settings', 'get', args, this.context),
        update: (args: z.input<typeof Contract_12.settingsUpdateContract['inputSchema']>): Promise<z.infer<typeof Contract_12.settingsUpdateContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_12.settingsUpdateContract['outputSchema']>>('settings', 'update', args, this.context),
        getAll: (args: z.input<typeof Contract_12.settingsGetAllContract['inputSchema']>): Promise<z.infer<typeof Contract_12.settingsGetAllContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_12.settingsGetAllContract['outputSchema']>>('settings', 'getAll', args, this.context),
    };
    public readonly system = {
        genesis: (args: z.input<typeof Contract_13.genesisContract['inputSchema']>): Promise<z.infer<typeof Contract_13.genesisContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_13.genesisContract['outputSchema']>>('system', 'genesis', args, this.context),
        bootstrap: (args: z.input<typeof Contract_13.bootstrapContract['inputSchema']>): Promise<z.infer<typeof Contract_13.bootstrapContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_13.bootstrapContract['outputSchema']>>('system', 'bootstrap', args, this.context),
        reset: (args: z.input<typeof Contract_13.resetContract['inputSchema']>): Promise<z.infer<typeof Contract_13.resetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_13.resetContract['outputSchema']>>('system', 'reset', args, this.context),
    };
    public readonly web = {
        fetch_feed: (args: z.input<typeof Contract_14.webFetchFeedContract['inputSchema']>): Promise<z.infer<typeof Contract_14.webFetchFeedContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.webFetchFeedContract['outputSchema']>>('web', 'fetch_feed', args, this.context),
        searxng_search: (args: z.input<typeof Contract_14.webSearxngSearchContract['inputSchema']>): Promise<z.infer<typeof Contract_14.webSearxngSearchContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.webSearxngSearchContract['outputSchema']>>('web', 'searxng_search', args, this.context),
        create: (args: z.input<typeof Contract_14.rssFeedCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_14.rssFeedCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.rssFeedCrud['create']['outputSchema']>>('web', 'create', args, this.context),
        find: (args: z.input<typeof Contract_14.rssFeedCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_14.rssFeedCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.rssFeedCrud['find']['outputSchema']>>('web', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_14.rssFeedCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_14.rssFeedCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.rssFeedCrud['findOne']['outputSchema']>>('web', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_14.rssFeedCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_14.rssFeedCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.rssFeedCrud['count']['outputSchema']>>('web', 'count', args, this.context),
        get: (args: z.input<typeof Contract_14.rssFeedCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_14.rssFeedCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.rssFeedCrud['get']['outputSchema']>>('web', 'get', args, this.context),
        update: (args: z.input<typeof Contract_14.rssFeedCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_14.rssFeedCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.rssFeedCrud['update']['outputSchema']>>('web', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_14.rssFeedCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_14.rssFeedCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_14.rssFeedCrud['delete']['outputSchema']>>('web', 'delete', args, this.context),
    };
}
