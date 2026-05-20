import { ISandbox, SandboxStatus, FileStat, CommandResult, BackgroundService } from './ISandbox.js';
import Docker from 'dockerode';
import path from 'path';
import { IFileSystem } from './IFileSystem.js';

export class Sandbox implements ISandbox {
    private docker: Docker;
    private fs: IFileSystem;
    private sandboxesRoot: string;
    public activeContainerId: string | null = null;
    public portMappings: Record<number, number> = {};
    private activeHostPath: string | null = null;
    private services: Map<string, BackgroundService> = new Map();
    private ptySessions: Map<string, { stream: any, exec: any, shell: string }> = new Map();
    public activeLspStream: { stdout: NodeJS.ReadableStream; stderr: NodeJS.ReadableStream; stdin: NodeJS.WritableStream } | null = null;

    private env: Record<string, string> = {};
    private secrets: Record<string, string> = {};
    private exposedPortsList: Array<{ port: number, mappedUrl: string, protocol: string }> = [];
    private allowInternet: boolean = true;

    private getCombinedEnv(localEnv?: Record<string, string>): Record<string, string> {
        return {
            ...this.env,
            ...this.secrets,
            ...(localEnv || {})
        };
    }

    constructor(docker: Docker, fs: IFileSystem, sandboxesRoot: string = path.resolve('.workspaces')) {
        this.docker = docker;
        this.fs = fs;
        this.sandboxesRoot = sandboxesRoot;
    }

    // ─── 1. Domain: Host Filesystem Preparation ──────────────────────────────


    public async cleanSandbox(sandboxId: string): Promise<boolean> {
        const sandboxPath = path.join(this.sandboxesRoot, sandboxId);
        try {
            await this.fs.rm(sandboxPath, { recursive: true, force: true });
            if (this.activeHostPath === sandboxPath) {
                this.activeHostPath = null;
            }
            return true;
        } catch (error) {
            console.error(`[Sandbox] Failed to clean sandbox ${sandboxId}:`, error);
            return false;
        }
    }

    // ─── 2. Domain: Container Lifecycle & State (The Quarters) ──────────────

    public async initialize(imageTag: string, hostPath: string, memoryLimitMB: number, networkEnabled: boolean, exposedPorts: number[] = []): Promise<string> {
        // Ensure image exists
        try {
            await this.docker.getImage(imageTag).inspect();
        } catch (err) {
            console.log(`[Sandbox] Pulling image: ${imageTag}`);
            try {
                const stream = await this.docker.pull(imageTag);
                await new Promise((resolve, reject) => {
                    this.docker.modem.followProgress(stream, (err: any, res: any) => err ? reject(err) : resolve(res));
                });
            } catch (pullErr: any) {
                console.error(`[Sandbox] Failed to pull ${imageTag}: ${pullErr.message}`);
                // If specific pull fails (e.g. manifest not found), fallback to project default
                if (imageTag !== 'node:18') {
                    console.warn(`[Sandbox] Falling back to default 'node:18' image.`);
                    return this.initialize('node:18', hostPath, memoryLimitMB, networkEnabled, exposedPorts);
                }
                throw pullErr;
            }
        }

        const portBindings: any = {};
        const exposedPortsObj: any = {};

        for (const port of exposedPorts) {
            const key = `${port}/tcp`;
            exposedPortsObj[key] = {};
            portBindings[key] = [{ HostPort: '' }]; // Let Docker pick a random port
        }

        const containerParams: Docker.ContainerCreateOptions = {
            Image: imageTag,
            Cmd: ['tail', '-f', '/dev/null'], // Keep container alive
            WorkingDir: '/workspace',
            ExposedPorts: exposedPortsObj,
            Labels: {
                'com.castellan.managed': 'true',
                'com.castellan.sandboxId': hostPath.split('/').pop() || 'unknown'
            },
            HostConfig: {
                Binds: [`${hostPath}:/workspace`],
                Memory: memoryLimitMB * 1024 * 1024,
                NetworkMode: networkEnabled ? 'bridge' : 'none',
                PortBindings: portBindings,
                AutoRemove: true,
            },
        };

        const container = await this.docker.createContainer(containerParams);
        await container.start();

        const inspectData = await container.inspect();
        this.portMappings = {};
        
        if (inspectData.NetworkSettings.Ports) {
            for (const [containerPortProto, bindings] of Object.entries(inspectData.NetworkSettings.Ports)) {
                if (bindings && (bindings as any[]).length > 0) {
                    const containerPort = parseInt(containerPortProto.split('/')[0]);
                    const hostPort = parseInt((bindings as any[])[0].HostPort);
                    this.portMappings[containerPort] = hostPort;
                }
            }
        }

        this.activeContainerId = container.id;
        this.activeHostPath = hostPath;

        return container.id;
    }

