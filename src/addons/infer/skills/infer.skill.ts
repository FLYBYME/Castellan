import { BaseSkillModule, SkillActionHandler } from 'castellan/core';
import { z } from 'zod';
import {
    ollamaCrud,
    modelCrud,
    threadCrud,
    messageCrud,
    toolCallCrud,
    inferChatContract,
    inferApproveToolContract,
    inferRefreshInventoryContract,
    inferAcquireOllamaContract,
    inferReleaseOllamaContract
} from './infer.contract.js';
import {
    infer_chat,
    approve_tool,
    refresh_inventory,
    acquire_ollama,
    release_ollama
} from './infer.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * InferSkill: Manages LLM inference, stateful threads, and Ollama concurrency.
 */
export class InferSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'infer';

    constructor() {
        super();

        // 1. Mount State Persistence (CRUD)
        this.mountCrud(ollamaCrud);
        this.mountCrud(modelCrud);
        this.mountCrud(threadCrud);
        this.mountCrud(messageCrud);
        this.mountCrud(toolCallCrud);

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
        this.mountTool(inferRefreshInventoryContract, refresh_inventory);
        this.mountTool(inferAcquireOllamaContract, acquire_ollama);
        this.mountTool(inferReleaseOllamaContract, release_ollama);

        // 3. Lifecycle Handlers
        this.mountEventHandler('data:created', async (payload) => {
            if (payload.domain === 'ollama') {
                console.log(`[InferSkill] New node discovered: ${payload.id}.`);
            }
        });
    }
}
