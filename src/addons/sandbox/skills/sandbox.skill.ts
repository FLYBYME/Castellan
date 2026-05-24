import { BaseSkillModule, ISkillContext } from '@flybyme/castellan/core';
import { ISandboxManager, ISandbox } from '../core/ISandbox.js';
import { Sandbox } from '../core/Sandbox.js';
import { IFileSystem } from '../core/IFileSystem.js';
import { LocalFileSystem } from '../core/LocalFileSystem.js';
import { SftpFileSystem } from '../core/SftpFileSystem.js';
import {
    sandboxCrud,
    sandboxSetActiveContract,
    sandboxFsReadContract,
    sandboxFsWriteContract,
    sandboxFsListContract,
    sandboxFsPatchContract,
    sandboxFsRemoveContract,
    sandboxFsMkdirContract,
    sandboxFsMoveContract,
    sandboxTerminalExecuteContract,
    sandboxTerminalSpawnContract,
    sandboxTerminalListContract,
    sandboxTerminalKillContract,
    sandboxTerminalLogsContract,
    sandboxTerminalSessionOpenContract,
    sandboxTerminalSessionListContract,
    sandboxTerminalSessionWriteContract,
    sandboxTerminalSessionResizeContract,
    sandboxPruneContract,
    sandboxNetworkExposeContract,
    sandboxNetworkUnexposeContract,
    sandboxNetworkListContract,
    sandboxNetworkSetPolicyContract,
    sandboxEnvSetContract,
    sandboxEnvSetSecretContract,
    sandboxEnvListContract,
    sandboxResourceUpdateLimitsContract,
    sandboxResourceGetStatsContract,
    sandboxStateCommitContract,
    sandboxStateCloneContract
} from './sandbox.contract.js';
import {
    sandbox_set_active,
    sandbox_fs_read,
    sandbox_fs_write,
    sandbox_fs_list,
    sandbox_fs_patch,
    sandbox_fs_remove,
    sandbox_fs_mkdir,
    sandbox_fs_move,
    sandbox_terminal_execute,
    sandbox_terminal_spawn,
    sandbox_terminal_list,
    sandbox_terminal_kill,
    sandbox_terminal_logs,
    sandbox_terminal_session_open,
    sandbox_terminal_session_list,
    sandbox_terminal_session_write,
    sandbox_terminal_session_resize,
    sandbox_prune,
    sandbox_create,
    sandbox_delete,
    sandbox_before_create,
    sandbox_after_create,
    sandbox_after_delete,
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
} from './sandbox.tools.js';
import { Sandbox as SandboxModel, SandboxSchema } from './sandbox.schema.js';
import Docker from 'dockerode';
import path from 'path';
import { nanoid } from 'nanoid';
import fs from 'fs';

export class SandboxSkill extends BaseSkillModule implements ISandboxManager {
    public readonly domain = 'sandbox';

    public async getGlobalContext(ctx: ISkillContext): Promise<string> {
        const activeSandboxId = ctx.sandboxId;
        return activeSandboxId
            ? `### PHYSICAL MANIFESTATION\n- **Active Sandbox**: ${activeSandboxId}\n- **Status**: Linked and Active.`
            : `### PHYSICAL MANIFESTATION\n- **Status**: DISCONNECTED. System is awaiting a sandbox anchor.`;
    }

    public async getSkillContext(ctx: ISkillContext): Promise<string> {
        return `
## Sandbox & Environment
Direct interaction with isolated Linux environments and Node.js runtimes.
- **IMMEDIATE EXPLORATION**: Upon entering a sandbox, proactively discover the project structure and key files.
- **STATE MANAGEMENT**: Target the active sandbox for all filesystem and terminal operations.
- **RESILIENCE**: Monitor background processes and terminate any that become unresponsive.
        `.trim();
    }


    public static instance: SandboxSkill;

    private docker: Docker;
    private fs: IFileSystem;
    private sandboxesRoot: string;
    private sandboxes: Map<string, ISandbox> = new Map();
    private pendingInitializations: Map<string, Promise<ISandbox>> = new Map();
    private lastHealthChecks: WeakMap<ISandbox, number> = new WeakMap();

