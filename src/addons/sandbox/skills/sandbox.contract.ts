import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import {
    SandboxSchema,
    SandboxSetActiveInputSchema,
    FsReadInputSchema,
    FsWriteInputSchema,
    FsListInputSchema,
    FsPatchInputSchema,
    FsRemoveInputSchema,
    FsMkdirInputSchema,
    FsMoveInputSchema,
    TerminalExecuteInputSchema,
    TerminalSpawnInputSchema,
    TerminalKillInputSchema,
    TerminalListOutputSchema,
    TerminalLogsInputSchema,
    TerminalSessionInputSchema,
    TerminalSessionListOutputSchema,
    TerminalSessionWriteInputSchema,
    TerminalSessionResizeInputSchema,
    SuccessOutputSchema,
    NetworkExposeInputSchema,
    NetworkExposeOutputSchema,
    NetworkUnexposeInputSchema,
    NetworkListOutputSchema,
    NetworkSetPolicyInputSchema,
    EnvSetInputSchema,
    EnvSetSecretInputSchema,
    EnvListOutputSchema,
    ResourceUpdateLimitsInputSchema,
    ResourceGetStatsOutputSchema,
    StateCommitInputSchema,
    StateCommitOutputSchema,
    StateCloneInputSchema
} from './sandbox.schema.js';

/**
 * --- Event Augmentation ---
 * We augment the events module to register our domain-specific events.
 */
declare module '../../../core/events.js' {
    interface EventRegistry {
        'sandbox:terminal_output': SandboxTerminalOutputEvent;
        'sandbox:pty_output': SandboxPtyOutputEvent;
    }
}

export const SandboxTerminalOutputEventSchema = z.object({
    sandboxId: z.string(),
    processId: z.string(),
    name: z.string(),
    type: z.enum(['stdout', 'stderr', 'exit']),
    data: z.string().optional(),
    exitCode: z.number().optional()
});
export type SandboxTerminalOutputEvent = z.infer<typeof SandboxTerminalOutputEventSchema>;

export const SandboxPtyOutputEventSchema = z.object({
    sandboxId: z.string(),
    sessionId: z.string(),
    type: z.enum(['stdout', 'stderr', 'exit']),
    data: z.string().optional(),
    exitCode: z.number().optional()
});
export type SandboxPtyOutputEvent = z.infer<typeof SandboxPtyOutputEventSchema>;

/**
 * Sandbox Domain: Unified Environment, Filesystem, and Execution.
 */
export const sandboxCrud = defineCrud('sandbox', SandboxSchema, {
    pluralPath: 'sandboxes',
    idField: 'id'
});

const successPrint = (output: { success: boolean }): string => output.success ? 'Operation successful.' : 'Operation failed.';

export const sandboxSetActiveContract = defineContract({
    domain: 'sandbox',
    action: 'set_active',
    description: 'Step into a specific sandbox. All subsequent FS and Terminal tools will target this sandbox.',
    inputSchema: SandboxSetActiveInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandboxes/active' },
    destructive: false,
    event: true,
    print: (output) => output.success ? `Successfully stepped into sandbox.` : `Failed to activate sandbox.`
});

export const sandboxPruneContract = defineContract({
    domain: 'sandbox',
    action: 'prune',
    description: 'Clean up stale or stopped sandbox containers running on the Docker host.',
    inputSchema: z.object({
        all: z.boolean().default(false).describe("If true, forcefully terminates and prunes all managed containers. If false, prunes only unused/orphaned containers."),
    }),
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/prune' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Pruning complete. Managed resources synchronized.` : `Pruning failed.`
});


// ─── Filesystem Contracts ────────────────────────────────────────────────────

export const sandboxFsReadContract = defineContract({
    domain: 'sandbox',
    action: 'fs_read',
    description: 'Read a file from the current sandbox.',
    inputSchema: FsReadInputSchema,
    outputSchema: z.object({ content: z.string(), size: z.number(), lastModified: z.coerce.date() }),
    rest: { method: 'GET', path: '/sandbox/fs/read' },
    destructive: false,
    event: true,
    print: (output) => `
### File Content
- **Size**: ${output.size} bytes
- **Last Modified**: ${output.lastModified.toISOString()}

\`\`\`
${output.content}
\`\`\`
    `.trim()
});

