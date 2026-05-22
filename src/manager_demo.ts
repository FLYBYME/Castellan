import { CastellanClient } from './generated/client/CastellanClient.js';
import { C } from './cli/core/Utils.js';

async function main() {
    const client = new CastellanClient('http://localhost:3000');

    let isThinking = false;
    let isGenerating = false;
    let currentThreadId: string;

    client.onEvent(async (name, payload, correlationId) => {
        if (name === 'infer:thinking_chunk') {
            const p = payload as { delta: string, threadId: string };
            if (!isThinking) {
                process.stdout.write(`\n${C.magenta}${C.bold}[Thinking: ${p.threadId} ${correlationId}]${C.reset}\n\n `);
                isThinking = true;
                if (p.threadId !== currentThreadId) {
                    currentThreadId = p.threadId;
                    isGenerating = false;
                    process.stdout.write(`\n\n${C.cyan}${C.bold}[Assistant: ${p.threadId} ${correlationId}]${C.reset} \n\n `);
                }
            }
            process.stdout.write(p.delta);
        } else if (name === 'infer:content_chunk') {
            const p = payload as { delta: string, threadId: string };
            if (!isGenerating) {
                process.stdout.write(`\n\n${C.cyan}${C.bold}[Assistant: ${p.threadId} ${correlationId}]${C.reset}\n\n `);
                isGenerating = true;
                if (p.threadId !== currentThreadId) {
                    currentThreadId = p.threadId;
                    isGenerating = false;
                    process.stdout.write(`\n\n${C.cyan}${C.bold}[Assistant: ${p.threadId} ${correlationId}]${C.reset}\n\n `);
                }
            }
            process.stdout.write(p.delta);
        } else if (name == 'infer:tool_call_requested') {
            const p = payload as { toolCallId: string };
            const toolCall = await client.api.tool_calls.get({ id: p.toolCallId });
            if (!toolCall) {
                console.log(`Tool call ${p.toolCallId} not found.`);
                return;
            }
            console.log(`[Manager] Approving tool call ${p.toolCallId}`, toolCall);
            await client.api.infer.approve_tool({ toolCallId: p.toolCallId });
        } else if (name == 'infer:tool_call_auto_approved') {
            const p = payload as { toolCallId: string };
            const toolCall = await client.api.tool_calls.get({ id: p.toolCallId });
            console.log(`[Manager] Auto-approved tool call ${p.toolCallId}`, toolCall);
        } else if (name == 'infer:tool_call_completed') {
            const p = payload as { id: string };
            const toolCall = await client.api.tool_calls.get({ id: p.id });
            console.log(`[Manager] Tool call ${p.id} completed`, toolCall);
        } else if (name == 'infer:tool_call_failed') {
            const p = payload as { toolCallId: string, error: string };
            const toolCall = await client.api.tool_calls.get({ id: p.toolCallId });
            if (!toolCall) {
                console.log(`Tool call ${p.toolCallId} not found.`);
            }
            console.log(`Tool call ${p.toolCallId} failed: ${p.error}`);

        }

        else {
            const p = payload as { domain: string, id: string };

            console.log(name, p.domain, p.id);
        }
    });

    const manager = await client.api.manager.chat({
        prompt: 'Create a new thread for a manager test. Create a new task in the Backlog for this test. Create a new kanban task for this test. Say hello to Gemini and check the status. ',
        wait: true
    });

    console.log('Run finished:', manager);


    client.close();
}

main().catch(console.error);
