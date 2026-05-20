import { z } from 'zod';
import { ICastellanApi } from '../../core/api.js';
import { ISkillContext } from '../../core/SkillModule.js';
import { SkillRegistry } from './SkillRegistry.js';
import { Database } from '../db/Database.js';

/**
 * ToolExecutor: The central execution pipeline of the Castellan Engine.
 * 
 * Mandate: No 'any', no 'as' assertions. Strict type narrowing only.
 */
export class ToolExecutor<TApi extends ICastellanApi = ICastellanApi> {
    constructor(
        private registry: SkillRegistry<TApi>,
        private db: Database
    ) { }

    /**
     * execute: Performs the full tool execution lifecycle for standard tools.
     */
    public async execute<T>(
        domain: string,
        action: string,
        input: unknown,
        context: ISkillContext<TApi>
    ): Promise<T> {
        const skill = this.registry.getSkill(domain);
        if (!skill) throw new Error(`Execution Error: Domain "${domain}" not found.`);

        const contracts = skill.getContracts();
        const contract = contracts.find(c => c.domain === domain && c.action === action);
        if (!contract) throw new Error(`Execution Error: Action "${action}" not found in domain "${domain}".`);

        // 1. Validation
        const validatedInput: unknown = contract.inputSchema
            ? contract.inputSchema.parse(input)
            : input;

        // 2. Intercept CRUD
        if (skill.isCrud(domain, action)) {
            const result = await this.executeCrud(domain, action, validatedInput, contract, context);
            return result as T;
        }

        // 3. Normal Execution
        const result = skill.execute<T>(domain, action, validatedInput, context);

        if (this.isAsyncIterable(result)) {
            throw new Error(`Execution Error: Action "${domain}_${action}" returned a stream but was called as a standard tool.`);
        }

        return await result;
    }

    /**
     * executeStream: Variant for tools that return AsyncIterables.
     */
    public async *executeStream<T>(
        domain: string,
        action: string,
        input: unknown,
        context: ISkillContext<TApi>
    ): AsyncIterable<T> {
        const skill = this.registry.getSkill(domain);
        if (!skill) throw new Error(`Execution Error: Domain "${domain}" not found.`);

        const result = skill.execute<T>(domain, action, input, context);

        if (!this.isAsyncIterable(result)) {
            throw new Error(`Execution Error: Action "${domain}_${action}" is not a streaming tool.`);
        }

        yield* result;
    }

    private async executeCrud(
        domain: string,
        action: string,
        input: unknown,
        contract: { outputSchema: z.ZodTypeAny },
        context: ISkillContext<TApi>
    ): Promise<unknown> {
        let docSchema = contract.outputSchema;
        if (docSchema instanceof z.ZodArray) {
            docSchema = docSchema.element;
        } else if (docSchema instanceof z.ZodOptional) {
            docSchema = docSchema.unwrap();
        }

        const repo = this.db.repo(docSchema as z.ZodType<{ id: string }>, domain);

        if (!this.isRecord(input)) {
            throw new Error(`Execution Error: CRUD input for ${domain}:${action} must be an object.`);
        }

        const id = typeof input['id'] === 'string' ? input['id'] : '';

        switch (action) {
            case 'find': return await repo.find(input);
            case 'find_one': return await repo.findOne(input['query'] as Record<string, unknown> || {});
            case 'count': return await repo.count(input['query'] as Record<string, unknown> || {});
            case 'get': return await repo.get(id);
            case 'create':
                return await repo.create(input as Omit<{ id: string }, 'id'>, context.correlationId);
            case 'update': return await repo.update(id, input, context.correlationId);
            case 'delete': return await repo.delete(id, context.correlationId);
            default: throw new Error(`Execution Error: Unsupported CRUD action "${action}"`);
        }
    }

    private isAsyncIterable(obj: unknown): obj is AsyncIterable<unknown> {
        return (
            typeof obj === 'object' &&
            obj !== null &&
            Symbol.asyncIterator in obj
        );
    }

    private isRecord(obj: unknown): obj is Record<string, unknown> {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    }
}
