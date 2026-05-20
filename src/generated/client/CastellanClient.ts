import { z } from 'zod';
import { BaseClient } from '@castellan/core/index.js';
import * as Contract_0 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_1 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_2 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_3 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_4 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_5 from '../../addons/settings/skills/settings.contract.js';

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

    public readonly api = {
        demo: {
            hello: (args: z.input<typeof Contract_0.demoHelloContract['inputSchema']>): Promise<z.infer<typeof Contract_0.demoHelloContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoHelloContract['outputSchema']>>('demo_hello', args, Contract_0.demoHelloContract.outputSchema),
            status: (args: z.input<typeof Contract_0.demoStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_0.demoStatusContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoStatusContract['outputSchema']>>('demo_status', args, Contract_0.demoStatusContract.outputSchema),
            notify: (args: z.input<typeof Contract_0.demoNotifyContract['inputSchema']>): Promise<z.infer<typeof Contract_0.demoNotifyContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoNotifyContract['outputSchema']>>('demo_notify', args, Contract_0.demoNotifyContract.outputSchema),
            create: (args: z.input<typeof Contract_0.demoCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoCrud['create']['outputSchema']>>('demo_create', args, Contract_0.demoCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_0.demoCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoCrud['find']['outputSchema']>>('demo_find', args, Contract_0.demoCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_0.demoCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoCrud['findOne']['outputSchema']>>('demo_find_one', args, Contract_0.demoCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_0.demoCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoCrud['count']['outputSchema']>>('demo_count', args, Contract_0.demoCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_0.demoCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoCrud['get']['outputSchema']>>('demo_get', args, Contract_0.demoCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_0.demoCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoCrud['update']['outputSchema']>>('demo_update', args, Contract_0.demoCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_0.demoCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.demoCrud['delete']['outputSchema']>>('demo_delete', args, Contract_0.demoCrud['delete'].outputSchema),
        },
        infer: {
            chat: (args: z.input<typeof Contract_1.inferChatContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferChatContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.inferChatContract['outputSchema']>>('infer_chat', args, Contract_1.inferChatContract.outputSchema),
            approve_tool: (args: z.input<typeof Contract_1.inferApproveToolContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferApproveToolContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.inferApproveToolContract['outputSchema']>>('infer_approve_tool', args, Contract_1.inferApproveToolContract.outputSchema),
            refresh_inventory: (args: z.input<typeof Contract_1.inferRefreshInventoryContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferRefreshInventoryContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.inferRefreshInventoryContract['outputSchema']>>('infer_refresh_inventory', args, Contract_1.inferRefreshInventoryContract.outputSchema),
            acquire_ollama: (args: z.input<typeof Contract_1.inferAcquireOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferAcquireOllamaContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.inferAcquireOllamaContract['outputSchema']>>('infer_acquire_ollama', args, Contract_1.inferAcquireOllamaContract.outputSchema),
            release_ollama: (args: z.input<typeof Contract_1.inferReleaseOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferReleaseOllamaContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.inferReleaseOllamaContract['outputSchema']>>('infer_release_ollama', args, Contract_1.inferReleaseOllamaContract.outputSchema),
        },
        ollama: {
            create: (args: z.input<typeof Contract_1.ollamaCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.ollamaCrud['create']['outputSchema']>>('ollama_create', args, Contract_1.ollamaCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.ollamaCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.ollamaCrud['find']['outputSchema']>>('ollama_find', args, Contract_1.ollamaCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.ollamaCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.ollamaCrud['findOne']['outputSchema']>>('ollama_find_one', args, Contract_1.ollamaCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.ollamaCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.ollamaCrud['count']['outputSchema']>>('ollama_count', args, Contract_1.ollamaCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.ollamaCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.ollamaCrud['get']['outputSchema']>>('ollama_get', args, Contract_1.ollamaCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.ollamaCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.ollamaCrud['update']['outputSchema']>>('ollama_update', args, Contract_1.ollamaCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.ollamaCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.ollamaCrud['delete']['outputSchema']>>('ollama_delete', args, Contract_1.ollamaCrud['delete'].outputSchema),
        },
        models: {
            create: (args: z.input<typeof Contract_1.modelCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.modelCrud['create']['outputSchema']>>('models_create', args, Contract_1.modelCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.modelCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.modelCrud['find']['outputSchema']>>('models_find', args, Contract_1.modelCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.modelCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.modelCrud['findOne']['outputSchema']>>('models_find_one', args, Contract_1.modelCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.modelCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.modelCrud['count']['outputSchema']>>('models_count', args, Contract_1.modelCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.modelCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.modelCrud['get']['outputSchema']>>('models_get', args, Contract_1.modelCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.modelCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.modelCrud['update']['outputSchema']>>('models_update', args, Contract_1.modelCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.modelCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.modelCrud['delete']['outputSchema']>>('models_delete', args, Contract_1.modelCrud['delete'].outputSchema),
        },
        threads: {
            create: (args: z.input<typeof Contract_1.threadCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.threadCrud['create']['outputSchema']>>('threads_create', args, Contract_1.threadCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.threadCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.threadCrud['find']['outputSchema']>>('threads_find', args, Contract_1.threadCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.threadCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.threadCrud['findOne']['outputSchema']>>('threads_find_one', args, Contract_1.threadCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.threadCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.threadCrud['count']['outputSchema']>>('threads_count', args, Contract_1.threadCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.threadCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.threadCrud['get']['outputSchema']>>('threads_get', args, Contract_1.threadCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.threadCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.threadCrud['update']['outputSchema']>>('threads_update', args, Contract_1.threadCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.threadCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.threadCrud['delete']['outputSchema']>>('threads_delete', args, Contract_1.threadCrud['delete'].outputSchema),
        },
        messages: {
            create: (args: z.input<typeof Contract_1.messageCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.messageCrud['create']['outputSchema']>>('messages_create', args, Contract_1.messageCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.messageCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.messageCrud['find']['outputSchema']>>('messages_find', args, Contract_1.messageCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.messageCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.messageCrud['findOne']['outputSchema']>>('messages_find_one', args, Contract_1.messageCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.messageCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.messageCrud['count']['outputSchema']>>('messages_count', args, Contract_1.messageCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.messageCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.messageCrud['get']['outputSchema']>>('messages_get', args, Contract_1.messageCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.messageCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.messageCrud['update']['outputSchema']>>('messages_update', args, Contract_1.messageCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.messageCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.messageCrud['delete']['outputSchema']>>('messages_delete', args, Contract_1.messageCrud['delete'].outputSchema),
        },
        tool_calls: {
            create: (args: z.input<typeof Contract_1.toolCallCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.toolCallCrud['create']['outputSchema']>>('tool_calls_create', args, Contract_1.toolCallCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.toolCallCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.toolCallCrud['find']['outputSchema']>>('tool_calls_find', args, Contract_1.toolCallCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.toolCallCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.toolCallCrud['findOne']['outputSchema']>>('tool_calls_find_one', args, Contract_1.toolCallCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.toolCallCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.toolCallCrud['count']['outputSchema']>>('tool_calls_count', args, Contract_1.toolCallCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.toolCallCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.toolCallCrud['get']['outputSchema']>>('tool_calls_get', args, Contract_1.toolCallCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.toolCallCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.toolCallCrud['update']['outputSchema']>>('tool_calls_update', args, Contract_1.toolCallCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.toolCallCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.toolCallCrud['delete']['outputSchema']>>('tool_calls_delete', args, Contract_1.toolCallCrud['delete'].outputSchema),
        },
        marketplace: {
            list: (args: z.input<typeof Contract_2.marketplaceListContract['inputSchema']>): Promise<z.infer<typeof Contract_2.marketplaceListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.marketplaceListContract['outputSchema']>>('marketplace_list', args, Contract_2.marketplaceListContract.outputSchema),
            install: (args: z.input<typeof Contract_2.marketplaceInstallContract['inputSchema']>): Promise<z.infer<typeof Contract_2.marketplaceInstallContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.marketplaceInstallContract['outputSchema']>>('marketplace_install', args, Contract_2.marketplaceInstallContract.outputSchema),
        },
        notifications: {
            send: (args: z.input<typeof Contract_3.notificationsSendContract['inputSchema']>): Promise<z.infer<typeof Contract_3.notificationsSendContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.notificationsSendContract['outputSchema']>>('notifications_send', args, Contract_3.notificationsSendContract.outputSchema),
            list: (args: z.input<typeof Contract_3.notificationsListContract['inputSchema']>): Promise<z.infer<typeof Contract_3.notificationsListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.notificationsListContract['outputSchema']>>('notifications_list', args, Contract_3.notificationsListContract.outputSchema),
        },
        sandbox: {
            set_active: (args: z.input<typeof Contract_4.sandboxSetActiveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxSetActiveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxSetActiveContract['outputSchema']>>('sandbox_set_active', args, Contract_4.sandboxSetActiveContract.outputSchema),
            prune: (args: z.input<typeof Contract_4.sandboxPruneContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxPruneContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxPruneContract['outputSchema']>>('sandbox_prune', args, Contract_4.sandboxPruneContract.outputSchema),
            fs_read: (args: z.input<typeof Contract_4.sandboxFsReadContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsReadContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxFsReadContract['outputSchema']>>('sandbox_fs_read', args, Contract_4.sandboxFsReadContract.outputSchema),
            fs_write: (args: z.input<typeof Contract_4.sandboxFsWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsWriteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxFsWriteContract['outputSchema']>>('sandbox_fs_write', args, Contract_4.sandboxFsWriteContract.outputSchema),
            fs_list: (args: z.input<typeof Contract_4.sandboxFsListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxFsListContract['outputSchema']>>('sandbox_fs_list', args, Contract_4.sandboxFsListContract.outputSchema),
            fs_patch: (args: z.input<typeof Contract_4.sandboxFsPatchContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsPatchContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxFsPatchContract['outputSchema']>>('sandbox_fs_patch', args, Contract_4.sandboxFsPatchContract.outputSchema),
            fs_remove: (args: z.input<typeof Contract_4.sandboxFsRemoveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsRemoveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxFsRemoveContract['outputSchema']>>('sandbox_fs_remove', args, Contract_4.sandboxFsRemoveContract.outputSchema),
            fs_mkdir: (args: z.input<typeof Contract_4.sandboxFsMkdirContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsMkdirContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxFsMkdirContract['outputSchema']>>('sandbox_fs_mkdir', args, Contract_4.sandboxFsMkdirContract.outputSchema),
            fs_move: (args: z.input<typeof Contract_4.sandboxFsMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsMoveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxFsMoveContract['outputSchema']>>('sandbox_fs_move', args, Contract_4.sandboxFsMoveContract.outputSchema),
            terminal_execute: (args: z.input<typeof Contract_4.sandboxTerminalExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalExecuteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalExecuteContract['outputSchema']>>('sandbox_terminal_execute', args, Contract_4.sandboxTerminalExecuteContract.outputSchema),
            terminal_spawn: (args: z.input<typeof Contract_4.sandboxTerminalSpawnContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSpawnContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalSpawnContract['outputSchema']>>('sandbox_terminal_spawn', args, Contract_4.sandboxTerminalSpawnContract.outputSchema),
            terminal_list: (args: z.input<typeof Contract_4.sandboxTerminalListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalListContract['outputSchema']>>('sandbox_terminal_list', args, Contract_4.sandboxTerminalListContract.outputSchema),
            terminal_kill: (args: z.input<typeof Contract_4.sandboxTerminalKillContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalKillContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalKillContract['outputSchema']>>('sandbox_terminal_kill', args, Contract_4.sandboxTerminalKillContract.outputSchema),
            terminal_logs: (args: z.input<typeof Contract_4.sandboxTerminalLogsContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalLogsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalLogsContract['outputSchema']>>('sandbox_terminal_logs', args, Contract_4.sandboxTerminalLogsContract.outputSchema),
            terminal_session_open: (args: z.input<typeof Contract_4.sandboxTerminalSessionOpenContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionOpenContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalSessionOpenContract['outputSchema']>>('sandbox_terminal_session_open', args, Contract_4.sandboxTerminalSessionOpenContract.outputSchema),
            terminal_session_list: (args: z.input<typeof Contract_4.sandboxTerminalSessionListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalSessionListContract['outputSchema']>>('sandbox_terminal_session_list', args, Contract_4.sandboxTerminalSessionListContract.outputSchema),
            terminal_session_write: (args: z.input<typeof Contract_4.sandboxTerminalSessionWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionWriteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalSessionWriteContract['outputSchema']>>('sandbox_terminal_session_write', args, Contract_4.sandboxTerminalSessionWriteContract.outputSchema),
            terminal_session_resize: (args: z.input<typeof Contract_4.sandboxTerminalSessionResizeContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionResizeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxTerminalSessionResizeContract['outputSchema']>>('sandbox_terminal_session_resize', args, Contract_4.sandboxTerminalSessionResizeContract.outputSchema),
            network_expose: (args: z.input<typeof Contract_4.sandboxNetworkExposeContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkExposeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxNetworkExposeContract['outputSchema']>>('sandbox_network_expose', args, Contract_4.sandboxNetworkExposeContract.outputSchema),
            network_unexpose: (args: z.input<typeof Contract_4.sandboxNetworkUnexposeContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkUnexposeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxNetworkUnexposeContract['outputSchema']>>('sandbox_network_unexpose', args, Contract_4.sandboxNetworkUnexposeContract.outputSchema),
            network_list: (args: z.input<typeof Contract_4.sandboxNetworkListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxNetworkListContract['outputSchema']>>('sandbox_network_list', args, Contract_4.sandboxNetworkListContract.outputSchema),
            network_set_policy: (args: z.input<typeof Contract_4.sandboxNetworkSetPolicyContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkSetPolicyContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxNetworkSetPolicyContract['outputSchema']>>('sandbox_network_set_policy', args, Contract_4.sandboxNetworkSetPolicyContract.outputSchema),
            env_set: (args: z.input<typeof Contract_4.sandboxEnvSetContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxEnvSetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxEnvSetContract['outputSchema']>>('sandbox_env_set', args, Contract_4.sandboxEnvSetContract.outputSchema),
            env_set_secret: (args: z.input<typeof Contract_4.sandboxEnvSetSecretContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxEnvSetSecretContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxEnvSetSecretContract['outputSchema']>>('sandbox_env_set_secret', args, Contract_4.sandboxEnvSetSecretContract.outputSchema),
            env_list: (args: z.input<typeof Contract_4.sandboxEnvListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxEnvListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxEnvListContract['outputSchema']>>('sandbox_env_list', args, Contract_4.sandboxEnvListContract.outputSchema),
            resource_update_limits: (args: z.input<typeof Contract_4.sandboxResourceUpdateLimitsContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxResourceUpdateLimitsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxResourceUpdateLimitsContract['outputSchema']>>('sandbox_resource_update_limits', args, Contract_4.sandboxResourceUpdateLimitsContract.outputSchema),
            resource_get_stats: (args: z.input<typeof Contract_4.sandboxResourceGetStatsContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxResourceGetStatsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxResourceGetStatsContract['outputSchema']>>('sandbox_resource_get_stats', args, Contract_4.sandboxResourceGetStatsContract.outputSchema),
            state_commit: (args: z.input<typeof Contract_4.sandboxStateCommitContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxStateCommitContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxStateCommitContract['outputSchema']>>('sandbox_state_commit', args, Contract_4.sandboxStateCommitContract.outputSchema),
            state_clone: (args: z.input<typeof Contract_4.sandboxStateCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxStateCloneContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxStateCloneContract['outputSchema']>>('sandbox_state_clone', args, Contract_4.sandboxStateCloneContract.outputSchema),
            create: (args: z.input<typeof Contract_4.sandboxCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxCrud['create']['outputSchema']>>('sandbox_create', args, Contract_4.sandboxCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.sandboxCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxCrud['find']['outputSchema']>>('sandbox_find', args, Contract_4.sandboxCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.sandboxCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxCrud['findOne']['outputSchema']>>('sandbox_find_one', args, Contract_4.sandboxCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.sandboxCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxCrud['count']['outputSchema']>>('sandbox_count', args, Contract_4.sandboxCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.sandboxCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxCrud['get']['outputSchema']>>('sandbox_get', args, Contract_4.sandboxCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.sandboxCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxCrud['update']['outputSchema']>>('sandbox_update', args, Contract_4.sandboxCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.sandboxCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.sandboxCrud['delete']['outputSchema']>>('sandbox_delete', args, Contract_4.sandboxCrud['delete'].outputSchema),
        },
        settings: {
            get: (args: z.input<typeof Contract_5.settingsGetContract['inputSchema']>): Promise<z.infer<typeof Contract_5.settingsGetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.settingsGetContract['outputSchema']>>('settings_get', args, Contract_5.settingsGetContract.outputSchema),
            update: (args: z.input<typeof Contract_5.settingsUpdateContract['inputSchema']>): Promise<z.infer<typeof Contract_5.settingsUpdateContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.settingsUpdateContract['outputSchema']>>('settings_update', args, Contract_5.settingsUpdateContract.outputSchema),
            getAll: (args: z.input<typeof Contract_5.settingsGetAllContract['inputSchema']>): Promise<z.infer<typeof Contract_5.settingsGetAllContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.settingsGetAllContract['outputSchema']>>('settings_getAll', args, Contract_5.settingsGetAllContract.outputSchema),
        },
    };
}
