import { z } from 'zod';
import { BaseClient } from '@castellan/core/index.js';
import * as Contract_0 from '../../addons/agents/skills/agent.contract.js';
import * as Contract_1 from '../../addons/cron/skills/cron.contract.js';
import * as Contract_2 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_3 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_4 from '../../addons/journal/skills/journal.contract.js';
import * as Contract_5 from '../../addons/kanban/skills/kanban.contract.js';
import * as Contract_6 from '../../addons/manager/skills/manager.contract.js';
import * as Contract_7 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_8 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_9 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_10 from '../../addons/settings/skills/settings.contract.js';

export class CastellanClient extends BaseClient {
    protected async getWebSocket(): Promise<any> {
        const getWsState = (ws: any) => {
            if (!ws) return 3; // CLOSED
            return typeof ws.readyState !== 'undefined' ? ws.readyState : (ws as any).status;
        };
        const state = getWsState(this.socket);
        if (this.socket && state === 1) return this.socket; // 1 = OPEN
        if (this.connectingPromise && (state === 0 || state === 1)) return this.connectingPromise; // 0 = CONNECTING
        
        this.connectingPromise = new Promise(async (resolve, reject) => {
            try {
                const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
                const WS = isNode ? (await import('ws')).default : WebSocket;
                let url = this.serverUrl.replace(/^http/, 'ws');
                if (!url.endsWith('/ws')) url += '/ws';
                if (this.sandboxId) url += `?sandboxId=${this.sandboxId}`;
                const ws = new (WS as any)(url);
                const cleanup = () => { this.connectingPromise = null; };
                let resolved = false;
                const onOpen = () => { resolved = true; this.socket = ws; cleanup(); resolve(ws); };
                const onMessage = (e: any) => this.handleIncomingMessage(isNode ? e : e.data);
                const onError = (e: any) => { cleanup(); reject(e); };
                const onClose = () => { this.socket = null; cleanup(); if (!resolved) reject(new Error('WebSocket closed before connection could be established')); };
                if (isNode) { ws.on('open', onOpen); ws.on('message', onMessage); ws.on('error', onError); ws.on('close', onClose); }
                else { ws.onopen = onOpen; ws.onmessage = onMessage; ws.onerror = onError; ws.onclose = onClose; }
            } catch (err) { this.connectingPromise = null; reject(err); }
        });
        return this.connectingPromise;
    }

    protected send(ws: any, payload: any): void {
        ws.send(JSON.stringify(payload));
    }

    public async connect(): Promise<void> { await this.getWebSocket(); }

    public close(): void { if (this.socket) { (this.socket as any).close(); this.socket = null; } }

