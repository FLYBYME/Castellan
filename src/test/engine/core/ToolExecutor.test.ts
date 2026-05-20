import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToolExecutor } from '../../../engine/core/ToolExecutor.js';
import { SkillRegistry } from '../../../engine/core/SkillRegistry.js';
import { Database } from '../../../engine/db/Database.js';
import { defineCrud } from '../../../core/crud_contract.js';
import { z } from 'zod';

const TestSchema = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

describe('ToolExecutor', () => {
    let mockRegistry: any;
    let mockDb: any;
    let mockRepo: any;
    let executor: ToolExecutor;
    let mockContext: any;
    let crudContracts: any;

    beforeEach(() => {
        const BaseTestSchema = z.object({
            name: z.string(),
        });
        crudContracts = defineCrud('test_domain', BaseTestSchema);

        mockRegistry = {
            getSkill: vi.fn(),
        };

        mockRepo = {
            find: vi.fn(),
            findOne: vi.fn(),
            count: vi.fn(),
            get: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };

        mockDb = {
            repo: vi.fn().mockReturnValue(mockRepo),
        };

        executor = new ToolExecutor(
            mockRegistry as unknown as SkillRegistry,
            mockDb as unknown as Database
        );

        mockContext = {
            correlationId: 'corr-123',
        };
    });

    describe('executeCrud', () => {
        beforeEach(() => {
            mockRegistry.getSkill.mockReturnValue({
                getContracts: () => Object.values(crudContracts).filter((c: any) => typeof c === 'object' && c.domain),
                isCrud: () => true,
            });
        });

        it('find: passes query, limit, offset, and parsed sort', async () => {
            mockRepo.find.mockResolvedValue([]);

            await executor.execute('test_domain', 'find', {
                query: { name: 'test' },
                limit: 10,
                offset: 5,
                sort: ['-createdAt', 'name:asc']
            }, mockContext);

            expect(mockRepo.find).toHaveBeenCalledWith({
                query: { name: 'test' },
                limit: 10,
                offset: 5,
                sort: { createdAt: -1, name: 1 }
            });
        });

        it('find_one: passes query and parsed sort', async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await executor.execute('test_domain', 'find_one', {
                query: { name: 'test' },
                sort: 'name'
            }, mockContext);

            expect(mockRepo.findOne).toHaveBeenCalledWith({ name: 'test' }, { sort: { name: 1 } });
        });

        it('update: isolates id from input payload', async () => {
            mockRepo.update.mockResolvedValue(null);

            await executor.execute('test_domain', 'update', {
                id: '123',
                name: 'new name'
            }, mockContext);

            expect(mockRepo.update).toHaveBeenCalledWith('123', { id: '123', name: 'new name' }, 'corr-123');
        });
    });
});
