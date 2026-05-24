import { BaseSkillModule, ISkillContext, SkillActionHandler } from '@flybyme/castellan/core';
import { z } from 'zod';
import {
    ollamaCrud,
    modelCrud,
    threadCrud,
    messageCrud,
    toolCallCrud,
    inferQueueCrud,
    inferChatContract,
    inferApproveToolContract,
    inferRefreshInventoryContract,
    inferAcquireOllamaContract,
    inferReleaseOllamaContract,
    inferRejectToolContract,
    inferQueueStatusContract
} from './infer.contract.js';
import {
    infer_chat,
    approve_tool,
    refresh_inventory,
    acquire_ollama,
    release_ollama,
    process_infer_queue,
    reject_tool,
    queue_status
} from './infer.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';
import { InferScheduler } from './InferScheduler.js';

/**
 * InferSkill: Manages LLM inference, stateful threads, and Ollama concurrency.
 */
export class InferSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'infer';
    private contextApi?: ISkillContext<ContextApi>;
    private scheduler?: InferScheduler;

    constructor() {
        super();

        // 1. Mount State Persistence (CRUD)
        this.mountCrud(ollamaCrud);
        this.mountCrud(modelCrud);
        this.mountCrud(threadCrud);
        this.mountCrud(messageCrud);
        this.mountCrud(toolCallCrud);
        this.mountCrud(inferQueueCrud);

        // 2. Mount inference tools
        this.mountTool(
            inferChatContract,
            infer_chat as SkillActionHandler<
                z.infer<typeof inferChatContract.inputSchema>,
                z.infer<typeof inferChatContract.outputSchema>,
                ContextApi
            >
        );
        this.mountTool(inferApproveToolContract, approve_tool);
        this.mountTool(inferRejectToolContract, reject_tool);
        this.mountTool(inferRefreshInventoryContract, refresh_inventory);
        this.mountTool(inferAcquireOllamaContract, acquire_ollama);
        this.mountTool(inferReleaseOllamaContract, release_ollama);
        this.mountTool(inferQueueStatusContract, queue_status);

        // 3. Lifecycle Handlers
        this.mountEventHandler('data:created', async (payload) => {
            if (payload.domain === 'ollama') {
                console.log(`[InferSkill] New node discovered: ${payload.id}.`);
            }
        });
    }

    public async postInit(context: ISkillContext<ContextApi>): Promise<void> {
        this.contextApi = context;
        this.scheduler = new InferScheduler(context);
        this.scheduler.start();
    }
}
