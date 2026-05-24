import { ISkillContext } from '@flybyme/castellan/core';
import { z } from 'zod';
import {
    sandboxSetActiveContract,
    sandboxFsReadContract,
    sandboxFsWriteContract,
    sandboxFsListContract,
    sandboxFsPatchContract,
    sandboxFsRemoveContract,
    sandboxTerminalExecuteContract,
    sandboxTerminalSpawnContract,
    sandboxTerminalListContract,
    sandboxTerminalKillContract,
    sandboxTerminalLogsContract,
    sandboxFsMkdirContract,
    sandboxFsMoveContract,
    sandboxTerminalSessionOpenContract,
    sandboxTerminalSessionListContract,
    sandboxTerminalSessionWriteContract,
    sandboxTerminalSessionResizeContract,
    sandboxPruneContract,
    sandboxCrud,
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
import { SandboxSchema, SettingSchema } from './sandbox.schema.js';
import { SandboxSkill } from './sandbox.skill.js';
import { nanoid } from 'nanoid';

/**
 * getActiveSandbox: Helper to resolve the focused sandbox from context.
 */
async function getActiveSandbox(ctx: ISkillContext) {
    const id = await ctx.api.settings.get({
        key: 'active_sandbox'
    })

    console.log('Active sandbox ID: ', id);

    if (!id) {
        throw new Error("Validation Failed: You are not currently inside a sandbox. Use 'sandbox_set_active' to step into one.");
    }
    try {
        return await SandboxSkill.instance.getSandbox(id, ctx);
    } catch (err) {
        throw new Error(`Sandbox record not found in 'sandbox' collection: ${id}. Please ensure the sandbox exists or use 'sandbox_set_active' with a valid ID.`);
    }
}

// ─── Environment Tools ──────────────────────────────────────────────────────

export async function sandbox_set_active(
    input: z.infer<typeof sandboxSetActiveContract.inputSchema>,
    ctx: ISkillContext
) {
    // 1. Verify sandbox exists in DB
    const sandbox = await ctx.api.sandbox.find_one({ query: { id: input.id } });
    if (!sandbox) throw new Error(`Sandbox not found: ${input.id}`);

    // 2. Persist the choice globally
    await ctx.api.settings.update({ key: 'active_sandbox', value: input.id });
    console.log('Sandboz set to active: ', input.id);

    return { success: true };
}

// ─── Filesystem Tools ───────────────────────────────────────────────────────

export async function sandbox_fs_read(
    input: z.infer<typeof sandboxFsReadContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.readFile(input.path);
}

export async function sandbox_fs_write(
    input: z.infer<typeof sandboxFsWriteContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.writeFile(input.path, input.content);
    return { success };
}

export async function sandbox_fs_list(
    input: z.infer<typeof sandboxFsListContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.listDirectory(input.path, input.recursive);
}

export async function sandbox_fs_patch(
    input: z.infer<typeof sandboxFsPatchContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    // 1. Read the current content
    await sandbox.readFile(input.path);

    // 2. Use the "Coder" capability to patch (simulated for now, would typically use an LLM call)
    // For this unified tool, we'll assume the implementation is handled by the server's AI agent.
    throw new Error("fs_patch implementation requires the Coder agent to be initialized.");

    return { success: true };
}

export async function sandbox_fs_remove(
    input: z.infer<typeof sandboxFsRemoveContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.removeFile(input.path);
    return { success };
}

export async function sandbox_fs_mkdir(
    input: z.infer<typeof sandboxFsMkdirContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.mkdir(input.path);
    return { success };
}

export async function sandbox_fs_move(
    input: z.infer<typeof sandboxFsMoveContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.moveFile(input.source, input.destination);
    return { success };
}

// ─── Terminal Tools ────────────────────────────────────────────────────────

export async function sandbox_terminal_execute(
    input: z.infer<typeof sandboxTerminalExecuteContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.executeCommand(input.command, input.cwd, input.env || {}, input.timeoutMs);
}

export async function sandbox_terminal_spawn(
    input: z.infer<typeof sandboxTerminalSpawnContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const processId = await sandbox.spawnBackgroundService(
        input.name,
        input.command,
        input.env || {},
        {},
        (type, data, exitCode) => {
            // Dispatch real-time chunks to the event stream
            void ctx.events.dispatch('sandbox:terminal_output', ctx.correlationId, {
                sandboxId: ctx.sandboxId!,
                processId,
                name: input.name,
                type,
                data,
                exitCode
            });
        }
    );
    return { processId };
}

export async function sandbox_terminal_list(
    input: z.infer<typeof sandboxTerminalListContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.listBackgroundServices();
}

export async function sandbox_terminal_kill(
    input: z.infer<typeof sandboxTerminalKillContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.killBackgroundService(input.processId);
    return { success };
}

export async function sandbox_terminal_logs(
    input: z.infer<typeof sandboxTerminalLogsContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const logs = await sandbox.getBackgroundServiceLogs(input.processId, input.tail);
    return { logs };
}

export async function sandbox_terminal_session_open(
    input: z.infer<typeof sandboxTerminalSessionOpenContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const sessionId = await sandbox.openPtySession(
        input.shell,
        '.',
        {},
        input.cols,
        input.rows,
        (type, data, exitCode) => {
            // Dispatch real-time chunks to the event stream
            void ctx.events.dispatch('sandbox:pty_output', ctx.correlationId, {
                sandboxId: ctx.sandboxId!,
                sessionId,
                type,
                data,
                exitCode
            });
        }
    );
    return { sessionId };
}

export async function sandbox_terminal_session_list(
    input: z.infer<typeof sandboxTerminalSessionListContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.listPtySessions();
}

export async function sandbox_terminal_session_write(
    input: z.infer<typeof sandboxTerminalSessionWriteContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    await sandbox.writeToPtySession(input.sessionId, input.data);
    return { success: true };
}

export async function sandbox_terminal_session_resize(
    input: z.infer<typeof sandboxTerminalSessionResizeContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    await sandbox.resizePtySession(input.sessionId, input.cols, input.rows);
    return { success: true };
}

export async function sandbox_prune(
    input: z.infer<typeof sandboxPruneContract.inputSchema>,
    ctx: ISkillContext
) {
    const dbSandboxes = await ctx.api.sandbox.find({ limit: 1000 });
    const dbSandboxIds = new Set<string>(dbSandboxes.map((s) => s.id));

    const prunedCount = await SandboxSkill.instance.pruneContainers(input.all, dbSandboxIds);
    console.log(`[sandbox_prune] Completed pruning: removed ${prunedCount} containers.`);

    // Purge sandbox database records that no longer have active running containers
    try {
        const containers = await SandboxSkill.instance.listContainers();
        const activeContainerSandboxIds = new Set<string>(
            containers
                .filter((c: any) => c.State === 'running')
                .map((c: any) => c.Labels['com.castellan.sandboxId'])
                .filter(Boolean)
        );

        for (const sandbox of dbSandboxes) {
            if (!activeContainerSandboxIds.has(sandbox.id) || input.all) {
                await ctx.api.sandbox.delete({ id: sandbox.id });
                console.log(`[sandbox_prune] Purged stale sandbox database record: ${sandbox.id}`);
            }
        }
    } catch (dbErr) {
        console.error('[sandbox_prune] Failed to sync database records:', dbErr);
    }

    return { success: true };
}

export async function sandbox_before_create(
    input: z.infer<typeof sandboxCrud['create']['inputSchema']>,
    ctx: ISkillContext
) {
    const gitUrl = input.gitUrl;
    if (!gitUrl || typeof gitUrl !== 'string') {
        throw new Error("Validation Failed: gitUrl is required and must be a valid string.");
    }

    const expectedOrg = process.env.GITHUB_ORG || 'flybyme';
    const cleanUrl = gitUrl.trim();
    const regex = /(?:github\.com[:\/])([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_.]+)/i;
    const match = cleanUrl.match(regex);
    let valid = true;
    if (expectedOrg && expectedOrg !== 'Not Configured') {
        if (match) {
            valid = match[1].toLowerCase() === expectedOrg.toLowerCase();
        } else {
            const relativeMatch = cleanUrl.match(/^([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_.]+)$/);
            if (relativeMatch) {
                valid = relativeMatch[1].toLowerCase() === expectedOrg.toLowerCase();
            } else {
                valid = false;
            }
        }
    }
    if (!valid) {
        throw new Error(`Access Denied: Sandbox repository must belong to the authorized GitHub organization '${expectedOrg}'. Repository requested: '${gitUrl}'`);
    }

    // Check for duplicate gitUrl in existing sandboxes
    const existing = await ctx.api.sandbox.find_one({ query: { gitUrl } });
    if (existing) {
        throw new Error(`Conflict: A sandbox is already provisioned for repository ${gitUrl}`);
    }

    return input;
}

export async function sandbox_after_create(
    item: z.infer<typeof sandboxCrud['create']['outputSchema']>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxCrud['create']['outputSchema']>> {
    console.log(`[sandbox_after_create] Provisioning host filesystem for ${item.id}...`);
    // 1. Provision host filesystem using the generated database ID
    await SandboxSkill.instance.createSandbox(item.id, item.gitUrl);

    // 2. Pre-initialize and register immediately in memory to bypass DB lag
    try {
        await SandboxSkill.instance.registerSandboxInMemory(item);
    } catch (err) {
        console.error(`[SandboxSkill] Immediate initialization failed for ${item.id}:`, err);
    }

    return item;
}

export async function sandbox_after_delete(
    output: z.infer<typeof sandboxCrud['delete']['outputSchema']> & { id?: string },
    _ctx: ISkillContext
): Promise<z.infer<typeof sandboxCrud['delete']['outputSchema']>> {
    if (output.id) {
        console.log(`[sandbox_after_delete] Cleaning up resources for sandbox ${output.id}...`);
        await SandboxSkill.instance.deleteSandbox(output.id);
    }
    return output;
}

export async function sandbox_create(
    _input: z.infer<typeof sandboxCrud['create']['inputSchema']>,
    _ctx: ISkillContext
): Promise<z.infer<typeof sandboxCrud['create']['outputSchema']>> {
    throw new Error("This tool is deprecated in favor of CRUD hooks.");
}

export async function sandbox_delete(
    _input: z.infer<typeof sandboxCrud['delete']['inputSchema']>,
    _ctx: ISkillContext
): Promise<z.infer<typeof sandboxCrud['delete']['outputSchema']>> {
    throw new Error("This tool is deprecated in favor of CRUD hooks.");
}

// ─── Networking & Port Forwarding Tool Handlers ─────────────────────────────

export async function sandbox_network_expose(
    input: z.infer<typeof sandboxNetworkExposeContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxNetworkExposeContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    const mappedUrl = await sandbox.exposePort(input.port, input.protocol);
    return { success: true, mappedUrl };
}

export async function sandbox_network_unexpose(
    input: z.infer<typeof sandboxNetworkUnexposeContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxNetworkUnexposeContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.unexposePort(input.port);
    return { success };
}

export async function sandbox_network_list(
    input: z.infer<typeof sandboxNetworkListContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxNetworkListContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.listExposedPorts();
}

export async function sandbox_network_set_policy(
    input: z.infer<typeof sandboxNetworkSetPolicyContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxNetworkSetPolicyContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.setNetworkPolicy(input.allowInternet);
    return { success };
}

// ─── Environment Variables Tool Handlers ─────────────────────────────────────

export async function sandbox_env_set(
    input: z.infer<typeof sandboxEnvSetContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxEnvSetContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.setEnv(input.key, input.value, false);
    return { success };
}

export async function sandbox_env_set_secret(
    input: z.infer<typeof sandboxEnvSetSecretContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxEnvSetSecretContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.setEnv(input.key, input.value, true);
    return { success };
}

export async function sandbox_env_list(
    input: z.infer<typeof sandboxEnvListContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxEnvListContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.listEnv();
}

// ─── Resource Limits & Telemetry Tool Handlers ───────────────────────────────

export async function sandbox_resource_update_limits(
    input: z.infer<typeof sandboxResourceUpdateLimitsContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxResourceUpdateLimitsContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    const success = await sandbox.updateResourceLimits(input.cpuCores, input.memoryMb);
    return { success };
}

export async function sandbox_resource_get_stats(
    input: z.infer<typeof sandboxResourceGetStatsContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxResourceGetStatsContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    return await sandbox.getResourceStats();
}

// ─── Snapshot & State Management Tool Handlers ───────────────────────────────

export async function sandbox_state_commit(
    input: z.infer<typeof sandboxStateCommitContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxStateCommitContract.outputSchema>> {
    const sandbox = await getActiveSandbox(ctx);
    const imageId = await sandbox.commitState(input.snapshotName);
    return { success: true, imageId };
}

export async function sandbox_state_clone(
    input: z.infer<typeof sandboxStateCloneContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxStateCloneContract.outputSchema>> {
    const activeId = ctx.sandboxId;
    if (!activeId) throw new Error("No active sandbox. Call sandbox_set_active first.");
    const sourceSandbox = await SandboxSkill.instance.getSandbox(activeId, ctx);

    const imageId = await sourceSandbox.commitState(input.snapshotName);

    const doc = await ctx.api.sandbox.find_one({ query: { id: activeId } });
    if (!doc) throw new Error(`Source sandbox ${activeId} record not found.`);

    const item = await ctx.api.sandbox.create({
        name: `${doc.name} (Clone)`,
        description: `Cloned from ${doc.name} with snapshot ${input.snapshotName}`,
        gitUrl: doc.gitUrl,
        image: imageId,
        status: 'active',
        agentId: doc.agentId || null,
        threadId: doc.threadId || null
    });

    await SandboxSkill.instance.createSandbox(item.id, doc.gitUrl);

    await SandboxSkill.instance.registerSandboxInMemory(item);

    return { success: true };
}
