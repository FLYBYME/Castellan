import { z } from 'zod';
import { ToolContract } from './tool_contract.js';
import { ICastellanApi } from './api.js';
import { IEventBus, EventRegistry } from './events.js';
import { AnyCrudContracts } from './crud_contract.js';

export interface ISkillRegistry<TApi extends ICastellanApi = ICastellanApi> {
    getSkill(domain: string): ISkillModule<TApi> | undefined;
    getTool(toolName: string): Promise<ToolContract<z.ZodTypeAny, z.ZodTypeAny> | undefined>;
}

/**
 * ISkillContext: The strictly-typed execution context injected into every skill.
 */
export interface ISkillContext<TApi extends ICastellanApi = ICastellanApi> {
    readonly api: TApi;
    readonly events: IEventBus;
    readonly skills: ISkillRegistry<TApi>;
    readonly sandboxId?: string;
    readonly correlationId: string;
    readonly signal?: AbortSignal;
}

/**
 * SkillActionHandler: The function signature for a tool's implementation.
 */
export type SkillActionHandler<TInput, TOutput, TApi extends ICastellanApi> = (
    args: TInput,
    context: ISkillContext<TApi>
) => Promise<TOutput> | AsyncIterable<TOutput>;

/**
 * EventHandler: Signature for a strictly-typed event subscriber.
 */
export type EventHandler<K extends keyof EventRegistry> = (
    payload: EventRegistry[K],
    correlationId: string
) => void | Promise<void>;

/**
 * ISkillModule: The interface every skill must implement.
 */
export interface ISkillModule<TApi extends ICastellanApi = ICastellanApi> {
    readonly domain: string;
    getContracts(): ToolContract<z.ZodTypeAny, z.ZodTypeAny>[];
    execute<T>(domain: string, action: string, args: unknown, context: ISkillContext<TApi>): Promise<T>;
    postInit?(context: ISkillContext<TApi>): Promise<void>;
    isCrud(domain: string, action: string): boolean;
    getEventHandlers(): Map<keyof EventRegistry, EventHandler<keyof EventRegistry>>;
}

/**
 * BaseSkillModule: Abstract base class for all skills.
 */
export abstract class BaseSkillModule<TApi extends ICastellanApi = ICastellanApi> implements ISkillModule<TApi> {
    public abstract readonly domain: string;

    private eventHandlers: Map<keyof EventRegistry, EventHandler<keyof EventRegistry>> = new Map();

    protected handlers: Map<string, {
        contract: ToolContract<z.ZodTypeAny, z.ZodTypeAny>;
        handler: SkillActionHandler<unknown, unknown, TApi>;
    }> = new Map();

    public getContracts(): ToolContract<z.ZodTypeAny, z.ZodTypeAny>[] {
        return Array.from(this.handlers.values()).map(h => h.contract);
    }

    public async execute<T>(domain: string, action: string, args: unknown, context: ISkillContext<TApi>): Promise<T> {
        const binding = this.handlers.get(`${domain}:${action}`);
        if (!binding) {
            throw new Error(`Execution Error: Action '${action}' not found in domain '${domain}' of skill '${this.domain}'.`);
        }

        const result = binding.handler(args, context);
        if (result instanceof Promise) {
            return await (result as Promise<T>);
        }

        throw new Error(`Execution Error: Action '${action}' in '${domain}' of skill '${this.domain}' returned a stream.`);
    }

    public isCrud(domain: string, action: string): boolean {
        const binding = this.handlers.get(`${domain}:${action}`);
        return !!binding?.contract.isCrud;
    }

    public getEventHandlers(): Map<keyof EventRegistry, EventHandler<keyof EventRegistry>> {
        return this.eventHandlers;
    }

    /**
     * mountTool: Register a custom tool handler.
     */
    protected mountTool<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny>(
        contract: ToolContract<TIn, TOut>,
        handler: SkillActionHandler<z.infer<TIn>, z.infer<TOut>, TApi>
    ): void {
        this.handlers.set(`${contract.domain}:${contract.action}`, {
            contract: contract as unknown as ToolContract<z.ZodTypeAny, z.ZodTypeAny>,
            handler: handler as SkillActionHandler<unknown, unknown, TApi>
        });
    }

    /**
     * mountCrud: Mounts standard persistence routing for a domain.
     */
    protected mountCrud(contracts: AnyCrudContracts): void {
        const keys = ['create', 'find', 'findOne', 'get', 'update', 'delete', 'count', 'replace', 'resolve', 'createMany'] as const;
        for (const key of keys) {
            const contract = contracts[key];
            if (contract && typeof contract === 'object' && 'domain' in contract && 'action' in contract) {
                const tool = contract as ToolContract<z.ZodTypeAny, z.ZodTypeAny>;
                this.mountTool(tool, async () => {
                    throw new Error(`Engine Error: CRUD action "${tool.action}" for domain "${tool.domain}" was not intercepted.`);
                });
            }
        }
    }

    /**
     * mountEventHandler: Declaratively register an event subscriber.
     * Subscriptions are activated automatically during engine boot.
     */
    protected mountEventHandler<K extends keyof EventRegistry>(
        name: K,
        handler: EventHandler<K>
    ): void {
        this.eventHandlers.set(name, handler as EventHandler<keyof EventRegistry>);
    }
}