export const sandboxFsWriteContract = defineContract({
    domain: 'sandbox',
    action: 'fs_write',
    description: 'Write a file to the current sandbox.',
    inputSchema: FsWriteInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/fs/write' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `File written successfully.` : `Failed to write file.`
});

export const sandboxFsListContract = defineContract({
    domain: 'sandbox',
    action: 'fs_list',
    description: 'List contents of a directory in the current sandbox. Automatically ignores .git, node_modules, and dist.',
    inputSchema: FsListInputSchema,
    outputSchema: z.array(z.object({ name: z.string(), isDirectory: z.boolean(), size: z.number() })),
    rest: { method: 'GET', path: '/sandbox/fs/list' },
    destructive: false,
    event: true,
    print: (output) => {
        if (output.length === 0) return "Directory is empty.";
        const rows = output.map(f => `| ${f.name}${f.isDirectory ? '/' : ''} | ${f.isDirectory ? 'DIR' : 'FILE'} | ${f.size} |`).join('\n');
        return `
### Directory Listing
| Name | Type | Size (Bytes) |
| :--- | :--- | :----------- |
${rows}
        `.trim();
    }
});

export const sandboxFsPatchContract = defineContract({
    domain: 'sandbox',
    action: 'fs_patch',
    description: 'Apply targeted changes to a file in the current sandbox.',
    inputSchema: FsPatchInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/fs/patch' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `File patched successfully.` : `Failed to patch file.`
});

export const sandboxFsRemoveContract = defineContract({
    domain: 'sandbox',
    action: 'fs_remove',
    description: 'Remove a file or directory from the current sandbox.',
    inputSchema: FsRemoveInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'DELETE', path: '/sandbox/fs/remove' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Resource removed successfully.` : `Failed to remove resource.`
});

export const sandboxFsMkdirContract = defineContract({
    domain: 'sandbox',
    action: 'fs_mkdir',
    description: 'Create a new directory in the current sandbox.',
    inputSchema: FsMkdirInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/fs/mkdir' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Directory created successfully.` : `Failed to create directory.`
});

export const sandboxFsMoveContract = defineContract({
    domain: 'sandbox',
    action: 'fs_move',
    description: 'Move or rename a file/directory in the current sandbox.',
    inputSchema: FsMoveInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/fs/move' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Resource moved successfully.` : `Failed to move resource.`
});

// ─── Terminal Contracts ──────────────────────────────────────────────────────

export const sandboxTerminalExecuteContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_execute',
    description: 'Execute a short-lived command in the current sandbox. Output (stdout/stderr) is capped at 50,000 chars each (preserving the tail).',
    inputSchema: TerminalExecuteInputSchema,
    outputSchema: z.object({ exitCode: z.number(), stdout: z.string(), stderr: z.string() }),
    rest: { method: 'POST', path: '/sandbox/terminal/execute' },
    destructive: true,
    event: true,
    print: (output) => `
### Command Execution Result
- **Exit Code**: ${output.exitCode}

#### STDOUT
\`\`\`
${output.stdout || '(empty)'}
\`\`\`

#### STDERR
\`\`\`
${output.stderr || '(empty)'}
\`\`\`
    `.trim()
});

export const sandboxTerminalSpawnContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_spawn',
    description: 'Spawn a background service in the current sandbox.',
    inputSchema: TerminalSpawnInputSchema,
    outputSchema: z.object({ processId: z.string() }),
    rest: { method: 'POST', path: '/sandbox/terminal/spawn' },
    destructive: true,
    event: true,
    print: (output) => `Background service spawned. Process ID: ${output.processId}`
});

