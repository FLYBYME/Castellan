import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ISkillContext } from '../../../core/index.js';
import { SandboxSkill } from '../../../addons/sandbox/skills/sandbox.skill.js';
import {
    sandbox_terminal_execute,
    sandbox_terminal_spawn,
    sandbox_network_expose,
    sandbox_network_unexpose,
    sandbox_network_list,
    sandbox_network_set_policy,
    sandbox_env_set,
    sandbox_env_set_secret,
    sandbox_env_list,
    sandbox_resource_update_limits,
    sandbox_resource_get_stats,
    sandbox_state_commit,
    sandbox_state_clone
} from '../../../addons/sandbox/skills/sandbox.tools.js';

describe('Sandbox Skill Tool Handlers', () => {
    let mockSandbox: any;
    let mockCtx: any;

    beforeEach(() => {
        mockSandbox = {
            executeCommand: vi.fn(),
            spawnBackgroundService: vi.fn(),
            exposePort: vi.fn(),
            unexposePort: vi.fn(),
            listExposedPorts: vi.fn(),
            setNetworkPolicy: vi.fn(),
            setEnv: vi.fn(),
            listEnv: vi.fn(),
            updateResourceLimits: vi.fn(),
            getResourceStats: vi.fn(),
            commitState: vi.fn()
        };

        // Mock static singleton instance
        SandboxSkill.instance = {
            getSandbox: vi.fn().mockResolvedValue(mockSandbox),
            createSandbox: vi.fn().mockResolvedValue('/mock/host/path'),
            registerSandboxInMemory: vi.fn()
        } as any;

        mockCtx = {
            sandboxId: 'sb-123',
            correlationId: 'corr-123',
            events: {
                dispatch: vi.fn()
            },
            api: {
                sandbox: {
                    create: vi.fn(),
                    update: vi.fn(),
                    find_one: vi.fn()
                }
            }
        } as unknown as ISkillContext;
    });

    it('sandbox_terminal_execute calls executeCommand on active sandbox', async () => {
        mockSandbox.executeCommand.mockResolvedValue({ exitCode: 0, stdout: 'ok', stderr: '' });

        const result = await sandbox_terminal_execute({
            command: ['echo', 'hello'],
            cwd: '.',
            timeoutMs: 5000,
            env: { MY_VAR: 'val' }
        }, mockCtx);

        expect(result.exitCode).toBe(0);
        expect(mockSandbox.executeCommand).toHaveBeenCalledWith(['echo', 'hello'], '.', { MY_VAR: 'val' }, 5000);
    });

    it('sandbox_network_expose exposes port successfully', async () => {
        mockSandbox.exposePort.mockResolvedValue('http://localhost:8000');

        const result = await sandbox_network_expose({
            port: 8000,
            protocol: 'tcp'
        }, mockCtx);

        expect(result.success).toBe(true);
        expect(result.mappedUrl).toBe('http://localhost:8000');
        expect(mockSandbox.exposePort).toHaveBeenCalledWith(8000, 'tcp');
    });

    it('sandbox_env_set persists standard environment variable', async () => {
        mockSandbox.setEnv.mockResolvedValue(true);

        const result = await sandbox_env_set({
            key: 'THEME',
            value: 'dark'
        }, mockCtx);

        expect(result.success).toBe(true);
        expect(mockSandbox.setEnv).toHaveBeenCalledWith('THEME', 'dark', false);
    });

    it('sandbox_resource_get_stats queries stats successfully', async () => {
        mockSandbox.getResourceStats.mockResolvedValue({
            cpuPercent: 10.5,
            memoryMb: 120,
            memoryLimitMb: 512
        });

        const result = await sandbox_resource_get_stats({}, mockCtx);
        expect(result.cpuPercent).toBe(10.5);
        expect(mockSandbox.getResourceStats).toHaveBeenCalled();
    });

    it('sandbox_state_clone commits and provisions new sandbox', async () => {
        mockSandbox.commitState.mockResolvedValue('sha256:snapshotsasdf');
        
        mockCtx.api.sandbox.find_one.mockResolvedValue({
            name: 'Original',
            gitUrl: 'git@github.com:flybyme/original.git',
            image: 'node:18',
            agentId: 'agent-1',
            threadId: 'thread-1'
        });

        mockCtx.api.sandbox.create.mockResolvedValue({ id: 'sb-clone-456' });
        mockCtx.api.sandbox.update.mockResolvedValue({ id: 'sb-clone-456', hostPath: '/mock/host/path', image: 'sha256:snapshotsasdf' });

        const result = await sandbox_state_clone({
            snapshotName: 'my-snapshot',
            newSandboxId: 'sb-clone-456'
        }, mockCtx);

        expect(result.success).toBe(true);
        expect(mockSandbox.commitState).toHaveBeenCalledWith('my-snapshot');
        expect(mockCtx.api.sandbox.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Original (Clone)',
            image: 'sha256:snapshotsasdf'
        }));
    });
});
