import { z } from 'zod';
import { ICastellanApi } from '../core/api.js';
import * as Contract_0 from '../addons/agents/skills/agent.contract.js';
import * as Contract_1 from '../addons/audit/skills/approval.contract.js';
import * as Contract_2 from '../addons/cron/skills/cron.contract.js';
import * as Contract_3 from '../addons/demo/skills/demo.contract.js';
import * as Contract_4 from '../addons/infer/skills/infer.contract.js';
import * as Contract_5 from '../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_6 from '../addons/notifications/skills/notifications.contract.js';
import * as Contract_7 from '../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_8 from '../addons/settings/skills/settings.contract.js';

declare module '../core/api.js' {
    interface ICastellanApi {
        readonly agent: {
            /** Start an autonomous execution turn for a specific agent. */
            readonly run: (args: z.input<typeof Contract_0.agentRunContract['inputSchema']>) => Promise<z.infer<typeof Contract_0.agentRunContract['outputSchema']>>;
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
        readonly infer: {
            /** Perform stateful chat completion within a thread. */
            readonly chat: (args: z.input<typeof Contract_4.inferChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.inferChatContract['outputSchema']>>;
            /** Approve a pending tool call for execution. */
            readonly approve_tool: (args: z.input<typeof Contract_4.inferApproveToolContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.inferApproveToolContract['outputSchema']>>;
            /** Force a refresh of the model inventory from all registered Ollama instances. */
            readonly refresh_inventory: (args: z.input<typeof Contract_4.inferRefreshInventoryContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.inferRefreshInventoryContract['outputSchema']>>;
            /** Atomically acquire the next available online Ollama instance. */
            readonly acquire_ollama: (args: z.input<typeof Contract_4.inferAcquireOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.inferAcquireOllamaContract['outputSchema']>>;
            /** Release an acquired Ollama instance, decrementing its active request count. */
            readonly release_ollama: (args: z.input<typeof Contract_4.inferReleaseOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.inferReleaseOllamaContract['outputSchema']>>;
        };
        readonly ollama: {
            /** CRUD create for ollama (ollamaCrud) */
            readonly create: (args: z.input<typeof Contract_4.ollamaCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.ollamaCrud['create']['outputSchema']>>;
            /** CRUD find for ollama (ollamaCrud) */
            readonly find: (args: z.input<typeof Contract_4.ollamaCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.ollamaCrud['find']['outputSchema']>>;
            /** CRUD findOne for ollama (ollamaCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.ollamaCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.ollamaCrud['findOne']['outputSchema']>>;
            /** CRUD count for ollama (ollamaCrud) */
            readonly count: (args: z.input<typeof Contract_4.ollamaCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.ollamaCrud['count']['outputSchema']>>;
            /** CRUD get for ollama (ollamaCrud) */
            readonly get: (args: z.input<typeof Contract_4.ollamaCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.ollamaCrud['get']['outputSchema']>>;
            /** CRUD update for ollama (ollamaCrud) */
            readonly update: (args: z.input<typeof Contract_4.ollamaCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.ollamaCrud['update']['outputSchema']>>;
            /** CRUD delete for ollama (ollamaCrud) */
            readonly delete: (args: z.input<typeof Contract_4.ollamaCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.ollamaCrud['delete']['outputSchema']>>;
        };
        readonly models: {
            /** CRUD create for models (modelCrud) */
            readonly create: (args: z.input<typeof Contract_4.modelCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.modelCrud['create']['outputSchema']>>;
            /** CRUD find for models (modelCrud) */
            readonly find: (args: z.input<typeof Contract_4.modelCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.modelCrud['find']['outputSchema']>>;
            /** CRUD findOne for models (modelCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.modelCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.modelCrud['findOne']['outputSchema']>>;
            /** CRUD count for models (modelCrud) */
            readonly count: (args: z.input<typeof Contract_4.modelCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.modelCrud['count']['outputSchema']>>;
            /** CRUD get for models (modelCrud) */
            readonly get: (args: z.input<typeof Contract_4.modelCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.modelCrud['get']['outputSchema']>>;
            /** CRUD update for models (modelCrud) */
            readonly update: (args: z.input<typeof Contract_4.modelCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.modelCrud['update']['outputSchema']>>;
            /** CRUD delete for models (modelCrud) */
            readonly delete: (args: z.input<typeof Contract_4.modelCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.modelCrud['delete']['outputSchema']>>;
        };
        readonly threads: {
            /** CRUD create for threads (threadCrud) */
            readonly create: (args: z.input<typeof Contract_4.threadCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.threadCrud['create']['outputSchema']>>;
            /** CRUD find for threads (threadCrud) */
            readonly find: (args: z.input<typeof Contract_4.threadCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.threadCrud['find']['outputSchema']>>;
            /** CRUD findOne for threads (threadCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.threadCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.threadCrud['findOne']['outputSchema']>>;
            /** CRUD count for threads (threadCrud) */
            readonly count: (args: z.input<typeof Contract_4.threadCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.threadCrud['count']['outputSchema']>>;
            /** CRUD get for threads (threadCrud) */
            readonly get: (args: z.input<typeof Contract_4.threadCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.threadCrud['get']['outputSchema']>>;
            /** CRUD update for threads (threadCrud) */
            readonly update: (args: z.input<typeof Contract_4.threadCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.threadCrud['update']['outputSchema']>>;
            /** CRUD delete for threads (threadCrud) */
            readonly delete: (args: z.input<typeof Contract_4.threadCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.threadCrud['delete']['outputSchema']>>;
        };
        readonly messages: {
            /** CRUD create for messages (messageCrud) */
            readonly create: (args: z.input<typeof Contract_4.messageCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.messageCrud['create']['outputSchema']>>;
            /** CRUD find for messages (messageCrud) */
            readonly find: (args: z.input<typeof Contract_4.messageCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.messageCrud['find']['outputSchema']>>;
            /** CRUD findOne for messages (messageCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.messageCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.messageCrud['findOne']['outputSchema']>>;
            /** CRUD count for messages (messageCrud) */
            readonly count: (args: z.input<typeof Contract_4.messageCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.messageCrud['count']['outputSchema']>>;
            /** CRUD get for messages (messageCrud) */
            readonly get: (args: z.input<typeof Contract_4.messageCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.messageCrud['get']['outputSchema']>>;
            /** CRUD update for messages (messageCrud) */
            readonly update: (args: z.input<typeof Contract_4.messageCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.messageCrud['update']['outputSchema']>>;
            /** CRUD delete for messages (messageCrud) */
            readonly delete: (args: z.input<typeof Contract_4.messageCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.messageCrud['delete']['outputSchema']>>;
        };
        readonly tool_calls: {
            /** CRUD create for tool_calls (toolCallCrud) */
            readonly create: (args: z.input<typeof Contract_4.toolCallCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.toolCallCrud['create']['outputSchema']>>;
            /** CRUD find for tool_calls (toolCallCrud) */
            readonly find: (args: z.input<typeof Contract_4.toolCallCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.toolCallCrud['find']['outputSchema']>>;
            /** CRUD findOne for tool_calls (toolCallCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.toolCallCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.toolCallCrud['findOne']['outputSchema']>>;
            /** CRUD count for tool_calls (toolCallCrud) */
            readonly count: (args: z.input<typeof Contract_4.toolCallCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.toolCallCrud['count']['outputSchema']>>;
            /** CRUD get for tool_calls (toolCallCrud) */
            readonly get: (args: z.input<typeof Contract_4.toolCallCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.toolCallCrud['get']['outputSchema']>>;
            /** CRUD update for tool_calls (toolCallCrud) */
            readonly update: (args: z.input<typeof Contract_4.toolCallCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.toolCallCrud['update']['outputSchema']>>;
            /** CRUD delete for tool_calls (toolCallCrud) */
            readonly delete: (args: z.input<typeof Contract_4.toolCallCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.toolCallCrud['delete']['outputSchema']>>;
        };
        readonly marketplace: {
            /** List available and installed addons */
            readonly list: (args: z.input<typeof Contract_5.marketplaceListContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.marketplaceListContract['outputSchema']>>;
            /** Install an addon */
            readonly install: (args: z.input<typeof Contract_5.marketplaceInstallContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.marketplaceInstallContract['outputSchema']>>;
        };
        readonly notifications: {
            /** Trigger a new system notification */
            readonly send: (args: z.input<typeof Contract_6.notificationsSendContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.notificationsSendContract['outputSchema']>>;
            /** List recent notifications */
            readonly list: (args: z.input<typeof Contract_6.notificationsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.notificationsListContract['outputSchema']>>;
        };
        readonly sandbox: {
            /** Step into a specific sandbox. All subsequent FS and Terminal tools will target this sandbox. */
            readonly set_active: (args: z.input<typeof Contract_7.sandboxSetActiveContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxSetActiveContract['outputSchema']>>;
            /** Clean up stale or stopped sandbox containers running on the Docker host. */
            readonly prune: (args: z.input<typeof Contract_7.sandboxPruneContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxPruneContract['outputSchema']>>;
            /** Read a file from the current sandbox. */
            readonly fs_read: (args: z.input<typeof Contract_7.sandboxFsReadContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxFsReadContract['outputSchema']>>;
            /** Write a file to the current sandbox. */
            readonly fs_write: (args: z.input<typeof Contract_7.sandboxFsWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxFsWriteContract['outputSchema']>>;
            /** List contents of a directory in the current sandbox. */
            readonly fs_list: (args: z.input<typeof Contract_7.sandboxFsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxFsListContract['outputSchema']>>;
            /** Apply targeted changes to a file in the current sandbox. */
            readonly fs_patch: (args: z.input<typeof Contract_7.sandboxFsPatchContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxFsPatchContract['outputSchema']>>;
            /** Remove a file or directory from the current sandbox. */
            readonly fs_remove: (args: z.input<typeof Contract_7.sandboxFsRemoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxFsRemoveContract['outputSchema']>>;
            /** Create a new directory in the current sandbox. */
            readonly fs_mkdir: (args: z.input<typeof Contract_7.sandboxFsMkdirContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxFsMkdirContract['outputSchema']>>;
            /** Move or rename a file/directory in the current sandbox. */
            readonly fs_move: (args: z.input<typeof Contract_7.sandboxFsMoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxFsMoveContract['outputSchema']>>;
            /** Execute a short-lived command in the current sandbox. */
            readonly terminal_execute: (args: z.input<typeof Contract_7.sandboxTerminalExecuteContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalExecuteContract['outputSchema']>>;
            /** Spawn a background service in the current sandbox. */
            readonly terminal_spawn: (args: z.input<typeof Contract_7.sandboxTerminalSpawnContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalSpawnContract['outputSchema']>>;
            /** List all background services running in the current sandbox. */
            readonly terminal_list: (args: z.input<typeof Contract_7.sandboxTerminalListContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalListContract['outputSchema']>>;
            /** Kill a background service in the current sandbox. */
            readonly terminal_kill: (args: z.input<typeof Contract_7.sandboxTerminalKillContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalKillContract['outputSchema']>>;
            /** Get logs for a background service in the current sandbox. */
            readonly terminal_logs: (args: z.input<typeof Contract_7.sandboxTerminalLogsContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalLogsContract['outputSchema']>>;
            /** Open a persistent PTY session (e.g. bash) in the current sandbox. */
            readonly terminal_session_open: (args: z.input<typeof Contract_7.sandboxTerminalSessionOpenContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalSessionOpenContract['outputSchema']>>;
            /** List all active PTY sessions in the current sandbox. */
            readonly terminal_session_list: (args: z.input<typeof Contract_7.sandboxTerminalSessionListContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalSessionListContract['outputSchema']>>;
            /** Write data to a PTY session stdin. */
            readonly terminal_session_write: (args: z.input<typeof Contract_7.sandboxTerminalSessionWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalSessionWriteContract['outputSchema']>>;
            /** Resize a PTY session window. */
            readonly terminal_session_resize: (args: z.input<typeof Contract_7.sandboxTerminalSessionResizeContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxTerminalSessionResizeContract['outputSchema']>>;
            /** Map a container port to the host or proxy. */
            readonly network_expose: (args: z.input<typeof Contract_7.sandboxNetworkExposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxNetworkExposeContract['outputSchema']>>;
            /** Remove a port mapping. */
            readonly network_unexpose: (args: z.input<typeof Contract_7.sandboxNetworkUnexposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxNetworkUnexposeContract['outputSchema']>>;
            /** List all active exposed ports. */
            readonly network_list: (args: z.input<typeof Contract_7.sandboxNetworkListContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxNetworkListContract['outputSchema']>>;
            /** Toggle external internet access for the sandbox. */
            readonly network_set_policy: (args: z.input<typeof Contract_7.sandboxNetworkSetPolicyContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxNetworkSetPolicyContract['outputSchema']>>;
            /** Set a generic environment variable. */
            readonly env_set: (args: z.input<typeof Contract_7.sandboxEnvSetContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxEnvSetContract['outputSchema']>>;
            /** Set a secret (hidden from logs/telemetry). */
            readonly env_set_secret: (args: z.input<typeof Contract_7.sandboxEnvSetSecretContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxEnvSetSecretContract['outputSchema']>>;
            /** List all non-secret environment variables. */
            readonly env_list: (args: z.input<typeof Contract_7.sandboxEnvListContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxEnvListContract['outputSchema']>>;
            /** Update constraints on the active sandbox. */
            readonly resource_update_limits: (args: z.input<typeof Contract_7.sandboxResourceUpdateLimitsContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxResourceUpdateLimitsContract['outputSchema']>>;
            /** Fetch current CPU/Memory usage metrics. */
            readonly resource_get_stats: (args: z.input<typeof Contract_7.sandboxResourceGetStatsContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxResourceGetStatsContract['outputSchema']>>;
            /** Save current container state as a named image. */
            readonly state_commit: (args: z.input<typeof Contract_7.sandboxStateCommitContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxStateCommitContract['outputSchema']>>;
            /** Create a new sandbox from a saved snapshot. */
            readonly state_clone: (args: z.input<typeof Contract_7.sandboxStateCloneContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxStateCloneContract['outputSchema']>>;
            /** CRUD create for sandbox (sandboxCrud) */
            readonly create: (args: z.input<typeof Contract_7.sandboxCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxCrud['create']['outputSchema']>>;
            /** CRUD find for sandbox (sandboxCrud) */
            readonly find: (args: z.input<typeof Contract_7.sandboxCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxCrud['find']['outputSchema']>>;
            /** CRUD findOne for sandbox (sandboxCrud) */
            readonly find_one: (args: z.input<typeof Contract_7.sandboxCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxCrud['findOne']['outputSchema']>>;
            /** CRUD count for sandbox (sandboxCrud) */
            readonly count: (args: z.input<typeof Contract_7.sandboxCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxCrud['count']['outputSchema']>>;
            /** CRUD get for sandbox (sandboxCrud) */
            readonly get: (args: z.input<typeof Contract_7.sandboxCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxCrud['get']['outputSchema']>>;
            /** CRUD update for sandbox (sandboxCrud) */
            readonly update: (args: z.input<typeof Contract_7.sandboxCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxCrud['update']['outputSchema']>>;
            /** CRUD delete for sandbox (sandboxCrud) */
            readonly delete: (args: z.input<typeof Contract_7.sandboxCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_7.sandboxCrud['delete']['outputSchema']>>;
        };
        readonly settings: {
            /** Get a configuration value */
            readonly get: (args: z.input<typeof Contract_8.settingsGetContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.settingsGetContract['outputSchema']>>;
            /** Update a configuration value */
            readonly update: (args: z.input<typeof Contract_8.settingsUpdateContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.settingsUpdateContract['outputSchema']>>;
            /** Get all configuration values */
            readonly getAll: (args: z.input<typeof Contract_8.settingsGetAllContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.settingsGetAllContract['outputSchema']>>;
        };
    }
}

export { ICastellanApi };
