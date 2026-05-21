import { BaseSkillModule, ISkillContext, ISkillRegistry, IEventBus } from 'castellan/core';
import {
    agentCrud,
    agentRunCrud,
    agentRunContract
} from './agent.contract.js';
import {
    agent_run,
    handle_tool_approval,
    handle_tool_completion,
    handle_inference_completion
} from './agent.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * AgentSkill: Orchestrates autonomous execution turns and event-driven tool loops.
 */
export class AgentSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'agent';
    private api?: ContextApi;
    private skills?: ISkillRegistry<ContextApi>;
    private events?: IEventBus;

    constructor() {
        super();

        // 1. Mount Persistence
        this.mountCrud(agentCrud);
        this.mountCrud(agentRunCrud);

        // 2. Mount Tools
        this.mountTool(agentRunContract, agent_run);

        // 3. Event-Driven Loop: Auto-Approval
        this.mountEventHandler('infer:tool_call_requested', async (payload, correlationId) => {
            if (!this.api || !this.skills || !this.events) return;
            const ctx = this.createEventHandlerContext(correlationId);
            await handle_tool_approval(payload.toolCallId, ctx);
        });

        // 4. Event-Driven Loop: Tool Execution & Lifecycle
        this.mountEventHandler('data:updated', async (payload, correlationId) => {
            if (!this.api || !this.skills || !this.events) return;

            if (payload.domain === 'tool_calls') {
                const ctx = this.createEventHandlerContext(correlationId);
                await handle_tool_completion(payload.id, ctx);
            }
        });

        // 5. Event-Driven Loop: Turn Completion
        this.mountEventHandler('infer:completed', async (payload, correlationId) => {
            if (!this.api || !this.skills || !this.events) return;
            const ctx = this.createEventHandlerContext(correlationId);
            await handle_inference_completion(payload.threadId, payload.messageId, ctx);
        });
    }

    public async postInit(context: ISkillContext<ContextApi>): Promise<void> {
        this.api = context.api;
        this.skills = context.skills;
        this.events = context.events;
    }

    private createEventHandlerContext(correlationId: string): ISkillContext<ContextApi> {
        return {
            api: this.api!,
            skills: this.skills!,
            events: this.events!,
            correlationId
        };
    }
}