    constructor() {
        super();
        SandboxSkill.instance = this;

        // 1. Initialize Docker client
        if (process.env.DOCKER_HOST) {
            this.docker = new Docker({
                host: process.env.DOCKER_HOST,
                port: process.env.DOCKER_PORT || 2375,
                protocol: 'http'
            });
        } else {
            this.docker = new Docker(); // Local socket
        }

        // 2. Initialize Filesystem
        if (process.env.SFTP_HOST) {
            let privateKey = process.env.SFTP_KEY;
            if (!privateKey && process.env.SFTP_KEY_PATH) {
                try {
                    privateKey = fs.readFileSync(process.env.SFTP_KEY_PATH, 'utf-8');
                } catch (err) {
                    console.error(`[SandboxSkill] Failed to read SFTP_KEY_PATH: ${process.env.SFTP_KEY_PATH}`, err);
                }
            }

            this.fs = new SftpFileSystem({
                host: process.env.SFTP_HOST,
                port: Number(process.env.SFTP_PORT) || 22,
                username: process.env.SFTP_USER || 'root',
                password: process.env.SFTP_PASS,
                privateKey
            });
        } else {
            this.fs = new LocalFileSystem();
        }

        this.sandboxesRoot = process.env.SANDBOXES_ROOT || path.resolve('.workspaces');

        // 3. Environment Management (CRUD)
        this.mountCrud(sandboxCrud);
        this.mountCrudHook(this.domain, 'create', {
            before: sandbox_before_create,
            after: sandbox_after_create
        });
        this.mountCrudHook(this.domain, 'delete', {
            after: sandbox_after_delete
        });

        // 2. Environment Tools
        this.mountTool(sandboxSetActiveContract, sandbox_set_active);

        // 3. Filesystem Tools
        this.mountTool(sandboxFsReadContract, sandbox_fs_read);
        this.mountTool(sandboxFsWriteContract, sandbox_fs_write);
        this.mountTool(sandboxFsListContract, sandbox_fs_list);
        this.mountTool(sandboxFsPatchContract, sandbox_fs_patch);
        this.mountTool(sandboxFsRemoveContract, sandbox_fs_remove);
        this.mountTool(sandboxFsMkdirContract, sandbox_fs_mkdir);
        this.mountTool(sandboxFsMoveContract, sandbox_fs_move);

        // 4. Terminal Tools
        this.mountTool(sandboxTerminalExecuteContract, sandbox_terminal_execute);
        this.mountTool(sandboxTerminalSpawnContract, sandbox_terminal_spawn);
        this.mountTool(sandboxTerminalListContract, sandbox_terminal_list);
        this.mountTool(sandboxTerminalKillContract, sandbox_terminal_kill);
        this.mountTool(sandboxTerminalLogsContract, sandbox_terminal_logs);
        this.mountTool(sandboxTerminalSessionOpenContract, sandbox_terminal_session_open);
        this.mountTool(sandboxTerminalSessionListContract, sandbox_terminal_session_list);
        this.mountTool(sandboxTerminalSessionWriteContract, sandbox_terminal_session_write);
        this.mountTool(sandboxTerminalSessionResizeContract, sandbox_terminal_session_resize);
        this.mountTool(sandboxPruneContract, sandbox_prune);

        // 5. Networking & Port Forwarding Tools
        this.mountTool(sandboxNetworkExposeContract, sandbox_network_expose);
        this.mountTool(sandboxNetworkUnexposeContract, sandbox_network_unexpose);
        this.mountTool(sandboxNetworkListContract, sandbox_network_list);
        this.mountTool(sandboxNetworkSetPolicyContract, sandbox_network_set_policy);

        // 6. Environment & Secret Management Tools
        this.mountTool(sandboxEnvSetContract, sandbox_env_set);
        this.mountTool(sandboxEnvSetSecretContract, sandbox_env_set_secret);
        this.mountTool(sandboxEnvListContract, sandbox_env_list);

        // 7. Resource Limits & Telemetry Tools
        this.mountTool(sandboxResourceUpdateLimitsContract, sandbox_resource_update_limits);
        this.mountTool(sandboxResourceGetStatsContract, sandbox_resource_get_stats);

        // 8. Snapshot & State Management Tools
        this.mountTool(sandboxStateCommitContract, sandbox_state_commit);
        this.mountTool(sandboxStateCloneContract, sandbox_state_clone);
    }

