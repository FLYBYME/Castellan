import { CastellanClient } from './generated/client/CastellanClient.js';
import { C } from './cli/core/Utils.js';

const CLIENT_URL = 'http://localhost:3000';

type TestContext = {
    client: CastellanClient;
};

type TestFunction = (ctx: TestContext) => Promise<void>;

const tests: Record<string, TestFunction> = {};

/**
 * Cleanup helper to clear the Kanban board and active sandboxes.
 */
async function cleanup(client: CastellanClient) {
    console.log(`${C.yellow}Cleaning up environment...${C.reset}`);
    
    // Cleanup WorkItems
    const workItems = await client.api.kanban_work_item.find({ limit: 100 });
    for (const item of workItems) {
        await client.api.kanban_work_item.delete({ id: (item as any).id });
    }

    // Cleanup Features
    const features = await client.api.kanban_feature.find({ limit: 100 });
    for (const f of features) {
        await client.api.kanban_feature.delete({ id: (f as any).id });
    }

    // Cleanup Projects
    const projects = await client.api.kanban_project.find({ limit: 100 });
    for (const p of projects) {
        await client.api.kanban_project.delete({ id: (p as any).id });
    }

    const sandboxes = await client.api.sandbox.find({ limit: 100 });
    for (const sb of sandboxes) {
        await client.api.sandbox.delete({ id: sb.id });
    }
}

/**
 * setupGitFlow: Creates a project and feature to work in.
 */
async function setupGitFlow(client: CastellanClient) {
    const project = await client.api.kanban_project.create({
        name: 'Castellan Test',
        description: 'System tests repository',
        gitUrl: 'https://github.com/FLYBYME/Castellan.git',
        defaultBranch: 'main',
        sandboxImage: 'node:18'
    });
    
    const feature = await client.api.kanban_feature.create({
        projectId: (project as any).id,
        name: 'System Verification',
        description: 'Verifying orchestrator mandates.',
        status: 'In Progress',
        priority: 'High'
    });

    return { project: project as any, feature: feature as any };
}

// ─── 1. KANBAN DOMAIN TESTS ──────────────────────────────────────────────────

tests['kanban_1_project_creation'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-1] Project Creation${C.reset}`);
    await cleanup(client);

    const project = await client.api.kanban_project.create({
        name: 'Test Project',
        description: 'Test Description',
        gitUrl: 'https://github.com/FLYBYME/test.git',
        defaultBranch: 'develop',
        sandboxImage: 'node:20'
    });

    if (project.id && project.gitUrl === 'https://github.com/FLYBYME/test.git' && project.sandboxImage === 'node:20') {
        console.log(`${C.green}PASS: Project created with correct fields.${C.reset}`);
    } else {
        throw new Error(`FAIL: Project creation returned invalid data: ${JSON.stringify(project)}`);
    }
};

tests['kanban_3_feature_linking'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-3] Feature Linking${C.reset}`);
    await cleanup(client);

    try {
        await client.api.kanban_feature.create({
            projectId: 'non-existent-id',
            name: 'Orphan Feature',
            description: 'Should fail',
            status: 'Backlog',
            priority: 'Low'
        });
        throw new Error(`FAIL: Created a feature with a non-existent projectId.`);
    } catch (e) {
        if (e instanceof Error && e.message.includes('FAIL')) throw e;
        console.log(`${C.green}PASS: Correctly rejected orphaned feature.${C.reset}`);
    }
};

