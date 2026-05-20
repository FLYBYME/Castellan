import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sandbox } from '../../../addons/sandbox/core/Sandbox.js';
import { IFileSystem } from '../../../addons/sandbox/core/IFileSystem.js';

describe('Sandbox Core Lifecycle', () => {
    let mockDocker: any;
    let mockFs: any;
    let mockContainer: any;
    let mockImage: any;

    beforeEach(() => {
        mockContainer = {
            id: 'container-123',
            start: vi.fn().mockResolvedValue({}),
            inspect: vi.fn().mockResolvedValue({
                NetworkSettings: {
                    Ports: {}
                }
            }),
            update: vi.fn().mockResolvedValue({}),
            stats: vi.fn(),
            commit: vi.fn()
        };

        mockImage = {
            inspect: vi.fn().mockResolvedValue({})
        };

        mockDocker = {
            getImage: vi.fn().mockReturnValue(mockImage),
            createContainer: vi.fn().mockResolvedValue(mockContainer),
            getContainer: vi.fn().mockReturnValue(mockContainer)
        };

        mockFs = {
            rm: vi.fn().mockResolvedValue(true),
            mkdir: vi.fn().mockResolvedValue(true),
            access: vi.fn().mockResolvedValue(true),
            execOnHost: vi.fn().mockResolvedValue(true)
        } as unknown as IFileSystem;
    });

    it('requires initialize before running commands', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await expect(sandbox.executeCommand(['ls'], '.', {}, 5000)).rejects.toThrow('No active container');
    });

    it('cleans sandbox path successfully', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        const success = await sandbox.cleanSandbox('sandbox-123');
        expect(success).toBe(true);
        expect(mockFs.rm).toHaveBeenCalledWith('/mock/root/sandbox-123', { recursive: true, force: true });
    });

    it('initializes with image and custom exposed ports', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        const containerId = await sandbox.initialize('node:18', '/mock/root/sandbox-123', 512, true, [8080]);
        
        expect(mockDocker.createContainer).toHaveBeenCalledWith(expect.objectContaining({
            Image: 'node:18',
            WorkingDir: '/workspace',
            HostConfig: expect.objectContaining({
                Binds: ['/mock/root/sandbox-123:/workspace'],
                Memory: 512 * 1024 * 1024,
                NetworkMode: 'bridge'
            })
        }));
        expect(mockContainer.start).toHaveBeenCalled();
        expect(sandbox.activeContainerId).toBeDefined();
    });

    it('falls back to node:18 if custom image pull fails', async () => {
        // Mock custom image to not exist locally
        mockDocker.getImage.mockImplementationOnce(() => {
            throw new Error('Image not found');
        });
        
        mockDocker.pull = vi.fn().mockImplementation(() => {
            throw new Error('Pull failed');
        });

        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.initialize('invalid-image:latest', '/mock/root/sandbox-123', 256, true, []);

        // Should fall back and try initializing with node:18
        expect(mockDocker.createContainer).toHaveBeenCalledWith(expect.objectContaining({
            Image: 'node:18'
        }));
    });
});
