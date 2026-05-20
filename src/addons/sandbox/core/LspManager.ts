/**
 * LspManager: Language-agnostic Language Server Protocol lifecycle manager.
 *
 * Responsibilities:
 * - Auto-detect project configuration files inside sandbox containers.
 * - Manage language server processes (start, stop, health-check).
 * - Support multiple language servers per sandbox (TypeScript, Python, Go, etc.).
 * - Provide typed session handles for consumers (WebSocket relay, etc.).
 */

import type { ISandbox } from './ISandbox.js';
import type { PassThrough } from 'stream';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Supported language server identifiers */
export type LanguageServerId = 'typescript' | 'python' | 'go' | 'rust' | 'generic';

/** Descriptor for a language server that can be auto-detected and launched */
export interface LanguageServerDescriptor {
    /** Unique identifier for this language server type */
    readonly id: LanguageServerId;
    /** Human-readable label */
    readonly label: string;
    /** File(s) whose presence triggers auto-detection */
    readonly configFiles: string[];
    /** The command to spawn inside the container */
    readonly command: string[];
    /** Languages this server covers (Monaco language identifiers) */
    readonly languages: string[];
    /** NPM package name to install if missing (optional — container may already have it) */
    readonly installPackage?: string;
}

/** An active LSP session bound to a sandbox + language server */
export interface LspSession {
    readonly id: string;
    readonly sandboxId: string;
    readonly serverId: LanguageServerId;
    readonly languages: string[];
    readonly stdout: NodeJS.ReadableStream;
    readonly stdin: NodeJS.WritableStream;
    readonly startedAt: Date;
    status: 'initializing' | 'running' | 'stopped' | 'error';
    errorMessage?: string;
}

/** Result of a project detection scan */
export interface DetectedLanguageServer {
    readonly descriptor: LanguageServerDescriptor;
    readonly configFile: string;
}

// ─── Registry of Known Language Servers ──────────────────────────────────────

export const LANGUAGE_SERVER_REGISTRY: ReadonlyArray<LanguageServerDescriptor> = [
    {
        id: 'typescript',
        label: 'TypeScript Language Server',
        configFiles: ['tsconfig.json', 'jsconfig.json'],
        command: ['npx', '-y', 'typescript-language-server', '--stdio'],
        languages: ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'],
    },
    {
        id: 'python',
        label: 'Python Language Server (Pylsp)',
        configFiles: ['pyproject.toml', 'setup.py', 'requirements.txt', 'Pipfile'],
        command: ['pylsp'],
        languages: ['python'],
        installPackage: 'python-lsp-server',
    },
    {
        id: 'go',
        label: 'Go Language Server (gopls)',
        configFiles: ['go.mod'],
        command: ['gopls', 'serve'],
        languages: ['go'],
    },
    {
        id: 'rust',
        label: 'Rust Language Server (rust-analyzer)',
        configFiles: ['Cargo.toml'],
        command: ['rust-analyzer'],
        languages: ['rust'],
    },
] as const;

// ─── LspManager Implementation ─────────────────────────────────────────────

export class LspManager {
    /** Active sessions keyed by `${sandboxId}::${serverId}` */
    private sessions: Map<string, LspSession> = new Map();

    /** Custom descriptors registered at runtime (extension point) */
    private customDescriptors: Map<string, LanguageServerDescriptor> = new Map();

    // ─── Session Key ────────────────────────────────────────────────────

    private sessionKey(sandboxId: string, serverId: LanguageServerId): string {
        return `${sandboxId}::${serverId}`;
    }

    // ─── Detection ──────────────────────────────────────────────────────

    /**
     * Scan the sandbox workspace for known project configuration files.
     * Returns all language servers that should be activated.
     */
    public async detectLanguageServers(sandbox: ISandbox): Promise<DetectedLanguageServer[]> {
        const allDescriptors: LanguageServerDescriptor[] = [
            ...LANGUAGE_SERVER_REGISTRY,
            ...this.customDescriptors.values(),
        ];

        const detected: DetectedLanguageServer[] = [];

        for (const descriptor of allDescriptors) {
            for (const configFile of descriptor.configFiles) {
                const exists = await sandbox.hasFile(configFile);
                if (exists) {
                    detected.push({ descriptor, configFile });
                    break; // One match per descriptor is sufficient
                }
            }
        }

        return detected;
    }