    public readonly contracts = {
        agent: {
            run: Contract_0.agentRunContract,
            structured_infer: Contract_0.agentStructuredInferContract,
            create: Contract_0.agentCrud['create'],
            find: Contract_0.agentCrud['find'],
            find_one: Contract_0.agentCrud['findOne'],
            count: Contract_0.agentCrud['count'],
            get: Contract_0.agentCrud['get'],
            update: Contract_0.agentCrud['update'],
            delete: Contract_0.agentCrud['delete'],
        },
        agent_run: {
            create: Contract_0.agentRunCrud['create'],
            find: Contract_0.agentRunCrud['find'],
            find_one: Contract_0.agentRunCrud['findOne'],
            count: Contract_0.agentRunCrud['count'],
            get: Contract_0.agentRunCrud['get'],
            update: Contract_0.agentRunCrud['update'],
            delete: Contract_0.agentRunCrud['delete'],
        },
        cron: {
            trigger: Contract_1.cronTriggerContract,
            reset: Contract_1.cronResetContract,
            status: Contract_1.cronStatusContract,
            create: Contract_1.cronJobCrud['create'],
            find: Contract_1.cronJobCrud['find'],
            find_one: Contract_1.cronJobCrud['findOne'],
            count: Contract_1.cronJobCrud['count'],
            get: Contract_1.cronJobCrud['get'],
            update: Contract_1.cronJobCrud['update'],
            delete: Contract_1.cronJobCrud['delete'],
        },
        cron_runs: {
            create: Contract_1.cronJobRunCrud['create'],
            find: Contract_1.cronJobRunCrud['find'],
            find_one: Contract_1.cronJobRunCrud['findOne'],
            count: Contract_1.cronJobRunCrud['count'],
            get: Contract_1.cronJobRunCrud['get'],
            update: Contract_1.cronJobRunCrud['update'],
            delete: Contract_1.cronJobRunCrud['delete'],
        },
        demo: {
            hello: Contract_2.demoHelloContract,
            status: Contract_2.demoStatusContract,
            notify: Contract_2.demoNotifyContract,
            create: Contract_2.demoCrud['create'],
            find: Contract_2.demoCrud['find'],
            find_one: Contract_2.demoCrud['findOne'],
            count: Contract_2.demoCrud['count'],
            get: Contract_2.demoCrud['get'],
            update: Contract_2.demoCrud['update'],
            delete: Contract_2.demoCrud['delete'],
        },
        infer: {
            chat: Contract_3.inferChatContract,
            approve_tool: Contract_3.inferApproveToolContract,
            refresh_inventory: Contract_3.inferRefreshInventoryContract,
            acquire_ollama: Contract_3.inferAcquireOllamaContract,
            release_ollama: Contract_3.inferReleaseOllamaContract,
            structured_chat: Contract_3.inferStructuredChatContract,
            reject_tool: Contract_3.inferRejectToolContract,
        },
        ollama: {
            create: Contract_3.ollamaCrud['create'],
            find: Contract_3.ollamaCrud['find'],
            find_one: Contract_3.ollamaCrud['findOne'],
            count: Contract_3.ollamaCrud['count'],
            get: Contract_3.ollamaCrud['get'],
            update: Contract_3.ollamaCrud['update'],
            delete: Contract_3.ollamaCrud['delete'],
        },
        models: {
            create: Contract_3.modelCrud['create'],
            find: Contract_3.modelCrud['find'],
            find_one: Contract_3.modelCrud['findOne'],
            count: Contract_3.modelCrud['count'],
            get: Contract_3.modelCrud['get'],
            update: Contract_3.modelCrud['update'],
            delete: Contract_3.modelCrud['delete'],
        },
        threads: {
            create: Contract_3.threadCrud['create'],
            find: Contract_3.threadCrud['find'],
            find_one: Contract_3.threadCrud['findOne'],
            count: Contract_3.threadCrud['count'],
            get: Contract_3.threadCrud['get'],
            update: Contract_3.threadCrud['update'],
            delete: Contract_3.threadCrud['delete'],
        },
        messages: {
            create: Contract_3.messageCrud['create'],
            find: Contract_3.messageCrud['find'],
            find_one: Contract_3.messageCrud['findOne'],
            count: Contract_3.messageCrud['count'],
            get: Contract_3.messageCrud['get'],
            update: Contract_3.messageCrud['update'],
            delete: Contract_3.messageCrud['delete'],
        },
        tool_calls: {
            create: Contract_3.toolCallCrud['create'],
            find: Contract_3.toolCallCrud['find'],
            find_one: Contract_3.toolCallCrud['findOne'],
            count: Contract_3.toolCallCrud['count'],
            get: Contract_3.toolCallCrud['get'],
            update: Contract_3.toolCallCrud['update'],
            delete: Contract_3.toolCallCrud['delete'],
        },
        infer_queue: {
            create: Contract_3.inferQueueCrud['create'],
            find: Contract_3.inferQueueCrud['find'],
            find_one: Contract_3.inferQueueCrud['findOne'],
            count: Contract_3.inferQueueCrud['count'],
            get: Contract_3.inferQueueCrud['get'],
            update: Contract_3.inferQueueCrud['update'],
            delete: Contract_3.inferQueueCrud['delete'],
        },
        journal: {
            note: Contract_4.journalNoteContract,
            resolve: Contract_4.journalResolveContract,
            compress: Contract_4.journalCompressContract,
            create: Contract_4.journalCrud['create'],
            find: Contract_4.journalCrud['find'],
            find_one: Contract_4.journalCrud['findOne'],
            count: Contract_4.journalCrud['count'],
            get: Contract_4.journalCrud['get'],
            update: Contract_4.journalCrud['update'],
            delete: Contract_4.journalCrud['delete'],
        },
        directive: {
            create: Contract_4.directiveCrud['create'],
            find: Contract_4.directiveCrud['find'],
            find_one: Contract_4.directiveCrud['findOne'],
            count: Contract_4.directiveCrud['count'],
            get: Contract_4.directiveCrud['get'],
            update: Contract_4.directiveCrud['update'],
            delete: Contract_4.directiveCrud['delete'],
        },
        kanban: {
            move: Contract_5.kanbanMoveContract,
            create: Contract_5.kanbanCrud['create'],
            find: Contract_5.kanbanCrud['find'],
            find_one: Contract_5.kanbanCrud['findOne'],
            count: Contract_5.kanbanCrud['count'],
            get: Contract_5.kanbanCrud['get'],
            update: Contract_5.kanbanCrud['update'],
            delete: Contract_5.kanbanCrud['delete'],
        },
        manager: {
            chat: Contract_6.managerChatContract,
            pulse: Contract_6.managerPulseContract,
            inquire: Contract_6.managerInquireContract,
            execute: Contract_6.managerExecuteContract,
            research: Contract_6.managerResearchContract,
            run: Contract_6.managerRunContract,
            list_tool_errors: Contract_6.managerListToolErrorsContract,
            agent_bootstrap: Contract_6.managerAgentBootstrapContract,
            evaluate_approval: Contract_6.managerEvaluateApprovalContract,
        },
        pulse_report: {
            create: Contract_6.pulseReportCrud['create'],
            find: Contract_6.pulseReportCrud['find'],
            find_one: Contract_6.pulseReportCrud['findOne'],
            count: Contract_6.pulseReportCrud['count'],
            get: Contract_6.pulseReportCrud['get'],
            update: Contract_6.pulseReportCrud['update'],
            delete: Contract_6.pulseReportCrud['delete'],
        },
        marketplace: {
            list: Contract_7.marketplaceListContract,
            install: Contract_7.marketplaceInstallContract,
        },
        notifications: {
            send: Contract_8.notificationsSendContract,
            list: Contract_8.notificationsListContract,
        },
        sandbox: {
            set_active: Contract_9.sandboxSetActiveContract,
            prune: Contract_9.sandboxPruneContract,
            fs_read: Contract_9.sandboxFsReadContract,
            fs_write: Contract_9.sandboxFsWriteContract,
            fs_list: Contract_9.sandboxFsListContract,
            fs_patch: Contract_9.sandboxFsPatchContract,
            fs_remove: Contract_9.sandboxFsRemoveContract,
            fs_mkdir: Contract_9.sandboxFsMkdirContract,
            fs_move: Contract_9.sandboxFsMoveContract,
            terminal_execute: Contract_9.sandboxTerminalExecuteContract,
            terminal_spawn: Contract_9.sandboxTerminalSpawnContract,
            terminal_list: Contract_9.sandboxTerminalListContract,
            terminal_kill: Contract_9.sandboxTerminalKillContract,
            terminal_logs: Contract_9.sandboxTerminalLogsContract,
            terminal_session_open: Contract_9.sandboxTerminalSessionOpenContract,
            terminal_session_list: Contract_9.sandboxTerminalSessionListContract,
            terminal_session_write: Contract_9.sandboxTerminalSessionWriteContract,
            terminal_session_resize: Contract_9.sandboxTerminalSessionResizeContract,
            network_expose: Contract_9.sandboxNetworkExposeContract,
            network_unexpose: Contract_9.sandboxNetworkUnexposeContract,
            network_list: Contract_9.sandboxNetworkListContract,
            network_set_policy: Contract_9.sandboxNetworkSetPolicyContract,
            env_set: Contract_9.sandboxEnvSetContract,
            env_set_secret: Contract_9.sandboxEnvSetSecretContract,
            env_list: Contract_9.sandboxEnvListContract,
            resource_update_limits: Contract_9.sandboxResourceUpdateLimitsContract,
            resource_get_stats: Contract_9.sandboxResourceGetStatsContract,
            state_commit: Contract_9.sandboxStateCommitContract,
            state_clone: Contract_9.sandboxStateCloneContract,
            create: Contract_9.sandboxCrud['create'],
            find: Contract_9.sandboxCrud['find'],
            find_one: Contract_9.sandboxCrud['findOne'],
            count: Contract_9.sandboxCrud['count'],
            get: Contract_9.sandboxCrud['get'],
            update: Contract_9.sandboxCrud['update'],
            delete: Contract_9.sandboxCrud['delete'],
        },
        settings: {
            get: Contract_10.settingsGetContract,
            update: Contract_10.settingsUpdateContract,
            getAll: Contract_10.settingsGetAllContract,
        },
    };

