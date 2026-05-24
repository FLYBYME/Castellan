import { z } from 'zod';
import { ICastellanApi } from '@flybyme/castellan/core';
import * as Contract_0 from '@flybyme/castellan/addons/agents/skills/agent.contract.js';
import * as Contract_1 from '@flybyme/castellan/addons/cron/skills/cron.contract.js';
import * as Contract_2 from '@flybyme/castellan/addons/demo/skills/demo.contract.js';
import * as Contract_3 from '@flybyme/castellan/addons/infer/skills/infer.contract.js';
import * as Contract_4 from '@flybyme/castellan/addons/journal/skills/journal.contract.js';
import * as Contract_5 from '@flybyme/castellan/addons/kanban/skills/kanban.contract.js';
import * as Contract_6 from '@flybyme/castellan/addons/manager/skills/manager.contract.js';
import * as Contract_7 from '@flybyme/castellan/addons/marketplace/skills/marketplace.contract.js';
import * as Contract_8 from '@flybyme/castellan/addons/notifications/skills/notifications.contract.js';
import * as Contract_9 from '@flybyme/castellan/addons/sandbox/skills/sandbox.contract.js';
import * as Contract_10 from '@flybyme/castellan/addons/settings/skills/settings.contract.js';

declare module '@flybyme/castellan/core' {
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
        readonly cron: {
            /** Manually trigger a scheduled cron job to run as soon as possible. */
            readonly trigger: (args: z.input<typeof Contract_1.cronTriggerContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronTriggerContract['outputSchema']>>;
            /** Reset a stuck or running cron job to queued state so it can be picked up by the scheduler again. */
            readonly reset: (args: z.input<typeof Contract_1.cronResetContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronResetContract['outputSchema']>>;
            /** Get a summary of the cron scheduler status, including running jobs and queue depth. */
            readonly status: (args: z.input<typeof Contract_1.cronStatusContract['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronStatusContract['outputSchema']>>;
            /** CRUD create for cron (cronJobCrud) */
            readonly create: (args: z.input<typeof Contract_1.cronJobCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobCrud['create']['outputSchema']>>;
            /** CRUD find for cron (cronJobCrud) */
            readonly find: (args: z.input<typeof Contract_1.cronJobCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobCrud['find']['outputSchema']>>;
            /** CRUD findOne for cron (cronJobCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.cronJobCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobCrud['findOne']['outputSchema']>>;
            /** CRUD count for cron (cronJobCrud) */
            readonly count: (args: z.input<typeof Contract_1.cronJobCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobCrud['count']['outputSchema']>>;
            /** CRUD get for cron (cronJobCrud) */
            readonly get: (args: z.input<typeof Contract_1.cronJobCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobCrud['get']['outputSchema']>>;
            /** CRUD update for cron (cronJobCrud) */
            readonly update: (args: z.input<typeof Contract_1.cronJobCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobCrud['update']['outputSchema']>>;
            /** CRUD delete for cron (cronJobCrud) */
            readonly delete: (args: z.input<typeof Contract_1.cronJobCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobCrud['delete']['outputSchema']>>;
        };
        readonly cron_runs: {
            /** CRUD create for cron_runs (cronJobRunCrud) */
            readonly create: (args: z.input<typeof Contract_1.cronJobRunCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobRunCrud['create']['outputSchema']>>;
            /** CRUD find for cron_runs (cronJobRunCrud) */
            readonly find: (args: z.input<typeof Contract_1.cronJobRunCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobRunCrud['find']['outputSchema']>>;
            /** CRUD findOne for cron_runs (cronJobRunCrud) */
            readonly find_one: (args: z.input<typeof Contract_1.cronJobRunCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobRunCrud['findOne']['outputSchema']>>;
            /** CRUD count for cron_runs (cronJobRunCrud) */
            readonly count: (args: z.input<typeof Contract_1.cronJobRunCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobRunCrud['count']['outputSchema']>>;
            /** CRUD get for cron_runs (cronJobRunCrud) */
            readonly get: (args: z.input<typeof Contract_1.cronJobRunCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobRunCrud['get']['outputSchema']>>;
            /** CRUD update for cron_runs (cronJobRunCrud) */
            readonly update: (args: z.input<typeof Contract_1.cronJobRunCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobRunCrud['update']['outputSchema']>>;
            /** CRUD delete for cron_runs (cronJobRunCrud) */
            readonly delete: (args: z.input<typeof Contract_1.cronJobRunCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_1.cronJobRunCrud['delete']['outputSchema']>>;
        };
        readonly demo: {
            /** A simple hello world tool for demonstration. */
            readonly hello: (args: z.input<typeof Contract_2.demoHelloContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoHelloContract['outputSchema']>>;
            /** Check the status of the demo environment. */
            readonly status: (args: z.input<typeof Contract_2.demoStatusContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoStatusContract['outputSchema']>>;
            /** Send a notification via the system notifications service. */
            readonly notify: (args: z.input<typeof Contract_2.demoNotifyContract['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoNotifyContract['outputSchema']>>;
            /** CRUD create for demo (demoCrud) */
            readonly create: (args: z.input<typeof Contract_2.demoCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoCrud['create']['outputSchema']>>;
            /** CRUD find for demo (demoCrud) */
            readonly find: (args: z.input<typeof Contract_2.demoCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoCrud['find']['outputSchema']>>;
            /** CRUD findOne for demo (demoCrud) */
            readonly find_one: (args: z.input<typeof Contract_2.demoCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoCrud['findOne']['outputSchema']>>;
            /** CRUD count for demo (demoCrud) */
            readonly count: (args: z.input<typeof Contract_2.demoCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoCrud['count']['outputSchema']>>;
            /** CRUD get for demo (demoCrud) */
            readonly get: (args: z.input<typeof Contract_2.demoCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoCrud['get']['outputSchema']>>;
            /** CRUD update for demo (demoCrud) */
            readonly update: (args: z.input<typeof Contract_2.demoCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoCrud['update']['outputSchema']>>;
            /** CRUD delete for demo (demoCrud) */
            readonly delete: (args: z.input<typeof Contract_2.demoCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_2.demoCrud['delete']['outputSchema']>>;
        };
        readonly infer: {
            /** Perform stateful chat completion within a thread. */
            readonly chat: (args: z.input<typeof Contract_3.inferChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferChatContract['outputSchema']>>;
            /** Approve a pending tool call for execution. */
            readonly approve_tool: (args: z.input<typeof Contract_3.inferApproveToolContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferApproveToolContract['outputSchema']>>;
            /** Force a refresh of the model inventory from all registered Ollama instances. */
            readonly refresh_inventory: (args: z.input<typeof Contract_3.inferRefreshInventoryContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferRefreshInventoryContract['outputSchema']>>;
            /** Atomically acquire the next available online Ollama instance. */
            readonly acquire_ollama: (args: z.input<typeof Contract_3.inferAcquireOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferAcquireOllamaContract['outputSchema']>>;
            /** Release an acquired Ollama instance, decrementing its active request count. */
            readonly release_ollama: (args: z.input<typeof Contract_3.inferReleaseOllamaContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferReleaseOllamaContract['outputSchema']>>;
            /** Perform a structured completion using a JSON schema format. */
            readonly structured_chat: (args: z.input<typeof Contract_3.inferStructuredChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferStructuredChatContract['outputSchema']>>;
            /** Reject a pending tool call for execution. */
            readonly reject_tool: (args: z.input<typeof Contract_3.inferRejectToolContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferRejectToolContract['outputSchema']>>;
            /** Get the current statistics/counts of the inference queue. */
            readonly queue_status: (args: z.input<typeof Contract_3.inferQueueStatusContract['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueStatusContract['outputSchema']>>;
        };
        readonly ollama: {
            /** CRUD create for ollama (ollamaCrud) */
            readonly create: (args: z.input<typeof Contract_3.ollamaCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_3.ollamaCrud['create']['outputSchema']>>;
            /** CRUD find for ollama (ollamaCrud) */
            readonly find: (args: z.input<typeof Contract_3.ollamaCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_3.ollamaCrud['find']['outputSchema']>>;
            /** CRUD findOne for ollama (ollamaCrud) */
            readonly find_one: (args: z.input<typeof Contract_3.ollamaCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_3.ollamaCrud['findOne']['outputSchema']>>;
            /** CRUD count for ollama (ollamaCrud) */
            readonly count: (args: z.input<typeof Contract_3.ollamaCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_3.ollamaCrud['count']['outputSchema']>>;
            /** CRUD get for ollama (ollamaCrud) */
            readonly get: (args: z.input<typeof Contract_3.ollamaCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_3.ollamaCrud['get']['outputSchema']>>;
            /** CRUD update for ollama (ollamaCrud) */
            readonly update: (args: z.input<typeof Contract_3.ollamaCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_3.ollamaCrud['update']['outputSchema']>>;
            /** CRUD delete for ollama (ollamaCrud) */
            readonly delete: (args: z.input<typeof Contract_3.ollamaCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_3.ollamaCrud['delete']['outputSchema']>>;
        };
        readonly models: {
            /** CRUD create for models (modelCrud) */
            readonly create: (args: z.input<typeof Contract_3.modelCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_3.modelCrud['create']['outputSchema']>>;
            /** CRUD find for models (modelCrud) */
            readonly find: (args: z.input<typeof Contract_3.modelCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_3.modelCrud['find']['outputSchema']>>;
            /** CRUD findOne for models (modelCrud) */
            readonly find_one: (args: z.input<typeof Contract_3.modelCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_3.modelCrud['findOne']['outputSchema']>>;
            /** CRUD count for models (modelCrud) */
            readonly count: (args: z.input<typeof Contract_3.modelCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_3.modelCrud['count']['outputSchema']>>;
            /** CRUD get for models (modelCrud) */
            readonly get: (args: z.input<typeof Contract_3.modelCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_3.modelCrud['get']['outputSchema']>>;
            /** CRUD update for models (modelCrud) */
            readonly update: (args: z.input<typeof Contract_3.modelCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_3.modelCrud['update']['outputSchema']>>;
            /** CRUD delete for models (modelCrud) */
            readonly delete: (args: z.input<typeof Contract_3.modelCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_3.modelCrud['delete']['outputSchema']>>;
        };
        readonly threads: {
            /** CRUD create for threads (threadCrud) */
            readonly create: (args: z.input<typeof Contract_3.threadCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_3.threadCrud['create']['outputSchema']>>;
            /** CRUD find for threads (threadCrud) */
            readonly find: (args: z.input<typeof Contract_3.threadCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_3.threadCrud['find']['outputSchema']>>;
            /** CRUD findOne for threads (threadCrud) */
            readonly find_one: (args: z.input<typeof Contract_3.threadCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_3.threadCrud['findOne']['outputSchema']>>;
            /** CRUD count for threads (threadCrud) */
            readonly count: (args: z.input<typeof Contract_3.threadCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_3.threadCrud['count']['outputSchema']>>;
            /** CRUD get for threads (threadCrud) */
            readonly get: (args: z.input<typeof Contract_3.threadCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_3.threadCrud['get']['outputSchema']>>;
            /** CRUD update for threads (threadCrud) */
            readonly update: (args: z.input<typeof Contract_3.threadCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_3.threadCrud['update']['outputSchema']>>;
            /** CRUD delete for threads (threadCrud) */
            readonly delete: (args: z.input<typeof Contract_3.threadCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_3.threadCrud['delete']['outputSchema']>>;
        };
        readonly messages: {
            /** CRUD create for messages (messageCrud) */
            readonly create: (args: z.input<typeof Contract_3.messageCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_3.messageCrud['create']['outputSchema']>>;
            /** CRUD find for messages (messageCrud) */
            readonly find: (args: z.input<typeof Contract_3.messageCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_3.messageCrud['find']['outputSchema']>>;
            /** CRUD findOne for messages (messageCrud) */
            readonly find_one: (args: z.input<typeof Contract_3.messageCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_3.messageCrud['findOne']['outputSchema']>>;
            /** CRUD count for messages (messageCrud) */
            readonly count: (args: z.input<typeof Contract_3.messageCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_3.messageCrud['count']['outputSchema']>>;
            /** CRUD get for messages (messageCrud) */
            readonly get: (args: z.input<typeof Contract_3.messageCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_3.messageCrud['get']['outputSchema']>>;
            /** CRUD update for messages (messageCrud) */
            readonly update: (args: z.input<typeof Contract_3.messageCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_3.messageCrud['update']['outputSchema']>>;
            /** CRUD delete for messages (messageCrud) */
            readonly delete: (args: z.input<typeof Contract_3.messageCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_3.messageCrud['delete']['outputSchema']>>;
        };
        readonly tool_calls: {
            /** CRUD create for tool_calls (toolCallCrud) */
            readonly create: (args: z.input<typeof Contract_3.toolCallCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_3.toolCallCrud['create']['outputSchema']>>;
            /** CRUD find for tool_calls (toolCallCrud) */
            readonly find: (args: z.input<typeof Contract_3.toolCallCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_3.toolCallCrud['find']['outputSchema']>>;
            /** CRUD findOne for tool_calls (toolCallCrud) */
            readonly find_one: (args: z.input<typeof Contract_3.toolCallCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_3.toolCallCrud['findOne']['outputSchema']>>;
            /** CRUD count for tool_calls (toolCallCrud) */
            readonly count: (args: z.input<typeof Contract_3.toolCallCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_3.toolCallCrud['count']['outputSchema']>>;
            /** CRUD get for tool_calls (toolCallCrud) */
            readonly get: (args: z.input<typeof Contract_3.toolCallCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_3.toolCallCrud['get']['outputSchema']>>;
            /** CRUD update for tool_calls (toolCallCrud) */
            readonly update: (args: z.input<typeof Contract_3.toolCallCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_3.toolCallCrud['update']['outputSchema']>>;
            /** CRUD delete for tool_calls (toolCallCrud) */
            readonly delete: (args: z.input<typeof Contract_3.toolCallCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_3.toolCallCrud['delete']['outputSchema']>>;
        };
        readonly infer_queue: {
            /** CRUD create for infer_queue (inferQueueCrud) */
            readonly create: (args: z.input<typeof Contract_3.inferQueueCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueCrud['create']['outputSchema']>>;
            /** CRUD find for infer_queue (inferQueueCrud) */
            readonly find: (args: z.input<typeof Contract_3.inferQueueCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueCrud['find']['outputSchema']>>;
            /** CRUD findOne for infer_queue (inferQueueCrud) */
            readonly find_one: (args: z.input<typeof Contract_3.inferQueueCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueCrud['findOne']['outputSchema']>>;
            /** CRUD count for infer_queue (inferQueueCrud) */
            readonly count: (args: z.input<typeof Contract_3.inferQueueCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueCrud['count']['outputSchema']>>;
            /** CRUD get for infer_queue (inferQueueCrud) */
            readonly get: (args: z.input<typeof Contract_3.inferQueueCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueCrud['get']['outputSchema']>>;
            /** CRUD update for infer_queue (inferQueueCrud) */
            readonly update: (args: z.input<typeof Contract_3.inferQueueCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueCrud['update']['outputSchema']>>;
            /** CRUD delete for infer_queue (inferQueueCrud) */
            readonly delete: (args: z.input<typeof Contract_3.inferQueueCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_3.inferQueueCrud['delete']['outputSchema']>>;
        };
        readonly journal: {
            /** Record an observation, reasoning step, or proposal in the episodic memory ledger. */
            readonly note: (args: z.input<typeof Contract_4.journalNoteContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalNoteContract['outputSchema']>>;
            /** Approve or reject a proposed action in the journal. Requires a correction if rejected. */
            readonly resolve: (args: z.input<typeof Contract_4.journalResolveContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalResolveContract['outputSchema']>>;
            /** The Nightly Sleep Cycle: Compress recent journal entries and extract permanent directives. */
            readonly compress: (args: z.input<typeof Contract_4.journalCompressContract['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCompressContract['outputSchema']>>;
            /** CRUD create for journal (journalCrud) */
            readonly create: (args: z.input<typeof Contract_4.journalCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCrud['create']['outputSchema']>>;
            /** CRUD find for journal (journalCrud) */
            readonly find: (args: z.input<typeof Contract_4.journalCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCrud['find']['outputSchema']>>;
            /** CRUD findOne for journal (journalCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.journalCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCrud['findOne']['outputSchema']>>;
            /** CRUD count for journal (journalCrud) */
            readonly count: (args: z.input<typeof Contract_4.journalCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCrud['count']['outputSchema']>>;
            /** CRUD get for journal (journalCrud) */
            readonly get: (args: z.input<typeof Contract_4.journalCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCrud['get']['outputSchema']>>;
            /** CRUD update for journal (journalCrud) */
            readonly update: (args: z.input<typeof Contract_4.journalCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCrud['update']['outputSchema']>>;
            /** CRUD delete for journal (journalCrud) */
            readonly delete: (args: z.input<typeof Contract_4.journalCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.journalCrud['delete']['outputSchema']>>;
        };
        readonly directive: {
            /** CRUD create for directive (directiveCrud) */
            readonly create: (args: z.input<typeof Contract_4.directiveCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_4.directiveCrud['create']['outputSchema']>>;
            /** CRUD find for directive (directiveCrud) */
            readonly find: (args: z.input<typeof Contract_4.directiveCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_4.directiveCrud['find']['outputSchema']>>;
            /** CRUD findOne for directive (directiveCrud) */
            readonly find_one: (args: z.input<typeof Contract_4.directiveCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_4.directiveCrud['findOne']['outputSchema']>>;
            /** CRUD count for directive (directiveCrud) */
            readonly count: (args: z.input<typeof Contract_4.directiveCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_4.directiveCrud['count']['outputSchema']>>;
            /** CRUD get for directive (directiveCrud) */
            readonly get: (args: z.input<typeof Contract_4.directiveCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_4.directiveCrud['get']['outputSchema']>>;
            /** CRUD update for directive (directiveCrud) */
            readonly update: (args: z.input<typeof Contract_4.directiveCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_4.directiveCrud['update']['outputSchema']>>;
            /** CRUD delete for directive (directiveCrud) */
            readonly delete: (args: z.input<typeof Contract_4.directiveCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_4.directiveCrud['delete']['outputSchema']>>;
        };
        readonly kanban: {
            /** Transition a WorkItem or Feature through the Kanban lifecycle. */
            readonly move: (args: z.input<typeof Contract_5.kanbanMoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanMoveContract['outputSchema']>>;
        };
        readonly kanban_project: {
            /** CRUD create for kanban_project (kanbanProjectCrud) */
            readonly create: (args: z.input<typeof Contract_5.kanbanProjectCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanProjectCrud['create']['outputSchema']>>;
            /** CRUD find for kanban_project (kanbanProjectCrud) */
            readonly find: (args: z.input<typeof Contract_5.kanbanProjectCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanProjectCrud['find']['outputSchema']>>;
            /** CRUD findOne for kanban_project (kanbanProjectCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.kanbanProjectCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanProjectCrud['findOne']['outputSchema']>>;
            /** CRUD count for kanban_project (kanbanProjectCrud) */
            readonly count: (args: z.input<typeof Contract_5.kanbanProjectCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanProjectCrud['count']['outputSchema']>>;
            /** CRUD get for kanban_project (kanbanProjectCrud) */
            readonly get: (args: z.input<typeof Contract_5.kanbanProjectCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanProjectCrud['get']['outputSchema']>>;
            /** CRUD update for kanban_project (kanbanProjectCrud) */
            readonly update: (args: z.input<typeof Contract_5.kanbanProjectCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanProjectCrud['update']['outputSchema']>>;
            /** CRUD delete for kanban_project (kanbanProjectCrud) */
            readonly delete: (args: z.input<typeof Contract_5.kanbanProjectCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanProjectCrud['delete']['outputSchema']>>;
        };
        readonly kanban_feature: {
            /** CRUD create for kanban_feature (kanbanFeatureCrud) */
            readonly create: (args: z.input<typeof Contract_5.kanbanFeatureCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['create']['outputSchema']>>;
            /** CRUD find for kanban_feature (kanbanFeatureCrud) */
            readonly find: (args: z.input<typeof Contract_5.kanbanFeatureCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['find']['outputSchema']>>;
            /** CRUD findOne for kanban_feature (kanbanFeatureCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.kanbanFeatureCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['findOne']['outputSchema']>>;
            /** CRUD count for kanban_feature (kanbanFeatureCrud) */
            readonly count: (args: z.input<typeof Contract_5.kanbanFeatureCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['count']['outputSchema']>>;
            /** CRUD get for kanban_feature (kanbanFeatureCrud) */
            readonly get: (args: z.input<typeof Contract_5.kanbanFeatureCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['get']['outputSchema']>>;
            /** CRUD update for kanban_feature (kanbanFeatureCrud) */
            readonly update: (args: z.input<typeof Contract_5.kanbanFeatureCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['update']['outputSchema']>>;
            /** CRUD delete for kanban_feature (kanbanFeatureCrud) */
            readonly delete: (args: z.input<typeof Contract_5.kanbanFeatureCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['delete']['outputSchema']>>;
        };
        readonly kanban_work_item: {
            /** CRUD create for kanban_work_item (kanbanWorkItemCrud) */
            readonly create: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['create']['outputSchema']>>;
            /** CRUD find for kanban_work_item (kanbanWorkItemCrud) */
            readonly find: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['find']['outputSchema']>>;
            /** CRUD findOne for kanban_work_item (kanbanWorkItemCrud) */
            readonly find_one: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['findOne']['outputSchema']>>;
            /** CRUD count for kanban_work_item (kanbanWorkItemCrud) */
            readonly count: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['count']['outputSchema']>>;
            /** CRUD get for kanban_work_item (kanbanWorkItemCrud) */
            readonly get: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['get']['outputSchema']>>;
            /** CRUD update for kanban_work_item (kanbanWorkItemCrud) */
            readonly update: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['update']['outputSchema']>>;
            /** CRUD delete for kanban_work_item (kanbanWorkItemCrud) */
            readonly delete: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['delete']['outputSchema']>>;
        };
        readonly manager: {
            /** The exclusive entry point for user interaction. Translates intent into Git Flow missions. */
            readonly chat: (args: z.input<typeof Contract_6.managerChatContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerChatContract['outputSchema']>>;
            /** Autonomous wake-up for system reconciliation and reporting. */
            readonly pulse: (args: z.input<typeof Contract_6.managerPulseContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerPulseContract['outputSchema']>>;
            /** Ask the inquirer agent to perform a local read-only discovery on a WorkItem. */
            readonly inquire: (args: z.input<typeof Contract_6.managerInquireContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerInquireContract['outputSchema']>>;
            /** Dispatch the engineer agent to modify code or execute tests for a WorkItem. */
            readonly execute: (args: z.input<typeof Contract_6.managerExecuteContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerExecuteContract['outputSchema']>>;
            /** Instruct the researcher agent to perform external research for a WorkItem. */
            readonly research: (args: z.input<typeof Contract_6.managerResearchContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerResearchContract['outputSchema']>>;
            /** Run the Orchestrator on a mission (blocking). */
            readonly run: (args: z.input<typeof Contract_6.managerRunContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerRunContract['outputSchema']>>;
            /** Retrieve the last 50 execution errors. */
            readonly list_tool_errors: (args: z.input<typeof Contract_6.managerListToolErrorsContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerListToolErrorsContract['outputSchema']>>;
            /** Sync system prompts from Markdown files. */
            readonly load_prompts: (args: z.input<typeof Contract_6.managerLoadPromptsContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerLoadPromptsContract['outputSchema']>>;
            /** Safety audit for a pending tool call. */
            readonly evaluate_approval: (args: z.input<typeof Contract_6.managerEvaluateApprovalContract['inputSchema']>) => Promise<z.infer<typeof Contract_6.managerEvaluateApprovalContract['outputSchema']>>;
        };
        readonly pulse_report: {
            /** CRUD create for pulse_report (pulseReportCrud) */
            readonly create: (args: z.input<typeof Contract_6.pulseReportCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_6.pulseReportCrud['create']['outputSchema']>>;
            /** CRUD find for pulse_report (pulseReportCrud) */
            readonly find: (args: z.input<typeof Contract_6.pulseReportCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_6.pulseReportCrud['find']['outputSchema']>>;
            /** CRUD findOne for pulse_report (pulseReportCrud) */
            readonly find_one: (args: z.input<typeof Contract_6.pulseReportCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_6.pulseReportCrud['findOne']['outputSchema']>>;
            /** CRUD count for pulse_report (pulseReportCrud) */
            readonly count: (args: z.input<typeof Contract_6.pulseReportCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_6.pulseReportCrud['count']['outputSchema']>>;
            /** CRUD get for pulse_report (pulseReportCrud) */
            readonly get: (args: z.input<typeof Contract_6.pulseReportCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_6.pulseReportCrud['get']['outputSchema']>>;
            /** CRUD update for pulse_report (pulseReportCrud) */
            readonly update: (args: z.input<typeof Contract_6.pulseReportCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_6.pulseReportCrud['update']['outputSchema']>>;
            /** CRUD delete for pulse_report (pulseReportCrud) */
            readonly delete: (args: z.input<typeof Contract_6.pulseReportCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_6.pulseReportCrud['delete']['outputSchema']>>;
        };
        readonly marketplace: {
            /** List available and installed addons */
            readonly list: (args: z.input<typeof Contract_7.marketplaceListContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.marketplaceListContract['outputSchema']>>;
            /** Install an addon */
            readonly install: (args: z.input<typeof Contract_7.marketplaceInstallContract['inputSchema']>) => Promise<z.infer<typeof Contract_7.marketplaceInstallContract['outputSchema']>>;
        };
        readonly notifications: {
            /** Trigger a new system notification */
            readonly send: (args: z.input<typeof Contract_8.notificationsSendContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.notificationsSendContract['outputSchema']>>;
            /** List recent notifications */
            readonly list: (args: z.input<typeof Contract_8.notificationsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_8.notificationsListContract['outputSchema']>>;
        };
        readonly sandbox: {
            /** Step into a specific sandbox. All subsequent FS and Terminal tools will target this sandbox. */
            readonly set_active: (args: z.input<typeof Contract_9.sandboxSetActiveContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxSetActiveContract['outputSchema']>>;
            /** Clean up stale or stopped sandbox containers running on the Docker host. */
            readonly prune: (args: z.input<typeof Contract_9.sandboxPruneContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxPruneContract['outputSchema']>>;
            /** Read a file from the current sandbox. */
            readonly fs_read: (args: z.input<typeof Contract_9.sandboxFsReadContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxFsReadContract['outputSchema']>>;
            /** Write a file to the current sandbox. */
            readonly fs_write: (args: z.input<typeof Contract_9.sandboxFsWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxFsWriteContract['outputSchema']>>;
            /** List contents of a directory in the current sandbox. Automatically ignores .git, node_modules, and dist. */
            readonly fs_list: (args: z.input<typeof Contract_9.sandboxFsListContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxFsListContract['outputSchema']>>;
            /** Apply targeted changes to a file in the current sandbox. */
            readonly fs_patch: (args: z.input<typeof Contract_9.sandboxFsPatchContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxFsPatchContract['outputSchema']>>;
            /** Remove a file or directory from the current sandbox. */
            readonly fs_remove: (args: z.input<typeof Contract_9.sandboxFsRemoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxFsRemoveContract['outputSchema']>>;
            /** Create a new directory in the current sandbox. */
            readonly fs_mkdir: (args: z.input<typeof Contract_9.sandboxFsMkdirContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxFsMkdirContract['outputSchema']>>;
            /** Move or rename a file/directory in the current sandbox. */
            readonly fs_move: (args: z.input<typeof Contract_9.sandboxFsMoveContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxFsMoveContract['outputSchema']>>;
            /** Execute a short-lived command in the current sandbox. Output (stdout/stderr) is capped at 50,000 chars each (preserving the tail). */
            readonly terminal_execute: (args: z.input<typeof Contract_9.sandboxTerminalExecuteContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalExecuteContract['outputSchema']>>;
            /** Spawn a background service in the current sandbox. */
            readonly terminal_spawn: (args: z.input<typeof Contract_9.sandboxTerminalSpawnContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalSpawnContract['outputSchema']>>;
            /** List all background services running in the current sandbox. */
            readonly terminal_list: (args: z.input<typeof Contract_9.sandboxTerminalListContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalListContract['outputSchema']>>;
            /** Kill a background service in the current sandbox. */
            readonly terminal_kill: (args: z.input<typeof Contract_9.sandboxTerminalKillContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalKillContract['outputSchema']>>;
            /** Get logs for a background service in the current sandbox. */
            readonly terminal_logs: (args: z.input<typeof Contract_9.sandboxTerminalLogsContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalLogsContract['outputSchema']>>;
            /** Open a persistent PTY session (e.g. bash) in the current sandbox. */
            readonly terminal_session_open: (args: z.input<typeof Contract_9.sandboxTerminalSessionOpenContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalSessionOpenContract['outputSchema']>>;
            /** List all active PTY sessions in the current sandbox. */
            readonly terminal_session_list: (args: z.input<typeof Contract_9.sandboxTerminalSessionListContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalSessionListContract['outputSchema']>>;
            /** Write data to a PTY session stdin. */
            readonly terminal_session_write: (args: z.input<typeof Contract_9.sandboxTerminalSessionWriteContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalSessionWriteContract['outputSchema']>>;
            /** Resize a PTY session window. */
            readonly terminal_session_resize: (args: z.input<typeof Contract_9.sandboxTerminalSessionResizeContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxTerminalSessionResizeContract['outputSchema']>>;
            /** Map a container port to the host or proxy. */
            readonly network_expose: (args: z.input<typeof Contract_9.sandboxNetworkExposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxNetworkExposeContract['outputSchema']>>;
            /** Remove a port mapping. */
            readonly network_unexpose: (args: z.input<typeof Contract_9.sandboxNetworkUnexposeContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxNetworkUnexposeContract['outputSchema']>>;
            /** List all active exposed ports. */
            readonly network_list: (args: z.input<typeof Contract_9.sandboxNetworkListContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxNetworkListContract['outputSchema']>>;
            /** Toggle external internet access for the sandbox. */
            readonly network_set_policy: (args: z.input<typeof Contract_9.sandboxNetworkSetPolicyContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxNetworkSetPolicyContract['outputSchema']>>;
            /** Set a generic environment variable. */
            readonly env_set: (args: z.input<typeof Contract_9.sandboxEnvSetContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxEnvSetContract['outputSchema']>>;
            /** Set a secret (hidden from logs/telemetry). */
            readonly env_set_secret: (args: z.input<typeof Contract_9.sandboxEnvSetSecretContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxEnvSetSecretContract['outputSchema']>>;
            /** List all non-secret environment variables. */
            readonly env_list: (args: z.input<typeof Contract_9.sandboxEnvListContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxEnvListContract['outputSchema']>>;
            /** Update constraints on the active sandbox. */
            readonly resource_update_limits: (args: z.input<typeof Contract_9.sandboxResourceUpdateLimitsContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxResourceUpdateLimitsContract['outputSchema']>>;
            /** Fetch current CPU/Memory usage metrics. */
            readonly resource_get_stats: (args: z.input<typeof Contract_9.sandboxResourceGetStatsContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxResourceGetStatsContract['outputSchema']>>;
            /** Save current container state as a named image. */
            readonly state_commit: (args: z.input<typeof Contract_9.sandboxStateCommitContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxStateCommitContract['outputSchema']>>;
            /** Create a new sandbox from a saved snapshot. */
            readonly state_clone: (args: z.input<typeof Contract_9.sandboxStateCloneContract['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxStateCloneContract['outputSchema']>>;
            /** CRUD create for sandbox (sandboxCrud) */
            readonly create: (args: z.input<typeof Contract_9.sandboxCrud['create']['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxCrud['create']['outputSchema']>>;
            /** CRUD find for sandbox (sandboxCrud) */
            readonly find: (args: z.input<typeof Contract_9.sandboxCrud['find']['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxCrud['find']['outputSchema']>>;
            /** CRUD findOne for sandbox (sandboxCrud) */
            readonly find_one: (args: z.input<typeof Contract_9.sandboxCrud['findOne']['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxCrud['findOne']['outputSchema']>>;
            /** CRUD count for sandbox (sandboxCrud) */
            readonly count: (args: z.input<typeof Contract_9.sandboxCrud['count']['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxCrud['count']['outputSchema']>>;
            /** CRUD get for sandbox (sandboxCrud) */
            readonly get: (args: z.input<typeof Contract_9.sandboxCrud['get']['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxCrud['get']['outputSchema']>>;
            /** CRUD update for sandbox (sandboxCrud) */
            readonly update: (args: z.input<typeof Contract_9.sandboxCrud['update']['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxCrud['update']['outputSchema']>>;
            /** CRUD delete for sandbox (sandboxCrud) */
            readonly delete: (args: z.input<typeof Contract_9.sandboxCrud['delete']['inputSchema']>) => Promise<z.infer<typeof Contract_9.sandboxCrud['delete']['outputSchema']>>;
        };
        readonly settings: {
            /** Get a configuration value */
            readonly get: (args: z.input<typeof Contract_10.settingsGetContract['inputSchema']>) => Promise<z.infer<typeof Contract_10.settingsGetContract['outputSchema']>>;
            /** Update a configuration value */
            readonly update: (args: z.input<typeof Contract_10.settingsUpdateContract['inputSchema']>) => Promise<z.infer<typeof Contract_10.settingsUpdateContract['outputSchema']>>;
            /** Get all configuration values */
            readonly getAll: (args: z.input<typeof Contract_10.settingsGetAllContract['inputSchema']>) => Promise<z.infer<typeof Contract_10.settingsGetAllContract['outputSchema']>>;
        };
    }
}

export { ICastellanApi };