tests['kanban_5_work_item_linking'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-5] WorkItem Linking${C.reset}`);
    await cleanup(client);

    try {
        await client.api.kanban_work_item.create({
            featureId: 'non-existent-id',
            title: 'Orphan WorkItem',
            description: 'Should fail',
            status: 'Backlog',
            priority: 'Low',
            branchName: 'orphan-branch',
            acceptanceCriteria: [],
            dependencies: []
        });
        throw new Error(`FAIL: Created a WorkItem with a non-existent featureId.`);
    } catch (e) {
        if (e instanceof Error && e.message.includes('FAIL')) throw e;
        console.log(`${C.green}PASS: Correctly rejected orphaned WorkItem.${C.reset}`);
    }
};

tests['kanban_6_work_item_validation'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-6] WorkItem Validation${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    try {
        // @ts-ignore - intentional missing field
        await client.api.kanban_work_item.create({
            featureId: feature.id,
            title: 'Missing Branch',
            description: 'This call is missing branchName',
            status: 'Backlog',
            priority: 'Medium'
        });
        console.log(`${C.red}FAIL: Created a WorkItem without mandatory branchName.${C.reset}`);
    } catch (e) {
        console.log(`${C.green}PASS: Correctly rejected invalid WorkItem schema.${C.reset}`);
    }
};

tests['kanban_8_stage_transitions'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-8] Stage Transitions${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Transition Test',
        description: 'Test',
        status: 'Backlog',
        priority: 'Low',
        branchName: 'test-transition',
        acceptanceCriteria: [],
        dependencies: []
    });

    const moved = await client.api.kanban.move({
        id: item.id,
        type: 'work_item',
        stage: 'Ready'
    });

    if (moved.status === 'Ready') {
        console.log(`${C.green}PASS: Successfully moved item from Backlog to Ready.${C.reset}`);
    } else {
        throw new Error(`FAIL: Unexpected status after move: ${moved.status}`);
    }
};

tests['kanban_9_invalid_transitions'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-9] Invalid Transitions${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Jump Test',
        description: 'Testing illegal move',
        status: 'Backlog',
        priority: 'Low',
        branchName: 'test-jump',
        acceptanceCriteria: [],
        dependencies: []
    });

    try {
        await client.api.kanban.move({
            id: item.id,
            type: 'work_item',
            stage: 'Done'
        });
        throw new Error(`FAIL: Item jumped from Backlog to Done directly.`);
    } catch (e) {
        if (e instanceof Error && e.message.includes('FAIL')) throw e;
        console.log(`${C.green}PASS: Successfully blocked illegal jump to Done.${C.reset}`);
    }
};

tests['kanban_10_feature_rollup'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-10] Feature Status Rollup${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Only Task',
        description: 'Single task for feature',
        status: 'Testing',
        priority: 'Low',
        branchName: 'test-rollup',
        acceptanceCriteria: [],
        dependencies: []
    });

    console.log('Moving work item to Done...');
    await client.api.kanban.move({
        id: item.id,
        type: 'work_item',
        stage: 'Done'
    });

    const updatedFeature = await client.api.kanban_feature.get({ id: feature.id });
    if (updatedFeature.status === 'Done') {
        console.log(`${C.green}PASS: Feature status automatically rolled up to Done.${C.reset}`);
    } else {
        throw new Error(`FAIL: Feature status is still ${updatedFeature.status}`);
    }
};

tests['kanban_13_dependency_blocking'] = async ({ client }) => {
    console.log(`${C.blue}[KANBAN-13] Dependency Blocking${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const dep = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Prerequisite',
        description: 'Must finish first',
        status: 'Ready',
        priority: 'High',
        branchName: 'dep-pre',
        acceptanceCriteria: [],
        dependencies: []
    });

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Dependent Task',
        description: 'Blocked task',
        status: 'Ready',
        priority: 'Medium',
        branchName: 'dep-blocked',
        acceptanceCriteria: [],
        dependencies: [dep.id]
    });

    try {
        await client.api.kanban.move({
            id: item.id,
            type: 'work_item',
            stage: 'In Progress'
        });
        throw new Error(`FAIL: Item moved to In Progress while dependency is not Done.`);
    } catch (e) {
        if (e instanceof Error && e.message.includes('FAIL')) throw e;
        console.log(`${C.green}PASS: Blocked move to In Progress due to pending dependency.${C.reset}`);
    }

    console.log('Completing dependency...');
    await client.api.kanban.move({ id: dep.id, type: 'work_item', stage: 'In Progress' });
    await client.api.kanban.move({ id: dep.id, type: 'work_item', stage: 'Testing' });
    await client.api.kanban.move({ id: dep.id, type: 'work_item', stage: 'Done' });

    console.log('Retrying move for dependent task...');
    const moved = await client.api.kanban.move({ id: item.id, type: 'work_item', stage: 'In Progress' });
    if (moved.status === 'In Progress') {
        console.log(`${C.green}PASS: Successfully moved to In Progress after dependency completed.${C.reset}`);
    } else {
        throw new Error(`FAIL: Status is ${moved.status}`);
    }
};

// ─── 2. AUTOMATED PROVISIONING TESTS ────────────────────────────────────────