    public async getStatus(containerId: string, includeStats: boolean = true): Promise<SandboxStatus> {
        if (!containerId) {
            throw new Error('Container ID is required to get status.');
        }

        try {
            const container = this.docker.getContainer(containerId);
            const inspectData = await container.inspect();

            let cpuPercentage = 0;
            let memoryUsageMB = 0;

            if (includeStats) {
                try {
                    const statsStream = await container.stats({ stream: false });
                    if (statsStream && (statsStream as any).cpu_stats) {
                        const stats = statsStream as any;
                        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
                        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
                        if (systemDelta > 0.0 && cpuDelta > 0.0) {
                            cpuPercentage = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100.0;
                        }
                        memoryUsageMB = stats.memory_stats.usage / (1024 * 1024);
                    }
                } catch (e) {
                    // Ignore stats failures
                }
            }

            let state: SandboxStatus['state'] = 'dead';
            if (inspectData.State.Running) state = 'running';
            else if (inspectData.State.Paused) state = 'paused';
            else if (inspectData.State.Status === 'exited') state = 'exited';

            let activeProcesses = 0;
            if (state === 'running') {
                try {
                    const top = await container.top();
                    activeProcesses = top.Processes.length;
                } catch (e) {
                    // Ignore if top fails
                }
            }

            return {
                state,
                cpuPercentage: Number(cpuPercentage.toFixed(2)),
                memoryUsageMB: Number(memoryUsageMB.toFixed(2)),
                activeProcesses
            };

        } catch (error) {
            console.error(`[Sandbox] Failed to get status for ${containerId}:`, error);
            return { state: 'dead', cpuPercentage: 0, memoryUsageMB: 0, activeProcesses: 0 };
        }
    }

    public async terminate(containerId: string): Promise<boolean> {
        try {
            const container = this.docker.getContainer(containerId);
            await container.kill();
            try {
                await container.remove({ force: true });
            } catch (e) { /* ignore if already auto-removed */ }

            if (this.activeContainerId === containerId) {
                this.activeContainerId = null;
            }
            return true;
        } catch (error: any) {
            if (error.statusCode === 404 || error.statusCode === 409) {
                return true;
            }
            console.error(`[Sandbox] Failed to terminate container ${containerId}:`, error);
            return false;
        }
    }

    // ─── 3. Domain: File System Authority (Path Jail) ─────────────────────────

    private resolvePath(relativePath: string): string {
        if (!this.activeHostPath) {
            throw new Error('No active sandbox. Select or initialize a sandbox first.');
        }
        const resolved = path.resolve(this.activeHostPath, relativePath);

        if (!resolved.startsWith(this.activeHostPath)) {
            throw new Error(`Path Jail Violation: '${relativePath}' attempts to escape sandbox boundaries.`);
        }
        return resolved;
    }

    public async readFile(relativePath: string): Promise<{ content: string; size: number; lastModified: Date }> {
        const fullPath = this.resolvePath(relativePath);
        const stats = await this.fs.stat(fullPath);
        const content = await this.fs.readFile(fullPath);
        return {
            content,
            size: stats.size,
            lastModified: stats.lastModified || new Date()
        };
    }

