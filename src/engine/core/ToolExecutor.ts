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
        const startTime = Date.now();
        //console.log(`[ToolExecutor] [${domain}:${action}] [START] CorrelationId: ${context.correlationId}`);
        //console.log(`[ToolExecutor] [${domain}:${action}] Input:`, (JSON.stringify(input) ?? 'undefined').slice(0, 1000));

        try {
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
            let result: any;
            if (skill.isCrud(domain, action)) {
                result = await this.executeCrud(domain, action, validatedInput, contract, context);
            } else {
                // 3. Normal Execution
                result = await skill.execute<T>(domain, action, validatedInput, context);
            }

            if (this.isAsyncIterable(result)) {
                throw new Error(`Execution Error: Action "${domain}_${action}" returned a stream but was called as a standard tool.`);
            }

            const duration = Date.now() - startTime;
            //console.log(`[ToolExecutor] [${domain}:${action}] [SUCCESS] Duration: ${duration}ms`);
            //console.log(`[ToolExecutor] [${domain}:${action}] Output:`, (JSON.stringify(result) ?? 'undefined').slice(0, 1000));

            return result as T;
        } catch (err) {
            const duration = Date.now() - startTime;
            //console.error(`[ToolExecutor] [${domain}:${action}] [ERROR] Duration: ${duration}ms. Message: ${err instanceof Error ? err.message : String(err)}`);
            if (err && typeof err === 'object') {
                if ((err as any).stdout) //console.error(`[${domain}:${action}] [STDOUT]\n${(err as any).stdout}`);
                    if ((err as any).stderr) //console.error(`[${domain}:${action}] [STDERR]\n${(err as any).stderr}`);
            }
            throw err;
        }
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
        const startTime = Date.now();
        //console.log(`[ToolExecutor] [${domain}:${action}] [STREAM_START] CorrelationId: ${context.correlationId}`);
        //console.log(`[ToolExecutor] [${domain}:${action}] Input:`, (JSON.stringify(input) ?? 'undefined').slice(0, 1000));

        try {
            const skill = this.registry.getSkill(domain);
            if (!skill) throw new Error(`Execution Error: Domain "${domain}" not found.`);

            const result = skill.executeStream<T>(domain, action, input, context);

            let chunkCount = 0;
            for await (const chunk of result) {
                chunkCount++;
                //console.log(`[ToolExecutor] [${domain}:${action}] [CHUNK ${chunkCount}]`, (JSON.stringify(chunk) ?? 'undefined').slice(0, 200));
                yield chunk;
            }

            const duration = Date.now() - startTime;
            //console.log(`[ToolExecutor] [${domain}:${action}] [STREAM_SUCCESS] Duration: ${duration}ms. Total chunks: ${chunkCount}`);
        } catch (err) {
            const duration = Date.now() - startTime;
            //console.error(`[ToolExecutor] [${domain}:${action}] [STREAM_ERROR] Duration: ${duration}ms. Message: ${err instanceof Error ? err.message : String(err)}`);
            throw err;
        }
    }

    private async executeCrud(
        domain: string,
        action: string,
        input: unknown,
        contract: { outputSchema: z.ZodTypeAny },
        context: ISkillContext<TApi>
    ): Promise<unknown> {
        const skill = this.registry.getSkill(domain);
        if (!skill) throw new Error(`Execution Error: Domain "${domain}" not found.`);

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

        // 1. Before Hook
        let effectiveInput = input;
        if (skill.beforeCrud) {
            effectiveInput = await skill.beforeCrud(domain, action, input, context) as Record<string, unknown>;
        }

        const id = typeof effectiveInput['id'] === 'string' ? effectiveInput['id'] : '';

        let result: unknown;
        switch (action) {
            case 'find': {
                const query = effectiveInput['query'] as Record<string, unknown> || {};
                const sortRaw = effectiveInput['sort'];
                const sort = (typeof sortRaw === 'string' || Array.isArray(sortRaw))
                    ? parseSort(sortRaw)
                    : undefined;
                result = await repo.find({
                    query,
                    limit: typeof effectiveInput['limit'] === 'number' ? effectiveInput['limit'] : undefined,
                    offset: typeof effectiveInput['offset'] === 'number' ? effectiveInput['offset'] : undefined,
                    sort
                });
                break;
            }
            case 'find_one': {
                const query = effectiveInput['query'] as Record<string, unknown> || {};
                const sortRaw = effectiveInput['sort'];
                const sort = (typeof sortRaw === 'string' || Array.isArray(sortRaw))
                    ? parseSort(sortRaw)
                    : undefined;
                result = await repo.findOne(query, { sort });
                break;
            }
            case 'count':
                result = await repo.count(effectiveInput['query'] as Record<string, unknown> || {});
                break;
            case 'get':
                result = await repo.get(id);
                break;
            case 'create':
                result = await repo.create(effectiveInput as Omit<{ id: string }, 'id'>, context.correlationId);
                break;
            case 'update':
                result = await repo.update(id, effectiveInput, context.correlationId);
                break;
            case 'delete': {
                const itemBefore = await repo.get(id);
                const success = await repo.delete(id, context.correlationId);
                result = { success, id, item: itemBefore };
                break;
            }
            default: throw new Error(`Execution Error: Unsupported CRUD action "${action}"`);
        }

        // 2. After Hook
        if (skill.afterCrud) {
            result = await skill.afterCrud(domain, action, result, context);
        }

        return result;
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

function parseSort(sort: string | string[]): Record<string, 1 | -1> {
    const result: Record<string, 1 | -1> = {};
    const parts = Array.isArray(sort) ? sort : [sort];
    for (const part of parts) {
        if (typeof part !== 'string') continue;
        const subParts = part.split(',').map(s => s.trim()).filter(Boolean);
        for (const item of subParts) {
            if (item.startsWith('-')) {
                result[item.slice(1)] = -1;
            } else if (item.startsWith('+')) {
                result[item.slice(1)] = 1;
            } else if (item.includes(':')) {
                const [field, dir] = item.split(':').map(s => s.trim());
                if (field) {
                    result[field] = dir?.toLowerCase() === 'desc' ? -1 : 1;
                }
            } else {
                result[item] = 1;
            }
        }
    }
    return result;
}
