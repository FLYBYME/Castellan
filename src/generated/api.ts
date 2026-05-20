import { z } from 'zod';
import { ICastellanApi } from '../core/api.js';
import * as Contract_0 from '../addons/demo/skills/demo.contract.js';
import * as Contract_1 from '../addons/infer/skills/infer.contract.js';
import * as Contract_2 from '../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_3 from '../addons/notifications/skills/notifications.contract.js';
import * as Contract_4 from '../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_5 from '../addons/settings/skills/settings.contract.js';

declare module '../core/api.js' {
    interface ICastellanApi {
        readonly demo: {
            /** A simple hello world tool for demonstration. */
            readonly hello: (args: z.input<typeof Contract_0.demoHelloContract['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoHelloContract['outputSchema']>>;
            /** Check the status of the demo environment. */
            readonly status: (args: z.input<typeof Contract_0.demoStatusContract['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoStatusContract['outputSchema']>>;
            /** Send a notification via the system notifications service. */
            readonly notify: (args: z.input<typeof Contract_0.demoNotifyContract['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoNotifyContract['outputSchema']>>;
            /** CRUD create for demo (demoCrud) */
            readonly create: (args: z.input<typeof Contract_0.demoCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoCrud['create']['outputSchema']>>;
            /** CRUD find for demo (demoCrud) */
            readonly find: (args: z.input<typeof Contract_0.demoCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoCrud['find']['outputSchema']>>;
            /** CRUD findOne for demo (demoCrud) */
            readonly find_one: (args: z.input<typeof Contract_0.demoCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoCrud['findOne']['outputSchema']>>;
            /** CRUD count for demo (demoCrud) */
            readonly count: (args: z.input<typeof Contract_0.demoCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoCrud['count']['outputSchema']>>;
            /** CRUD get for demo (demoCrud) */
            readonly get: (args: z.input<typeof Contract_0.demoCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoCrud['get']['outputSchema']>>;
            /** CRUD update for demo (demoCrud) */
            readonly update: (args: z.input<typeof Contract_0.demoCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoCrud['update']['outputSchema']>>;
            /** CRUD delete for demo (demoCrud) */
            readonly delete: (args: z.input<typeof Contract_0.demoCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_0.demoCrud['delete']['outputSchema']>>;
        };
        readonly infer: {
            /** Perform stateful chat completion within a thread. */
            readonly chat: (args: z.input<typeof Contract_1.inferChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.inferChatContract['outputSchema']>>;
            /** Approve a pending tool call for execution. */
            readonly approve_tool: (args: z.input<typeof Contract_1.inferApproveToolContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.inferApproveToolContract['outputSchema']>>;
            /** Force a refresh of the model inventory from all registered Ollama instances. */
            readonly refresh_inventory: (args: z.input<typeof Contract_1.inferRefreshInventoryContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.inferRefreshInventoryContract['outputSchema']>>;
            /** Atomically acquire the next available online Ollama instance. */
            readonly acquire_ollama: (args: z.input<typeof Contract_1.inferAcquireOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.inferAcquireOllamaContract['outputSchema']>>;
            /** Release an acquired Ollama instance, decrementing its active request count. */
            readonly release_ollama: (args: z.input<typeof Contract_1.inferReleaseOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.inferReleaseOllamaContract['outputSchema']>>;
        };
        readonly ollama: {
            /** CRUD create for ollama (ollamaCrud) */
            readonly create: (args: z.input<typeof Contract_1.ollamaCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.ollamaCrud['create']['outputSchema']>>;
            /** CRUD find for ollama (ollamaCrud) */
            readonly find: (args: z.input<typeof Contract_1.ollamaCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.ollamaCrud['find']['outputSchema']>>;
            /** CRUD findOne for ollama (ollamaCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.ollamaCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.ollamaCrud['findOne']['outputSchema']>>;
            /** CRUD count for ollama (ollamaCrud) */
            readonly count: (args: z.input<typeof Contract_1.ollamaCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.ollamaCrud['count']['outputSchema']>>;
            /** CRUD get for ollama (ollamaCrud) */
            readonly get: (args: z.input<typeof Contract_1.ollamaCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.ollamaCrud['get']['outputSchema']>>;
            /** CRUD update for ollama (ollamaCrud) */
            readonly update: (args: z.input<typeof Contract_1.ollamaCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.ollamaCrud['update']['outputSchema']>>;
            /** CRUD delete for ollama (ollamaCrud) */
            readonly delete: (args: z.input<typeof Contract_1.ollamaCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.ollamaCrud['delete']['outputSchema']>>;
        };
        readonly models: {
            /** CRUD create for models (modelCrud) */
            readonly create: (args: z.input<typeof Contract_1.modelCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.modelCrud['create']['outputSchema']>>;
            /** CRUD find for models (modelCrud) */
            readonly find: (args: z.input<typeof Contract_1.modelCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.modelCrud['find']['outputSchema']>>;
            /** CRUD findOne for models (modelCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.modelCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.modelCrud['findOne']['outputSchema']>>;
            /** CRUD count for models (modelCrud) */
            readonly count: (args: z.input<typeof Contract_1.modelCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.modelCrud['count']['outputSchema']>>;
            /** CRUD get for models (modelCrud) */
            readonly get: (args: z.input<typeof Contract_1.modelCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.modelCrud['get']['outputSchema']>>;
            /** CRUD update for models (modelCrud) */
            readonly update: (args: z.input<typeof Contract_1.modelCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.modelCrud['update']['outputSchema']>>;
            /** CRUD delete for models (modelCrud) */
            readonly delete: (args: z.input<typeof Contract_1.modelCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.modelCrud['delete']['outputSchema']>>;
        };
        readonly threads: {
            /** CRUD create for threads (threadCrud) */
            readonly create: (args: z.input<typeof Contract_1.threadCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.threadCrud['create']['outputSchema']>>;
            /** CRUD find for threads (threadCrud) */
            readonly find: (args: z.input<typeof Contract_1.threadCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.threadCrud['find']['outputSchema']>>;
            /** CRUD findOne for threads (threadCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.threadCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.threadCrud['findOne']['outputSchema']>>;
            /** CRUD count for threads (threadCrud) */
            readonly count: (args: z.input<typeof Contract_1.threadCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.threadCrud['count']['outputSchema']>>;
            /** CRUD get for threads (threadCrud) */
            readonly get: (args: z.input<typeof Contract_1.threadCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.threadCrud['get']['outputSchema']>>;
            /** CRUD update for threads (threadCrud) */
            readonly update: (args: z.input<typeof Contract_1.threadCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.threadCrud['update']['outputSchema']>>;
            /** CRUD delete for threads (threadCrud) */
            readonly delete: (args: z.input<typeof Contract_1.threadCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.threadCrud['delete']['outputSchema']>>;
        };
        readonly messages: {
            /** CRUD create for messages (messageCrud) */
            readonly create: (args: z.input<typeof Contract_1.messageCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.messageCrud['create']['outputSchema']>>;
            /** CRUD find for messages (messageCrud) */
            readonly find: (args: z.input<typeof Contract_1.messageCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.messageCrud['find']['outputSchema']>>;
            /** CRUD findOne for messages (messageCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.messageCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.messageCrud['findOne']['outputSchema']>>;
            /** CRUD count for messages (messageCrud) */
            readonly count: (args: z.input<typeof Contract_1.messageCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.messageCrud['count']['outputSchema']>>;
            /** CRUD get for messages (messageCrud) */
            readonly get: (args: z.input<typeof Contract_1.messageCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.messageCrud['get']['outputSchema']>>;
            /** CRUD update for messages (messageCrud) */
            readonly update: (args: z.input<typeof Contract_1.messageCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.messageCrud['update']['outputSchema']>>;
            /** CRUD delete for messages (messageCrud) */
            readonly delete: (args: z.input<typeof Contract_1.messageCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.messageCrud['delete']['outputSchema']>>;
        };
        readonly tool_calls: {
            /** CRUD create for tool_calls (toolCallCrud) */
            readonly create: (args: z.input<typeof Contract_1.toolCallCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.toolCallCrud['create']['outputSchema']>>;
            /** CRUD find for tool_calls (toolCallCrud) */
            readonly find: (args: z.input<typeof Contract_1.toolCallCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.toolCallCrud['find']['outputSchema']>>;
            /** CRUD findOne for tool_calls (toolCallCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.toolCallCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.toolCallCrud['findOne']['outputSchema']>>;
            /** CRUD count for tool_calls (toolCallCrud) */
            readonly count: (args: z.input<typeof Contract_1.toolCallCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.toolCallCrud['count']['outputSchema']>>;
            /** CRUD get for tool_calls (toolCallCrud) */
            readonly get: (args: z.input<typeof Contract_1.toolCallCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.toolCallCrud['get']['outputSchema']>>;
            /** CRUD update for tool_calls (toolCallCrud) */
            readonly update: (args: z.input<typeof Contract_1.toolCallCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.toolCallCrud['update']['outputSchema']>>;
            /** CRUD delete for tool_calls (toolCallCrud) */
            readonly delete: (args: z.input<typeof Contract_1.toolCallCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.toolCallCrud['delete']['outputSchema']>>;
        };
        readonly marketplace: {
            /** List available and installed addons */
            readonly list: (args: z.input<typeof Contract_2.marketplaceListContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.marketplaceListContract['outputSchema']>>;
            /** Install an addon */
            readonly install: (args: z.input<typeof Contract_2.marketplaceInstallContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.marketplaceInstallContract['outputSchema']>>;
        };
        readonly notifications: {
            /** Trigger a new system notification */
            readonly send: (args: z.input<typeof Contract_3.notificationsSendContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.notificationsSendContract['outputSchema']>>;
            /** List recent notifications */
            readonly list: (args: z.input<typeof Contract_3.notificationsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.notificationsListContract['outputSchema']>>;
        };
        readonly sandbox: {
            /** Step into a specific sandbox. All subsequent FS and Terminal tools will target this sandbox. */
            readonly set_active: (args: z.input<typeof Contract_4.sandboxSetActiveContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxSetActiveContract['outputSchema']>>;
            /** Clean up stale or stopped sandbox containers running on the Docker host. */
            readonly prune: (args: z.input<typeof Contract_4.sandboxPruneContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxPruneContract['outputSchema']>>;
            /** Read a file from the current sandbox. */
            readonly fs_read: (args: z.input<typeof Contract_4.sandboxFsReadContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxFsReadContract['outputSchema']>>;
            /** Write a file to the current sandbox. */
            readonly fs_write: (args: z.input<typeof Contract_4.sandboxFsWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxFsWriteContract['outputSchema']>>;
            /** List contents of a directory in the current sandbox. */
            readonly fs_list: (args: z.input<typeof Contract_4.sandboxFsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxFsListContract['outputSchema']>>;
            /** Apply targeted changes to a file in the current sandbox. */
            readonly fs_patch: (args: z.input<typeof Contract_4.sandboxFsPatchContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxFsPatchContract['outputSchema']>>;
            /** Remove a file or directory from the current sandbox. */
            readonly fs_remove: (args: z.input<typeof Contract_4.sandboxFsRemoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxFsRemoveContract['outputSchema']>>;
            /** Create a new directory in the current sandbox. */
            readonly fs_mkdir: (args: z.input<typeof Contract_4.sandboxFsMkdirContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxFsMkdirContract['outputSchema']>>;
            /** Move or rename a file/directory in the current sandbox. */
            readonly fs_move: (args: z.input<typeof Contract_4.sandboxFsMoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxFsMoveContract['outputSchema']>>;
            /** Execute a short-lived command in the current sandbox. */
            readonly terminal_execute: (args: z.input<typeof Contract_4.sandboxTerminalExecuteContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalExecuteContract['outputSchema']>>;
            /** Spawn a background service in the current sandbox. */
            readonly terminal_spawn: (args: z.input<typeof Contract_4.sandboxTerminalSpawnContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalSpawnContract['outputSchema']>>;
            /** List all background services running in the current sandbox. */
            readonly terminal_list: (args: z.input<typeof Contract_4.sandboxTerminalListContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalListContract['outputSchema']>>;
            /** Kill a background service in the current sandbox. */
            readonly terminal_kill: (args: z.input<typeof Contract_4.sandboxTerminalKillContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalKillContract['outputSchema']>>;
            /** Get logs for a background service in the current sandbox. */
            readonly terminal_logs: (args: z.input<typeof Contract_4.sandboxTerminalLogsContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalLogsContract['outputSchema']>>;
            /** Open a persistent PTY session (e.g. bash) in the current sandbox. */
            readonly terminal_session_open: (args: z.input<typeof Contract_4.sandboxTerminalSessionOpenContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalSessionOpenContract['outputSchema']>>;
            /** List all active PTY sessions in the current sandbox. */
            readonly terminal_session_list: (args: z.input<typeof Contract_4.sandboxTerminalSessionListContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalSessionListContract['outputSchema']>>;
            /** Write data to a PTY session stdin. */
            readonly terminal_session_write: (args: z.input<typeof Contract_4.sandboxTerminalSessionWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalSessionWriteContract['outputSchema']>>;
            /** Resize a PTY session window. */
            readonly terminal_session_resize: (args: z.input<typeof Contract_4.sandboxTerminalSessionResizeContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxTerminalSessionResizeContract['outputSchema']>>;
            /** Map a container port to the host or proxy. */
            readonly network_expose: (args: z.input<typeof Contract_4.sandboxNetworkExposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxNetworkExposeContract['outputSchema']>>;
            /** Remove a port mapping. */
            readonly network_unexpose: (args: z.input<typeof Contract_4.sandboxNetworkUnexposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxNetworkUnexposeContract['outputSchema']>>;
            /** List all active exposed ports. */
            readonly network_list: (args: z.input<typeof Contract_4.sandboxNetworkListContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxNetworkListContract['outputSchema']>>;
            /** Toggle external internet access for the sandbox. */
            readonly network_set_policy: (args: z.input<typeof Contract_4.sandboxNetworkSetPolicyContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxNetworkSetPolicyContract['outputSchema']>>;
            /** Set a generic environment variable. */
            readonly env_set: (args: z.input<typeof Contract_4.sandboxEnvSetContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxEnvSetContract['outputSchema']>>;
            /** Set a secret (hidden from logs/telemetry). */
            readonly env_set_secret: (args: z.input<typeof Contract_4.sandboxEnvSetSecretContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxEnvSetSecretContract['outputSchema']>>;
            /** List all non-secret environment variables. */
            readonly env_list: (args: z.input<typeof Contract_4.sandboxEnvListContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxEnvListContract['outputSchema']>>;
            /** Update constraints on the active sandbox. */
            readonly resource_update_limits: (args: z.input<typeof Contract_4.sandboxResourceUpdateLimitsContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxResourceUpdateLimitsContract['outputSchema']>>;
            /** Fetch current CPU/Memory usage metrics. */
            readonly resource_get_stats: (args: z.input<typeof Contract_4.sandboxResourceGetStatsContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxResourceGetStatsContract['outputSchema']>>;
            /** Save current container state as a named image. */
            readonly state_commit: (args: z.input<typeof Contract_4.sandboxStateCommitContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxStateCommitContract['outputSchema']>>;
            /** Create a new sandbox from a saved snapshot. */
            readonly state_clone: (args: z.input<typeof Contract_4.sandboxStateCloneContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxStateCloneContract['outputSchema']>>;
            /** CRUD create for sandbox (sandboxCrud) */
            readonly create: (args: z.input<typeof Contract_4.sandboxCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxCrud['create']['outputSchema']>>;
            /** CRUD find for sandbox (sandboxCrud) */
            readonly find: (args: z.input<typeof Contract_4.sandboxCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxCrud['find']['outputSchema']>>;
            /** CRUD findOne for sandbox (sandboxCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.sandboxCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxCrud['findOne']['outputSchema']>>;
            /** CRUD count for sandbox (sandboxCrud) */
            readonly count: (args: z.input<typeof Contract_4.sandboxCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxCrud['count']['outputSchema']>>;
            /** CRUD get for sandbox (sandboxCrud) */
            readonly get: (args: z.input<typeof Contract_4.sandboxCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxCrud['get']['outputSchema']>>;
            /** CRUD update for sandbox (sandboxCrud) */
            readonly update: (args: z.input<typeof Contract_4.sandboxCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxCrud['update']['outputSchema']>>;
            /** CRUD delete for sandbox (sandboxCrud) */
            readonly delete: (args: z.input<typeof Contract_4.sandboxCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.sandboxCrud['delete']['outputSchema']>>;
        };
        readonly settings: {
            /** Get a configuration value */
            readonly get: (args: z.input<typeof Contract_5.settingsGetContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.settingsGetContract['outputSchema']>>;
            /** Update a configuration value */
            readonly update: (args: z.input<typeof Contract_5.settingsUpdateContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.settingsUpdateContract['outputSchema']>>;
            /** Get all configuration values */
            readonly getAll: (args: z.input<typeof Contract_5.settingsGetAllContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.settingsGetAllContract['outputSchema']>>;
        };
    }
}

export { ICastellanApi };