    public async writeFile(relativePath: string, payload: string): Promise<boolean> {
        const fullPath = this.resolvePath(relativePath);
        await this.fs.writeFile(fullPath, payload);
        return true;
    }

    public async listDirectory(relativePath: string, recursive: boolean = false): Promise<FileStat[]> {
        const fullPath = this.resolvePath(relativePath);
        const results: FileStat[] = [];

        const walk = async (dirPath: string, currentRelativePath: string) => {
            const entries = await this.fs.readdir(dirPath);

            for (const entry of entries) {
                const entryRelativePath = currentRelativePath
                    ? path.join(currentRelativePath, entry.name)
                    : entry.name;
                const entryFullPath = path.join(dirPath, entry.name);

                try {
                    results.push({
                        name: entryRelativePath,
                        isDirectory: entry.isDirectory,
                        size: entry.size
                    });

                    if (recursive && entry.isDirectory) {
                        await walk(entryFullPath, entryRelativePath);
                    }
                } catch (e) {
                    // Skip unreadable files
                }
            }
        };

        await walk(fullPath, '');
        return results;
    }

    public async removeFile(relativePath: string): Promise<boolean> {
        const fullPath = this.resolvePath(relativePath);
        try {
            await this.fs.rm(fullPath, { recursive: true, force: true });
            return true;
        } catch (error) {
            console.error(`[Sandbox] Failed to remove ${relativePath}:`, error);
            return false;
        }
    }

    public async mkdir(relativePath: string): Promise<boolean> {
        const fullPath = this.resolvePath(relativePath);
        try {
            await this.fs.mkdir(fullPath, { recursive: true });
            return true;
        } catch (error) {
            console.error(`[Sandbox] Failed to create directory ${relativePath}:`, error);
            return false;
        }
    }

    public async moveFile(sourceRelativePath: string, destinationRelativePath: string): Promise<boolean> {
        const sourcePath = this.resolvePath(sourceRelativePath);
        const destPath = this.resolvePath(destinationRelativePath);

        try {
            await this.fs.rename(sourcePath, destPath);
            return true;
        } catch (error) {
            console.error(`[Sandbox] Failed to move ${sourceRelativePath} to ${destinationRelativePath}:`, error);
            return false;
        }
    }

    public async stat(relativePath: string): Promise<{ name: string, isDirectory: boolean, size: number, lastModified: Date }> {
        const fullPath = this.resolvePath(relativePath);
        const stats = await this.fs.stat(fullPath);
        return {
            name: stats.name,
            isDirectory: stats.isDirectory,
            size: stats.size,
            lastModified: stats.lastModified || new Date()
        };
    }

    public async hasFile(relativePath: string): Promise<boolean> {
        try {
            const fullPath = this.resolvePath(relativePath);
            await this.fs.access(fullPath);
            return true;
        } catch {
            return false;
        }
    }

    // ─── 4. Domain: Task Execution (Docker-Side) ─────────────────────────────