    // ─── ISandboxManager Implementation ──────────────────────────────────────

    public async initialize(): Promise<void> {
        await this.fs.mkdir(this.sandboxesRoot, { recursive: true });
        try {
            await this.docker.ping();
        } catch (err) {
            console.error('[SandboxSkill] Failed to connect to Docker daemon:', err);
        }
    }

    public async getSandbox(id: string, ctx?: ISkillContext): Promise<ISandbox> {
        let sandbox = this.sandboxes.get(id);

        if (sandbox) {
            const lastCheck = this.lastHealthChecks.get(sandbox) || 0;
            const now = Date.now();

            if (now - lastCheck > 30000 && sandbox.activeContainerId) {
                try {
                    const status = await sandbox.getStatus(sandbox.activeContainerId, false);
                    this.lastHealthChecks.set(sandbox, now);

                    if (status.state === 'dead' || status.state === 'exited') {
                        this.sandboxes.delete(id);
                        sandbox = undefined;
                    }
                } catch (e) {
                    this.sandboxes.delete(id);
                    sandbox = undefined;
                }
            }
        }

        if (sandbox) return sandbox;

        if (this.pendingInitializations.has(id)) {
            return this.pendingInitializations.get(id)!;
        }

        const initPromise = (async () => {
            try {
                let doc: any = null;
                if (ctx) {
                    doc = await ctx.api.sandbox.find_one({ query: { id } });
                }
                
                if (!doc) {
                    // Second chance: maybe it's a legacy or manually created directory that isn't in DB yet
                    const hostPath = path.join(this.sandboxesRoot, id);
                    try {
                        await this.fs.access(hostPath);
                        console.warn(`[SandboxSkill] Sandbox ${id} not in DB but folder exists. Using defaults.`);
                        const newSandbox = new Sandbox(this.docker, this.fs, this.sandboxesRoot);
                        await newSandbox.initialize('node:18', hostPath, 512, true, []);
                        this.sandboxes.set(id, newSandbox);
                        return newSandbox;
                    } catch {
                        throw new Error(`Sandbox record not found in 'sandbox' collection: ${id}. Please ensure the sandbox exists.`);
                    }
                }

                const newSandbox = new Sandbox(this.docker, this.fs, this.sandboxesRoot);
                const hostPath = path.join(this.sandboxesRoot, id);
                await newSandbox.initialize(doc.image || 'node:18', hostPath, 512, true, []);
                this.sandboxes.set(id, newSandbox);
                return newSandbox;
            } finally {
                this.pendingInitializations.delete(id);
            }
        })();

        this.pendingInitializations.set(id, initPromise);
        return initPromise;
    }

    public async registerSandboxInMemory(item: SandboxModel & { id: string }): Promise<void> {
        console.log(`[SandboxSkill] Initializing sandbox ${item.id} in memory...`);
        const sandbox = new Sandbox(this.docker, this.fs, this.sandboxesRoot);
        const hostPath = path.join(this.sandboxesRoot, item.id);
        await sandbox.initialize(item.image || 'node:18', hostPath, 512, true, []);
        this.sandboxes.set(item.id, sandbox);
        console.log(`[SandboxSkill] Sandbox ${item.id} registered and active in memory.`);
    }

    public async createSandbox(id: string, gitUrl: string): Promise<string> {
        const sandboxPath = path.join(this.sandboxesRoot, id);
        console.log(`[SandboxSkill] Creating directory ${sandboxPath}...`);
        await this.fs.mkdir(sandboxPath, { recursive: true });

        try {
            console.log(`[SandboxSkill] Cloning ${gitUrl} into ${sandboxPath}...`);
            const result = await this.fs.execOnHost(`git clone ${gitUrl} .`, sandboxPath);
            if (result.exitCode !== 0) {
                console.error(`[SandboxSkill] Git clone failed: ${result.stderr}`);
                throw new Error(`Git clone failed: ${result.stderr}`);
            }
            console.log(`[SandboxSkill] Clone successful.`);
        } catch (err) {
            console.error(`[SandboxSkill] Failed to clone ${gitUrl}:`, err);
            throw new Error(`Failed to clone repository: ${gitUrl}`);
        }

        return sandboxPath;
    }

