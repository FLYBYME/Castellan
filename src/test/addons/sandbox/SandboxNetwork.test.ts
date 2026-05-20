import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sandbox } from '../../../addons/sandbox/core/Sandbox.js';
import { IFileSystem } from '../../../addons/sandbox/core/IFileSystem.js';

describe('Sandbox Networking', () => {
    let mockDocker: any;
    let mockFs: any;

    beforeEach(() => {
        mockDocker = {};
        mockFs = {} as unknown as IFileSystem;
    });

    it('exposes a new port mapping with TCP by default', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        const url = await sandbox.exposePort(8000);

        expect(url).toBe('http://localhost:8000');
        const list = await sandbox.listExposedPorts();
        expect(list).toHaveLength(1);
        expect(list[0]).toEqual({
            port: 8000,
            mappedUrl: 'http://localhost:8000',
            protocol: 'tcp'
        });
    });

    it('exposes a port with custom protocol', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.exposePort(53, 'udp');

        const list = await sandbox.listExposedPorts();
        expect(list[0]).toEqual({
            port: 53,
            mappedUrl: 'http://localhost:53',
            protocol: 'udp'
        });
    });

    it('unexposes an exposed port', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        await sandbox.exposePort(9000);

        let unexposed = await sandbox.unexposePort(9000);
        expect(unexposed).toBe(true);

        const list = await sandbox.listExposedPorts();
        expect(list).toHaveLength(0);

        // Try unexposing port that is not exposed
        let unexposedAgain = await sandbox.unexposePort(9000);
        expect(unexposedAgain).toBe(false);
    });

    it('manages network policies correctly', async () => {
        const sandbox = new Sandbox(mockDocker, mockFs, '/mock/root');
        const success = await sandbox.setNetworkPolicy(false);
        expect(success).toBe(true);
    });
});