export const sandboxTerminalListContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_list',
    description: 'List all background services running in the current sandbox.',
    inputSchema: z.object({}),
    outputSchema: TerminalListOutputSchema,
    rest: { method: 'GET', path: '/sandbox/terminal/spawn' },
    destructive: false,
    event: true,
    print: (output) => {
        if (output.length === 0) return "No background services running.";
        const rows = output.map(s => `| ${s.id} | ${s.serviceName} | ${s.status} | ${s.startTime.toISOString()} |`).join('\n');
        return `
### Background Services
| ID | Name | Status | Started At |
| :--- | :--- | :--- | :--- |
${rows}
        `.trim();
    }
});

export const sandboxTerminalKillContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_kill',
    description: 'Kill a background service in the current sandbox.',
    inputSchema: TerminalKillInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/terminal/kill' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Service terminated successfully.` : `Failed to terminate service.`
});

export const sandboxTerminalLogsContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_logs',
    description: 'Get logs for a background service in the current sandbox.',
    inputSchema: TerminalLogsInputSchema,
    outputSchema: z.object({ logs: z.string() }),
    rest: { method: 'GET', path: '/sandbox/terminal/logs' },
    destructive: false,
    event: true,
    print: (output) => `
### Background Service Logs
\`\`\`
${output.logs || '(no logs available)'}
\`\`\`
    `.trim()
});

export const sandboxTerminalSessionOpenContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_session_open',
    description: 'Open a persistent PTY session (e.g. bash) in the current sandbox.',
    inputSchema: TerminalSessionInputSchema,
    outputSchema: z.object({ sessionId: z.string() }),
    rest: { method: 'POST', path: '/sandbox/terminal/sessions' },
    destructive: true,
    event: true,
    print: (output) => `PTY Session opened. Session ID: ${output.sessionId}`
});

export const sandboxTerminalSessionListContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_session_list',
    description: 'List all active PTY sessions in the current sandbox.',
    inputSchema: z.object({}),
    outputSchema: TerminalSessionListOutputSchema,
    rest: { method: 'GET', path: '/sandbox/terminal/sessions' },
    destructive: false,
    event: true,
    print: (output) => {
        if (output.length === 0) return "No active PTY sessions.";
        const rows = output.map(s => `| ${s.id} | ${s.shell} |`).join('\n');
        return `
### Active PTY Sessions
| ID | Shell |
| :--- | :--- |
${rows}
        `.trim();
    }
});

export const sandboxTerminalSessionWriteContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_session_write',
    description: 'Write data to a PTY session stdin.',
    inputSchema: TerminalSessionWriteInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/terminal/sessions/:sessionId/write' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Data written to PTY session.` : `Failed to write to PTY session.`
});

export const sandboxTerminalSessionResizeContract = defineContract({
    domain: 'sandbox',
    action: 'terminal_session_resize',
    description: 'Resize a PTY session window.',
    inputSchema: TerminalSessionResizeInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/terminal/sessions/:sessionId/resize' },
    destructive: false,
    event: true,
    print: (output) => output.success ? `PTY session resized.` : `Failed to resize PTY session.`
});

// ─── Networking & Port Forwarding Contracts ──────────────────────────────────