tests['prov_16_auto_sandbox'] = async ({ client }) => {
    console.log(`${C.blue}[PROV-16] Auto-Sandbox Creation${C.reset}`);
    await cleanup(client);
    const { project, feature } = await setupGitFlow(client);

    console.log('Creating WorkItem with branch feature/auto-prov...');
    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Auto Prov Test',
        description: 'Test',
        status: 'Ready',
        priority: 'Low',
        branchName: 'feature/auto-prov',
        acceptanceCriteria: [],
        dependencies: []
    });

    // Wait a bit for the hook to finish (hooks are async after response)
    // Actually, in our current executeCrud, we await afterCrud. 
    // So it should be linked by now.
    
    const updated = await client.api.kanban_work_item.get({ id: item.id });
    if (updated.sandboxId) {
        console.log(`${C.green}PASS: Sandbox ${updated.sandboxId} was automatically created and linked.${C.reset}`);
    } else {
        throw new Error(`FAIL: sandboxId is still missing on WorkItem.`);
    }
};

tests['prov_17_sandbox_reuse'] = async ({ client }) => {
    console.log(`${C.blue}[PROV-17] Sandbox Reuse${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    console.log('Creating first WorkItem...');
    const item1 = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Task 1',
        description: 'First',
        status: 'Ready',
        priority: 'Low',
        branchName: 'feature/task-1',
        acceptanceCriteria: [],
        dependencies: []
    });

    console.log('Creating second WorkItem for same project...');
    const item2 = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Task 2',
        description: 'Second',
        status: 'Ready',
        priority: 'Low',
        branchName: 'feature/task-2',
        acceptanceCriteria: [],
        dependencies: []
    });

    const refreshed1 = await client.api.kanban_work_item.get({ id: item1.id });
    const refreshed2 = await client.api.kanban_work_item.get({ id: item2.id });

    if (refreshed1.sandboxId && refreshed1.sandboxId === refreshed2.sandboxId) {
        console.log(`${C.green}PASS: Both WorkItems share the same sandbox: ${refreshed1.sandboxId}.${C.reset}`);
    } else {
        throw new Error(`FAIL: Sandboxes differ or are missing: ${refreshed1.sandboxId} vs ${refreshed2.sandboxId}`);
    }
};

tests['prov_18_branch_checkout'] = async ({ client }) => {
    console.log(`${C.blue}[PROV-18] Branch Checkout${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const branchName = 'test/checkout-verify';
    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Checkout Test',
        description: 'Verify branch existence',
        status: 'Ready',
        priority: 'Low',
        branchName: branchName,
        acceptanceCriteria: [],
        dependencies: []
    });

    const refreshed = await client.api.kanban_work_item.get({ id: item.id });
    
    // Set active sandbox and check branch
    await client.api.sandbox.set_active({ id: refreshed.sandboxId! });

    // Fix dubious ownership
    await client.api.sandbox.terminal_execute({
        command: ['git', 'config', '--global', '--add', 'safe.directory', '/workspace'],
        cwd: '.'
    });

    const result = await client.api.sandbox.terminal_execute({
        command: ['git', 'branch', '--show-current'],
        cwd: '.'
    });

    if (result.stdout.trim() === branchName) {
        console.log(`${C.green}PASS: Sandbox correctly switched to branch ${branchName}.${C.reset}`);
    } else {
        throw new Error(`FAIL: Unexpected branch: ${result.stdout}`);
    }
};

tests['prov_21_atomic_teardown'] = async ({ client }) => {
    console.log(`${C.blue}[PROV-21] Atomic Teardown${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Teardown Test',
        description: 'Testing cleanup',
        status: 'Ready',
        priority: 'Low',
        branchName: 'test-teardown',
        acceptanceCriteria: [],
        dependencies: []
    });

    const refreshed = await client.api.kanban_work_item.get({ id: item.id });
    const sandboxId = refreshed.sandboxId!;

    console.log(`Deleting WorkItem ${item.id}...`);
    await client.api.kanban_work_item.delete({ id: item.id });

    // Check if sandbox record is gone (or archived/deleted)
    // In our system, the hook calls sandbox.delete which removes the container and DB record.
    const sandboxes = await client.api.sandbox.find({ query: { id: sandboxId } });
    if (sandboxes.length === 0) {
        console.log(`${C.green}PASS: Sandbox ${sandboxId} was automatically deleted.${C.reset}`);
    } else {
        throw new Error(`FAIL: Sandbox ${sandboxId} still exists in database.`);
    }
};

tests['mgr_26_auto_context_switch'] = async ({ client }) => {
    console.log(`${C.blue}[MGR-26] Automated Context Switching${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Switch Test',
        description: 'Testing auto-activation',
        status: 'Ready',
        priority: 'Low',
        branchName: 'test-switch',
        acceptanceCriteria: [],
        dependencies: []
    });

    const refreshed = await client.api.kanban_work_item.get({ id: item.id });
    
    console.log('Dispatching manager_execute...');
    // This should trigger the auto-switch in the backend
    await client.api.manager.execute({
        workItemId: refreshed.id,
        instruction: 'ls -R'
    });

    // Verify global setting was updated
    const setting = await client.api.settings.get({ key: 'active_sandbox' });
    if (setting.value === refreshed.sandboxId) {
        console.log(`${C.green}PASS: active_sandbox setting was automatically updated to ${refreshed.sandboxId}.${C.reset}`);
    } else {
        throw new Error(`FAIL: active_sandbox is ${setting.value}, expected ${refreshed.sandboxId}`);
    }
};