    public async executeCommand(command: string[], workingDirectory: string, envVariables: Record<string, string>, timeoutMs: number): Promise<CommandResult> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }

        const container = this.docker.getContainer(this.activeContainerId);
        const safeWorkingDir = workingDirectory.startsWith('/')
            ? workingDirectory
            : path.posix.join('/workspace', workingDirectory.replace(/^(\.\.(\/|\\|$))+/, ''));

        const combinedEnv = this.getCombinedEnv(envVariables);
        const envArray = Object.entries(combinedEnv).map(([k, v]) => `${k}=${v}`);

        const exec = await container.exec({
            Cmd: command,
            WorkingDir: safeWorkingDir,
            Env: envArray,
            AttachStdout: true,
            AttachStderr: true,
        });

        const stream = await exec.start({ Detach: false }) as any;

        let stdout = '';
        let stderr = '';

        stream.on('data', (chunk: any) => {
            if (chunk.length >= 8 && (chunk[0] === 1 || chunk[0] === 2)) {
                const payload = chunk.slice(8).toString('utf-8');
                if (chunk[0] === 1) stdout += payload;
                if (chunk[0] === 2) stderr += payload;
            } else {
                stdout += chunk.toString('utf-8');
            }
        });

        const executionPromise = new Promise<number>((resolve, reject) => {
            stream.on('end', async () => {
                try {
                    const inspectData = await exec.inspect();
                    resolve(inspectData.ExitCode || 0);
                } catch (e) {
                    reject(e);
                }
            });
            stream.on('error', reject);
        });

        let timeoutHandle: NodeJS.Timeout;
        const timeoutPromise = new Promise<number>((_, reject) => {
            timeoutHandle = setTimeout(() => {
                reject(new Error(`Command timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        });

        try {
            const exitCode = await Promise.race([executionPromise, timeoutPromise]);
            clearTimeout(timeoutHandle!);
            return { exitCode, stdout, stderr };
        } catch (error) {
            clearTimeout(timeoutHandle!);
            throw error;
        }
    }

    public async streamCommandToEvents(command: string[], workingDirectory: string, envVariables: Record<string, string>, onData: (type: 'stdout' | 'stderr' | 'exit', data?: string, exitCode?: number) => void): Promise<string> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }

        const container = this.docker.getContainer(this.activeContainerId);
        const safeWorkingDir = workingDirectory.startsWith('/')
            ? workingDirectory
            : path.posix.join('/workspace', workingDirectory.replace(/^(\.\.(\/|\\|$))+/, ''));

        const combinedEnv = this.getCombinedEnv(envVariables);
        const envArray = Object.entries(combinedEnv).map(([k, v]) => `${k}=${v}`);

        const exec = await container.exec({
            Cmd: command,
            WorkingDir: safeWorkingDir,
            Env: envArray,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true
        });

        const stream = await exec.start({ Detach: false }) as any;
        const processId = exec.id;

        stream.on('data', (chunk: Buffer) => {
            let data = chunk;
            let type: 'stdout' | 'stderr' = 'stdout';

            if (chunk.length >= 8 && (chunk[0] === 1 || chunk[0] === 2) && chunk[1] === 0 && chunk[2] === 0 && chunk[3] === 0) {
                type = chunk[0] === 1 ? 'stdout' : 'stderr';
                data = chunk.slice(8);
            }

            if (data.length > 0) {
                onData(type, data.toString('utf-8'));
            }
        });

        stream.on('end', async () => {
            try {
                const inspectData = await exec.inspect();
                onData('exit', undefined, inspectData.ExitCode || 0);
            } catch (e) {
                onData('exit', undefined, 1);
            }
        });

        stream.on('error', (err: any) => {
            onData('stderr', err.message);
            onData('exit', undefined, 1);
        });

        return processId;
    }

    public async openPtySession(shell: string, workingDirectory: string, envVariables: Record<string, string>, cols: number, rows: number, onData: (type: 'stdout' | 'stderr' | 'exit', data?: string, exitCode?: number) => void): Promise<string> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }

        const container = this.docker.getContainer(this.activeContainerId);
        const combinedEnv = this.getCombinedEnv(envVariables);
        const envArray = Object.entries(combinedEnv).map(([k, v]) => `${k}=${v}`);

        const exec = await container.exec({
            Cmd: [shell],
            WorkingDir: workingDirectory.startsWith('/') ? workingDirectory : path.posix.join('/workspace', workingDirectory),
            Env: envArray,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
        });

        const stream = await exec.start({
            hijack: true,
            stdin: true,
        }) as any;

        const sessionId = exec.id;
        this.ptySessions.set(sessionId, { stream, exec, shell });

        await exec.resize({ w: cols, h: rows });

        stream.on('data', (chunk: Buffer) => {
            let data = chunk;
            let type: 'stdout' | 'stderr' = 'stdout';

            if (chunk.length >= 8 && (chunk[0] === 1 || chunk[0] === 2) && chunk[1] === 0 && chunk[2] === 0 && chunk[3] === 0) {
                type = chunk[0] === 1 ? 'stdout' : 'stderr';
                data = chunk.slice(8);
            }

            if (data.length > 0) {
                onData(type, data.toString('utf-8'));
            }
        });

        stream.on('end', () => {
            this.ptySessions.delete(sessionId);
            onData('exit', undefined, 0);
        });

        stream.on('error', (err: any) => {
            console.error(`[Sandbox] PTY session ${sessionId} error:`, err);
            this.ptySessions.delete(sessionId);
            onData('exit', undefined, 1);
        });

        return sessionId;
    }

    public async writeToPtySession(sessionId: string, data: string): Promise<void> {
        const session = this.ptySessions.get(sessionId);
        if (!session) throw new Error(`PTY Session ${sessionId} not found.`);
        session.stream.write(data);
    }

    public async resizePtySession(sessionId: string, cols: number, rows: number): Promise<void> {
        const session = this.ptySessions.get(sessionId);
        if (!session) throw new Error(`PTY Session ${sessionId} not found.`);
        await session.exec.resize({ w: cols, h: rows });
    }

    public async listPtySessions(): Promise<{ id: string, shell: string }[]> {
        return Array.from(this.ptySessions.entries()).map(([id, s]) => ({
            id,
            shell: s.shell
        }));
    }

    public async startLanguageServer(command: string[]): Promise<{ 
        stdout: NodeJS.ReadableStream; 
        stderr: NodeJS.ReadableStream; 
        stdin: NodeJS.WritableStream 
    }> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }

        const container = this.docker.getContainer(this.activeContainerId);

        const exec = await container.exec({
            Cmd: command,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false
        });

        const stream = await exec.start({
            hijack: true,
            stdin: true,
        }) as any;

        const { PassThrough } = await import('stream');
        const stdoutBuffer = new PassThrough();
        const stderrBuffer = new PassThrough();

        this.docker.modem.demuxStream(stream, stdoutBuffer, stderrBuffer);

        const result = {
            stdout: stdoutBuffer,
            stderr: stderrBuffer,
            stdin: stream
        };

        this.activeLspStream = result;

        return result;
    }

    private serviceLogs: Map<string, string[]> = new Map(); // processId -> log lines

    public async spawnBackgroundService(
        serviceName: string, 
        command: string[], 
        envVariables: Record<string, string>, 
        portBindings?: Record<number, number>,
        onData?: (type: 'stdout' | 'stderr' | 'exit', data?: string, exitCode?: number) => void
    ): Promise<string> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }

        const processId = await this.streamCommandToEvents(command, '.', envVariables, (type, data, exitCode) => {
            if (data) {
                // Buffer locally
                if (!this.serviceLogs.has(processId)) this.serviceLogs.set(processId, []);
                const logs = this.serviceLogs.get(processId)!;
                logs.push(data);
                if (logs.length > 1000) logs.shift(); // Cap buffer
            }

            // Relay to callback
            if (onData) onData(type, data, exitCode);

            if (exitCode !== undefined) {
                const service = this.services.get(processId);
                if (service) service.status = 'exited';
            }
        });

        const service: BackgroundService = {
            id: processId,
            serviceName,
            command,
            status: 'running',
            startTime: new Date()
        };
        this.services.set(processId, service);

        return processId;
    }

    public async killBackgroundService(processId: string): Promise<boolean> {
        if (!this.activeContainerId) {
            return false;
        }
        // Since it's an 'exec', we can't easily kill it directly by ID via Dockerode 
        // without keeping the stream handle. For now, we just mark it.
        const service = this.services.get(processId);
        if (service) {
            service.status = 'exited';
            return true;
        }
        return false;
    }

    public async listBackgroundServices(): Promise<BackgroundService[]> {
        return Array.from(this.services.values());
    }

    public async getBackgroundService(processId: string): Promise<BackgroundService> {
        const service = this.services.get(processId);
        if (!service) throw new Error(`Background service ${processId} not found`);
        return service;
    }

    public async getBackgroundServiceLogs(processId: string, tail: number = 100): Promise<string> {
        const logs = this.serviceLogs.get(processId) || [];
        return logs.slice(-tail).join('');
    }

    public async exposePort(port: number, protocol: 'tcp' | 'udp' = 'tcp'): Promise<string> {
        const mappedUrl = `http://localhost:${port}`;
        const existing = this.exposedPortsList.find(p => p.port === port && p.protocol === protocol);
        if (!existing) {
            this.exposedPortsList.push({ port, mappedUrl, protocol });
        }
        return mappedUrl;
    }

    public async unexposePort(port: number): Promise<boolean> {
        const index = this.exposedPortsList.findIndex(p => p.port === port);
        if (index !== -1) {
            this.exposedPortsList.splice(index, 1);
            return true;
        }
        return false;
    }

    public async listExposedPorts(): Promise<Array<{ port: number, mappedUrl: string, protocol: string }>> {
        return this.exposedPortsList;
    }

    public async setNetworkPolicy(allowInternet: boolean): Promise<boolean> {
        this.allowInternet = allowInternet;
        return true;
    }

    public async setEnv(key: string, value: string, isSecret?: boolean): Promise<boolean> {
        if (isSecret) {
            this.secrets[key] = value;
        } else {
            this.env[key] = value;
        }
        return true;
    }

    public async listEnv(): Promise<Record<string, string>> {
        return this.env;
    }

    public async updateResourceLimits(cpuCores?: number, memoryMb?: number): Promise<boolean> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }
        const container = this.docker.getContainer(this.activeContainerId);
        const updateParams: any = {};
        if (memoryMb) {
            updateParams.Memory = memoryMb * 1024 * 1024;
        }
        if (cpuCores) {
            updateParams.CpuQuota = cpuCores * 100000;
            updateParams.CpuPeriod = 100000;
        }
        await container.update(updateParams);
        return true;
    }

    public async getResourceStats(): Promise<{ cpuPercent: number, memoryMb: number, memoryLimitMb: number }> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }
        const container = this.docker.getContainer(this.activeContainerId);
        try {
            const stats = await container.stats({ stream: false }) as any;
            
            let cpuPercent = 0;
            if (stats.cpu_stats && stats.precpu_stats) {
                const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
                const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
                const onlineCpu = stats.cpu_stats.online_cpus || 1;
                if (systemDelta > 0 && cpuDelta > 0) {
                    cpuPercent = (cpuDelta / systemDelta) * onlineCpu * 100.0;
                }
            }

            let memoryMb = 0;
            let memoryLimitMb = 512;
            if (stats.memory_stats) {
                const usage = stats.memory_stats.usage || 0;
                memoryMb = usage / (1024 * 1024);
                const limit = stats.memory_stats.limit || 0;
                if (limit > 0) {
                    memoryLimitMb = limit / (1024 * 1024);
                }
            }

            return {
                cpuPercent: Math.round(cpuPercent * 100) / 100,
                memoryMb: Math.round(memoryMb * 100) / 100,
                memoryLimitMb: Math.round(memoryLimitMb * 100) / 100
            };
        } catch (err) {
            console.error(`[Sandbox] Failed to fetch live stats for ${this.activeContainerId}:`, err);
            return { cpuPercent: 0, memoryMb: 0, memoryLimitMb: 512 };
        }
    }

    public async commitState(snapshotName: string): Promise<string> {
        if (!this.activeContainerId) {
            throw new Error('No active container. Call initialize() first.');
        }
        const container = this.docker.getContainer(this.activeContainerId);
        const repoTag = snapshotName.includes(':') ? snapshotName : `${snapshotName}:latest`;
        const parts = repoTag.split(':');
        const repo = parts[0];
        const tag = parts[1] || 'latest';
        const image = await container.commit({ repo, tag });
        return image.Id;
    }
}
