import { z } from 'zod';
import { ICastellanApi } from '../api.js';
import { ISkillContext } from '@castellan/core/index.js';
import { ToolExecutor } from '@castellan/engine/core/ToolExecutor.js';
import * as Contract_0 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_1 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_2 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_3 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_4 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_5 from '../../addons/settings/skills/settings.contract.js';

export class ContextApi implements ICastellanApi {
    constructor(private executor: ToolExecutor<ContextApi>, private context: ISkillContext<ContextApi>) {}

    public readonly demo = {
        hello: (args: z.input<typeof Contract_0.demoHelloContract['inputSchema']>): Promise<z.infer<typeof Contract_0.demoHelloContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoHelloContract['outputSchema']>>('demo', 'hello', args, this.context),
        status: (args: z.input<typeof Contract_0.demoStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_0.demoStatusContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoStatusContract['outputSchema']>>('demo', 'status', args, this.context),
        notify: (args: z.input<typeof Contract_0.demoNotifyContract['inputSchema']>): Promise<z.infer<typeof Contract_0.demoNotifyContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoNotifyContract['outputSchema']>>('demo', 'notify', args, this.context),
        create: (args: z.input<typeof Contract_0.demoCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoCrud['create']['outputSchema']>>('demo', 'create', args, this.context),
        find: (args: z.input<typeof Contract_0.demoCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoCrud['find']['outputSchema']>>('demo', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_0.demoCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoCrud['findOne']['outputSchema']>>('demo', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_0.demoCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoCrud['count']['outputSchema']>>('demo', 'count', args, this.context),
        get: (args: z.input<typeof Contract_0.demoCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoCrud['get']['outputSchema']>>('demo', 'get', args, this.context),
        update: (args: z.input<typeof Contract_0.demoCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoCrud['update']['outputSchema']>>('demo', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_0.demoCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.demoCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_0.demoCrud['delete']['outputSchema']>>('demo', 'delete', args, this.context),
    };
    public readonly infer = {
        chat: (args: z.input<typeof Contract_1.inferChatContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.inferChatContract['outputSchema']>>('infer', 'chat', args, this.context),
        approve_tool: (args: z.input<typeof Contract_1.inferApproveToolContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferApproveToolContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.inferApproveToolContract['outputSchema']>>('infer', 'approve_tool', args, this.context),
        refresh_inventory: (args: z.input<typeof Contract_1.inferRefreshInventoryContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferRefreshInventoryContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.inferRefreshInventoryContract['outputSchema']>>('infer', 'refresh_inventory', args, this.context),
        acquire_ollama: (args: z.input<typeof Contract_1.inferAcquireOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferAcquireOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.inferAcquireOllamaContract['outputSchema']>>('infer', 'acquire_ollama', args, this.context),
        release_ollama: (args: z.input<typeof Contract_1.inferReleaseOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_1.inferReleaseOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.inferReleaseOllamaContract['outputSchema']>>('infer', 'release_ollama', args, this.context),
    };
    public readonly ollama = {
        create: (args: z.input<typeof Contract_1.ollamaCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.ollamaCrud['create']['outputSchema']>>('ollama', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.ollamaCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.ollamaCrud['find']['outputSchema']>>('ollama', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.ollamaCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.ollamaCrud['findOne']['outputSchema']>>('ollama', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.ollamaCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.ollamaCrud['count']['outputSchema']>>('ollama', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.ollamaCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.ollamaCrud['get']['outputSchema']>>('ollama', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.ollamaCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.ollamaCrud['update']['outputSchema']>>('ollama', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.ollamaCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.ollamaCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.ollamaCrud['delete']['outputSchema']>>('ollama', 'delete', args, this.context),
    };
    public readonly models = {
        create: (args: z.input<typeof Contract_1.modelCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.modelCrud['create']['outputSchema']>>('models', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.modelCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.modelCrud['find']['outputSchema']>>('models', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.modelCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.modelCrud['findOne']['outputSchema']>>('models', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.modelCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.modelCrud['count']['outputSchema']>>('models', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.modelCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.modelCrud['get']['outputSchema']>>('models', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.modelCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.modelCrud['update']['outputSchema']>>('models', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.modelCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.modelCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.modelCrud['delete']['outputSchema']>>('models', 'delete', args, this.context),
    };
    public readonly threads = {
        create: (args: z.input<typeof Contract_1.threadCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.threadCrud['create']['outputSchema']>>('threads', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.threadCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.threadCrud['find']['outputSchema']>>('threads', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.threadCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.threadCrud['findOne']['outputSchema']>>('threads', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.threadCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.threadCrud['count']['outputSchema']>>('threads', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.threadCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.threadCrud['get']['outputSchema']>>('threads', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.threadCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.threadCrud['update']['outputSchema']>>('threads', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.threadCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.threadCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.threadCrud['delete']['outputSchema']>>('threads', 'delete', args, this.context),
    };
    public readonly messages = {
        create: (args: z.input<typeof Contract_1.messageCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.messageCrud['create']['outputSchema']>>('messages', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.messageCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.messageCrud['find']['outputSchema']>>('messages', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.messageCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.messageCrud['findOne']['outputSchema']>>('messages', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.messageCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.messageCrud['count']['outputSchema']>>('messages', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.messageCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.messageCrud['get']['outputSchema']>>('messages', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.messageCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.messageCrud['update']['outputSchema']>>('messages', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.messageCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.messageCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.messageCrud['delete']['outputSchema']>>('messages', 'delete', args, this.context),
    };
    public readonly tool_calls = {
        create: (args: z.input<typeof Contract_1.toolCallCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.toolCallCrud['create']['outputSchema']>>('tool_calls', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.toolCallCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.toolCallCrud['find']['outputSchema']>>('tool_calls', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.toolCallCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.toolCallCrud['findOne']['outputSchema']>>('tool_calls', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.toolCallCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.toolCallCrud['count']['outputSchema']>>('tool_calls', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.toolCallCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.toolCallCrud['get']['outputSchema']>>('tool_calls', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.toolCallCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.toolCallCrud['update']['outputSchema']>>('tool_calls', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.toolCallCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.toolCallCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.toolCallCrud['delete']['outputSchema']>>('tool_calls', 'delete', args, this.context),
    };
    public readonly marketplace = {
        list: (args: z.input<typeof Contract_2.marketplaceListContract['inputSchema']>): Promise<z.infer<typeof Contract_2.marketplaceListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.marketplaceListContract['outputSchema']>>('marketplace', 'list', args, this.context),
        install: (args: z.input<typeof Contract_2.marketplaceInstallContract['inputSchema']>): Promise<z.infer<typeof Contract_2.marketplaceInstallContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.marketplaceInstallContract['outputSchema']>>('marketplace', 'install', args, this.context),
    };
    public readonly notifications = {
        send: (args: z.input<typeof Contract_3.notificationsSendContract['inputSchema']>): Promise<z.infer<typeof Contract_3.notificationsSendContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.notificationsSendContract['outputSchema']>>('notifications', 'send', args, this.context),
        list: (args: z.input<typeof Contract_3.notificationsListContract['inputSchema']>): Promise<z.infer<typeof Contract_3.notificationsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.notificationsListContract['outputSchema']>>('notifications', 'list', args, this.context),
    };
    public readonly sandbox = {
        set_active: (args: z.input<typeof Contract_4.sandboxSetActiveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxSetActiveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxSetActiveContract['outputSchema']>>('sandbox', 'set_active', args, this.context),
        prune: (args: z.input<typeof Contract_4.sandboxPruneContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxPruneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxPruneContract['outputSchema']>>('sandbox', 'prune', args, this.context),
        fs_read: (args: z.input<typeof Contract_4.sandboxFsReadContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsReadContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxFsReadContract['outputSchema']>>('sandbox', 'fs_read', args, this.context),
        fs_write: (args: z.input<typeof Contract_4.sandboxFsWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxFsWriteContract['outputSchema']>>('sandbox', 'fs_write', args, this.context),
        fs_list: (args: z.input<typeof Contract_4.sandboxFsListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxFsListContract['outputSchema']>>('sandbox', 'fs_list', args, this.context),
        fs_patch: (args: z.input<typeof Contract_4.sandboxFsPatchContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsPatchContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxFsPatchContract['outputSchema']>>('sandbox', 'fs_patch', args, this.context),
        fs_remove: (args: z.input<typeof Contract_4.sandboxFsRemoveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsRemoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxFsRemoveContract['outputSchema']>>('sandbox', 'fs_remove', args, this.context),
        fs_mkdir: (args: z.input<typeof Contract_4.sandboxFsMkdirContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsMkdirContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxFsMkdirContract['outputSchema']>>('sandbox', 'fs_mkdir', args, this.context),
        fs_move: (args: z.input<typeof Contract_4.sandboxFsMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxFsMoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxFsMoveContract['outputSchema']>>('sandbox', 'fs_move', args, this.context),
        terminal_execute: (args: z.input<typeof Contract_4.sandboxTerminalExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalExecuteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalExecuteContract['outputSchema']>>('sandbox', 'terminal_execute', args, this.context),
        terminal_spawn: (args: z.input<typeof Contract_4.sandboxTerminalSpawnContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSpawnContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalSpawnContract['outputSchema']>>('sandbox', 'terminal_spawn', args, this.context),
        terminal_list: (args: z.input<typeof Contract_4.sandboxTerminalListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalListContract['outputSchema']>>('sandbox', 'terminal_list', args, this.context),
        terminal_kill: (args: z.input<typeof Contract_4.sandboxTerminalKillContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalKillContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalKillContract['outputSchema']>>('sandbox', 'terminal_kill', args, this.context),
        terminal_logs: (args: z.input<typeof Contract_4.sandboxTerminalLogsContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalLogsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalLogsContract['outputSchema']>>('sandbox', 'terminal_logs', args, this.context),
        terminal_session_open: (args: z.input<typeof Contract_4.sandboxTerminalSessionOpenContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionOpenContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalSessionOpenContract['outputSchema']>>('sandbox', 'terminal_session_open', args, this.context),
        terminal_session_list: (args: z.input<typeof Contract_4.sandboxTerminalSessionListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalSessionListContract['outputSchema']>>('sandbox', 'terminal_session_list', args, this.context),
        terminal_session_write: (args: z.input<typeof Contract_4.sandboxTerminalSessionWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalSessionWriteContract['outputSchema']>>('sandbox', 'terminal_session_write', args, this.context),
        terminal_session_resize: (args: z.input<typeof Contract_4.sandboxTerminalSessionResizeContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxTerminalSessionResizeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxTerminalSessionResizeContract['outputSchema']>>('sandbox', 'terminal_session_resize', args, this.context),
        network_expose: (args: z.input<typeof Contract_4.sandboxNetworkExposeContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkExposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxNetworkExposeContract['outputSchema']>>('sandbox', 'network_expose', args, this.context),
        network_unexpose: (args: z.input<typeof Contract_4.sandboxNetworkUnexposeContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkUnexposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxNetworkUnexposeContract['outputSchema']>>('sandbox', 'network_unexpose', args, this.context),
        network_list: (args: z.input<typeof Contract_4.sandboxNetworkListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxNetworkListContract['outputSchema']>>('sandbox', 'network_list', args, this.context),
        network_set_policy: (args: z.input<typeof Contract_4.sandboxNetworkSetPolicyContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxNetworkSetPolicyContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxNetworkSetPolicyContract['outputSchema']>>('sandbox', 'network_set_policy', args, this.context),
        env_set: (args: z.input<typeof Contract_4.sandboxEnvSetContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxEnvSetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxEnvSetContract['outputSchema']>>('sandbox', 'env_set', args, this.context),
        env_set_secret: (args: z.input<typeof Contract_4.sandboxEnvSetSecretContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxEnvSetSecretContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxEnvSetSecretContract['outputSchema']>>('sandbox', 'env_set_secret', args, this.context),
        env_list: (args: z.input<typeof Contract_4.sandboxEnvListContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxEnvListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxEnvListContract['outputSchema']>>('sandbox', 'env_list', args, this.context),
        resource_update_limits: (args: z.input<typeof Contract_4.sandboxResourceUpdateLimitsContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxResourceUpdateLimitsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxResourceUpdateLimitsContract['outputSchema']>>('sandbox', 'resource_update_limits', args, this.context),
        resource_get_stats: (args: z.input<typeof Contract_4.sandboxResourceGetStatsContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxResourceGetStatsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxResourceGetStatsContract['outputSchema']>>('sandbox', 'resource_get_stats', args, this.context),
        state_commit: (args: z.input<typeof Contract_4.sandboxStateCommitContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxStateCommitContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxStateCommitContract['outputSchema']>>('sandbox', 'state_commit', args, this.context),
        state_clone: (args: z.input<typeof Contract_4.sandboxStateCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxStateCloneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxStateCloneContract['outputSchema']>>('sandbox', 'state_clone', args, this.context),
        create: (args: z.input<typeof Contract_4.sandboxCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxCrud['create']['outputSchema']>>('sandbox', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.sandboxCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxCrud['find']['outputSchema']>>('sandbox', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.sandboxCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxCrud['findOne']['outputSchema']>>('sandbox', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.sandboxCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxCrud['count']['outputSchema']>>('sandbox', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.sandboxCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxCrud['get']['outputSchema']>>('sandbox', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.sandboxCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxCrud['update']['outputSchema']>>('sandbox', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.sandboxCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.sandboxCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.sandboxCrud['delete']['outputSchema']>>('sandbox', 'delete', args, this.context),
    };
    public readonly settings = {
        get: (args: z.input<typeof Contract_5.settingsGetContract['inputSchema']>): Promise<z.infer<typeof Contract_5.settingsGetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.settingsGetContract['outputSchema']>>('settings', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.settingsUpdateContract['inputSchema']>): Promise<z.infer<typeof Contract_5.settingsUpdateContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.settingsUpdateContract['outputSchema']>>('settings', 'update', args, this.context),
        getAll: (args: z.input<typeof Contract_5.settingsGetAllContract['inputSchema']>): Promise<z.infer<typeof Contract_5.settingsGetAllContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.settingsGetAllContract['outputSchema']>>('settings', 'getAll', args, this.context),
    };
}
