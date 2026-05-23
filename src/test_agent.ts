import { CastellanClient } from './generated/client/CastellanClient.js';
import { C } from './cli/core/Utils.js';

async function main() {
    const client = new CastellanClient('http://localhost:3000');

    let isThinking = false;
    let isGenerating = false;

    client.onEvent(async (name, payload, correlationId) => {
        if (name === 'infer:thinking_chunk') {
            const p = payload as { delta: string };
            if (!isThinking) {
                process.stdout.write(`\n${C.magenta}${C.bold}[Thinking]${C.reset} `);
                isThinking = true;
            }
            process.stdout.write(p.delta);
        } else if (name === 'infer:content_chunk') {
            const p = payload as { delta: string };
            if (!isGenerating) {
                process.stdout.write(`\n\n${C.cyan}${C.bold}[Assistant]${C.reset} `);
                isGenerating = true;
            }
            process.stdout.write(p.delta);
        } else if (name === 'infer:tool_call_requested') {
            const p = payload as { toolCallId: string };
            console.log(`\n\n${C.yellow}🔔 Tool call requested: ${p.toolCallId}${C.reset}`);
            console.log(p)
            const toolCall = await client.api.tool_calls.get({ id: p.toolCallId });
            if (!toolCall) {
                console.log(`Tool call ${p.toolCallId} not found`);
                return;
            }
            console.log(toolCall);

            await client.api.infer.approve_tool({
                toolCallId: p.toolCallId,
            });

        } else if (name === 'infer:completed') {
            console.log(`\n\n${C.green}✔ Response complete.${C.reset}`);
        } else if (name === 'infer:aborted') {
            console.log(`\n\n${C.red}✖ Response aborted.${C.reset}`);
        } else {
            //console.log(name, payload);
        }
    });

    console.log('Getting "Doer" agent...');
    const agent = await client.api.agent.find_one({
        query: {
            name: 'Castellan Orchestrator'
        }
    })
    if (!agent) {
        throw new Error('Agent not found');
    }
    console.log('Agent registered:', agent.id);

    console.log('Creating a new thread...');
    const thread = await client.api.threads.create({
        title: 'Agent Test',
        model: 'gpt-oss:20b',
        status: 'active'
    });
    console.log('Thread created:', thread.id);

    console.log('Starting agent run with auto-approve...');
    const run = await client.api.agent.run({
        agentId: agent.id,
        threadId: thread.id,
        autoApprove: false,
        prompt: 'Say hello to Gemini and check the status.',
        wait: true
    });
    console.log('Run finished:', run);


    client.close();
}

main().catch(console.error);