export const sandboxNetworkExposeContract = defineContract({
    domain: 'sandbox',
    action: 'network_expose',
    description: 'Map a container port to the host or proxy.',
    inputSchema: NetworkExposeInputSchema,
    outputSchema: NetworkExposeOutputSchema,
    rest: { method: 'POST', path: '/sandbox/network/expose' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Port exposed successfully. Mapped URL: ${output.mappedUrl}` : `Failed to expose port.`
});

export const sandboxNetworkUnexposeContract = defineContract({
    domain: 'sandbox',
    action: 'network_unexpose',
    description: 'Remove a port mapping.',
    inputSchema: NetworkUnexposeInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/network/unexpose' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Port mapping removed.` : `Failed to remove port mapping.`
});

export const sandboxNetworkListContract = defineContract({
    domain: 'sandbox',
    action: 'network_list',
    description: 'List all active exposed ports.',
    inputSchema: z.object({}),
    outputSchema: NetworkListOutputSchema,
    rest: { method: 'GET', path: '/sandbox/network/list' },
    destructive: false,
    event: true,
    print: (output) => {
        if (output.length === 0) return "No ports are currently exposed.";
        const rows = output.map(n => `| ${n.port} | ${n.protocol} | ${n.mappedUrl} |`).join('\n');
        return `
### Exposed Ports
| Container Port | Protocol | Mapped URL |
| :--- | :--- | :--- |
${rows}
        `.trim();
    }
});

export const sandboxNetworkSetPolicyContract = defineContract({
    domain: 'sandbox',
    action: 'network_set_policy',
    description: 'Toggle external internet access for the sandbox.',
    inputSchema: NetworkSetPolicyInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/network/policy' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Network policy updated.` : `Failed to update network policy.`
});

// ─── Environment Variables Contracts ────────────────────────────────────────

export const sandboxEnvSetContract = defineContract({
    domain: 'sandbox',
    action: 'env_set',
    description: 'Set a generic environment variable.',
    inputSchema: EnvSetInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/env' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Environment variable set.` : `Failed to set environment variable.`
});

export const sandboxEnvSetSecretContract = defineContract({
    domain: 'sandbox',
    action: 'env_set_secret',
    description: 'Set a secret (hidden from logs/telemetry).',
    inputSchema: EnvSetSecretInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/env/secret' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Secret set successfully (hidden from logs).` : `Failed to set secret.`
});

export const sandboxEnvListContract = defineContract({
    domain: 'sandbox',
    action: 'env_list',
    description: 'List all non-secret environment variables.',
    inputSchema: z.object({}),
    outputSchema: EnvListOutputSchema,
    rest: { method: 'GET', path: '/sandbox/env' },
    destructive: false,
    event: true,
    print: (output) => {
        const keys = Object.keys(output);
        if (keys.length === 0) return "No environment variables defined.";
        const rows = keys.map(k => `| ${k} | ${output[k]} |`).join('\n');
        return `
### Environment Variables
| Key | Value |
| :--- | :--- |
${rows}
        `.trim();
    }
});

// ─── Resource Management & Telemetry Contracts ──────────────────────────────

export const sandboxResourceUpdateLimitsContract = defineContract({
    domain: 'sandbox',
    action: 'resource_update_limits',
    description: 'Update constraints on the active sandbox.',
    inputSchema: ResourceUpdateLimitsInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/resources/limits' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Resource limits updated.` : `Failed to update resource limits.`
});

export const sandboxResourceGetStatsContract = defineContract({
    domain: 'sandbox',
    action: 'resource_get_stats',
    description: 'Fetch current CPU/Memory usage metrics.',
    inputSchema: z.object({}),
    outputSchema: ResourceGetStatsOutputSchema,
    rest: { method: 'GET', path: '/sandbox/resources/stats' },
    destructive: false,
    event: true,
    print: (output) => `
### Resource Usage
- **CPU Usage**: ${output.cpuPercent}%
- **Memory Usage**: ${output.memoryMb} MB
- **Memory Limit**: ${output.memoryLimitMb} MB
    `.trim()
});

// ─── Snapshot & State Management Contracts ──────────────────────────────────

export const sandboxStateCommitContract = defineContract({
    domain: 'sandbox',
    action: 'state_commit',
    description: 'Save current container state as a named image.',
    inputSchema: StateCommitInputSchema,
    outputSchema: StateCommitOutputSchema,
    rest: { method: 'POST', path: '/sandbox/state/commit' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `State committed. Image ID: ${output.imageId}` : `Failed to commit state.`
});

export const sandboxStateCloneContract = defineContract({
    domain: 'sandbox',
    action: 'state_clone',
    description: 'Create a new sandbox from a saved snapshot.',
    inputSchema: StateCloneInputSchema,
    outputSchema: SuccessOutputSchema,
    rest: { method: 'POST', path: '/sandbox/state/clone' },
    destructive: true,
    event: true,
    print: (output) => output.success ? `Sandbox cloned successfully.` : `Failed to clone sandbox.`
});

