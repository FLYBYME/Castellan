import { ISkillContext } from 'castellan/core';
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
    sandboxCrud
} from './sandbox.contract.js';
import { SandboxSchema, SettingSchema } from './sandbox.schema.js';
import { SandboxSkill } from './sandbox.skill.js';
import { nanoid } from 'nanoid';

/**
 * getActiveSandbox: Helper to resolve the focused sandbox from context.
 */
async function getActiveSandbox(ctx: ISkillContext) {
    const id = ctx.sandboxId;
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

    // 3. IMPORTANT: Update the current execution context immediately!
    // This ensures subsequent tools in the same turn use the correct ID.
    (ctx as any).sandboxId = input.id;

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
    return await sandbox.executeCommand(input.command, input.cwd, {}, input.timeoutMs);
}

export async function sandbox_terminal_spawn(
    input: z.infer<typeof sandboxTerminalSpawnContract.inputSchema>,
    ctx: ISkillContext
) {
    const sandbox = await getActiveSandbox(ctx);
    const processId = await sandbox.spawnBackgroundService(
        input.name, 
        input.command, 
        {}, 
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

export async function sandbox_create(
    input: z.infer<typeof sandboxCrud['create']['inputSchema']>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxCrud['create']['outputSchema']>> {
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

    // 1. Create database record using Dynamic Database repository through the context API
    const item = await ctx.api.sandbox.create({
        name: input.name,
        description: input.description || null,
        gitUrl,
        image,
        status: 'active',
        agentId: input.agentId || null,
        threadId: input.threadId || null
    });

    // 2. Provision host filesystem using the generated database ID
    const hostPath = await SandboxSkill.instance.createSandbox(item.id, gitUrl);

    // 3. Update the database record with the hostPath
    const updatedItem = await ctx.api.sandbox.update({
        id: item.id,
        hostPath
    });

    // 4. Pre-initialize and register immediately in memory to bypass DB lag
    try {
        await SandboxSkill.instance.registerSandboxInMemory(updatedItem);
    } catch (err) {
        console.error(`[SandboxSkill] Immediate initialization failed for ${updatedItem.id}:`, err);
    }

    return updatedItem;
}

export async function sandbox_delete(
    input: z.infer<typeof sandboxCrud['delete']['inputSchema']>,
    ctx: ISkillContext
): Promise<z.infer<typeof sandboxCrud['delete']['outputSchema']>> {
    // 1. Clean up sandbox containers and host folder
    await SandboxSkill.instance.deleteSandbox(input.id);

    // 2. Delete database record
    await ctx.api.sandbox.delete({ id: input.id });

    return { success: true };
}
