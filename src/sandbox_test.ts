import { CastellanClient } from './generated/client/CastellanClient.js';
import { C } from './cli/core/Utils.js';

async function main() {
    const client = new CastellanClient('http://localhost:3000');

    const state = {
        thinking: false,
        content: false,
        threadId: null
    }
    // Attach event listeners to the WebSocket manager
    client.onEvent(async (name, payload: any, correlationId) => {
        try {
            switch (name) {
                case 'infer:thinking_chunk':
                    if (!state.thinking) {
                        state.thinking = true;
                        state.content = false;
                        process.stdout.write(`\n${C.cyan}[thinking]:${C.reset} ${payload.threadId}\n`);
                    }
                    if (state.threadId != payload.threadId) {
                        state.threadId = payload.threadId;
                        console.log(`${C.cyan}${C.bold}[Thread]:${C.reset} ${payload.threadId}`);
                    }
                    process.stdout.write(payload.delta);
                    break;
                case 'infer:content_chunk':
                    if (!state.content) {
                        state.thinking = false;
                        state.content = true;
                        process.stdout.write(`\n${C.cyan}[response]:${C.reset} ${payload.threadId}\n`);
                    }
                    if (state.threadId != payload.threadId) {
                        state.threadId = payload.threadId;
                        console.log(`${C.cyan}${C.bold}[Thread]:${C.reset} ${payload.threadId}`);
                    }
                    process.stdout.write(payload.delta);
                    break;
                case 'infer:completed':
                    state.thinking = false;
                    state.content = false;
                    state.threadId = null;
                    process.stdout.write(`\n`);
                    break;
                case 'infer:tool_call_requested':
                    console.log(name, payload);
                    const toolCall = await client.api.tool_calls.get({ id: payload.toolCallId });
                    if (!toolCall) {
                        console.log(`Tool call ${payload.toolCallId} not found.`);
                        return;
                    }
                    console.log(`[Manager] Approving tool call ${payload.toolCallId}`, toolCall);
                    await client.api.infer.approve_tool({ toolCallId: payload.toolCallId });
                    break;
                case 'infer:tool_call_completed':
                    console.log(name, payload);
                    const tc_compl = await client.api.tool_calls.get({ id: payload.id });
                    if (!tc_compl) {
                        console.log(`Tool call ${payload.id} not found.`);
                        return;
                    }
                    console.log(`[Manager] Tool call completed ${payload.id}`, tc_compl);
                    break;
                case 'infer:tool_call_failed':
                    console.log(`[Manager] Tool call failed ${payload.toolCallId}`, payload);
                    const tc_fail = await client.api.tool_calls.get({ id: payload.toolCallId });
                    if (!tc_fail) {
                        console.log(`Tool call ${payload.toolCallId} not found.`);
                        return;
                    }
                    console.log(`[Manager] Tool call failed ${payload.toolCallId}`, tc_fail);
                    break;
                default:
                    if (state.thinking || state.content) {
                        state.thinking = false;
                        state.content = false;
                        process.stdout.write(`\n`);
                    }
                    if (name.startsWith('data:')) {
                        console.log(`${C.magenta} ${name} ${payload.domain} ${payload.id} ${C.reset}`);
                        return;
                    }
                    console.log(name, payload);
                    break;
            }
        } catch (err) {
            console.log(err);
        }
    });

    const sandboxes = await client.api.sandbox.find({});
    console.log(sandboxes);

    for (const sandbox of sandboxes) {
        console.log(`Deleting sandbox ${sandbox.id}`);
        await client.api.sandbox.delete({ id: sandbox.id });
    }

    //https://github.com/FLYBYME/Castellan.git
    const sandbox = await client.api.sandbox.create({
        status: 'active',
        name: "Castellan",
        gitUrl: "https://github.com/FLYBYME/apt_cache.git",
        image: "node:18",
    });
    console.log(sandbox);

    // Set active
    await client.api.sandbox.set_active({ id: sandbox.id });

    // list directories
    const dir = await client.api.sandbox.fs_list({ path: '.' });
    console.log(dir);

    // execute ls -la
    const ls_la = await client.api.sandbox.terminal_execute({ command: ['ls', '-la'] });
    console.log(ls_la);

    // execute install command
    const command = await client.api.sandbox.terminal_execute({
        timeoutMs: 120000,
        command: ['npm', 'install']
    });
    console.log(command);

    // Delete sandbox
    await client.api.sandbox.delete({ id: sandbox.id });


    client.close();
}

main().catch(console.error);