tests['mgr_28_tool_list_injection'] = async ({ client }) => {
    console.log(`${C.blue}[MGR-28] Tool List Injection${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Tool List Test',
        description: 'Verify sub-agent prompt',
        status: 'Ready',
        priority: 'Low',
        branchName: 'test-tools',
        acceptanceCriteria: [],
        dependencies: []
    });

    console.log('Dispatching manager_inquire...');
    const result = await client.api.manager.inquire({
        workItemId: item.id,
        question: 'What tools do you see?'
    });

    // Retrieve the actual prompt sent to the sub-agent from the messages collection
    // The inquirer's thread is returned in the result.
    const messages = await client.api.messages.find({
        query: { threadId: result.threadId, role: 'user' },
        sort: ['createdAt']
    });

    const prompt = messages[0]?.content || '';
    if (prompt.includes('### Your Authorized Tools') && prompt.includes('sandbox:fs_list')) {
        console.log(`${C.green}PASS: Sub-agent prompt correctly includes the authorized tool list.${C.reset}`);
    } else {
        throw new Error(`FAIL: Injected prompt missing tool list section. Prompt: ${prompt}`);
    }
};

// ─── LEGACY TESTS (REFACTORED) ───────────────────────────────────────────────

tests['sys_strict_execution'] = async ({ client }) => {
    console.log(`${C.blue}\n[SYS] Strict Execution Mandate${C.reset}`);
    await cleanup(client);
    const { feature } = await setupGitFlow(client);

    const item = await client.api.kanban_work_item.create({
        featureId: feature.id,
        title: 'Calculate line count of server.ts',
        description: 'Provide the exact line count of src/server/GatewayServer.ts.',
        status: 'Ready',
        priority: 'High',
        branchName: 'test/line-count',
        acceptanceCriteria: ['A file "line_count.txt" exists with the correct number.'],
        dependencies: [],
        targetFiles: [],
        errorLog: []
    });

    console.log('Asking Orchestrator to execute...');
    const result = await client.api.manager.chat({
        prompt: `Execute work item ${item.id}. I need the exact line count of src/server/GatewayServer.ts saved to line_count.txt.`,
        wait: true
    });

    console.log('Orchestrator Response:', result.response);

    try {
        const file = await client.api.sandbox.fs_read({ path: 'line_count.txt' });
        const count = parseInt(file.content.trim());
        console.log(`Verified line_count.txt content: ${count}`);
        
        if (count > 100 && count < 1000) {
            console.log(`${C.green}PASS: Realistic line count found.${C.reset}`);
        } else {
            console.log(`${C.red}FAIL: Suspected fake line count: ${count}${C.reset}`);
        }
    } catch (e) {
        console.log(`${C.red}FAIL: line_count.txt not found in sandbox.${C.reset}`);
    }
};

/**
 * Main Runner
 */
async function main() {
    const client = new CastellanClient(CLIENT_URL);
    const args = process.argv.slice(2);
    const filter = args[0]?.toLowerCase();

    const selectedTests = Object.keys(tests).filter(name => !filter || filter === 'all' || name.includes(filter));

    console.log(`${C.bold}Running ${selectedTests.length} tests...${C.reset}`);

    let passed = 0;
    let failed = 0;

    for (const name of selectedTests) {
        try {
            await tests[name]({ client });
            passed++;
        } catch (err) {
            console.error(`${C.red}Test Failed: ${name}${C.reset}`);
            console.error(err);
            failed++;
        }
    }

    console.log(`\n${C.bold}Test Results:${C.reset}`);
    console.log(`${C.green}Passed: ${passed}${C.reset}`);
    console.log(`${C.red}Failed: ${failed}${C.reset}`);

    client.close();
    process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
