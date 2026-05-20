import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sandbox } from '../../../addons/sandbox/core/Sandbox.js';
import { IFileSystem } from '../../../addons/sandbox/core/IFileSystem.js';

describe('Sandbox State Snapshots & Commits', () => {
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
            commit: vi.fn().mockResolvedValue({ Id: 'sha256:newimageid123' })
        };

        mockDocker = {
            getImage: vi.fn().mockReturnValue({ inspect: vi.fn().mockResolvedValue({}) }),
            createContainer: vi.fn().mockResolvedValue(mockContainer),
            getContainer: vi.fn().mockReturnValue(mockContainer)
        };

        mockFs = {} as unknown as IFileSystem;
    });

    it('commits running container state with default tag', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.initialize('node:18', '/mock/root/sandbox-123', 512, true, []);

        const imageId = await sandbox.commitState('my-snapshot');
        expect(imageId).toBe('sha256:newimageid123');

        expect(mockContainer.commit).toHaveBeenCalledWith({
            repo: 'my-snapshot',
            tag: 'latest'
        });
    });

    it('commits container state with explicit custom tag', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.initialize('node:18', '/mock/root/sandbox-123', 512, true, []);

        await sandbox.commitState('my-repo:v1.2.3');

        expect(mockContainer.commit).toHaveBeenCalledWith({
            repo: 'my-repo',
            tag: 'v1.2.3'
        });
    });

    it('fails if commit is attempted on uninitialized sandbox', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await expect(sandbox.commitState('fail-snapshot')).rejects.toThrow('No active container');
    });
});
