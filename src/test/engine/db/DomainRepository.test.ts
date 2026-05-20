import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DomainRepository } from '../../../engine/db/DomainRepository.js';
import { z } from 'zod';
import { Collection, ObjectId } from 'mongodb';
import { IEventBus } from '../../../core/events.js';

const TestSchema = z.object({
    id: z.string(),
    name: z.string(),
    value: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
type TestEntity = z.infer<typeof TestSchema>;

describe('DomainRepository', () => {
    let mockCollection: any;
    let mockEventBus: any;
    let repository: DomainRepository<TestEntity>;

    beforeEach(() => {
        mockCollection = {
            find: vi.fn(),
            findOne: vi.fn(),
            countDocuments: vi.fn(),
            insertOne: vi.fn(),
            findOneAndUpdate: vi.fn(),
            deleteOne: vi.fn(),
        };

        mockEventBus = {
            dispatch: vi.fn(),
            subscribe: vi.fn(),
        };

        repository = new DomainRepository(
            mockCollection as unknown as Collection<any>,
            TestSchema,
            'test_domain',
            mockEventBus as unknown as IEventBus
        );
    });

    describe('Query & ID Mapping', () => {
        it('Translates flat IDs', async () => {
            const validHex = new ObjectId().toHexString();
            
            const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);
            
            await repository.find({ query: { id: validHex } });
            
            expect(mockCollection.find).toHaveBeenCalledWith({ _id: new ObjectId(validHex) });
        });

        it('Translates $in / $nin operators', async () => {
            const hex1 = new ObjectId().toHexString();
            const hex2 = new ObjectId().toHexString();
            
            const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);
            
            await repository.find({ query: { id: { $in: [hex1, hex2], $nin: [hex1] } } });
            
            const callArgs = mockCollection.find.mock.calls[0][0];
            expect(callArgs._id.$in).toEqual([new ObjectId(hex1), new ObjectId(hex2)]);
            expect(callArgs._id.$nin).toEqual([new ObjectId(hex1)]);
        });

        it('Translates $or / $and operators', async () => {
            const hex1 = new ObjectId().toHexString();
            const hex2 = new ObjectId().toHexString();
            
            const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);
            
            await repository.find({ query: { $or: [{ id: hex1 }, { id: hex2 }] } });
            
            expect(mockCollection.find).toHaveBeenCalledWith({
                $or: [{ _id: new ObjectId(hex1) }, { _id: new ObjectId(hex2) }]
            });
        });

        it('Strips invalid outbound data', async () => {
            const validId = new ObjectId();
            mockCollection.findOne.mockResolvedValue({
                _id: validId,
                name: 'test',
                value: 42,
                createdAt: new Date(),
                updatedAt: new Date(),
                invalidField: 'should be stripped'
            });

            const result = await repository.get(validId.toHexString());
            expect((result as any).invalidField).toBeUndefined();
            expect(result?.name).toBe('test');
        });

        it('Should not map invalid flat IDs to empty query (BUG TEST)', async () => {
            const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);
            
            await repository.find({ query: { id: "not-a-valid-hex-id" } });
            
            // Wait, we WANT this to fail right now so the user sees the bug in action.
            // If the bug exists, the query will be empty `{}` instead of `{ _id: null }` or throwing.
            // We will assert that the query is NOT empty, which will fail if the bug is present.
            const callArgs = mockCollection.find.mock.calls[0][0];
            expect(Object.keys(callArgs).length).toBeGreaterThan(0);
        });

        it('Should not map invalid $in array IDs to empty query (BUG TEST)', async () => {
            const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);
            
            await repository.find({ query: { id: { $in: ["not-a-valid-hex-id"] } } });
            
            const callArgs = mockCollection.find.mock.calls[0][0];
            // If the bug is present, the $in array will be empty, matching nothing (which might be okay, but let's check).
            // Actually, if we pass an invalid ID, we'd rather it not be silently swallowed if it's the only one.
            // But let's focus on the flat ID bug first.
            expect(callArgs._id.$in.length).toBeGreaterThan(0);
        });

        it('Fails on invalid Zod schema', async () => {
            const validId = new ObjectId();
            mockCollection.findOne.mockResolvedValue({
                _id: validId,
                name: 'test',
                // missing value field, should fail zod validation
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await expect(repository.get(validId.toHexString())).rejects.toThrow();
        });
    });

    describe('Read Operations', () => {
        it('get with invalid ID', async () => {
            const result = await repository.get('not-a-mongo-id');
            expect(result).toBeUndefined();
            expect(mockCollection.findOne).not.toHaveBeenCalled();
        });

        it('get not found', async () => {
            const validId = new ObjectId();
            mockCollection.findOne.mockResolvedValue(null);
            
            const result = await repository.get(validId.toHexString());
            expect(result).toBeUndefined();
        });

        it('find pagination', async () => {
            const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);

            await repository.find({ offset: 10, limit: 5 });

            expect(cursorMock.skip).toHaveBeenCalledWith(10);
            expect(cursorMock.limit).toHaveBeenCalledWith(5);
        });

        it('list pagination math', async () => {
            const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);
            mockCollection.countDocuments.mockResolvedValue(51);

            const result = await repository.list({ page: 1, pageSize: 50 });

            expect(result.total).toBe(51);
            expect(result.totalPages).toBe(2);
            expect(cursorMock.skip).toHaveBeenCalledWith(0);
            expect(cursorMock.limit).toHaveBeenCalledWith(50);
        });

        it('list default sorts', async () => {
             const cursorMock = {
                limit: vi.fn().mockReturnThis(),
                skip: vi.fn().mockReturnThis(),
                sort: vi.fn().mockReturnThis(),
                toArray: vi.fn().mockResolvedValue([]),
            };
            mockCollection.find.mockReturnValue(cursorMock);
            mockCollection.countDocuments.mockResolvedValue(10);

            await repository.list();

            expect(cursorMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
        });
    });

    describe('Write Operations', () => {
        it('create timestamps and event emission', async () => {
            const mockId = new ObjectId();
            const now = new Date();
            mockCollection.insertOne.mockResolvedValue({ insertedId: mockId });
            mockCollection.findOne.mockResolvedValue({
                _id: mockId,
                name: 'new item',
                value: 10,
                createdAt: now,
                updatedAt: now
            });

            const result = await repository.create({ name: 'new item', value: 10 }, 'corr-123');

            expect(result.id).toBe(mockId.toHexString());
            expect(result.createdAt).toBeInstanceOf(Date);
            
            const insertCall = mockCollection.insertOne.mock.calls[0][0];
            expect(insertCall.createdAt).toBeInstanceOf(Date);
            expect(insertCall.updatedAt).toBeInstanceOf(Date);

            expect(mockEventBus.dispatch).toHaveBeenCalledWith('data:created', 'corr-123', expect.objectContaining({
                domain: 'test_domain',
                id: mockId.toHexString()
            }));
        });

        it('update payload isolation and event emission', async () => {
            const mockId = new ObjectId();
            const hexId = mockId.toHexString();
            const now = new Date();
            
            mockCollection.findOneAndUpdate.mockResolvedValue({
                _id: mockId,
                name: 'updated',
                value: 10,
                createdAt: now,
                updatedAt: now
            });

            const result = await repository.update(hexId, { name: 'updated', id: 'should-be-removed' } as any, 'corr-123');

            const updateCall = mockCollection.findOneAndUpdate.mock.calls[0][1];
            expect(updateCall.$set.id).toBeUndefined();
            expect(updateCall.$set.name).toBe('updated');
            expect(updateCall.$set.updatedAt).toBeInstanceOf(Date);

            expect(mockEventBus.dispatch).toHaveBeenCalledWith('data:updated', 'corr-123', expect.objectContaining({
                domain: 'test_domain',
                id: hexId,
                patch: { name: 'updated', id: 'should-be-removed' } // the patch parameter includes what was passed
            }));
        });
        
        it('update not found event omission', async () => {
            const mockId = new ObjectId();
            mockCollection.findOneAndUpdate.mockResolvedValue(null);
            
            await repository.update(mockId.toHexString(), { name: 'test' }, 'corr-123');
            
            expect(mockEventBus.dispatch).not.toHaveBeenCalled();
        });

        it('delete missing document', async () => {
            const mockId = new ObjectId();
            mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

            const success = await repository.delete(mockId.toHexString(), 'corr-123');

            expect(success).toBe(false);
            expect(mockEventBus.dispatch).not.toHaveBeenCalled();
        });
        
        it('delete existing document', async () => {
            const mockId = new ObjectId();
            mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const success = await repository.delete(mockId.toHexString(), 'corr-123');

            expect(success).toBe(true);
            expect(mockEventBus.dispatch).toHaveBeenCalledWith('data:deleted', 'corr-123', {
                domain: 'test_domain',
                id: mockId.toHexString()
            });
        });
    });
});