    public async deleteSandbox(id: string): Promise<void> {
        const sandboxPath = path.join(this.sandboxesRoot, id);

        try {
            const containers = await this.docker.listContainers({ all: true });
            for (const c of containers) {
                if (c.Labels['com.castellan.sandboxId'] === id) {
                    const container = this.docker.getContainer(c.Id);
                    await container.remove({ force: true });
                }
            }
        } catch (err) {
            console.error(`[SandboxSkill] Failed to prune containers for sandbox ${id}:`, err);
        }

        try {
            // Forcefully remove the sandbox folder via rm -rf on the host to bypass SFTP permission limitations
            await this.fs.execOnHost(`rm -rf "${sandboxPath}"`, this.sandboxesRoot);
        } catch (err) {
            console.warn(`[SandboxSkill] Host rm -rf execution failed for ${sandboxPath}, attempting SFTP fallback...`, err);
            try {
                await this.fs.rm(sandboxPath, { recursive: true, force: true });
            } catch (fallbackErr) {
                console.error(`[SandboxSkill] Failed to delete sandbox folder ${sandboxPath}:`, fallbackErr);
            }
        }

        this.sandboxes.delete(id);
    }

    public async listSandboxes(): Promise<{ id: string, createdAt: Date }[]> {
        const entries = await this.fs.readdir(this.sandboxesRoot);
        const sandboxes = [];
        for (const entry of entries) {
            if (entry.isDirectory) {
                sandboxes.push({
                    id: entry.name,
                    createdAt: entry.lastModified || new Date()
                });
            }
        }
        return sandboxes;
    }

    public async listContainers(): Promise<any[]> {
        return await this.docker.listContainers({ all: true });
    }

    public async pruneAllContainers(): Promise<void> {
        try {
            const containers = await this.docker.listContainers({ all: true });
            for (const c of containers) {
                if (c.Labels['com.castellan.managed'] === 'true') {
                    const container = this.docker.getContainer(c.Id);
                    try {
                        await container.kill();
                    } catch (e) { /* ignore if already stopped */ }
                    await container.remove({ force: true });
                }
            }
        } catch (err) {
            console.error('[SandboxSkill] Global container prune failed:', err);
        }
    }

    public async pruneContainers(all: boolean, activeSandboxIds: Set<string>): Promise<number> {
        let prunedCount = 0;
        try {
            const containers = await this.docker.listContainers({ all: true });
            for (const c of containers) {
                const sandboxId = c.Labels['com.castellan.sandboxId'];
                const containerId = c.Id;
                const name = c.Names[0] || '';

                const isManaged = c.Labels['com.castellan.managed'] === 'true';
                const isActionRunner = c.Image.includes('action-runner') || c.Image.includes('canvas-workspace');
                const isGitFlybyme = name.startsWith('/git-flybyme-');

                if (isManaged || isActionRunner || isGitFlybyme) {
                    let shouldPrune = false;
                    if (all) {
                        shouldPrune = true;
                    } else {
                        const isRunning = c.State === 'running';
                        if (!isRunning) {
                            shouldPrune = true;
                        } else if (sandboxId && !activeSandboxIds.has(sandboxId)) {
                            shouldPrune = true;
                        } else if (isActionRunner || isGitFlybyme) {
                            shouldPrune = true;
                        }
                    }

                    if (shouldPrune) {
                        const container = this.docker.getContainer(containerId);
                        try {
                            await container.kill();
                        } catch (e) { /* ignore if already stopped */ }
                        await container.remove({ force: true });
                        prunedCount++;
                    }
                }
            }
        } catch (err) {
            console.error('[SandboxSkill] container prune failed:', err);
        }
        return prunedCount;
    }

    public async teardown(): Promise<void> {
        if (this.fs && (this.fs as any).disconnect) {
            await (this.fs as any).disconnect();
        }
        this.sandboxes.clear();
    }
}
