import { z } from 'zod';
import { ICastellanApi } from '../core/api.js';
import * as Contract_0 from '../addons/agents/skills/agent.contract.js';
import * as Contract_1 from '../addons/audit/skills/approval.contract.js';
import * as Contract_2 from '../addons/cron/skills/cron.contract.js';
import * as Contract_3 from '../addons/demo/skills/demo.contract.js';
import * as Contract_4 from '../addons/github/skills/github.contract.js';
import * as Contract_5 from '../addons/infer/skills/infer.contract.js';
import * as Contract_6 from '../addons/journal/skills/journal.contract.js';
import * as Contract_7 from '../addons/kanban/skills/kanban.contract.js';
import * as Contract_8 from '../addons/manager/skills/manager.contract.js';
import * as Contract_9 from '../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_10 from '../addons/notifications/skills/notifications.contract.js';
import * as Contract_11 from '../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_12 from '../addons/settings/skills/settings.contract.js';
import * as Contract_13 from '../addons/system/skills/system.contract.js';
import * as Contract_14 from '../addons/web/skills/web.contract.js';

declare module '../core/api.js' {
    interface ICastellanApi {
        readonly agent: {
            /** Start an autonomous execution turn for a specific agent. */
            readonly run: (args: z.input<typeof Contract_0.agentRunContract['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunContract['outputSchema']>>;
            /** Perform a structured completion using a JSON schema format. */
            readonly structured_infer: (args: z.input<typeof Contract_0.agentStructuredInferContract['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentStructuredInferContract['outputSchema']>>;
            /** CRUD create for agent (agentCrud) */
            readonly create: (args: z.input<typeof Contract_0.agentCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentCrud['create']['outputSchema']>>;
            /** CRUD find for agent (agentCrud) */
            readonly find: (args: z.input<typeof Contract_0.agentCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentCrud['find']['outputSchema']>>;
            /** CRUD findOne for agent (agentCrud) */
            readonly find_one: (args: z.input<typeof Contract_0.agentCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentCrud['findOne']['outputSchema']>>;
            /** CRUD count for agent (agentCrud) */
            readonly count: (args: z.input<typeof Contract_0.agentCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentCrud['count']['outputSchema']>>;
            /** CRUD get for agent (agentCrud) */
            readonly get: (args: z.input<typeof Contract_0.agentCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentCrud['get']['outputSchema']>>;
            /** CRUD update for agent (agentCrud) */
            readonly update: (args: z.input<typeof Contract_0.agentCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentCrud['update']['outputSchema']>>;
            /** CRUD delete for agent (agentCrud) */
            readonly delete: (args: z.input<typeof Contract_0.agentCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentCrud['delete']['outputSchema']>>;
        };
        readonly agent_run: {
            /** CRUD create for agent_run (agentRunCrud) */
            readonly create: (args: z.input<typeof Contract_0.agentRunCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunCrud['create']['outputSchema']>>;
            /** CRUD find for agent_run (agentRunCrud) */
            readonly find: (args: z.input<typeof Contract_0.agentRunCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunCrud['find']['outputSchema']>>;
            /** CRUD findOne for agent_run (agentRunCrud) */
            readonly find_one: (args: z.input<typeof Contract_0.agentRunCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunCrud['findOne']['outputSchema']>>;
            /** CRUD count for agent_run (agentRunCrud) */
            readonly count: (args: z.input<typeof Contract_0.agentRunCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunCrud['count']['outputSchema']>>;
            /** CRUD get for agent_run (agentRunCrud) */
            readonly get: (args: z.input<typeof Contract_0.agentRunCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunCrud['get']['outputSchema']>>;
            /** CRUD update for agent_run (agentRunCrud) */
            readonly update: (args: z.input<typeof Contract_0.agentRunCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunCrud['update']['outputSchema']>>;
            /** CRUD delete for agent_run (agentRunCrud) */
            readonly delete: (args: z.input<typeof Contract_0.agentRunCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunCrud['delete']['outputSchema']>>;
        };
        readonly audit: {
            /** Resolve a pending tool call approval request. */
            readonly approval_resolve: (args: z.input<typeof Contract_1.approvalResolveContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalResolveContract['outputSchema']>>;
            /** Trigger a multi-judge audit on a thread. */
            readonly run: (args: z.input<typeof Contract_1.auditRunContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.auditRunContract['outputSchema']>>;
            /** Spawn a fresh sandbox and clone a git repository to create a consistent world state for testing. */
            readonly create_testbed: (args: z.input<typeof Contract_1.auditCreateTestbedContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.auditCreateTestbedContract['outputSchema']>>;
            /** Analyze a historical failure and generate a gold-standard Scenario for regression testing. */
            readonly generate_scenario: (args: z.input<typeof Contract_1.auditGenerateScenarioContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.auditGenerateScenarioContract['outputSchema']>>;
            /** Run a triad (Manager/Thinker/Doer) simulation against a Scenario and grade the autonomy and accuracy. */
            readonly evaluate_triad: (args: z.input<typeof Contract_1.auditEvaluateTriadContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.auditEvaluateTriadContract['outputSchema']>>;
            /** Trigger a multi-judge safety audit on a pending tool call approval request. */
            readonly evaluate_approval: (args: z.input<typeof Contract_1.auditEvaluateApprovalContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.auditEvaluateApprovalContract['outputSchema']>>;
        };
        readonly approval: {
            /** CRUD create for approval (approvalCrud) */
            readonly create: (args: z.input<typeof Contract_1.approvalCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalCrud['create']['outputSchema']>>;
            /** CRUD find for approval (approvalCrud) */
            readonly find: (args: z.input<typeof Contract_1.approvalCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalCrud['find']['outputSchema']>>;
            /** CRUD findOne for approval (approvalCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.approvalCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalCrud['findOne']['outputSchema']>>;
            /** CRUD count for approval (approvalCrud) */
            readonly count: (args: z.input<typeof Contract_1.approvalCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalCrud['count']['outputSchema']>>;
            /** CRUD get for approval (approvalCrud) */
            readonly get: (args: z.input<typeof Contract_1.approvalCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalCrud['get']['outputSchema']>>;
            /** CRUD update for approval (approvalCrud) */
            readonly update: (args: z.input<typeof Contract_1.approvalCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalCrud['update']['outputSchema']>>;
            /** CRUD delete for approval (approvalCrud) */
            readonly delete: (args: z.input<typeof Contract_1.approvalCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.approvalCrud['delete']['outputSchema']>>;
        };
        readonly scenario: {
            /** CRUD create for scenario (scenarioCrud) */
            readonly create: (args: z.input<typeof Contract_1.scenarioCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.scenarioCrud['create']['outputSchema']>>;
            /** CRUD find for scenario (scenarioCrud) */
            readonly find: (args: z.input<typeof Contract_1.scenarioCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.scenarioCrud['find']['outputSchema']>>;
            /** CRUD findOne for scenario (scenarioCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.scenarioCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.scenarioCrud['findOne']['outputSchema']>>;
            /** CRUD count for scenario (scenarioCrud) */
            readonly count: (args: z.input<typeof Contract_1.scenarioCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.scenarioCrud['count']['outputSchema']>>;
            /** CRUD get for scenario (scenarioCrud) */
            readonly get: (args: z.input<typeof Contract_1.scenarioCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.scenarioCrud['get']['outputSchema']>>;
            /** CRUD update for scenario (scenarioCrud) */
            readonly update: (args: z.input<typeof Contract_1.scenarioCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.scenarioCrud['update']['outputSchema']>>;
            /** CRUD delete for scenario (scenarioCrud) */
            readonly delete: (args: z.input<typeof Contract_1.scenarioCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.scenarioCrud['delete']['outputSchema']>>;
        };
        readonly evaluation: {
            /** CRUD create for evaluation (evaluationCrud) */
            readonly create: (args: z.input<typeof Contract_1.evaluationCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.evaluationCrud['create']['outputSchema']>>;
            /** CRUD find for evaluation (evaluationCrud) */
            readonly find: (args: z.input<typeof Contract_1.evaluationCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.evaluationCrud['find']['outputSchema']>>;
            /** CRUD findOne for evaluation (evaluationCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.evaluationCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.evaluationCrud['findOne']['outputSchema']>>;
            /** CRUD count for evaluation (evaluationCrud) */
            readonly count: (args: z.input<typeof Contract_1.evaluationCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.evaluationCrud['count']['outputSchema']>>;
            /** CRUD get for evaluation (evaluationCrud) */
            readonly get: (args: z.input<typeof Contract_1.evaluationCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.evaluationCrud['get']['outputSchema']>>;
            /** CRUD update for evaluation (evaluationCrud) */
            readonly update: (args: z.input<typeof Contract_1.evaluationCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.evaluationCrud['update']['outputSchema']>>;
            /** CRUD delete for evaluation (evaluationCrud) */
            readonly delete: (args: z.input<typeof Contract_1.evaluationCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.evaluationCrud['delete']['outputSchema']>>;
        };
        readonly cron: {
            /** Manually trigger a scheduled cron job to run as soon as possible. */
            readonly trigger: (args: z.input<typeof Contract_2.cronTriggerContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronTriggerContract['outputSchema']>>;
            /** Reset a stuck or running cron job to queued state so it can be picked up by the scheduler again. */
            readonly reset: (args: z.input<typeof Contract_2.cronResetContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronResetContract['outputSchema']>>;
            /** Get a summary of the cron scheduler status, including running jobs and queue depth. */
            readonly status: (args: z.input<typeof Contract_2.cronStatusContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronStatusContract['outputSchema']>>;
            /** CRUD create for cron (cronJobCrud) */
            readonly create: (args: z.input<typeof Contract_2.cronJobCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobCrud['create']['outputSchema']>>;
            /** CRUD find for cron (cronJobCrud) */
            readonly find: (args: z.input<typeof Contract_2.cronJobCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobCrud['find']['outputSchema']>>;
            /** CRUD findOne for cron (cronJobCrud) */
            readonly find_one: (args: z.input<typeof Contract_2.cronJobCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobCrud['findOne']['outputSchema']>>;
            /** CRUD count for cron (cronJobCrud) */
            readonly count: (args: z.input<typeof Contract_2.cronJobCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobCrud['count']['outputSchema']>>;
            /** CRUD get for cron (cronJobCrud) */
            readonly get: (args: z.input<typeof Contract_2.cronJobCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobCrud['get']['outputSchema']>>;
            /** CRUD update for cron (cronJobCrud) */
            readonly update: (args: z.input<typeof Contract_2.cronJobCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobCrud['update']['outputSchema']>>;
            /** CRUD delete for cron (cronJobCrud) */
            readonly delete: (args: z.input<typeof Contract_2.cronJobCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobCrud['delete']['outputSchema']>>;
        };
        readonly cron_runs: {
            /** CRUD create for cron_runs (cronJobRunCrud) */
            readonly create: (args: z.input<typeof Contract_2.cronJobRunCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobRunCrud['create']['outputSchema']>>;
            /** CRUD find for cron_runs (cronJobRunCrud) */
            readonly find: (args: z.input<typeof Contract_2.cronJobRunCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobRunCrud['find']['outputSchema']>>;
            /** CRUD findOne for cron_runs (cronJobRunCrud) */
            readonly find_one: (args: z.input<typeof Contract_2.cronJobRunCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobRunCrud['findOne']['outputSchema']>>;
            /** CRUD count for cron_runs (cronJobRunCrud) */
            readonly count: (args: z.input<typeof Contract_2.cronJobRunCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobRunCrud['count']['outputSchema']>>;
            /** CRUD get for cron_runs (cronJobRunCrud) */
            readonly get: (args: z.input<typeof Contract_2.cronJobRunCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobRunCrud['get']['outputSchema']>>;
            /** CRUD update for cron_runs (cronJobRunCrud) */
            readonly update: (args: z.input<typeof Contract_2.cronJobRunCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobRunCrud['update']['outputSchema']>>;
            /** CRUD delete for cron_runs (cronJobRunCrud) */
            readonly delete: (args: z.input<typeof Contract_2.cronJobRunCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_2.cronJobRunCrud['delete']['outputSchema']>>;
        };
        readonly demo: {
            /** A simple hello world tool for demonstration. */
            readonly hello: (args: z.input<typeof Contract_3.demoHelloContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoHelloContract['outputSchema']>>;
            /** Check the status of the demo environment. */
            readonly status: (args: z.input<typeof Contract_3.demoStatusContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoStatusContract['outputSchema']>>;
            /** Send a notification via the system notifications service. */
            readonly notify: (args: z.input<typeof Contract_3.demoNotifyContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoNotifyContract['outputSchema']>>;
            /** CRUD create for demo (demoCrud) */
            readonly create: (args: z.input<typeof Contract_3.demoCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoCrud['create']['outputSchema']>>;
            /** CRUD find for demo (demoCrud) */
            readonly find: (args: z.input<typeof Contract_3.demoCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoCrud['find']['outputSchema']>>;
            /** CRUD findOne for demo (demoCrud) */
            readonly find_one: (args: z.input<typeof Contract_3.demoCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoCrud['findOne']['outputSchema']>>;
            /** CRUD count for demo (demoCrud) */
            readonly count: (args: z.input<typeof Contract_3.demoCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoCrud['count']['outputSchema']>>;
            /** CRUD get for demo (demoCrud) */
            readonly get: (args: z.input<typeof Contract_3.demoCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoCrud['get']['outputSchema']>>;
            /** CRUD update for demo (demoCrud) */
            readonly update: (args: z.input<typeof Contract_3.demoCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoCrud['update']['outputSchema']>>;
            /** CRUD delete for demo (demoCrud) */
            readonly delete: (args: z.input<typeof Contract_3.demoCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_3.demoCrud['delete']['outputSchema']>>;
        };
        readonly github: {
            /** List all repositories in the configured organization. */
            readonly list_repos: (args: z.input<typeof Contract_4.githubListReposContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.githubListReposContract['outputSchema']>>;
            /** Get detailed information for a specific repository in the organization. */
            readonly get_repo: (args: z.input<typeof Contract_4.githubGetRepoContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.githubGetRepoContract['outputSchema']>>;
            /** List open issues for a specific repository. */
            readonly list_issues: (args: z.input<typeof Contract_4.githubListIssuesContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.githubListIssuesContract['outputSchema']>>;
            /** List open pull requests for a specific repository. */
            readonly list_pulls: (args: z.input<typeof Contract_4.githubListPullsContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.githubListPullsContract['outputSchema']>>;
            /** Check the health of the GitHub integration, token scopes, and current rate limits. */
            readonly status: (args: z.input<typeof Contract_4.githubStatusContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.githubStatusContract['outputSchema']>>;
            /** Clone a repository from GitHub into the active sandbox workspace. */
            readonly clone: (args: z.input<typeof Contract_4.githubCloneContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.githubCloneContract['outputSchema']>>;
        };
        readonly infer: {
            /** Perform stateful chat completion within a thread. */
            readonly chat: (args: z.input<typeof Contract_5.inferChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferChatContract['outputSchema']>>;
            /** Approve a pending tool call for execution. */
            readonly approve_tool: (args: z.input<typeof Contract_5.inferApproveToolContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferApproveToolContract['outputSchema']>>;
            /** Force a refresh of the model inventory from all registered Ollama instances. */
            readonly refresh_inventory: (args: z.input<typeof Contract_5.inferRefreshInventoryContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferRefreshInventoryContract['outputSchema']>>;
            /** Atomically acquire the next available online Ollama instance. */
            readonly acquire_ollama: (args: z.input<typeof Contract_5.inferAcquireOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferAcquireOllamaContract['outputSchema']>>;
            /** Release an acquired Ollama instance, decrementing its active request count. */
            readonly release_ollama: (args: z.input<typeof Contract_5.inferReleaseOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferReleaseOllamaContract['outputSchema']>>;
            /** Perform a structured completion using a JSON schema format. */
            readonly structured_chat: (args: z.input<typeof Contract_5.inferStructuredChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferStructuredChatContract['outputSchema']>>;
        };
        readonly ollama: {
            /** CRUD create for ollama (ollamaCrud) */
            readonly create: (args: z.input<typeof Contract_5.ollamaCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.ollamaCrud['create']['outputSchema']>>;
            /** CRUD find for ollama (ollamaCrud) */
            readonly find: (args: z.input<typeof Contract_5.ollamaCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.ollamaCrud['find']['outputSchema']>>;
            /** CRUD findOne for ollama (ollamaCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.ollamaCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.ollamaCrud['findOne']['outputSchema']>>;
            /** CRUD count for ollama (ollamaCrud) */
            readonly count: (args: z.input<typeof Contract_5.ollamaCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.ollamaCrud['count']['outputSchema']>>;
            /** CRUD get for ollama (ollamaCrud) */
            readonly get: (args: z.input<typeof Contract_5.ollamaCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.ollamaCrud['get']['outputSchema']>>;
            /** CRUD update for ollama (ollamaCrud) */
            readonly update: (args: z.input<typeof Contract_5.ollamaCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.ollamaCrud['update']['outputSchema']>>;
            /** CRUD delete for ollama (ollamaCrud) */
            readonly delete: (args: z.input<typeof Contract_5.ollamaCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.ollamaCrud['delete']['outputSchema']>>;
        };
        readonly models: {
            /** CRUD create for models (modelCrud) */
            readonly create: (args: z.input<typeof Contract_5.modelCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.modelCrud['create']['outputSchema']>>;
            /** CRUD find for models (modelCrud) */
            readonly find: (args: z.input<typeof Contract_5.modelCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.modelCrud['find']['outputSchema']>>;
            /** CRUD findOne for models (modelCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.modelCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.modelCrud['findOne']['outputSchema']>>;
            /** CRUD count for models (modelCrud) */
            readonly count: (args: z.input<typeof Contract_5.modelCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.modelCrud['count']['outputSchema']>>;
            /** CRUD get for models (modelCrud) */
            readonly get: (args: z.input<typeof Contract_5.modelCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.modelCrud['get']['outputSchema']>>;
            /** CRUD update for models (modelCrud) */
            readonly update: (args: z.input<typeof Contract_5.modelCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.modelCrud['update']['outputSchema']>>;
            /** CRUD delete for models (modelCrud) */
            readonly delete: (args: z.input<typeof Contract_5.modelCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.modelCrud['delete']['outputSchema']>>;
        };
        readonly threads: {
            /** CRUD create for threads (threadCrud) */
            readonly create: (args: z.input<typeof Contract_5.threadCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.threadCrud['create']['outputSchema']>>;
            /** CRUD find for threads (threadCrud) */
            readonly find: (args: z.input<typeof Contract_5.threadCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.threadCrud['find']['outputSchema']>>;
            /** CRUD findOne for threads (threadCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.threadCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.threadCrud['findOne']['outputSchema']>>;
            /** CRUD count for threads (threadCrud) */
            readonly count: (args: z.input<typeof Contract_5.threadCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.threadCrud['count']['outputSchema']>>;
            /** CRUD get for threads (threadCrud) */
            readonly get: (args: z.input<typeof Contract_5.threadCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.threadCrud['get']['outputSchema']>>;
            /** CRUD update for threads (threadCrud) */
            readonly update: (args: z.input<typeof Contract_5.threadCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.threadCrud['update']['outputSchema']>>;
            /** CRUD delete for threads (threadCrud) */
            readonly delete: (args: z.input<typeof Contract_5.threadCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.threadCrud['delete']['outputSchema']>>;
        };
        readonly messages: {
            /** CRUD create for messages (messageCrud) */
            readonly create: (args: z.input<typeof Contract_5.messageCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.messageCrud['create']['outputSchema']>>;
            /** CRUD find for messages (messageCrud) */
            readonly find: (args: z.input<typeof Contract_5.messageCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.messageCrud['find']['outputSchema']>>;
            /** CRUD findOne for messages (messageCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.messageCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.messageCrud['findOne']['outputSchema']>>;
            /** CRUD count for messages (messageCrud) */
            readonly count: (args: z.input<typeof Contract_5.messageCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.messageCrud['count']['outputSchema']>>;
            /** CRUD get for messages (messageCrud) */
            readonly get: (args: z.input<typeof Contract_5.messageCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.messageCrud['get']['outputSchema']>>;
            /** CRUD update for messages (messageCrud) */
            readonly update: (args: z.input<typeof Contract_5.messageCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.messageCrud['update']['outputSchema']>>;
            /** CRUD delete for messages (messageCrud) */
            readonly delete: (args: z.input<typeof Contract_5.messageCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.messageCrud['delete']['outputSchema']>>;
        };
        readonly tool_calls: {
            /** CRUD create for tool_calls (toolCallCrud) */
            readonly create: (args: z.input<typeof Contract_5.toolCallCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.toolCallCrud['create']['outputSchema']>>;
            /** CRUD find for tool_calls (toolCallCrud) */
            readonly find: (args: z.input<typeof Contract_5.toolCallCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.toolCallCrud['find']['outputSchema']>>;
            /** CRUD findOne for tool_calls (toolCallCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.toolCallCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.toolCallCrud['findOne']['outputSchema']>>;
            /** CRUD count for tool_calls (toolCallCrud) */
            readonly count: (args: z.input<typeof Contract_5.toolCallCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.toolCallCrud['count']['outputSchema']>>;
            /** CRUD get for tool_calls (toolCallCrud) */
            readonly get: (args: z.input<typeof Contract_5.toolCallCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.toolCallCrud['get']['outputSchema']>>;
            /** CRUD update for tool_calls (toolCallCrud) */
            readonly update: (args: z.input<typeof Contract_5.toolCallCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.toolCallCrud['update']['outputSchema']>>;
            /** CRUD delete for tool_calls (toolCallCrud) */
            readonly delete: (args: z.input<typeof Contract_5.toolCallCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.toolCallCrud['delete']['outputSchema']>>;
        };
        readonly infer_queue: {
            /** CRUD create for infer_queue (inferQueueCrud) */
            readonly create: (args: z.input<typeof Contract_5.inferQueueCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferQueueCrud['create']['outputSchema']>>;
            /** CRUD find for infer_queue (inferQueueCrud) */
            readonly find: (args: z.input<typeof Contract_5.inferQueueCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferQueueCrud['find']['outputSchema']>>;
            /** CRUD findOne for infer_queue (inferQueueCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.inferQueueCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferQueueCrud['findOne']['outputSchema']>>;
            /** CRUD count for infer_queue (inferQueueCrud) */
            readonly count: (args: z.input<typeof Contract_5.inferQueueCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferQueueCrud['count']['outputSchema']>>;
            /** CRUD get for infer_queue (inferQueueCrud) */
            readonly get: (args: z.input<typeof Contract_5.inferQueueCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferQueueCrud['get']['outputSchema']>>;
            /** CRUD update for infer_queue (inferQueueCrud) */
            readonly update: (args: z.input<typeof Contract_5.inferQueueCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferQueueCrud['update']['outputSchema']>>;
            /** CRUD delete for infer_queue (inferQueueCrud) */
            readonly delete: (args: z.input<typeof Contract_5.inferQueueCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.inferQueueCrud['delete']['outputSchema']>>;
        };
        readonly journal: {
            /** Record an observation, reasoning step, or proposal in the episodic memory ledger. */
            readonly note: (args: z.input<typeof Contract_6.journalNoteContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalNoteContract['outputSchema']>>;
            /** Approve or reject a proposed action in the journal. Requires a correction if rejected. */
            readonly resolve: (args: z.input<typeof Contract_6.journalResolveContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalResolveContract['outputSchema']>>;
            /** The Nightly Sleep Cycle: Compress recent journal entries and extract permanent directives. */
            readonly compress: (args: z.input<typeof Contract_6.journalCompressContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCompressContract['outputSchema']>>;
            /** CRUD create for journal (journalCrud) */
            readonly create: (args: z.input<typeof Contract_6.journalCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCrud['create']['outputSchema']>>;
            /** CRUD find for journal (journalCrud) */
            readonly find: (args: z.input<typeof Contract_6.journalCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCrud['find']['outputSchema']>>;
            /** CRUD findOne for journal (journalCrud) */
            readonly find_one: (args: z.input<typeof Contract_6.journalCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCrud['findOne']['outputSchema']>>;
            /** CRUD count for journal (journalCrud) */
            readonly count: (args: z.input<typeof Contract_6.journalCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCrud['count']['outputSchema']>>;
            /** CRUD get for journal (journalCrud) */
            readonly get: (args: z.input<typeof Contract_6.journalCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCrud['get']['outputSchema']>>;
            /** CRUD update for journal (journalCrud) */
            readonly update: (args: z.input<typeof Contract_6.journalCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCrud['update']['outputSchema']>>;
            /** CRUD delete for journal (journalCrud) */
            readonly delete: (args: z.input<typeof Contract_6.journalCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_6.journalCrud['delete']['outputSchema']>>;
        };
        readonly directive: {
            /** CRUD create for directive (directiveCrud) */
            readonly create: (args: z.input<typeof Contract_6.directiveCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_6.directiveCrud['create']['outputSchema']>>;
            /** CRUD find for directive (directiveCrud) */
            readonly find: (args: z.input<typeof Contract_6.directiveCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_6.directiveCrud['find']['outputSchema']>>;
            /** CRUD findOne for directive (directiveCrud) */
            readonly find_one: (args: z.input<typeof Contract_6.directiveCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_6.directiveCrud['findOne']['outputSchema']>>;
            /** CRUD count for directive (directiveCrud) */
            readonly count: (args: z.input<typeof Contract_6.directiveCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_6.directiveCrud['count']['outputSchema']>>;
            /** CRUD get for directive (directiveCrud) */
            readonly get: (args: z.input<typeof Contract_6.directiveCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_6.directiveCrud['get']['outputSchema']>>;
            /** CRUD update for directive (directiveCrud) */
            readonly update: (args: z.input<typeof Contract_6.directiveCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_6.directiveCrud['update']['outputSchema']>>;
            /** CRUD delete for directive (directiveCrud) */
            readonly delete: (args: z.input<typeof Contract_6.directiveCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_6.directiveCrud['delete']['outputSchema']>>;
        };
        readonly kanban: {
            /** Transition a mission through the Kanban lifecycle. */
            readonly move: (args: z.input<typeof Contract_7.kanbanMoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanMoveContract['outputSchema']>>;
            /** CRUD create for kanban (kanbanCrud) */
            readonly create: (args: z.input<typeof Contract_7.kanbanCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanCrud['create']['outputSchema']>>;
            /** CRUD find for kanban (kanbanCrud) */
            readonly find: (args: z.input<typeof Contract_7.kanbanCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanCrud['find']['outputSchema']>>;
            /** CRUD findOne for kanban (kanbanCrud) */
            readonly find_one: (args: z.input<typeof Contract_7.kanbanCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanCrud['findOne']['outputSchema']>>;
            /** CRUD count for kanban (kanbanCrud) */
            readonly count: (args: z.input<typeof Contract_7.kanbanCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanCrud['count']['outputSchema']>>;
            /** CRUD get for kanban (kanbanCrud) */
            readonly get: (args: z.input<typeof Contract_7.kanbanCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanCrud['get']['outputSchema']>>;
            /** CRUD update for kanban (kanbanCrud) */
            readonly update: (args: z.input<typeof Contract_7.kanbanCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanCrud['update']['outputSchema']>>;
            /** CRUD delete for kanban (kanbanCrud) */
            readonly delete: (args: z.input<typeof Contract_7.kanbanCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_7.kanbanCrud['delete']['outputSchema']>>;
        };
        readonly manager: {
            /** The exclusive entry point for user interaction. Translates intent into agent missions. */
            readonly chat: (args: z.input<typeof Contract_8.managerChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.managerChatContract['outputSchema']>>;
            /** Autonomous wake-up for system reconciliation and reporting. */
            readonly pulse: (args: z.input<typeof Contract_8.managerPulseContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.managerPulseContract['outputSchema']>>;
            /** Ask the inquirer agent to perform a local read-only discovery or analysis on the repository. */
            readonly inquire: (args: z.input<typeof Contract_8.managerInquireContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.managerInquireContract['outputSchema']>>;
            /** Dispatch the engineer agent to perform mutations, write code, or execute tests within a sandbox. */
            readonly execute: (args: z.input<typeof Contract_8.managerExecuteContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.managerExecuteContract['outputSchema']>>;
            /** Instruct the researcher agent to perform external web searches or fetch technical documentation. */
            readonly research: (args: z.input<typeof Contract_8.managerResearchContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.managerResearchContract['outputSchema']>>;
            /** Run the Central Directorate Orchestrator on a given mission or task (blocking). */
            readonly run: (args: z.input<typeof Contract_8.managerRunContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.managerRunContract['outputSchema']>>;
            /** Retrieve the last 50 tool result messages that generated execution errors. */
            readonly list_tool_errors: (args: z.input<typeof Contract_8.managerListToolErrorsContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.managerListToolErrorsContract['outputSchema']>>;
        };
        readonly pulse_report: {
            /** CRUD create for pulse_report (pulseReportCrud) */
            readonly create: (args: z.input<typeof Contract_8.pulseReportCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_8.pulseReportCrud['create']['outputSchema']>>;
            /** CRUD find for pulse_report (pulseReportCrud) */
            readonly find: (args: z.input<typeof Contract_8.pulseReportCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_8.pulseReportCrud['find']['outputSchema']>>;
            /** CRUD findOne for pulse_report (pulseReportCrud) */
            readonly find_one: (args: z.input<typeof Contract_8.pulseReportCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_8.pulseReportCrud['findOne']['outputSchema']>>;
            /** CRUD count for pulse_report (pulseReportCrud) */
            readonly count: (args: z.input<typeof Contract_8.pulseReportCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_8.pulseReportCrud['count']['outputSchema']>>;
            /** CRUD get for pulse_report (pulseReportCrud) */
            readonly get: (args: z.input<typeof Contract_8.pulseReportCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_8.pulseReportCrud['get']['outputSchema']>>;
            /** CRUD update for pulse_report (pulseReportCrud) */
            readonly update: (args: z.input<typeof Contract_8.pulseReportCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_8.pulseReportCrud['update']['outputSchema']>>;
            /** CRUD delete for pulse_report (pulseReportCrud) */
            readonly delete: (args: z.input<typeof Contract_8.pulseReportCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_8.pulseReportCrud['delete']['outputSchema']>>;
        };
        readonly marketplace: {
            /** List available and installed addons */
            readonly list: (args: z.input<typeof Contract_9.marketplaceListContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.marketplaceListContract['outputSchema']>>;
            /** Install an addon */
            readonly install: (args: z.input<typeof Contract_9.marketplaceInstallContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.marketplaceInstallContract['outputSchema']>>;
        };
        readonly notifications: {
            /** Trigger a new system notification */
            readonly send: (args: z.input<typeof Contract_10.notificationsSendContract['inputSchema']>) => Promise<z.infer<typeof Contract_10.notificationsSendContract['outputSchema']>>;
            /** List recent notifications */
            readonly list: (args: z.input<typeof Contract_10.notificationsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_10.notificationsListContract['outputSchema']>>;
        };
        readonly sandbox: {
            /** Step into a specific sandbox. All subsequent FS and Terminal tools will target this sandbox. */
            readonly set_active: (args: z.input<typeof Contract_11.sandboxSetActiveContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxSetActiveContract['outputSchema']>>;
            /** Clean up stale or stopped sandbox containers running on the Docker host. */
            readonly prune: (args: z.input<typeof Contract_11.sandboxPruneContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxPruneContract['outputSchema']>>;
            /** Read a file from the current sandbox. */
            readonly fs_read: (args: z.input<typeof Contract_11.sandboxFsReadContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxFsReadContract['outputSchema']>>;
            /** Write a file to the current sandbox. */
            readonly fs_write: (args: z.input<typeof Contract_11.sandboxFsWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxFsWriteContract['outputSchema']>>;
            /** List contents of a directory in the current sandbox. */
            readonly fs_list: (args: z.input<typeof Contract_11.sandboxFsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxFsListContract['outputSchema']>>;
            /** Apply targeted changes to a file in the current sandbox. */
            readonly fs_patch: (args: z.input<typeof Contract_11.sandboxFsPatchContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxFsPatchContract['outputSchema']>>;
            /** Remove a file or directory from the current sandbox. */
            readonly fs_remove: (args: z.input<typeof Contract_11.sandboxFsRemoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxFsRemoveContract['outputSchema']>>;
            /** Create a new directory in the current sandbox. */
            readonly fs_mkdir: (args: z.input<typeof Contract_11.sandboxFsMkdirContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxFsMkdirContract['outputSchema']>>;
            /** Move or rename a file/directory in the current sandbox. */
            readonly fs_move: (args: z.input<typeof Contract_11.sandboxFsMoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxFsMoveContract['outputSchema']>>;
            /** Execute a short-lived command in the current sandbox. */
            readonly terminal_execute: (args: z.input<typeof Contract_11.sandboxTerminalExecuteContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalExecuteContract['outputSchema']>>;
            /** Spawn a background service in the current sandbox. */
            readonly terminal_spawn: (args: z.input<typeof Contract_11.sandboxTerminalSpawnContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalSpawnContract['outputSchema']>>;
            /** List all background services running in the current sandbox. */
            readonly terminal_list: (args: z.input<typeof Contract_11.sandboxTerminalListContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalListContract['outputSchema']>>;
            /** Kill a background service in the current sandbox. */
            readonly terminal_kill: (args: z.input<typeof Contract_11.sandboxTerminalKillContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalKillContract['outputSchema']>>;
            /** Get logs for a background service in the current sandbox. */
            readonly terminal_logs: (args: z.input<typeof Contract_11.sandboxTerminalLogsContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalLogsContract['outputSchema']>>;
            /** Open a persistent PTY session (e.g. bash) in the current sandbox. */
            readonly terminal_session_open: (args: z.input<typeof Contract_11.sandboxTerminalSessionOpenContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalSessionOpenContract['outputSchema']>>;
            /** List all active PTY sessions in the current sandbox. */
            readonly terminal_session_list: (args: z.input<typeof Contract_11.sandboxTerminalSessionListContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalSessionListContract['outputSchema']>>;
            /** Write data to a PTY session stdin. */
            readonly terminal_session_write: (args: z.input<typeof Contract_11.sandboxTerminalSessionWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalSessionWriteContract['outputSchema']>>;
            /** Resize a PTY session window. */
            readonly terminal_session_resize: (args: z.input<typeof Contract_11.sandboxTerminalSessionResizeContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxTerminalSessionResizeContract['outputSchema']>>;
            /** Map a container port to the host or proxy. */
            readonly network_expose: (args: z.input<typeof Contract_11.sandboxNetworkExposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxNetworkExposeContract['outputSchema']>>;
            /** Remove a port mapping. */
            readonly network_unexpose: (args: z.input<typeof Contract_11.sandboxNetworkUnexposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxNetworkUnexposeContract['outputSchema']>>;
            /** List all active exposed ports. */
            readonly network_list: (args: z.input<typeof Contract_11.sandboxNetworkListContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxNetworkListContract['outputSchema']>>;
            /** Toggle external internet access for the sandbox. */
            readonly network_set_policy: (args: z.input<typeof Contract_11.sandboxNetworkSetPolicyContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxNetworkSetPolicyContract['outputSchema']>>;
            /** Set a generic environment variable. */
            readonly env_set: (args: z.input<typeof Contract_11.sandboxEnvSetContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxEnvSetContract['outputSchema']>>;
            /** Set a secret (hidden from logs/telemetry). */
            readonly env_set_secret: (args: z.input<typeof Contract_11.sandboxEnvSetSecretContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxEnvSetSecretContract['outputSchema']>>;
            /** List all non-secret environment variables. */
            readonly env_list: (args: z.input<typeof Contract_11.sandboxEnvListContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxEnvListContract['outputSchema']>>;
            /** Update constraints on the active sandbox. */
            readonly resource_update_limits: (args: z.input<typeof Contract_11.sandboxResourceUpdateLimitsContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxResourceUpdateLimitsContract['outputSchema']>>;
            /** Fetch current CPU/Memory usage metrics. */
            readonly resource_get_stats: (args: z.input<typeof Contract_11.sandboxResourceGetStatsContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxResourceGetStatsContract['outputSchema']>>;
            /** Save current container state as a named image. */
            readonly state_commit: (args: z.input<typeof Contract_11.sandboxStateCommitContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxStateCommitContract['outputSchema']>>;
            /** Create a new sandbox from a saved snapshot. */
            readonly state_clone: (args: z.input<typeof Contract_11.sandboxStateCloneContract['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxStateCloneContract['outputSchema']>>;
            /** CRUD create for sandbox (sandboxCrud) */
            readonly create: (args: z.input<typeof Contract_11.sandboxCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxCrud['create']['outputSchema']>>;
            /** CRUD find for sandbox (sandboxCrud) */
            readonly find: (args: z.input<typeof Contract_11.sandboxCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxCrud['find']['outputSchema']>>;
            /** CRUD findOne for sandbox (sandboxCrud) */
            readonly find_one: (args: z.input<typeof Contract_11.sandboxCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxCrud['findOne']['outputSchema']>>;
            /** CRUD count for sandbox (sandboxCrud) */
            readonly count: (args: z.input<typeof Contract_11.sandboxCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxCrud['count']['outputSchema']>>;
            /** CRUD get for sandbox (sandboxCrud) */
            readonly get: (args: z.input<typeof Contract_11.sandboxCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxCrud['get']['outputSchema']>>;
            /** CRUD update for sandbox (sandboxCrud) */
            readonly update: (args: z.input<typeof Contract_11.sandboxCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxCrud['update']['outputSchema']>>;
            /** CRUD delete for sandbox (sandboxCrud) */
            readonly delete: (args: z.input<typeof Contract_11.sandboxCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_11.sandboxCrud['delete']['outputSchema']>>;
        };
        readonly settings: {
            /** Get a configuration value */
            readonly get: (args: z.input<typeof Contract_12.settingsGetContract['inputSchema']>) => Promise<z.infer<typeof Contract_12.settingsGetContract['outputSchema']>>;
            /** Update a configuration value */
            readonly update: (args: z.input<typeof Contract_12.settingsUpdateContract['inputSchema']>) => Promise<z.infer<typeof Contract_12.settingsUpdateContract['outputSchema']>>;
            /** Get all configuration values */
            readonly getAll: (args: z.input<typeof Contract_12.settingsGetAllContract['inputSchema']>) => Promise<z.infer<typeof Contract_12.settingsGetAllContract['outputSchema']>>;
        };
        readonly system: {
            /** Execute closed-loop evolutionary optimization of agent system prompts utilizing multi-model consensus critiques. */
            readonly genesis: (args: z.input<typeof Contract_13.genesisContract['inputSchema']>) => Promise<z.infer<typeof Contract_13.genesisContract['outputSchema']>>;
            /** Interactively assign tools to agents after the system soul has been generated. */
            readonly bootstrap: (args: z.input<typeof Contract_13.bootstrapContract['inputSchema']>) => Promise<z.infer<typeof Contract_13.bootstrapContract['outputSchema']>>;
            /** Wipe all system data and return to a clean slate. */
            readonly reset: (args: z.input<typeof Contract_13.resetContract['inputSchema']>) => Promise<z.infer<typeof Contract_13.resetContract['outputSchema']>>;
        };
        readonly web: {
            /** Fetch a managed RSS feed and use an internal agent to clean and structure the data. */
            readonly fetch_feed: (args: z.input<typeof Contract_14.webFetchFeedContract['inputSchema']>) => Promise<z.infer<typeof Contract_14.webFetchFeedContract['outputSchema']>>;
            /** Query a private SearXNG instance for real-time web search results. */
            readonly searxng_search: (args: z.input<typeof Contract_14.webSearxngSearchContract['inputSchema']>) => Promise<z.infer<typeof Contract_14.webSearxngSearchContract['outputSchema']>>;
            /** CRUD create for web (rssFeedCrud) */
            readonly create: (args: z.input<typeof Contract_14.rssFeedCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_14.rssFeedCrud['create']['outputSchema']>>;
            /** CRUD find for web (rssFeedCrud) */
            readonly find: (args: z.input<typeof Contract_14.rssFeedCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_14.rssFeedCrud['find']['outputSchema']>>;
            /** CRUD findOne for web (rssFeedCrud) */
            readonly find_one: (args: z.input<typeof Contract_14.rssFeedCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_14.rssFeedCrud['findOne']['outputSchema']>>;
            /** CRUD count for web (rssFeedCrud) */
            readonly count: (args: z.input<typeof Contract_14.rssFeedCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_14.rssFeedCrud['count']['outputSchema']>>;
            /** CRUD get for web (rssFeedCrud) */
            readonly get: (args: z.input<typeof Contract_14.rssFeedCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_14.rssFeedCrud['get']['outputSchema']>>;
            /** CRUD update for web (rssFeedCrud) */
            readonly update: (args: z.input<typeof Contract_14.rssFeedCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_14.rssFeedCrud['update']['outputSchema']>>;
            /** CRUD delete for web (rssFeedCrud) */
            readonly delete: (args: z.input<typeof Contract_14.rssFeedCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_14.rssFeedCrud['delete']['outputSchema']>>;
        };
    }
}

export { ICastellanApi };
