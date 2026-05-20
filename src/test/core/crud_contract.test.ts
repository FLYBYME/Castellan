import { describe, it, expect } from 'vitest';
import { defineCrud } from '../../core/crud_contract.js';
import { z } from 'zod';

const TestSchema = z.object({
    name: z.string(),
    age: z.number(),
});

describe('defineCrud', () => {
    describe('Initialization & Guardrails', () => {
        it('Throws on id in base schema', () => {
            const BadSchema = z.object({ id: z.string(), name: z.string() });
            expect(() => defineCrud('user', BadSchema)).toThrowError(/must NOT be defined in the Zod baseSchema shape/);
        });

        it('Defaults applied (plural path)', () => {
            const contracts = defineCrud('user', TestSchema);
            expect(contracts.find.rest?.path).toBe('/users');
            expect(contracts.create.rest?.path).toBe('/users');
        });
    });

    describe('Input Schema Validation (Zod Parsing)', () => {
        // use strict mode if we want it to fail on extra keys like `id`
        const StrictSchema = z.object({
            name: z.string(),
            age: z.number(),
        }).strict();

        const contracts = defineCrud('item', StrictSchema);

        it('CreateInputSchema restrictions', () => {
            const valid = contracts.create.inputSchema.safeParse({ name: 'test', age: 20 });
            expect(valid.success).toBe(true);

            // Using a strict schema base means extra fields will cause safeParse to fail
            const invalidWithId = contracts.create.inputSchema.safeParse({ name: 'test', age: 20, id: '123' });
            expect(invalidWithId.success).toBe(false);
            
            const invalidWithCreatedAt = contracts.create.inputSchema.safeParse({ name: 'test', age: 20, createdAt: new Date() });
            expect(invalidWithCreatedAt.success).toBe(false);
        });

        it('UpdateInputSchema requirements', () => {
            // Fails if id is missing
            const missingId = contracts.update.inputSchema.safeParse({ name: 'test' });
            expect(missingId.success).toBe(false);

            // Succeeds if single partial field provided with id
            const valid = contracts.update.inputSchema.safeParse({ id: '123', name: 'test' });
            expect(valid.success).toBe(true);
        });

        it('ReplaceInputSchema requirements', () => {
            // Fails if base fields missing
            const missingBase = contracts.replace.inputSchema.safeParse({ id: '123', name: 'test' }); // missing age
            expect(missingBase.success).toBe(false);

            // Succeeds with all fields
            const valid = contracts.replace.inputSchema.safeParse({ id: '123', name: 'test', age: 20 });
            expect(valid.success).toBe(true);
        });

        it('ResolveInputSchema logic', () => {
            // Accepts single string
            const validSingle = contracts.resolve.inputSchema.safeParse({ id: '123' });
            expect(validSingle.success).toBe(true);

            // Accepts array of strings
            const validArray = contracts.resolve.inputSchema.safeParse({ id: ['123', '456'] });
            expect(validArray.success).toBe(true);
        });
    });

    describe('REST Contract Generation', () => {
        const contracts = defineCrud('entity', TestSchema);

        it('Correct paths', () => {
            expect(contracts.get.rest?.path).toBe('/entitys/:id');
            expect(contracts.find.rest?.path).toBe('/entitys');
        });

        it('Correct HTTP methods', () => {
            expect(contracts.create.rest?.method).toBe('POST');
            expect(contracts.update.rest?.method).toBe('PATCH');
            expect(contracts.replace.rest?.method).toBe('PUT');
        });
    });
});