    /**
     * Check whether a specific language server should be activated for this sandbox.
     */
    public async shouldActivate(sandbox: ISandbox, serverId: LanguageServerId): Promise<boolean> {
        const descriptor = this.getDescriptor(serverId);
        if (!descriptor) return false;

        for (const configFile of descriptor.configFiles) {
            if (await sandbox.hasFile(configFile)) return true;
        }
        return false;
    }

    // ─── Lifecycle ──────────────────────────────────────────────────────

    /**
     * Ensure a language server session is running for the given sandbox and server type.
     * If already running, returns the existing session.
     * If not running but config detected, starts a new one.
     */
    public async ensureRunning(
        sandboxId: string,
        sandbox: ISandbox,
        serverId: LanguageServerId,
    ): Promise<LspSession | null> {
        const key = this.sessionKey(sandboxId, serverId);

        // Return existing healthy session
        const existing = this.sessions.get(key);
        if (existing && existing.status === 'running') {
            return existing;
        }

        // Clean up dead session if present
        if (existing && existing.status !== 'running') {
            this.sessions.delete(key);
        }

        // Check if we should start
        const descriptor = this.getDescriptor(serverId);
        if (!descriptor) return null;

        const shouldStart = await this.shouldActivate(sandbox, serverId);
        if (!shouldStart) return null;

        return this.startSession(sandboxId, sandbox, descriptor);
    }

    /**
     * Start all detected language servers for a sandbox.
     */
    public async startAll(sandboxId: string, sandbox: ISandbox): Promise<LspSession[]> {
        const detected = await this.detectLanguageServers(sandbox);
        const sessions: LspSession[] = [];

        for (const { descriptor } of detected) {
            const session = await this.ensureRunning(sandboxId, sandbox, descriptor.id);
            if (session) sessions.push(session);
        }

        return sessions;
    }

    /**
     * Start a specific language server session inside the sandbox container.
     */
    private async startSession(
        sandboxId: string,
        sandbox: ISandbox,
        descriptor: LanguageServerDescriptor,
    ): Promise<LspSession> {
        const key = this.sessionKey(sandboxId, descriptor.id);

        const sessionId = `${sandboxId}-${descriptor.id}-${Date.now()}`;

        const session: LspSession = {
            id: sessionId,
            sandboxId,
            serverId: descriptor.id,
            languages: [...descriptor.languages],
            // Placeholder streams — will be populated below
            stdout: null as unknown as NodeJS.ReadableStream,
            stdin: null as unknown as NodeJS.WritableStream,
            startedAt: new Date(),
            status: 'initializing',
        };

        this.sessions.set(key, session);

        try {
            const { stdout, stderr, stdin } = await sandbox.startLanguageServer(descriptor.command);

            // Log stderr for debugging
            stderr.on('data', (chunk: Buffer) => {
                const text = chunk.toString('utf-8').trim();
                if (text) {
                    console.log(`[LSP:${descriptor.id}:${sandboxId}] stderr: ${text}`);
                }
            });

            // Detect process exit
            stdin.on('end', () => {
                const existing = this.sessions.get(key);
                if (existing && existing.id === sessionId) {
                    existing.status = 'stopped';
                    console.log(`[LSP:${descriptor.id}:${sandboxId}] Language server process ended.`);
                }
            });

            stdin.on('error', (err: Error) => {
                const existing = this.sessions.get(key);
                if (existing && existing.id === sessionId) {
                    existing.status = 'error';
                    existing.errorMessage = err.message;
                    console.error(`[LSP:${descriptor.id}:${sandboxId}] Stream error:`, err.message);
                }
            });

            // Populate the session with real streams
            const mutableSession = session as { -readonly [K in keyof LspSession]: LspSession[K] };
            mutableSession.stdout = stdout;
            mutableSession.stdin = stdin;
            mutableSession.status = 'running';

            // Store the completed session back (it's the same object reference)
            this.sessions.set(key, session);

            console.log(`[LSP:${descriptor.id}:${sandboxId}] Language server started (session: ${sessionId}).`);

            return session;
        } catch (err: unknown) {
            session.status = 'error';
            session.errorMessage = err instanceof Error ? err.message : String(err);
            console.error(`[LSP:${descriptor.id}:${sandboxId}] Failed to start:`, session.errorMessage);
            this.sessions.delete(key);
            throw err;
        }
    }

