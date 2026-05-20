import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sandbox } from '../../../addons/sandbox/core/Sandbox.js';
import { IFileSystem } from '../../../addons/sandbox/core/IFileSystem.js';

describe('Sandbox Environment & Secrets Injection', () => {
    let mockDocker: any;
    let mockFs: any;
    let mockContainer: any;
    let mockExec: any;

    beforeEach(() => {
        const mockStream = {
            on: vi.fn((event, callback) => {
                if (event === 'end') {
                    process.nextTick(callback);
                }
            })
        };

        mockExec = {
            start: vi.fn().mockResolvedValue(mockStream),
            inspect: vi.fn().mockResolvedValue({ ExitCode: 0 }),
            resize: vi.fn().mockResolvedValue({})
        };

        mockContainer = {
            id: 'container-123',
            start: vi.fn().mockResolvedValue({}),
            inspect: vi.fn().mockResolvedValue({
                NetworkSettings: { Ports: {} }
            }),
            exec: vi.fn().mockResolvedValue(mockExec)
        };

        mockDocker = {
            getImage: vi.fn().mockReturnValue({ inspect: vi.fn().mockResolvedValue({}) }),
            createContainer: vi.fn().mockResolvedValue(mockContainer),
            getContainer: vi.fn().mockReturnValue(mockContainer)
        };

        mockFs = {} as unknown as IFileSystem;
    });

    it('sets and lists non-secret environment variables', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.setEnv('PORT', '3000', false);
        await sandbox.setEnv('HOST', '0.0.0.0', false);

        const env = await sandbox.listEnv();
        expect(env).toEqual({
            PORT: '3000',
            HOST: '0.0.0.0'
        });
    });

    it('stores secrets isolated from listEnv', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.setEnv('DB_PASSWORD', 'super-secret-pass', true);
        await sandbox.setEnv('PORT', '3000', false);

        const env = await sandbox.listEnv();
        // Secrets must be hidden from normal lists
        expect(env).toEqual({ PORT: '3000' });
        expect(env.DB_PASSWORD).toBeUndefined();
    });

    it('merges dynamic, persistent, and secret variables in executeCommand', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.initialize('node:18', '/mock/root/sandbox-123', 512, true, []);

        // Set persistent and secret variables
        await sandbox.setEnv('NODE_ENV', 'production', false);
        await sandbox.setEnv('API_KEY', 'sk_live_123', true);

        // Run command passing local dynamic variable
        const promise = sandbox.executeCommand(['node', 'app.js'], '.', { DYNAMIC_VAR: 'hello' }, 5000);

        // Since exec resolves asynchronously, we can wait a tick and inspect the container.exec call args
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(mockContainer.exec).toHaveBeenCalledWith(expect.objectContaining({
            Env: expect.arrayContaining([
                'NODE_ENV=production',
                'API_KEY=sk_live_123',
                'DYNAMIC_VAR=hello'
            ])
        }));
    });
});
