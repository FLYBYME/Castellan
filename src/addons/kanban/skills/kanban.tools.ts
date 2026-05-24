import { z } from 'zod';
import { ISkillContext } from '@flybyme/castellan/core';
import * as contract from './kanban.contract.js';
import { KanbanWorkItem, KanbanFeature, KanbanStage } from './kanban.schema.js';

/**
 * kanban_move: Enforcing lifecycle transitions for Features and WorkItems.
 */
export async function kanban_move(
    input: z.infer<typeof contract.kanbanMoveContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof contract.kanbanMoveContract.outputSchema>> {
    const isWorkItem = input.type === 'work_item';
    
    // 1. Resolve Entity
    const item = isWorkItem 
        ? await ctx.api.kanban_work_item.get({ id: input.id })
        : await ctx.api.kanban_feature.get({ id: input.id });

    if (!item) throw new Error(`Kanban ${input.type} not found: ${input.id}`);

    // 2. Validate Transition
    const currentStatus = item.status as KanbanStage;
    const targetStatus = input.stage as KanbanStage;

    const VALID_TRANSITIONS: Record<KanbanStage, KanbanStage[]> = {
        "Backlog": ["Ready", "In Progress"],
        "Ready": ["Backlog", "In Progress"],
        "In Progress": ["Ready", "Testing", "Backlog"],
        "Testing": ["In Progress", "Done", "Backlog"],
        "Done": ["In Progress", "Backlog"]
    };

    if (currentStatus !== targetStatus && !VALID_TRANSITIONS[currentStatus].includes(targetStatus)) {
        throw new Error(`Lifecycle Error: Invalid transition '${currentStatus}' -> '${targetStatus}' for ${input.type}.`);
    }

    // 3. Dependency Blocking
    if (isWorkItem && targetStatus === 'In Progress') {
        const wi = item as KanbanWorkItem;
        if (wi.dependencies && wi.dependencies.length > 0) {
            const deps = await ctx.api.kanban_work_item.find({ 
                query: { id: { $in: wi.dependencies } } 
            });
            const uncompleted = deps.filter(d => d.status !== 'Done');
            if (uncompleted.length > 0) {
                throw new Error(`Dependency Error: Cannot move to In Progress. Uncompleted dependencies: ${uncompleted.map(d => d.title).join(', ')}`);
            }
        }
    }

    // 4. Perform Update
    const updated = isWorkItem
        ? await ctx.api.kanban_work_item.update({ id: input.id, status: input.stage })
        : await ctx.api.kanban_feature.update({ id: input.id, status: input.stage });

    // 5. Feature Status Rollup (Post-Update)
    if (isWorkItem && targetStatus === 'Done') {
        const wi = updated as KanbanWorkItem;
        const allItems = await ctx.api.kanban_work_item.find({ 
            query: { featureId: wi.featureId } 
        });
        const allDone = allItems.every(i => i.status === 'Done');
        if (allDone && allItems.length > 0) {
            console.log(`[KanbanRollup] All items Done for Feature ${wi.featureId}. Moving feature to Done.`);
            await ctx.api.kanban_feature.update({ id: wi.featureId, status: 'Done' });
        }
    }

    return {
        success: true,
        title: (updated as any).title || (updated as any).name,
        status: updated!.status
    };
}

/**
 * kanban_feature_before_create: Validate projectId exists.
 */
export async function kanban_feature_before_create(
    input: z.infer<typeof contract.kanbanFeatureCrud['create']['inputSchema']>,
    ctx: ISkillContext
) {
    const project = await ctx.api.kanban_project.get({ id: input.projectId });
    if (!project) {
        throw new Error(`Validation Error: Project '${input.projectId}' not found. Features must be linked to a valid Project.`);
    }
    return input;
}

/**
 * kanban_work_item_before_create: Validate featureId exists.
 */
export async function kanban_work_item_before_create(
    input: z.infer<typeof contract.kanbanWorkItemCrud['create']['inputSchema']>,
    ctx: ISkillContext
) {
    const feature = await ctx.api.kanban_feature.get({ id: input.featureId });
    if (!feature) {
        throw new Error(`Validation Error: Feature '${input.featureId}' not found. WorkItems must be linked to a valid Feature.`);
    }
    return input;
}

/**
 * kanban_work_item_after_create: CRUD hook for automated sandbox provisioning.
 */
export async function kanban_work_item_after_create(
    item: KanbanWorkItem & { id: string },
    ctx: ISkillContext
) {
    console.log(`[KanbanHook] Intercepting WorkItem creation: ${item.id}`);

    try {
        // 1. Resolve Project Info
        const feature = await ctx.api.kanban_feature.get({ id: item.featureId });
        if (!feature) throw new Error("Parent feature not found.");

        const project = await ctx.api.kanban_project.get({ id: feature.projectId });
        if (!project) throw new Error("Parent project not found.");

        // 2. Provision Sandbox
        console.log(`[KanbanHook] Resolving sandbox for repository ${project.gitUrl}...`);
        
        // First, check for an existing sandbox with this gitUrl
        const existingSandboxes = await ctx.api.sandbox.find({ 
            query: { gitUrl: project.gitUrl, status: 'active' } 
        });

        let sandboxId: string;

        if (existingSandboxes.length > 0) {
            sandboxId = existingSandboxes[0].id;
            console.log(`[KanbanHook] Reusing existing sandbox: ${sandboxId}`);
        } else {
            console.log(`[KanbanHook] No existing sandbox found. Provisioning new environment for branch ${item.branchName}...`);
            const newSandbox = await ctx.api.sandbox.create({
                name: `${project.name} (${item.branchName})`,
                gitUrl: project.gitUrl,
                image: project.sandboxImage || 'node:18',
                status: 'active'
            });
            sandboxId = newSandbox.id;
        }

        // Set this as the active sandbox so subsequent internal API calls (like git checkout) work
        await ctx.api.settings.update({ key: 'active_sandbox', value: sandboxId });

        // 3. Prepare Branch
        console.log(`[KanbanHook] Configuring git safe directory and checking out branch ${item.branchName} in sandbox ${sandboxId}...`);
        
        await ctx.api.sandbox.terminal_execute({
            command: ['git', 'config', '--global', '--add', 'safe.directory', '/workspace'],
            cwd: '.'
        });

        await ctx.api.sandbox.terminal_execute({
            command: ['git', 'checkout', '-b', item.branchName],
            cwd: '.'
        });

        // 4. Link Sandbox to WorkItem
        const updatedItem = await ctx.api.kanban_work_item.update({
            id: item.id,
            sandboxId: sandboxId
        });

        console.log(`[KanbanHook] WorkItem ${item.id} successfully linked to Sandbox ${sandboxId}`);
        return updatedItem as KanbanWorkItem & { id: string };
    } catch (err) {
        console.error(`[KanbanHook] Automated provisioning failed for ${item.id}:`, err);
        const failedItem = await ctx.api.kanban_work_item.update({
            id: item.id,
            errorLog: [(err as Error).message]
        });
        return failedItem as KanbanWorkItem & { id: string };
    }
}

/**
 * kanban_work_item_after_delete: Cleanup resources.
 */
export async function kanban_work_item_after_delete(
    result: { id: string, success: boolean, item?: KanbanWorkItem },
    ctx: ISkillContext
) {
    if (result.success && result.item?.sandboxId) {
        console.log(`[KanbanHook] Cleaning up sandbox ${result.item.sandboxId} for deleted WorkItem ${result.id}`);
        try {
            await ctx.api.sandbox.delete({ id: result.item.sandboxId });
        } catch (e) {
            console.warn(`[KanbanHook] Failed to delete sandbox ${result.item.sandboxId}:`, e);
        }
    }
    return result;
}
