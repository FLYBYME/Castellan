import { z } from 'zod';
import { ICastellanApi } from '../api.js';
import { ISkillContext } from '@castellan/core/index.js';
import { ToolExecutor } from '@castellan/engine/core/ToolExecutor.js';
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
    public readonly cron = {
        trigger: (args: z.input<typeof Contract_1.cronTriggerContract['inputSchema']>): Promise<z.infer<typeof Contract_1.cronTriggerContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronTriggerContract['outputSchema']>>('cron', 'trigger', args, this.context),
        reset: (args: z.input<typeof Contract_1.cronResetContract['inputSchema']>): Promise<z.infer<typeof Contract_1.cronResetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronResetContract['outputSchema']>>('cron', 'reset', args, this.context),
        status: (args: z.input<typeof Contract_1.cronStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_1.cronStatusContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronStatusContract['outputSchema']>>('cron', 'status', args, this.context),
        create: (args: z.input<typeof Contract_1.cronJobCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobCrud['create']['outputSchema']>>('cron', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.cronJobCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobCrud['find']['outputSchema']>>('cron', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.cronJobCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobCrud['findOne']['outputSchema']>>('cron', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.cronJobCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobCrud['count']['outputSchema']>>('cron', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.cronJobCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobCrud['get']['outputSchema']>>('cron', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.cronJobCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobCrud['update']['outputSchema']>>('cron', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.cronJobCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobCrud['delete']['outputSchema']>>('cron', 'delete', args, this.context),
    };
    public readonly cron_runs = {
        create: (args: z.input<typeof Contract_1.cronJobRunCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobRunCrud['create']['outputSchema']>>('cron_runs', 'create', args, this.context),
        find: (args: z.input<typeof Contract_1.cronJobRunCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobRunCrud['find']['outputSchema']>>('cron_runs', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_1.cronJobRunCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobRunCrud['findOne']['outputSchema']>>('cron_runs', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_1.cronJobRunCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobRunCrud['count']['outputSchema']>>('cron_runs', 'count', args, this.context),
        get: (args: z.input<typeof Contract_1.cronJobRunCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobRunCrud['get']['outputSchema']>>('cron_runs', 'get', args, this.context),
        update: (args: z.input<typeof Contract_1.cronJobRunCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobRunCrud['update']['outputSchema']>>('cron_runs', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_1.cronJobRunCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.cronJobRunCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_1.cronJobRunCrud['delete']['outputSchema']>>('cron_runs', 'delete', args, this.context),
    };
    public readonly demo = {
        hello: (args: z.input<typeof Contract_2.demoHelloContract['inputSchema']>): Promise<z.infer<typeof Contract_2.demoHelloContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoHelloContract['outputSchema']>>('demo', 'hello', args, this.context),
        status: (args: z.input<typeof Contract_2.demoStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_2.demoStatusContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoStatusContract['outputSchema']>>('demo', 'status', args, this.context),
        notify: (args: z.input<typeof Contract_2.demoNotifyContract['inputSchema']>): Promise<z.infer<typeof Contract_2.demoNotifyContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoNotifyContract['outputSchema']>>('demo', 'notify', args, this.context),
        create: (args: z.input<typeof Contract_2.demoCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoCrud['create']['outputSchema']>>('demo', 'create', args, this.context),
        find: (args: z.input<typeof Contract_2.demoCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoCrud['find']['outputSchema']>>('demo', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_2.demoCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoCrud['findOne']['outputSchema']>>('demo', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_2.demoCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoCrud['count']['outputSchema']>>('demo', 'count', args, this.context),
        get: (args: z.input<typeof Contract_2.demoCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoCrud['get']['outputSchema']>>('demo', 'get', args, this.context),
        update: (args: z.input<typeof Contract_2.demoCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoCrud['update']['outputSchema']>>('demo', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_2.demoCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_2.demoCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_2.demoCrud['delete']['outputSchema']>>('demo', 'delete', args, this.context),
    };
    public readonly infer = {
        chat: (args: z.input<typeof Contract_3.inferChatContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferChatContract['outputSchema']>>('infer', 'chat', args, this.context),
        approve_tool: (args: z.input<typeof Contract_3.inferApproveToolContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferApproveToolContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferApproveToolContract['outputSchema']>>('infer', 'approve_tool', args, this.context),
        refresh_inventory: (args: z.input<typeof Contract_3.inferRefreshInventoryContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferRefreshInventoryContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferRefreshInventoryContract['outputSchema']>>('infer', 'refresh_inventory', args, this.context),
        acquire_ollama: (args: z.input<typeof Contract_3.inferAcquireOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferAcquireOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferAcquireOllamaContract['outputSchema']>>('infer', 'acquire_ollama', args, this.context),
        release_ollama: (args: z.input<typeof Contract_3.inferReleaseOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferReleaseOllamaContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferReleaseOllamaContract['outputSchema']>>('infer', 'release_ollama', args, this.context),
        structured_chat: (args: z.input<typeof Contract_3.inferStructuredChatContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferStructuredChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferStructuredChatContract['outputSchema']>>('infer', 'structured_chat', args, this.context),
        reject_tool: (args: z.input<typeof Contract_3.inferRejectToolContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferRejectToolContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferRejectToolContract['outputSchema']>>('infer', 'reject_tool', args, this.context),
        queue_status: (args: z.input<typeof Contract_3.inferQueueStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueStatusContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueStatusContract['outputSchema']>>('infer', 'queue_status', args, this.context),
    };
    public readonly ollama = {
        create: (args: z.input<typeof Contract_3.ollamaCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.ollamaCrud['create']['outputSchema']>>('ollama', 'create', args, this.context),
        find: (args: z.input<typeof Contract_3.ollamaCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.ollamaCrud['find']['outputSchema']>>('ollama', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_3.ollamaCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.ollamaCrud['findOne']['outputSchema']>>('ollama', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_3.ollamaCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.ollamaCrud['count']['outputSchema']>>('ollama', 'count', args, this.context),
        get: (args: z.input<typeof Contract_3.ollamaCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.ollamaCrud['get']['outputSchema']>>('ollama', 'get', args, this.context),
        update: (args: z.input<typeof Contract_3.ollamaCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.ollamaCrud['update']['outputSchema']>>('ollama', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_3.ollamaCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.ollamaCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.ollamaCrud['delete']['outputSchema']>>('ollama', 'delete', args, this.context),
    };
    public readonly models = {
        create: (args: z.input<typeof Contract_3.modelCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.modelCrud['create']['outputSchema']>>('models', 'create', args, this.context),
        find: (args: z.input<typeof Contract_3.modelCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.modelCrud['find']['outputSchema']>>('models', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_3.modelCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.modelCrud['findOne']['outputSchema']>>('models', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_3.modelCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.modelCrud['count']['outputSchema']>>('models', 'count', args, this.context),
        get: (args: z.input<typeof Contract_3.modelCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.modelCrud['get']['outputSchema']>>('models', 'get', args, this.context),
        update: (args: z.input<typeof Contract_3.modelCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.modelCrud['update']['outputSchema']>>('models', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_3.modelCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.modelCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.modelCrud['delete']['outputSchema']>>('models', 'delete', args, this.context),
    };
    public readonly threads = {
        create: (args: z.input<typeof Contract_3.threadCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.threadCrud['create']['outputSchema']>>('threads', 'create', args, this.context),
        find: (args: z.input<typeof Contract_3.threadCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.threadCrud['find']['outputSchema']>>('threads', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_3.threadCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.threadCrud['findOne']['outputSchema']>>('threads', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_3.threadCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.threadCrud['count']['outputSchema']>>('threads', 'count', args, this.context),
        get: (args: z.input<typeof Contract_3.threadCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.threadCrud['get']['outputSchema']>>('threads', 'get', args, this.context),
        update: (args: z.input<typeof Contract_3.threadCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.threadCrud['update']['outputSchema']>>('threads', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_3.threadCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.threadCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.threadCrud['delete']['outputSchema']>>('threads', 'delete', args, this.context),
    };
    public readonly messages = {
        create: (args: z.input<typeof Contract_3.messageCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.messageCrud['create']['outputSchema']>>('messages', 'create', args, this.context),
        find: (args: z.input<typeof Contract_3.messageCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.messageCrud['find']['outputSchema']>>('messages', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_3.messageCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.messageCrud['findOne']['outputSchema']>>('messages', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_3.messageCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.messageCrud['count']['outputSchema']>>('messages', 'count', args, this.context),
        get: (args: z.input<typeof Contract_3.messageCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.messageCrud['get']['outputSchema']>>('messages', 'get', args, this.context),
        update: (args: z.input<typeof Contract_3.messageCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.messageCrud['update']['outputSchema']>>('messages', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_3.messageCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.messageCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.messageCrud['delete']['outputSchema']>>('messages', 'delete', args, this.context),
    };
    public readonly tool_calls = {
        create: (args: z.input<typeof Contract_3.toolCallCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.toolCallCrud['create']['outputSchema']>>('tool_calls', 'create', args, this.context),
        find: (args: z.input<typeof Contract_3.toolCallCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.toolCallCrud['find']['outputSchema']>>('tool_calls', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_3.toolCallCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.toolCallCrud['findOne']['outputSchema']>>('tool_calls', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_3.toolCallCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.toolCallCrud['count']['outputSchema']>>('tool_calls', 'count', args, this.context),
        get: (args: z.input<typeof Contract_3.toolCallCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.toolCallCrud['get']['outputSchema']>>('tool_calls', 'get', args, this.context),
        update: (args: z.input<typeof Contract_3.toolCallCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.toolCallCrud['update']['outputSchema']>>('tool_calls', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_3.toolCallCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.toolCallCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.toolCallCrud['delete']['outputSchema']>>('tool_calls', 'delete', args, this.context),
    };
    public readonly infer_queue = {
        create: (args: z.input<typeof Contract_3.inferQueueCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueCrud['create']['outputSchema']>>('infer_queue', 'create', args, this.context),
        find: (args: z.input<typeof Contract_3.inferQueueCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueCrud['find']['outputSchema']>>('infer_queue', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_3.inferQueueCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueCrud['findOne']['outputSchema']>>('infer_queue', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_3.inferQueueCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueCrud['count']['outputSchema']>>('infer_queue', 'count', args, this.context),
        get: (args: z.input<typeof Contract_3.inferQueueCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueCrud['get']['outputSchema']>>('infer_queue', 'get', args, this.context),
        update: (args: z.input<typeof Contract_3.inferQueueCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueCrud['update']['outputSchema']>>('infer_queue', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_3.inferQueueCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.inferQueueCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_3.inferQueueCrud['delete']['outputSchema']>>('infer_queue', 'delete', args, this.context),
    };
    public readonly journal = {
        note: (args: z.input<typeof Contract_4.journalNoteContract['inputSchema']>): Promise<z.infer<typeof Contract_4.journalNoteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalNoteContract['outputSchema']>>('journal', 'note', args, this.context),
        resolve: (args: z.input<typeof Contract_4.journalResolveContract['inputSchema']>): Promise<z.infer<typeof Contract_4.journalResolveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalResolveContract['outputSchema']>>('journal', 'resolve', args, this.context),
        compress: (args: z.input<typeof Contract_4.journalCompressContract['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCompressContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCompressContract['outputSchema']>>('journal', 'compress', args, this.context),
        create: (args: z.input<typeof Contract_4.journalCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCrud['create']['outputSchema']>>('journal', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.journalCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCrud['find']['outputSchema']>>('journal', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.journalCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCrud['findOne']['outputSchema']>>('journal', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.journalCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCrud['count']['outputSchema']>>('journal', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.journalCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCrud['get']['outputSchema']>>('journal', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.journalCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCrud['update']['outputSchema']>>('journal', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.journalCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.journalCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.journalCrud['delete']['outputSchema']>>('journal', 'delete', args, this.context),
    };
    public readonly directive = {
        create: (args: z.input<typeof Contract_4.directiveCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.directiveCrud['create']['outputSchema']>>('directive', 'create', args, this.context),
        find: (args: z.input<typeof Contract_4.directiveCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.directiveCrud['find']['outputSchema']>>('directive', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_4.directiveCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.directiveCrud['findOne']['outputSchema']>>('directive', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_4.directiveCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.directiveCrud['count']['outputSchema']>>('directive', 'count', args, this.context),
        get: (args: z.input<typeof Contract_4.directiveCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.directiveCrud['get']['outputSchema']>>('directive', 'get', args, this.context),
        update: (args: z.input<typeof Contract_4.directiveCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.directiveCrud['update']['outputSchema']>>('directive', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_4.directiveCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.directiveCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_4.directiveCrud['delete']['outputSchema']>>('directive', 'delete', args, this.context),
    };
    public readonly kanban = {
        move: (args: z.input<typeof Contract_5.kanbanMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanMoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanMoveContract['outputSchema']>>('kanban', 'move', args, this.context),
    };
    public readonly kanban_project = {
        create: (args: z.input<typeof Contract_5.kanbanProjectCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanProjectCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanProjectCrud['create']['outputSchema']>>('kanban_project', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.kanbanProjectCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanProjectCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanProjectCrud['find']['outputSchema']>>('kanban_project', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.kanbanProjectCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanProjectCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanProjectCrud['findOne']['outputSchema']>>('kanban_project', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.kanbanProjectCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanProjectCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanProjectCrud['count']['outputSchema']>>('kanban_project', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.kanbanProjectCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanProjectCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanProjectCrud['get']['outputSchema']>>('kanban_project', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.kanbanProjectCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanProjectCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanProjectCrud['update']['outputSchema']>>('kanban_project', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.kanbanProjectCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanProjectCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanProjectCrud['delete']['outputSchema']>>('kanban_project', 'delete', args, this.context),
    };
    public readonly kanban_feature = {
        create: (args: z.input<typeof Contract_5.kanbanFeatureCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanFeatureCrud['create']['outputSchema']>>('kanban_feature', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.kanbanFeatureCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanFeatureCrud['find']['outputSchema']>>('kanban_feature', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.kanbanFeatureCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanFeatureCrud['findOne']['outputSchema']>>('kanban_feature', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.kanbanFeatureCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanFeatureCrud['count']['outputSchema']>>('kanban_feature', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.kanbanFeatureCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanFeatureCrud['get']['outputSchema']>>('kanban_feature', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.kanbanFeatureCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanFeatureCrud['update']['outputSchema']>>('kanban_feature', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.kanbanFeatureCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanFeatureCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanFeatureCrud['delete']['outputSchema']>>('kanban_feature', 'delete', args, this.context),
    };
    public readonly kanban_work_item = {
        create: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanWorkItemCrud['create']['outputSchema']>>('kanban_work_item', 'create', args, this.context),
        find: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanWorkItemCrud['find']['outputSchema']>>('kanban_work_item', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanWorkItemCrud['findOne']['outputSchema']>>('kanban_work_item', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanWorkItemCrud['count']['outputSchema']>>('kanban_work_item', 'count', args, this.context),
        get: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanWorkItemCrud['get']['outputSchema']>>('kanban_work_item', 'get', args, this.context),
        update: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanWorkItemCrud['update']['outputSchema']>>('kanban_work_item', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_5.kanbanWorkItemCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_5.kanbanWorkItemCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_5.kanbanWorkItemCrud['delete']['outputSchema']>>('kanban_work_item', 'delete', args, this.context),
    };
    public readonly manager = {
        chat: (args: z.input<typeof Contract_6.managerChatContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerChatContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerChatContract['outputSchema']>>('manager', 'chat', args, this.context),
        pulse: (args: z.input<typeof Contract_6.managerPulseContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerPulseContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerPulseContract['outputSchema']>>('manager', 'pulse', args, this.context),
        inquire: (args: z.input<typeof Contract_6.managerInquireContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerInquireContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerInquireContract['outputSchema']>>('manager', 'inquire', args, this.context),
        execute: (args: z.input<typeof Contract_6.managerExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerExecuteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerExecuteContract['outputSchema']>>('manager', 'execute', args, this.context),
        research: (args: z.input<typeof Contract_6.managerResearchContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerResearchContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerResearchContract['outputSchema']>>('manager', 'research', args, this.context),
        run: (args: z.input<typeof Contract_6.managerRunContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerRunContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerRunContract['outputSchema']>>('manager', 'run', args, this.context),
        list_tool_errors: (args: z.input<typeof Contract_6.managerListToolErrorsContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerListToolErrorsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerListToolErrorsContract['outputSchema']>>('manager', 'list_tool_errors', args, this.context),
        load_prompts: (args: z.input<typeof Contract_6.managerLoadPromptsContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerLoadPromptsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerLoadPromptsContract['outputSchema']>>('manager', 'load_prompts', args, this.context),
        evaluate_approval: (args: z.input<typeof Contract_6.managerEvaluateApprovalContract['inputSchema']>): Promise<z.infer<typeof Contract_6.managerEvaluateApprovalContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.managerEvaluateApprovalContract['outputSchema']>>('manager', 'evaluate_approval', args, this.context),
    };
    public readonly pulse_report = {
        create: (args: z.input<typeof Contract_6.pulseReportCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.pulseReportCrud['create']['outputSchema']>>('pulse_report', 'create', args, this.context),
        find: (args: z.input<typeof Contract_6.pulseReportCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.pulseReportCrud['find']['outputSchema']>>('pulse_report', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_6.pulseReportCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.pulseReportCrud['findOne']['outputSchema']>>('pulse_report', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_6.pulseReportCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.pulseReportCrud['count']['outputSchema']>>('pulse_report', 'count', args, this.context),
        get: (args: z.input<typeof Contract_6.pulseReportCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.pulseReportCrud['get']['outputSchema']>>('pulse_report', 'get', args, this.context),
        update: (args: z.input<typeof Contract_6.pulseReportCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.pulseReportCrud['update']['outputSchema']>>('pulse_report', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_6.pulseReportCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_6.pulseReportCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_6.pulseReportCrud['delete']['outputSchema']>>('pulse_report', 'delete', args, this.context),
    };
    public readonly marketplace = {
        list: (args: z.input<typeof Contract_7.marketplaceListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.marketplaceListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.marketplaceListContract['outputSchema']>>('marketplace', 'list', args, this.context),
        install: (args: z.input<typeof Contract_7.marketplaceInstallContract['inputSchema']>): Promise<z.infer<typeof Contract_7.marketplaceInstallContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_7.marketplaceInstallContract['outputSchema']>>('marketplace', 'install', args, this.context),
    };
    public readonly notifications = {
        send: (args: z.input<typeof Contract_8.notificationsSendContract['inputSchema']>): Promise<z.infer<typeof Contract_8.notificationsSendContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.notificationsSendContract['outputSchema']>>('notifications', 'send', args, this.context),
        list: (args: z.input<typeof Contract_8.notificationsListContract['inputSchema']>): Promise<z.infer<typeof Contract_8.notificationsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_8.notificationsListContract['outputSchema']>>('notifications', 'list', args, this.context),
    };
    public readonly sandbox = {
        set_active: (args: z.input<typeof Contract_9.sandboxSetActiveContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxSetActiveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxSetActiveContract['outputSchema']>>('sandbox', 'set_active', args, this.context),
        prune: (args: z.input<typeof Contract_9.sandboxPruneContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxPruneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxPruneContract['outputSchema']>>('sandbox', 'prune', args, this.context),
        fs_read: (args: z.input<typeof Contract_9.sandboxFsReadContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsReadContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxFsReadContract['outputSchema']>>('sandbox', 'fs_read', args, this.context),
        fs_write: (args: z.input<typeof Contract_9.sandboxFsWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxFsWriteContract['outputSchema']>>('sandbox', 'fs_write', args, this.context),
        fs_list: (args: z.input<typeof Contract_9.sandboxFsListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxFsListContract['outputSchema']>>('sandbox', 'fs_list', args, this.context),
        fs_patch: (args: z.input<typeof Contract_9.sandboxFsPatchContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsPatchContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxFsPatchContract['outputSchema']>>('sandbox', 'fs_patch', args, this.context),
        fs_remove: (args: z.input<typeof Contract_9.sandboxFsRemoveContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsRemoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxFsRemoveContract['outputSchema']>>('sandbox', 'fs_remove', args, this.context),
        fs_mkdir: (args: z.input<typeof Contract_9.sandboxFsMkdirContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsMkdirContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxFsMkdirContract['outputSchema']>>('sandbox', 'fs_mkdir', args, this.context),
        fs_move: (args: z.input<typeof Contract_9.sandboxFsMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxFsMoveContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxFsMoveContract['outputSchema']>>('sandbox', 'fs_move', args, this.context),
        terminal_execute: (args: z.input<typeof Contract_9.sandboxTerminalExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalExecuteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalExecuteContract['outputSchema']>>('sandbox', 'terminal_execute', args, this.context),
        terminal_spawn: (args: z.input<typeof Contract_9.sandboxTerminalSpawnContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSpawnContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalSpawnContract['outputSchema']>>('sandbox', 'terminal_spawn', args, this.context),
        terminal_list: (args: z.input<typeof Contract_9.sandboxTerminalListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalListContract['outputSchema']>>('sandbox', 'terminal_list', args, this.context),
        terminal_kill: (args: z.input<typeof Contract_9.sandboxTerminalKillContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalKillContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalKillContract['outputSchema']>>('sandbox', 'terminal_kill', args, this.context),
        terminal_logs: (args: z.input<typeof Contract_9.sandboxTerminalLogsContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalLogsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalLogsContract['outputSchema']>>('sandbox', 'terminal_logs', args, this.context),
        terminal_session_open: (args: z.input<typeof Contract_9.sandboxTerminalSessionOpenContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionOpenContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalSessionOpenContract['outputSchema']>>('sandbox', 'terminal_session_open', args, this.context),
        terminal_session_list: (args: z.input<typeof Contract_9.sandboxTerminalSessionListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalSessionListContract['outputSchema']>>('sandbox', 'terminal_session_list', args, this.context),
        terminal_session_write: (args: z.input<typeof Contract_9.sandboxTerminalSessionWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionWriteContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalSessionWriteContract['outputSchema']>>('sandbox', 'terminal_session_write', args, this.context),
        terminal_session_resize: (args: z.input<typeof Contract_9.sandboxTerminalSessionResizeContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxTerminalSessionResizeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxTerminalSessionResizeContract['outputSchema']>>('sandbox', 'terminal_session_resize', args, this.context),
        network_expose: (args: z.input<typeof Contract_9.sandboxNetworkExposeContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkExposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxNetworkExposeContract['outputSchema']>>('sandbox', 'network_expose', args, this.context),
        network_unexpose: (args: z.input<typeof Contract_9.sandboxNetworkUnexposeContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkUnexposeContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxNetworkUnexposeContract['outputSchema']>>('sandbox', 'network_unexpose', args, this.context),
        network_list: (args: z.input<typeof Contract_9.sandboxNetworkListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxNetworkListContract['outputSchema']>>('sandbox', 'network_list', args, this.context),
        network_set_policy: (args: z.input<typeof Contract_9.sandboxNetworkSetPolicyContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxNetworkSetPolicyContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxNetworkSetPolicyContract['outputSchema']>>('sandbox', 'network_set_policy', args, this.context),
        env_set: (args: z.input<typeof Contract_9.sandboxEnvSetContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxEnvSetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxEnvSetContract['outputSchema']>>('sandbox', 'env_set', args, this.context),
        env_set_secret: (args: z.input<typeof Contract_9.sandboxEnvSetSecretContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxEnvSetSecretContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxEnvSetSecretContract['outputSchema']>>('sandbox', 'env_set_secret', args, this.context),
        env_list: (args: z.input<typeof Contract_9.sandboxEnvListContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxEnvListContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxEnvListContract['outputSchema']>>('sandbox', 'env_list', args, this.context),
        resource_update_limits: (args: z.input<typeof Contract_9.sandboxResourceUpdateLimitsContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxResourceUpdateLimitsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxResourceUpdateLimitsContract['outputSchema']>>('sandbox', 'resource_update_limits', args, this.context),
        resource_get_stats: (args: z.input<typeof Contract_9.sandboxResourceGetStatsContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxResourceGetStatsContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxResourceGetStatsContract['outputSchema']>>('sandbox', 'resource_get_stats', args, this.context),
        state_commit: (args: z.input<typeof Contract_9.sandboxStateCommitContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxStateCommitContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxStateCommitContract['outputSchema']>>('sandbox', 'state_commit', args, this.context),
        state_clone: (args: z.input<typeof Contract_9.sandboxStateCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxStateCloneContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxStateCloneContract['outputSchema']>>('sandbox', 'state_clone', args, this.context),
        create: (args: z.input<typeof Contract_9.sandboxCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['create']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxCrud['create']['outputSchema']>>('sandbox', 'create', args, this.context),
        find: (args: z.input<typeof Contract_9.sandboxCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['find']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxCrud['find']['outputSchema']>>('sandbox', 'find', args, this.context),
        find_one: (args: z.input<typeof Contract_9.sandboxCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['findOne']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxCrud['findOne']['outputSchema']>>('sandbox', 'find_one', args, this.context),
        count: (args: z.input<typeof Contract_9.sandboxCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['count']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxCrud['count']['outputSchema']>>('sandbox', 'count', args, this.context),
        get: (args: z.input<typeof Contract_9.sandboxCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['get']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxCrud['get']['outputSchema']>>('sandbox', 'get', args, this.context),
        update: (args: z.input<typeof Contract_9.sandboxCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['update']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxCrud['update']['outputSchema']>>('sandbox', 'update', args, this.context),
        delete: (args: z.input<typeof Contract_9.sandboxCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_9.sandboxCrud['delete']['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_9.sandboxCrud['delete']['outputSchema']>>('sandbox', 'delete', args, this.context),
    };
    public readonly settings = {
        get: (args: z.input<typeof Contract_10.settingsGetContract['inputSchema']>): Promise<z.infer<typeof Contract_10.settingsGetContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_10.settingsGetContract['outputSchema']>>('settings', 'get', args, this.context),
        update: (args: z.input<typeof Contract_10.settingsUpdateContract['inputSchema']>): Promise<z.infer<typeof Contract_10.settingsUpdateContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_10.settingsUpdateContract['outputSchema']>>('settings', 'update', args, this.context),
        getAll: (args: z.input<typeof Contract_10.settingsGetAllContract['inputSchema']>): Promise<z.infer<typeof Contract_10.settingsGetAllContract['outputSchema']>> => 
            this.executor.execute<z.infer<typeof Contract_10.settingsGetAllContract['outputSchema']>>('settings', 'getAll', args, this.context),
    };
}
