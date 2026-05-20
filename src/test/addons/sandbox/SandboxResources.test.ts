import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sandbox } from '../../../addons/sandbox/core/Sandbox.js';
import { IFileSystem } from '../../../addons/sandbox/core/IFileSystem.js';

describe('Sandbox Resource Constraints & Telemetry', () => {
    let mockDocker: any;
    let mockFs: any;
    let mockContainer: any;

    beforeEach(() => {
        mockContainer = {
            id: 'container-123',
            start: vi.fn().mockResolvedValue({}),
            inspect: vi.fn().mockResolvedValue({
                NetworkSettings: { Ports: {} }
            }),
            update: vi.fn().mockResolvedValue({}),
            stats: vi.fn()
        };

        mockDocker = {
            getImage: vi.fn().mockReturnValue({ inspect: vi.fn().mockResolvedValue({}) }),
            createContainer: vi.fn().mockResolvedValue(mockContainer),
            getContainer: vi.fn().mockReturnValue(mockContainer)
        };

        mockFs = {} as unknown as IFileSystem;
    });

    it('updates dynamic resource limits', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.initialize('node:18', '/mock/root/sandbox-123', 512, true, []);

        const success = await sandbox.updateResourceLimits(4, 1024);
        expect(success).toBe(true);

        expect(mockContainer.update).toHaveBeenCalledWith({
            Memory: 1024 * 1024 * 1024,
            CpuQuota: 400000,
            CpuPeriod: 100000
        });
    });

    it('calculates live container telemetry and handles CPU utilization calculation', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.initialize('node:18', '/mock/root/sandbox-123', 512, true, []);

        // Mock stats return data
        mockContainer.stats.mockResolvedValue({
            cpu_stats: {
                cpu_usage: { total_usage: 1000000 },
                system_cpu_usage: 5000000,
                online_cpus: 4
            },
            precpu_stats: {
                cpu_usage: { total_usage: 500000 },
                system_cpu_usage: 4000000
            },
            memory_stats: {
                usage: 256 * 1024 * 1024,
                limit: 1024 * 1024 * 1024
            }
        });

        const stats = await sandbox.getResourceStats();

        // Formula: (cpuDelta / systemDelta) * onlineCpu * 100
        // cpuDelta = 1000000 - 500000 = 500000
        // systemDelta = 5000000 - 4000000 = 1000000
        // cpuPercent = (500000 / 1000000) * 4 * 100 = 200%
        expect(stats.cpuPercent).toBe(200);
        expect(stats.memoryMb).toBe(256);
        expect(stats.memoryLimitMb).toBe(1024);
    });

    it('gracefully falls back on stats fetch failure', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.initialize('node:18', '/mock/root/sandbox-123', 512, true, []);

        mockContainer.stats.mockRejectedValue(new Error('Docker engine offline'));

        const stats = await sandbox.getResourceStats();
        expect(stats).toEqual({
            cpuPercent: 0,
            memoryMb: 0,
            memoryLimitMb: 512
        });
    });
});
