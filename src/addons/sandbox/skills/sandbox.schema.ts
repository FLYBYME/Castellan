import { z } from 'zod';

/**
 * Sandbox: The database entity for a managed environment.
 */
export const SandboxSchema = z.object({
    name: z.string().describe("Human-readable name for the sandbox"),
    description: z.string().nullish().describe("Detailed description of the sandbox purpose"),
    containerPath: z.string().default("/workspace").describe("Absolute path to the workspace inside the container (Jailed)"),
    gitUrl: z.string().describe("The Git URL to clone into the sandbox upon creation. This is mandatory."),
    status: z.enum(['active', 'archived', 'orphaned']),
    image: z.string().default("node:25").describe("Docker image used for this sandbox"),
    agentId: z.string().nullish().describe("The agent associated with this sandbox"),
    threadId: z.string().nullish().describe("The thread associated with this sandbox"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Sandbox = z.infer<typeof SandboxSchema>;

/**
 * Setting: A key-value pair for platform-wide configurations.
 */
export const SettingSchema = z.object({
    id: z.string().describe("The unique key for the setting"),
    value: z.string().describe("The string value of the setting"),
});

export type Setting = z.infer<typeof SettingSchema>;

// ─── Environment Tools ──────────────────────────────────────────────────────

export const SandboxSetActiveInputSchema = z.object({
    id: z.string().describe("The ID of the sandbox to step into."),
});

export type SandboxSetActiveInput = z.infer<typeof SandboxSetActiveInputSchema>;

// ─── Filesystem Tools ───────────────────────────────────────────────────────

export const FsReadInputSchema = z.object({
    path: z.string().describe("Path to the file relative to the sandbox root."),
});

export type FsReadInput = z.infer<typeof FsReadInputSchema>;

export const FsWriteInputSchema = z.object({
    path: z.string().describe("Path to the file relative to the sandbox root."),
    content: z.string().describe("The complete text content to write."),
});

export type FsWriteInput = z.infer<typeof FsWriteInputSchema>;

export const FsListInputSchema = z.object({
    path: z.string().default('.').describe("Path to the directory relative to the sandbox root."),
    recursive: z.boolean().default(false).describe("Whether to list files recursively."),
});

export type FsListInput = z.infer<typeof FsListInputSchema>;

export const FsPatchInputSchema = z.object({
    path: z.string().describe("Path to the file to patch."),
    instructions: z.string().describe("Clear instructions on what to change in the file."),
});

export type FsPatchInput = z.infer<typeof FsPatchInputSchema>;

export const FsRemoveInputSchema = z.object({
    path: z.string().describe("Path to the file or directory to remove."),
});

export type FsRemoveInput = z.infer<typeof FsRemoveInputSchema>;

export const FsMkdirInputSchema = z.object({
    path: z.string().describe("Path to the directory to create relative to the sandbox root."),
});

export type FsMkdirInput = z.infer<typeof FsMkdirInputSchema>;

export const FsMoveInputSchema = z.object({
    source: z.string().describe("Source path relative to the sandbox root."),
    destination: z.string().describe("Destination path relative to the sandbox root."),
});

export type FsMoveInput = z.infer<typeof FsMoveInputSchema>;

// ─── Terminal Tools ────────────────────────────────────────────────────────

export const TerminalExecuteInputSchema = z.object({
    command: z.array(z.string()).describe("The command and arguments to execute (e.g. ['npm', 'test'])."),
    cwd: z.string().default('.').describe("Working directory relative to the sandbox root."),
    timeoutMs: z.number().default(30000).describe("Timeout in milliseconds."),
    env: z.record(z.string(), z.string()).optional().describe("Process-specific environment variables.")
});

export type TerminalExecuteInput = z.infer<typeof TerminalExecuteInputSchema>;

export const TerminalSpawnInputSchema = z.object({
    name: z.string().describe("A display name for this background service."),
    command: z.array(z.string()).describe("The command and arguments to spawn."),
    cwd: z.string().default('.').describe("Working directory relative to the sandbox root."),
    env: z.record(z.string(), z.string()).optional().describe("Process-specific environment variables.")
});

export type TerminalSpawnInput = z.infer<typeof TerminalSpawnInputSchema>;

export const TerminalKillInputSchema = z.object({
    processId: z.string().describe("The ID of the background process to kill."),
});

export type TerminalKillInput = z.infer<typeof TerminalKillInputSchema>;

export const TerminalListOutputSchema = z.array(z.object({
    id: z.string(),
    serviceName: z.string(),
    command: z.array(z.string()),
    status: z.enum(['running', 'exited', 'error']),
    startTime: z.coerce.date(),
}));

export type TerminalListOutput = z.infer<typeof TerminalListOutputSchema>;

export const TerminalLogsInputSchema = z.object({
    processId: z.string().describe("The ID of the background process to read logs from."),
    tail: z.number().default(100).describe("Number of lines to return."),
});

export type TerminalLogsInput = z.infer<typeof TerminalLogsInputSchema>;

export const TerminalSessionInputSchema = z.object({
    shell: z.string().default('/bin/bash').describe("The shell to open."),
    cols: z.number().default(80),
    rows: z.number().default(24),
});

export type TerminalSessionInput = z.infer<typeof TerminalSessionInputSchema>;

export const TerminalSessionWriteInputSchema = z.object({
    sessionId: z.string().describe("The PTY session ID."),
    data: z.string().describe("The raw string data to write to stdin."),
});

export type TerminalSessionWriteInput = z.infer<typeof TerminalSessionWriteInputSchema>;

export const TerminalSessionResizeInputSchema = z.object({
    sessionId: z.string().describe("The PTY session ID."),
    cols: z.number(),
    rows: z.number(),
});

export type TerminalSessionResizeInput = z.infer<typeof TerminalSessionResizeInputSchema>;

export const TerminalSessionListOutputSchema = z.array(z.object({
    id: z.string(),
    shell: z.string(),
}));

export type TerminalSessionListOutput = z.infer<typeof TerminalSessionListOutputSchema>;

// ─── Common Outputs ─────────────────────────────────────────────────────────

export const SuccessOutputSchema = z.object({
    success: z.boolean().describe("Whether the operation was successful"),
});

export type SuccessOutput = z.infer<typeof SuccessOutputSchema>;

// ─── Networking & Port Forwarding Schemas ───────────────────────────────────

export const NetworkExposeInputSchema = z.object({
    port: z.number().describe("The container port to expose/proxy"),
    protocol: z.enum(['tcp', 'udp']).default('tcp').describe("The transport protocol")
});
export type NetworkExposeInput = z.infer<typeof NetworkExposeInputSchema>;

export const NetworkExposeOutputSchema = z.object({
    success: z.boolean().describe("Whether port exposure succeeded"),
    mappedUrl: z.string().describe("The mapped host or proxy URL")
});
export type NetworkExposeOutput = z.infer<typeof NetworkExposeOutputSchema>;

export const NetworkUnexposeInputSchema = z.object({
    port: z.number().describe("The container port to stop exposing")
});
export type NetworkUnexposeInput = z.infer<typeof NetworkUnexposeInputSchema>;

export const NetworkListOutputSchema = z.array(z.object({
    port: z.number().describe("The internal container port"),
    mappedUrl: z.string().describe("The external mapped host/proxy URL"),
    protocol: z.string().describe("Protocol used")
}));
export type NetworkListOutput = z.infer<typeof NetworkListOutputSchema>;

export const NetworkSetPolicyInputSchema = z.object({
    allowInternet: z.boolean().describe("Whether to allow external internet connectivity inside the sandbox")
});
export type NetworkSetPolicyInput = z.infer<typeof NetworkSetPolicyInputSchema>;

// ─── Environment & Secret Management Schemas ───────────────────────────────

export const EnvSetInputSchema = z.object({
    key: z.string().describe("The environment variable key"),
    value: z.string().describe("The environment variable value")
});
export type EnvSetInput = z.infer<typeof EnvSetInputSchema>;

export const EnvSetSecretInputSchema = z.object({
    key: z.string().describe("The secret key"),
    value: z.string().describe("The secret value")
});
export type EnvSetSecretInput = z.infer<typeof EnvSetSecretInputSchema>;

export const EnvListOutputSchema = z.record(z.string(), z.string()).describe("A dictionary of generic environment variables");
export type EnvListOutput = z.infer<typeof EnvListOutputSchema>;

// ─── Resource Limits & Telemetry Schemas ───────────────────────────────────

export const ResourceUpdateLimitsInputSchema = z.object({
    cpuCores: z.number().optional().describe("Number of CPU cores allowed"),
    memoryMb: z.number().optional().describe("Memory cap in Megabytes")
});
export type ResourceUpdateLimitsInput = z.infer<typeof ResourceUpdateLimitsInputSchema>;

export const ResourceGetStatsOutputSchema = z.object({
    cpuPercent: z.number().describe("Live container CPU usage percentage"),
    memoryMb: z.number().describe("Live container memory usage in Megabytes"),
    memoryLimitMb: z.number().describe("Total allocated memory capacity in Megabytes")
});
export type ResourceGetStatsOutput = z.infer<typeof ResourceGetStatsOutputSchema>;

// ─── Snapshot & State Management Schemas ───────────────────────────────────

export const StateCommitInputSchema = z.object({
    snapshotName: z.string().describe("The snapshot/image name template to commit to")
});
export type StateCommitInput = z.infer<typeof StateCommitInputSchema>;

export const StateCommitOutputSchema = z.object({
    success: z.boolean(),
    imageId: z.string().describe("The resulting unique image hash")
});
export type StateCommitOutput = z.infer<typeof StateCommitOutputSchema>;

export const StateCloneInputSchema = z.object({
    snapshotName: z.string().describe("The snapshot/image name template to clone from"),
    newSandboxId: z.string().describe("The ID of the new cloned sandbox to provision")
});
export type StateCloneInput = z.infer<typeof StateCloneInputSchema>;

