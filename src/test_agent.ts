import { CastellanClient } from './generated/client/CastellanClient.js';
import { C } from './cli/core/Utils.js';

async function main() {
    const client = new CastellanClient('http://localhost:3000');

    let isThinking = false;
    let isGenerating = false;

    client.onEvent((name, payload, correlationId) => {
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
        } else if (name === 'infer:completed') {
            console.log(`\n\n${C.green}✔ Response complete.${C.reset}`);
        } else if (name === 'infer:aborted') {
            console.log(`\n\n${C.red}✖ Response aborted.${C.reset}`);
        }
    });

    console.log('Registering "Doer" agent...');
    const agent = await client.api.agent.create({
        name: 'Castellan Doer',
        systemPrompt: 'You are a helpful assistant. MANDATORY: You MUST use tools for every action. To greet, use demo_hello. To check status, use demo_status. Do not answer from memory.',
        model: 'gpt-oss:20b',
        tools: ['demo_hello', 'demo_status'],
        config: { temperature: 0.1 }
    });
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
        autoApprove: true,
        prompt: 'Say hello to Gemini and check the status.'
    });
    console.log('Run started:', run.runId);

    // Wait for the run to complete
    await new Promise<void>((resolve) => {
        const handler = (name: string, payload: unknown) => {
            if (name === 'data:updated') {
                const p = payload as any;
                if (p.domain === 'agent_run' && p.id === run.runId) {
                    if (p.patch.status === 'finished' || p.patch.status === 'failed') {
                        console.log(`\n\n${C.green}${C.bold}✔ Run finished with status: ${p.patch.status}${C.reset}`);
                        client.offEvent(handler);
                        resolve();
                    }
                }
            }
        };
        client.onEvent(handler);
    });

    client.close();
}

main().catch(console.error);
