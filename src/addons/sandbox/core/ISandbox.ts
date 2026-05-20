export interface SandboxMeta {
    id: string;
    hostPath: string;
    createdAt: Date;
    lastModified: Date;
    sizeMB: number;
    attachedContainerId?: string;
}

export interface SandboxStatus {
    state: 'running' | 'paused' | 'exited' | 'dead';
    cpuPercentage: number;
    memoryUsageMB: number;
    activeProcesses: number;
}

export interface FileStat {
    name: string;
    isDirectory: boolean;
    size: number;
}

export interface CommandResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

export interface BackgroundService {
    id: string;
    serviceName: string;
    command: string[];
    status: 'running' | 'exited' | 'error';
    startTime: Date;
}
/**
 * ISandboxManager: Orchestrates multiple Sandbox instances.
 * This is the central registry for all active agent environments.
 */
export interface ISandboxManager {
    /**
     * getSandbox: Retrieves or provisions a new Sandbox for the given ID.
     */
    getSandbox(sandboxId: string, ctx?: unknown): Promise<ISandbox>;

    /**
     * initialize: Ensures host SSD and Docker daemon are ready.
     */
    initialize(): Promise<void>;

    /**
     * createSandbox: Provisions a isolated host-side directory for an agent session.
     */

    /**
     * deleteSandbox: Removes the host-side directory and prunes associated containers.
     */
    deleteSandbox(sandboxId: string): Promise<void>;

    /**
     * listSandboxes: Returns all sandbox directories on the host.
     */
    listSandboxes(): Promise<{ id: string, hostPath: string, createdAt: Date }[]>;

    /**
     * listContainers: Returns all containers on the Docker host.
     */
    listContainers(): Promise<any[]>;

    /**
     * pruneAllContainers: Stops and removes all containers managed by Castellan.
     */
    pruneAllContainers(): Promise<void>;

    /**
     * pruneContainers: Stops and removes stale, stopped, or orphaned containers.
     */
    pruneContainers(all: boolean, activeSandboxIds: Set<string>): Promise<number>;

    /**
     * teardown: Cleans up all manager resources (e.g. SFTP connections).
     */
    teardown(): Promise<void>;
}

/**
 * ISandbox: The Hybrid Sandbox Architecture.
 * Provides a highly controlled, strongly-typed environment for agent operations.
 */
export interface ISandbox {
    readonly activeContainerId: string | null;
    readonly portMappings: Record<number, number>;
    activeLspStream: { stdout: NodeJS.ReadableStream; stderr: NodeJS.ReadableStream; stdin: NodeJS.WritableStream } | null;

    // ─── 1. Domain: Host Filesystem Preparation ──────────────────────────────

    /**
     * Creates a pristine, isolated directory on the host SSD.
     */

    /**
     * Recursively destroys the host folder.
     */
    cleanSandbox(sandboxId: string): Promise<boolean>;


    // ─── 2. Domain: Container Lifecycle & State (The Quarters) ──────────────

    /**
     * Spins up the container with the host path bind-mounted.
     */
    initialize(imageTag: string, hostPath: string, memoryLimitMB: number, networkEnabled: boolean, exposedPorts?: number[]): Promise<string>;


    /**
     * Queries the Docker daemon for real-time telemetry.
     */
    getStatus(containerId: string, includeStats?: boolean): Promise<SandboxStatus>;

    /**
     * Issues a docker kill followed by docker rm.
     */
    terminate(containerId: string): Promise<boolean>;


    // ─── 3. Domain: File System Authority (Path Jail) ─────────────────────────

    /**
     * Reads a file, enforcing the Path Jail.
     */
    readFile(relativePath: string): Promise<{ content: string; size: number; lastModified: Date }>;

    /**
     * Writes to a file, enforcing the Path Jail.
     */
    writeFile(relativePath: string, payload: string): Promise<boolean>;

    /**
     * Lists directory contents, enforcing the Path Jail.
     */
    listDirectory(relativePath: string, recursive?: boolean): Promise<FileStat[]>;

    /**
     * Removes a file or directory, enforcing the Path Jail.
     */
    removeFile(relativePath: string): Promise<boolean>;

    /**
     * Creates a new directory, enforcing the Path Jail.
     */
    mkdir(relativePath: string): Promise<boolean>;

    /**
     * Moves a file from source to destination.
     */
    moveFile(sourceRelativePath: string, destinationRelativePath: string): Promise<boolean>;

    /**
     * Gets detailed metadata for a file or directory.
     */
    stat(relativePath: string): Promise<{ name: string, isDirectory: boolean, size: number, lastModified: Date }>;

    /**
     * Checks whether a file or directory exists at the given relative path.
     * Used by LspManager for config file detection (e.g. tsconfig.json).
     */
    hasFile(relativePath: string): Promise<boolean>;


    // ─── 4. Domain: Task Execution (Docker-Side) ─────────────────────────────

    /**
     * Blocks until completion or timeout.
     */
    executeCommand(command: string[], workingDirectory: string, envVariables: Record<string, string>, timeoutMs: number): Promise<CommandResult>;

    /**
     * Executes a command and immediately returns a process ID.
     */
    streamCommandToEvents(command: string[], workingDirectory: string, envVariables: Record<string, string>, onData: (type: 'stdout' | 'stderr' | 'exit', data?: string, exitCode?: number) => void): Promise<string>;

    /**
     * Opens a persistent PTY session (e.g. bash).
     */
    openPtySession(shell: string, workingDirectory: string, envVariables: Record<string, string>, cols: number, rows: number, onData: (type: 'stdout' | 'stderr' | 'exit', data?: string, exitCode?: number) => void): Promise<string>;

    /**
     * Writes data to a PTY session's stdin.
     */
    writeToPtySession(sessionId: string, data: string): Promise<void>;

    /**
     * Resizes a PTY session window.
     */
    resizePtySession(sessionId: string, cols: number, rows: number): Promise<void>;

    /**
     * Lists all active PTY sessions.
     */
    listPtySessions(): Promise<{ id: string, shell: string }[]>;

    /**
     * Starts the Language Server Protocol (LSP) process inside the container.
     */
    startLanguageServer(command: string[]): Promise<{ 
        stdout: NodeJS.ReadableStream; 
        stderr: NodeJS.ReadableStream; 
        stdin: NodeJS.WritableStream 
    }>;

    /**
     * Starts a detached process inside the container.
     */
    spawnBackgroundService(
        serviceName: string, 
        command: string[], 
        envVariables: Record<string, string>, 
        portBindings?: Record<number, number>,
        onData?: (type: 'stdout' | 'stderr' | 'exit', data?: string, exitCode?: number) => void
    ): Promise<string>;

    /**
     * Sends SIGTERM/SIGKILL to a specific detached process.
     */
    killBackgroundService(processId: string): Promise<boolean>;

    /**
     * Lists all background services managed by the sandbox.
     */
    listBackgroundServices(): Promise<BackgroundService[]>;

    /**
     * Gets details for a specific background service.
     */
    getBackgroundService(processId: string): Promise<BackgroundService>;

    /**
     * Gets logs for a specific background service.
     */
    getBackgroundServiceLogs(processId: string, tail?: number): Promise<string>;
}