    public readonly api = {
        agent: {
            run: (args: z.input<typeof Contract_0.agentRunContract['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunContract['outputSchema']>>('agent_run', args, Contract_0.agentRunContract.outputSchema),
            structured_infer: (args: z.input<typeof Contract_0.agentStructuredInferContract['inputSchema']>): Promise<z.infer<typeof Contract_0.agentStructuredInferContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentStructuredInferContract['outputSchema']>>('agent_structured_infer', args, Contract_0.agentStructuredInferContract.outputSchema),
            create: (args: z.input<typeof Contract_0.agentCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['create']['outputSchema']>>('agent_create', args, Contract_0.agentCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_0.agentCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['find']['outputSchema']>>('agent_find', args, Contract_0.agentCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_0.agentCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['findOne']['outputSchema']>>('agent_find_one', args, Contract_0.agentCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_0.agentCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['count']['outputSchema']>>('agent_count', args, Contract_0.agentCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_0.agentCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['get']['outputSchema']>>('agent_get', args, Contract_0.agentCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_0.agentCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['update']['outputSchema']>>('agent_update', args, Contract_0.agentCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_0.agentCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['delete']['outputSchema']>>('agent_delete', args, Contract_0.agentCrud['delete'].outputSchema),
        },
        agent_run: {
            create: (args: z.input<typeof Contract_0.agentRunCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['create']['outputSchema']>>('agent_run_create', args, Contract_0.agentRunCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_0.agentRunCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['find']['outputSchema']>>('agent_run_find', args, Contract_0.agentRunCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_0.agentRunCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['findOne']['outputSchema']>>('agent_run_find_one', args, Contract_0.agentRunCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_0.agentRunCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['count']['outputSchema']>>('agent_run_count', args, Contract_0.agentRunCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_0.agentRunCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['get']['outputSchema']>>('agent_run_get', args, Contract_0.agentRunCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_0.agentRunCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['update']['outputSchema']>>('agent_run_update', args, Contract_0.agentRunCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_0.agentRunCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['delete']['outputSchema']>>('agent_run_delete', args, Contract_0.agentRunCrud['delete'].outputSchema),
        },
        cron: {
            trigger: (args: z.input<typeof Contract_1.cronTriggerContract['inputSchema']>): Promise<z.infer<typeof Contract_1.cronTriggerContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronTriggerContract['outputSchema']>>('cron_trigger', args, Contract_1.cronTriggerContract.outputSchema),
            reset: (args: z.input<typeof Contract_1.cronResetContract['inputSchema']>): Promise<z.infer<typeof Contract_1.cronResetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronResetContract['outputSchema']>>('cron_reset', args, Contract_1.cronResetContract.outputSchema),
            status: (args: z.input<typeof Contract_1.cronStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_1.cronStatusContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronStatusContract['outputSchema']>>('cron_status', args, Contract_1.cronStatusContract.outputSchema),
            create: (args: z.input<typeof Contract_1.cronJobCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobCrud['create']['outputSchema']>>('cron_create', args, Contract_1.cronJobCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.cronJobCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobCrud['find']['outputSchema']>>('cron_find', args, Contract_1.cronJobCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.cronJobCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobCrud['findOne']['outputSchema']>>('cron_find_one', args, Contract_1.cronJobCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.cronJobCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobCrud['count']['outputSchema']>>('cron_count', args, Contract_1.cronJobCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.cronJobCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobCrud['get']['outputSchema']>>('cron_get', args, Contract_1.cronJobCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.cronJobCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobCrud['update']['outputSchema']>>('cron_update', args, Contract_1.cronJobCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.cronJobCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobCrud['delete']['outputSchema']>>('cron_delete', args, Contract_1.cronJobCrud['delete'].outputSchema),
        },
        cron_runs: {
            create: (args: z.input<typeof Contract_1.cronJobRunCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobRunCrud['create']['outputSchema']>>('cron_runs_create', args, Contract_1.cronJobRunCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.cronJobRunCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobRunCrud['find']['outputSchema']>>('cron_runs_find', args, Contract_1.cronJobRunCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.cronJobRunCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobRunCrud['findOne']['outputSchema']>>('cron_runs_find_one', args, Contract_1.cronJobRunCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.cronJobRunCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobRunCrud['count']['outputSchema']>>('cron_runs_count', args, Contract_1.cronJobRunCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.cronJobRunCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobRunCrud['get']['outputSchema']>>('cron_runs_get', args, Contract_1.cronJobRunCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.cronJobRunCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobRunCrud['update']['outputSchema']>>('cron_runs_update', args, Contract_1.cronJobRunCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.cronJobRunCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.cronJobRunCrud['delete']['outputSchema']>>('cron_runs_delete', args, Contract_1.cronJobRunCrud['delete'].outputSchema),
        },
        demo: {
            hello: (args: z.input<typeof Contract_2.demoHelloContract['inputSchema']>): Promise<z.infer<typeof Contract_2.demoHelloContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoHelloContract['outputSchema']>>('demo_hello', args, Contract_2.demoHelloContract.outputSchema),
            status: (args: z.input<typeof Contract_2.demoStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_2.demoStatusContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoStatusContract['outputSchema']>>('demo_status', args, Contract_2.demoStatusContract.outputSchema),
            notify: (args: z.input<typeof Contract_2.demoNotifyContract['inputSchema']>): Promise<z.infer<typeof Contract_2.demoNotifyContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoNotifyContract['outputSchema']>>('demo_notify', args, Contract_2.demoNotifyContract.outputSchema),
            create: (args: z.input<typeof Contract_2.demoCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoCrud['create']['outputSchema']>>('demo_create', args, Contract_2.demoCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_2.demoCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoCrud['find']['outputSchema']>>('demo_find', args, Contract_2.demoCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_2.demoCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoCrud['findOne']['outputSchema']>>('demo_find_one', args, Contract_2.demoCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_2.demoCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoCrud['count']['outputSchema']>>('demo_count', args, Contract_2.demoCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_2.demoCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoCrud['get']['outputSchema']>>('demo_get', args, Contract_2.demoCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_2.demoCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoCrud['update']['outputSchema']>>('demo_update', args, Contract_2.demoCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_2.demoCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.demoCrud['delete']['outputSchema']>>('demo_delete', args, Contract_2.demoCrud['delete'].outputSchema),
        },
        infer: {
            chat: (args: z.input<typeof Contract_3.inferChatContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferChatContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferChatContract['outputSchema']>>('infer_chat', args, Contract_3.inferChatContract.outputSchema),
            approve_tool: (args: z.input<typeof Contract_3.inferApproveToolContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferApproveToolContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferApproveToolContract['outputSchema']>>('infer_approve_tool', args, Contract_3.inferApproveToolContract.outputSchema),
            refresh_inventory: (args: z.input<typeof Contract_3.inferRefreshInventoryContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferRefreshInventoryContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferRefreshInventoryContract['outputSchema']>>('infer_refresh_inventory', args, Contract_3.inferRefreshInventoryContract.outputSchema),
            acquire_ollama: (args: z.input<typeof Contract_3.inferAcquireOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferAcquireOllamaContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferAcquireOllamaContract['outputSchema']>>('infer_acquire_ollama', args, Contract_3.inferAcquireOllamaContract.outputSchema),
            release_ollama: (args: z.input<typeof Contract_3.inferReleaseOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferReleaseOllamaContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferReleaseOllamaContract['outputSchema']>>('infer_release_ollama', args, Contract_3.inferReleaseOllamaContract.outputSchema),
            structured_chat: (args: z.input<typeof Contract_3.inferStructuredChatContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferStructuredChatContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferStructuredChatContract['outputSchema']>>('infer_structured_chat', args, Contract_3.inferStructuredChatContract.outputSchema),
            reject_tool: (args: z.input<typeof Contract_3.inferRejectToolContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferRejectToolContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferRejectToolContract['outputSchema']>>('infer_reject_tool', args, Contract_3.inferRejectToolContract.outputSchema),
        },
        ollama: {
            create: (args: z.input<typeof Contract_3.ollamaCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.ollamaCrud['create']['outputSchema']>>('ollama_create', args, Contract_3.ollamaCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_3.ollamaCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.ollamaCrud['find']['outputSchema']>>('ollama_find', args, Contract_3.ollamaCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_3.ollamaCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.ollamaCrud['findOne']['outputSchema']>>('ollama_find_one', args, Contract_3.ollamaCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_3.ollamaCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.ollamaCrud['count']['outputSchema']>>('ollama_count', args, Contract_3.ollamaCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_3.ollamaCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.ollamaCrud['get']['outputSchema']>>('ollama_get', args, Contract_3.ollamaCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_3.ollamaCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.ollamaCrud['update']['outputSchema']>>('ollama_update', args, Contract_3.ollamaCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_3.ollamaCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.ollamaCrud['delete']['outputSchema']>>('ollama_delete', args, Contract_3.ollamaCrud['delete'].outputSchema),
        },
        models: {
            create: (args: z.input<typeof Contract_3.modelCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.modelCrud['create']['outputSchema']>>('models_create', args, Contract_3.modelCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_3.modelCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.modelCrud['find']['outputSchema']>>('models_find', args, Contract_3.modelCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_3.modelCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.modelCrud['findOne']['outputSchema']>>('models_find_one', args, Contract_3.modelCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_3.modelCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.modelCrud['count']['outputSchema']>>('models_count', args, Contract_3.modelCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_3.modelCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.modelCrud['get']['outputSchema']>>('models_get', args, Contract_3.modelCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_3.modelCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.modelCrud['update']['outputSchema']>>('models_update', args, Contract_3.modelCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_3.modelCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.modelCrud['delete']['outputSchema']>>('models_delete', args, Contract_3.modelCrud['delete'].outputSchema),
        },
        threads: {
            create: (args: z.input<typeof Contract_3.threadCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.threadCrud['create']['outputSchema']>>('threads_create', args, Contract_3.threadCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_3.threadCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.threadCrud['find']['outputSchema']>>('threads_find', args, Contract_3.threadCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_3.threadCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.threadCrud['findOne']['outputSchema']>>('threads_find_one', args, Contract_3.threadCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_3.threadCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.threadCrud['count']['outputSchema']>>('threads_count', args, Contract_3.threadCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_3.threadCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.threadCrud['get']['outputSchema']>>('threads_get', args, Contract_3.threadCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_3.threadCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.threadCrud['update']['outputSchema']>>('threads_update', args, Contract_3.threadCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_3.threadCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.threadCrud['delete']['outputSchema']>>('threads_delete', args, Contract_3.threadCrud['delete'].outputSchema),
        },
        messages: {
            create: (args: z.input<typeof Contract_3.messageCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.messageCrud['create']['outputSchema']>>('messages_create', args, Contract_3.messageCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_3.messageCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.messageCrud['find']['outputSchema']>>('messages_find', args, Contract_3.messageCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_3.messageCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.messageCrud['findOne']['outputSchema']>>('messages_find_one', args, Contract_3.messageCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_3.messageCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.messageCrud['count']['outputSchema']>>('messages_count', args, Contract_3.messageCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_3.messageCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.messageCrud['get']['outputSchema']>>('messages_get', args, Contract_3.messageCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_3.messageCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.messageCrud['update']['outputSchema']>>('messages_update', args, Contract_3.messageCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_3.messageCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.messageCrud['delete']['outputSchema']>>('messages_delete', args, Contract_3.messageCrud['delete'].outputSchema),
        },
        tool_calls: {
            create: (args: z.input<typeof Contract_3.toolCallCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.toolCallCrud['create']['outputSchema']>>('tool_calls_create', args, Contract_3.toolCallCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_3.toolCallCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.toolCallCrud['find']['outputSchema']>>('tool_calls_find', args, Contract_3.toolCallCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_3.toolCallCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.toolCallCrud['findOne']['outputSchema']>>('tool_calls_find_one', args, Contract_3.toolCallCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_3.toolCallCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.toolCallCrud['count']['outputSchema']>>('tool_calls_count', args, Contract_3.toolCallCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_3.toolCallCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.toolCallCrud['get']['outputSchema']>>('tool_calls_get', args, Contract_3.toolCallCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_3.toolCallCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.toolCallCrud['update']['outputSchema']>>('tool_calls_update', args, Contract_3.toolCallCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_3.toolCallCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.toolCallCrud['delete']['outputSchema']>>('tool_calls_delete', args, Contract_3.toolCallCrud['delete'].outputSchema),
        },
        infer_queue: {
            create: (args: z.input<typeof Contract_3.inferQueueCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferQueueCrud['create']['outputSchema']>>('infer_queue_create', args, Contract_3.inferQueueCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_3.inferQueueCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferQueueCrud['find']['outputSchema']>>('infer_queue_find', args, Contract_3.inferQueueCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_3.inferQueueCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferQueueCrud['findOne']['outputSchema']>>('infer_queue_find_one', args, Contract_3.inferQueueCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_3.inferQueueCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferQueueCrud['count']['outputSchema']>>('infer_queue_count', args, Contract_3.inferQueueCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_3.inferQueueCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferQueueCrud['get']['outputSchema']>>('infer_queue_get', args, Contract_3.inferQueueCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_3.inferQueueCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferQueueCrud['update']['outputSchema']>>('infer_queue_update', args, Contract_3.inferQueueCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_3.inferQueueCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.inferQueueCrud['delete']['outputSchema']>>('infer_queue_delete', args, Contract_3.inferQueueCrud['delete'].outputSchema),
        },
        journal: {
            note: (args: z.input<typeof Contract_4.journalNoteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.journalNoteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalNoteContract['outputSchema']>>('journal_note', args, Contract_4.journalNoteContract.outputSchema),
            resolve: (args: z.input<typeof Contract_4.journalResolveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.journalResolveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalResolveContract['outputSchema']>>('journal_resolve', args, Contract_4.journalResolveContract.outputSchema),
            compress: (args: z.input<typeof Contract_4.journalCompressContract['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCompressContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCompressContract['outputSchema']>>('journal_compress', args, Contract_4.journalCompressContract.outputSchema),
            create: (args: z.input<typeof Contract_4.journalCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCrud['create']['outputSchema']>>('journal_create', args, Contract_4.journalCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.journalCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCrud['find']['outputSchema']>>('journal_find', args, Contract_4.journalCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.journalCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCrud['findOne']['outputSchema']>>('journal_find_one', args, Contract_4.journalCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.journalCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCrud['count']['outputSchema']>>('journal_count', args, Contract_4.journalCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.journalCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCrud['get']['outputSchema']>>('journal_get', args, Contract_4.journalCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.journalCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCrud['update']['outputSchema']>>('journal_update', args, Contract_4.journalCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.journalCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.journalCrud['delete']['outputSchema']>>('journal_delete', args, Contract_4.journalCrud['delete'].outputSchema),
        },
        directive: {
            create: (args: z.input<typeof Contract_4.directiveCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.directiveCrud['create']['outputSchema']>>('directive_create', args, Contract_4.directiveCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.directiveCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.directiveCrud['find']['outputSchema']>>('directive_find', args, Contract_4.directiveCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.directiveCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.directiveCrud['findOne']['outputSchema']>>('directive_find_one', args, Contract_4.directiveCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.directiveCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.directiveCrud['count']['outputSchema']>>('directive_count', args, Contract_4.directiveCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.directiveCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.directiveCrud['get']['outputSchema']>>('directive_get', args, Contract_4.directiveCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.directiveCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.directiveCrud['update']['outputSchema']>>('directive_update', args, Contract_4.directiveCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.directiveCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.directiveCrud['delete']['outputSchema']>>('directive_delete', args, Contract_4.directiveCrud['delete'].outputSchema),
        },
        kanban: {
            move: (args: z.input<typeof Contract_5.kanbanMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanMoveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanMoveContract['outputSchema']>>('kanban_move', args, Contract_5.kanbanMoveContract.outputSchema),
            create: (args: z.input<typeof Contract_5.kanbanCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanCrud['create']['outputSchema']>>('kanban_create', args, Contract_5.kanbanCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_5.kanbanCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanCrud['find']['outputSchema']>>('kanban_find', args, Contract_5.kanbanCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_5.kanbanCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanCrud['findOne']['outputSchema']>>('kanban_find_one', args, Contract_5.kanbanCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_5.kanbanCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanCrud['count']['outputSchema']>>('kanban_count', args, Contract_5.kanbanCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_5.kanbanCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanCrud['get']['outputSchema']>>('kanban_get', args, Contract_5.kanbanCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_5.kanbanCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanCrud['update']['outputSchema']>>('kanban_update', args, Contract_5.kanbanCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_5.kanbanCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.kanbanCrud['delete']['outputSchema']>>('kanban_delete', args, Contract_5.kanbanCrud['delete'].outputSchema),
        },
        manager: {
            chat: (args: z.input<typeof Contract_6.managerChatContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerChatContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerChatContract['outputSchema']>>('manager_chat', args, Contract_6.managerChatContract.outputSchema),
            pulse: (args: z.input<typeof Contract_6.managerPulseContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerPulseContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerPulseContract['outputSchema']>>('manager_pulse', args, Contract_6.managerPulseContract.outputSchema),
            inquire: (args: z.input<typeof Contract_6.managerInquireContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerInquireContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerInquireContract['outputSchema']>>('manager_inquire', args, Contract_6.managerInquireContract.outputSchema),
            execute: (args: z.input<typeof Contract_6.managerExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerExecuteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerExecuteContract['outputSchema']>>('manager_execute', args, Contract_6.managerExecuteContract.outputSchema),
            research: (args: z.input<typeof Contract_6.managerResearchContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerResearchContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerResearchContract['outputSchema']>>('manager_research', args, Contract_6.managerResearchContract.outputSchema),
            run: (args: z.input<typeof Contract_6.managerRunContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerRunContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerRunContract['outputSchema']>>('manager_run', args, Contract_6.managerRunContract.outputSchema),
            list_tool_errors: (args: z.input<typeof Contract_6.managerListToolErrorsContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerListToolErrorsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerListToolErrorsContract['outputSchema']>>('manager_list_tool_errors', args, Contract_6.managerListToolErrorsContract.outputSchema),
            agent_bootstrap: (args: z.input<typeof Contract_6.managerAgentBootstrapContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerAgentBootstrapContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerAgentBootstrapContract['outputSchema']>>('manager_agent_bootstrap', args, Contract_6.managerAgentBootstrapContract.outputSchema),
            evaluate_approval: (args: z.input<typeof Contract_6.managerEvaluateApprovalContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerEvaluateApprovalContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.managerEvaluateApprovalContract['outputSchema']>>('manager_evaluate_approval', args, Contract_6.managerEvaluateApprovalContract.outputSchema),
        },
        pulse_report: {
            create: (args: z.input<typeof Contract_6.pulseReportCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.pulseReportCrud['create']['outputSchema']>>('pulse_report_create', args, Contract_6.pulseReportCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_6.pulseReportCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.pulseReportCrud['find']['outputSchema']>>('pulse_report_find', args, Contract_6.pulseReportCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_6.pulseReportCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.pulseReportCrud['findOne']['outputSchema']>>('pulse_report_find_one', args, Contract_6.pulseReportCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_6.pulseReportCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.pulseReportCrud['count']['outputSchema']>>('pulse_report_count', args, Contract_6.pulseReportCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_6.pulseReportCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.pulseReportCrud['get']['outputSchema']>>('pulse_report_get', args, Contract_6.pulseReportCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_6.pulseReportCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.pulseReportCrud['update']['outputSchema']>>('pulse_report_update', args, Contract_6.pulseReportCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_6.pulseReportCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.pulseReportCrud['delete']['outputSchema']>>('pulse_report_delete', args, Contract_6.pulseReportCrud['delete'].outputSchema),
        },
        marketplace: {
            list: (args: z.input<typeof Contract_7.marketplaceListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.marketplaceListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.marketplaceListContract['outputSchema']>>('marketplace_list', args, Contract_7.marketplaceListContract.outputSchema),
            install: (args: z.input<typeof Contract_7.marketplaceInstallContract['inputSchema']>): Promise<z.infer<typeof Contract_7.marketplaceInstallContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.marketplaceInstallContract['outputSchema']>>('marketplace_install', args, Contract_7.marketplaceInstallContract.outputSchema),
        },
        notifications: {
            send: (args: z.input<typeof Contract_8.notificationsSendContract['inputSchema']>): Promise<z.infer<typeof Contract_8.notificationsSendContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_8.notificationsSendContract['outputSchema']>>('notifications_send', args, Contract_8.notificationsSendContract.outputSchema),
            list: (args: z.input<typeof Contract_8.notificationsListContract['inputSchema']>): Promise<z.infer<typeof Contract_8.notificationsListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_8.notificationsListContract['outputSchema']>>('notifications_list', args, Contract_8.notificationsListContract.outputSchema),
        },
        sandbox: {
            set_active: (args: z.input<typeof Contract_9.sandboxSetActiveContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxSetActiveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxSetActiveContract['outputSchema']>>('sandbox_set_active', args, Contract_9.sandboxSetActiveContract.outputSchema),
            prune: (args: z.input<typeof Contract_9.sandboxPruneContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxPruneContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxPruneContract['outputSchema']>>('sandbox_prune', args, Contract_9.sandboxPruneContract.outputSchema),
            fs_read: (args: z.input<typeof Contract_9.sandboxFsReadContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsReadContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxFsReadContract['outputSchema']>>('sandbox_fs_read', args, Contract_9.sandboxFsReadContract.outputSchema),
            fs_write: (args: z.input<typeof Contract_9.sandboxFsWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsWriteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxFsWriteContract['outputSchema']>>('sandbox_fs_write', args, Contract_9.sandboxFsWriteContract.outputSchema),
            fs_list: (args: z.input<typeof Contract_9.sandboxFsListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxFsListContract['outputSchema']>>('sandbox_fs_list', args, Contract_9.sandboxFsListContract.outputSchema),
            fs_patch: (args: z.input<typeof Contract_9.sandboxFsPatchContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsPatchContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxFsPatchContract['outputSchema']>>('sandbox_fs_patch', args, Contract_9.sandboxFsPatchContract.outputSchema),
            fs_remove: (args: z.input<typeof Contract_9.sandboxFsRemoveContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsRemoveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxFsRemoveContract['outputSchema']>>('sandbox_fs_remove', args, Contract_9.sandboxFsRemoveContract.outputSchema),
            fs_mkdir: (args: z.input<typeof Contract_9.sandboxFsMkdirContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsMkdirContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxFsMkdirContract['outputSchema']>>('sandbox_fs_mkdir', args, Contract_9.sandboxFsMkdirContract.outputSchema),
            fs_move: (args: z.input<typeof Contract_9.sandboxFsMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsMoveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxFsMoveContract['outputSchema']>>('sandbox_fs_move', args, Contract_9.sandboxFsMoveContract.outputSchema),
            terminal_execute: (args: z.input<typeof Contract_9.sandboxTerminalExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalExecuteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalExecuteContract['outputSchema']>>('sandbox_terminal_execute', args, Contract_9.sandboxTerminalExecuteContract.outputSchema),
            terminal_spawn: (args: z.input<typeof Contract_9.sandboxTerminalSpawnContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSpawnContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalSpawnContract['outputSchema']>>('sandbox_terminal_spawn', args, Contract_9.sandboxTerminalSpawnContract.outputSchema),
            terminal_list: (args: z.input<typeof Contract_9.sandboxTerminalListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalListContract['outputSchema']>>('sandbox_terminal_list', args, Contract_9.sandboxTerminalListContract.outputSchema),
            terminal_kill: (args: z.input<typeof Contract_9.sandboxTerminalKillContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalKillContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalKillContract['outputSchema']>>('sandbox_terminal_kill', args, Contract_9.sandboxTerminalKillContract.outputSchema),
            terminal_logs: (args: z.input<typeof Contract_9.sandboxTerminalLogsContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalLogsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalLogsContract['outputSchema']>>('sandbox_terminal_logs', args, Contract_9.sandboxTerminalLogsContract.outputSchema),
            terminal_session_open: (args: z.input<typeof Contract_9.sandboxTerminalSessionOpenContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionOpenContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalSessionOpenContract['outputSchema']>>('sandbox_terminal_session_open', args, Contract_9.sandboxTerminalSessionOpenContract.outputSchema),
            terminal_session_list: (args: z.input<typeof Contract_9.sandboxTerminalSessionListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalSessionListContract['outputSchema']>>('sandbox_terminal_session_list', args, Contract_9.sandboxTerminalSessionListContract.outputSchema),
            terminal_session_write: (args: z.input<typeof Contract_9.sandboxTerminalSessionWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionWriteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalSessionWriteContract['outputSchema']>>('sandbox_terminal_session_write', args, Contract_9.sandboxTerminalSessionWriteContract.outputSchema),
            terminal_session_resize: (args: z.input<typeof Contract_9.sandboxTerminalSessionResizeContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionResizeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxTerminalSessionResizeContract['outputSchema']>>('sandbox_terminal_session_resize', args, Contract_9.sandboxTerminalSessionResizeContract.outputSchema),
            network_expose: (args: z.input<typeof Contract_9.sandboxNetworkExposeContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkExposeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxNetworkExposeContract['outputSchema']>>('sandbox_network_expose', args, Contract_9.sandboxNetworkExposeContract.outputSchema),
            network_unexpose: (args: z.input<typeof Contract_9.sandboxNetworkUnexposeContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkUnexposeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxNetworkUnexposeContract['outputSchema']>>('sandbox_network_unexpose', args, Contract_9.sandboxNetworkUnexposeContract.outputSchema),
            network_list: (args: z.input<typeof Contract_9.sandboxNetworkListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxNetworkListContract['outputSchema']>>('sandbox_network_list', args, Contract_9.sandboxNetworkListContract.outputSchema),
            network_set_policy: (args: z.input<typeof Contract_9.sandboxNetworkSetPolicyContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkSetPolicyContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxNetworkSetPolicyContract['outputSchema']>>('sandbox_network_set_policy', args, Contract_9.sandboxNetworkSetPolicyContract.outputSchema),
            env_set: (args: z.input<typeof Contract_9.sandboxEnvSetContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxEnvSetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxEnvSetContract['outputSchema']>>('sandbox_env_set', args, Contract_9.sandboxEnvSetContract.outputSchema),
            env_set_secret: (args: z.input<typeof Contract_9.sandboxEnvSetSecretContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxEnvSetSecretContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxEnvSetSecretContract['outputSchema']>>('sandbox_env_set_secret', args, Contract_9.sandboxEnvSetSecretContract.outputSchema),
            env_list: (args: z.input<typeof Contract_9.sandboxEnvListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxEnvListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxEnvListContract['outputSchema']>>('sandbox_env_list', args, Contract_9.sandboxEnvListContract.outputSchema),
            resource_update_limits: (args: z.input<typeof Contract_9.sandboxResourceUpdateLimitsContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxResourceUpdateLimitsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxResourceUpdateLimitsContract['outputSchema']>>('sandbox_resource_update_limits', args, Contract_9.sandboxResourceUpdateLimitsContract.outputSchema),
            resource_get_stats: (args: z.input<typeof Contract_9.sandboxResourceGetStatsContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxResourceGetStatsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxResourceGetStatsContract['outputSchema']>>('sandbox_resource_get_stats', args, Contract_9.sandboxResourceGetStatsContract.outputSchema),
            state_commit: (args: z.input<typeof Contract_9.sandboxStateCommitContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxStateCommitContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxStateCommitContract['outputSchema']>>('sandbox_state_commit', args, Contract_9.sandboxStateCommitContract.outputSchema),
            state_clone: (args: z.input<typeof Contract_9.sandboxStateCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxStateCloneContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxStateCloneContract['outputSchema']>>('sandbox_state_clone', args, Contract_9.sandboxStateCloneContract.outputSchema),
            create: (args: z.input<typeof Contract_9.sandboxCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxCrud['create']['outputSchema']>>('sandbox_create', args, Contract_9.sandboxCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_9.sandboxCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxCrud['find']['outputSchema']>>('sandbox_find', args, Contract_9.sandboxCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_9.sandboxCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxCrud['findOne']['outputSchema']>>('sandbox_find_one', args, Contract_9.sandboxCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_9.sandboxCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxCrud['count']['outputSchema']>>('sandbox_count', args, Contract_9.sandboxCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_9.sandboxCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxCrud['get']['outputSchema']>>('sandbox_get', args, Contract_9.sandboxCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_9.sandboxCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxCrud['update']['outputSchema']>>('sandbox_update', args, Contract_9.sandboxCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_9.sandboxCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_9.sandboxCrud['delete']['outputSchema']>>('sandbox_delete', args, Contract_9.sandboxCrud['delete'].outputSchema),
        },
        settings: {
            get: (args: z.input<typeof Contract_10.settingsGetContract['inputSchema']>): Promise<z.infer<typeof Contract_10.settingsGetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_10.settingsGetContract['outputSchema']>>('settings_get', args, Contract_10.settingsGetContract.outputSchema),
            update: (args: z.input<typeof Contract_10.settingsUpdateContract['inputSchema']>): Promise<z.infer<typeof Contract_10.settingsUpdateContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_10.settingsUpdateContract['outputSchema']>>('settings_update', args, Contract_10.settingsUpdateContract.outputSchema),
            getAll: (args: z.input<typeof Contract_10.settingsGetAllContract['inputSchema']>): Promise<z.infer<typeof Contract_10.settingsGetAllContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_10.settingsGetAllContract['outputSchema']>>('settings_getAll', args, Contract_10.settingsGetAllContract.outputSchema),
        },
    };
}