    /**
     * Stop a specific language server session.
     */
    public async stopSession(sandboxId: string, serverId: LanguageServerId): Promise<void> {
        const key = this.sessionKey(sandboxId, serverId);
        const session = this.sessions.get(key);

        if (!session) return;

        try {
            // Attempt graceful LSP shutdown: send `shutdown` request then `exit` notification
            const shutdownRequest = JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'shutdown',
                params: null,
            });
            const shutdownPayload = `Content-Length: ${Buffer.byteLength(shutdownRequest, 'utf8')}\r\n\r\n${shutdownRequest}`;
            session.stdin.write(shutdownPayload);

            // Wait briefly for shutdown acknowledgment
            await new Promise<void>((resolve) => setTimeout(resolve, 500));

            const exitNotification = JSON.stringify({
                jsonrpc: '2.0',
                method: 'exit',
                params: null,
            });
            const exitPayload = `Content-Length: ${Buffer.byteLength(exitNotification, 'utf8')}\r\n\r\n${exitNotification}`;
            session.stdin.write(exitPayload);

            // Force-end streams
            session.stdin.end();
        } catch (err) {
            console.error(`[LSP:${serverId}:${sandboxId}] Error during shutdown:`, err);
        } finally {
            session.status = 'stopped';
            this.sessions.delete(key);
            console.log(`[LSP:${serverId}:${sandboxId}] Session stopped.`);
        }
    }

    /**
     * Stop all language server sessions for a given sandbox.
     */
    public async stopAll(sandboxId: string): Promise<void> {
        const keysToStop: Array<{ key: string; serverId: LanguageServerId }> = [];

        for (const [key, session] of this.sessions) {
            if (session.sandboxId === sandboxId) {
                keysToStop.push({ key, serverId: session.serverId });
            }
        }

        await Promise.allSettled(
            keysToStop.map(({ serverId }) => this.stopSession(sandboxId, serverId))
        );
    }

    // ─── Queries ────────────────────────────────────────────────────────

    /**
     * Get a running session for a sandbox and language.
     */
    public getSession(sandboxId: string, serverId: LanguageServerId): LspSession | null {
        const key = this.sessionKey(sandboxId, serverId);
        const session = this.sessions.get(key);
        return session && session.status === 'running' ? session : null;
    }

    /**
     * Get all running sessions for a sandbox.
     */
    public getSessionsForSandbox(sandboxId: string): LspSession[] {
        const result: LspSession[] = [];
        for (const session of this.sessions.values()) {
            if (session.sandboxId === sandboxId && session.status === 'running') {
                result.push(session);
            }
        }
        return result;
    }

    /**
     * Find the session that covers a specific language.
     */
    public getSessionForLanguage(sandboxId: string, language: string): LspSession | null {
        for (const session of this.sessions.values()) {
            if (
                session.sandboxId === sandboxId &&
                session.status === 'running' &&
                session.languages.includes(language)
            ) {
                return session;
            }
        }
        return null;
    }

    /**
     * Get all active sessions across all sandboxes (for diagnostics).
     */
    public getAllSessions(): LspSession[] {
        return Array.from(this.sessions.values());
    }

    // ─── Registration ───────────────────────────────────────────────────

    /**
     * Register a custom language server descriptor at runtime.
     * This allows extensions to add support for additional languages.
     */
    public registerDescriptor(descriptor: LanguageServerDescriptor): void {
        this.customDescriptors.set(descriptor.id, descriptor);
    }

    /**
     * Get a descriptor by ID.
     */
    public getDescriptor(serverId: LanguageServerId | string): LanguageServerDescriptor | undefined {
        return (
            LANGUAGE_SERVER_REGISTRY.find((d) => d.id === serverId) ??
            this.customDescriptors.get(serverId)
        );
    }

    /**
     * Get all known descriptors (built-in + custom).
     */
    public getAllDescriptors(): LanguageServerDescriptor[] {
        return [...LANGUAGE_SERVER_REGISTRY, ...this.customDescriptors.values()];
    }
}
