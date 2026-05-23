import 'dotenv/config';
import path from 'path';
import { CastellanEngine } from './engine/CastellanEngine.js';
import { ContextApi } from './generated/server/ContextApi.js';
import { C } from './cli/core/Utils.js';

async function setup() {
    console.log(`\n${C.blue}${C.bold}=== Booting Castellan Headless Engine ===${C.reset}`);

    // 1. Instantiate the Headless Engine
    const engine = new CastellanEngine<ContextApi>();

    // 2. Boot the Engine and load all addons
    const builtInDir = path.resolve('./src/addons');
    const contextApi = new ContextApi(engine.executor, engine.createContext(undefined, 'boot'));

    await engine.boot(contextApi, builtInDir);

    console.log(`${C.green}✔ Engine booted successfully.${C.reset}`);
    return { engine, contextApi };
}

async function main() {
    const { engine, contextApi } = await setup();

    // 3. Register Event Listeners to display real-time progress
    console.log(`\n${C.yellow}${C.bold}=== Subscribing to Inference Streams ===${C.reset}`);

    let isThinking = false;
    let isGenerating = false;

    engine.events.subscribeAll((name, payload, correlationId) => {
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

    try {
        // 4. Ensure an Ollama Instance is registered
        console.log(`\n${C.blue}${C.bold}=== Resolving Ollama Node ===${C.reset}`);

        let instance = await contextApi.ollama.find_one({ query: { url: 'http://192.168.1.10:11434' } });

        if (!instance) {
            console.log(`${C.dim}Registering default local Ollama node...${C.reset}`);
            instance = await contextApi.ollama.create({
                url: 'http://192.168.1.10:11434',
                name: 'Local Ollama Mesh',
                status: 'online'
            });
        }
        console.log(`${C.green}✔ Ollama instance resolved: ${instance.name} (${instance.url})${C.reset}`);

        // 5. Refresh models
        console.log(`\n${C.dim}Refreshing model inventory from Ollama...${C.reset}`);
        await contextApi.infer.refresh_inventory({ instanceId: instance.id });

        const models = await contextApi.models.find({ query: {} });
        if (models.length === 0) {
            console.log(`${C.red}✖ No models detected. Make sure Ollama is running and has models pulled (e.g. 'ollama pull llama3')${C.reset}`);
            await engine.shutdown();
            return;
        }

        // Select the first available model
        const selectedModel = models.find((model) => model.name === 'gpt-oss:20b')?.name;
        if (!selectedModel) {
            console.log(`${C.red}✖ No gpt-oss:20b model found. Available models:${C.reset}`);
            models.forEach((model) => console.log(`  • ${model.name}`));
            await engine.shutdown();
            return;
        }
        console.log(`${C.green}✔ Selected Model: ${selectedModel}${C.reset}`);

        // 6. Create Chat Thread
        console.log(`\n${C.blue}${C.bold}=== Initializing Conversation Thread ===${C.reset}`);
        const thread = await contextApi.threads.create({
            title: 'Headless Science Demonstration',
            status: 'active',
            model: selectedModel,
            tools: []
        });
        console.log(`${C.dim}Created Thread ID: ${thread.id}${C.reset}`);

        // 7. Append User Prompt
        const prompt = 'Why is the sky blue? Answer in a single, short sentence.';
        console.log(`\n${C.white}${C.bold}[User]${C.reset} ${prompt}`);

        await contextApi.messages.create({
            threadId: thread.id,
            role: 'user',
            content: prompt
        });

        // 8. Trigger Inference Execution
        console.log(`\n${C.blue}${C.bold}=== Executing Inference chat() ===${C.reset}`);
        const result = await contextApi.infer.chat({
            threadId: thread.id
        });

        const response = await contextApi.messages.get({
            id: result.messageId,
        });

        console.log(response);

        const toolCalls = await contextApi.tool_calls.find({
            query: {
                threadId: thread.id,
                messageId: result.messageId,
            }
        });

        console.log(toolCalls);

        console.log(`\n${C.blue}${C.bold}=== Fetching Final Thread Metrics ===${C.reset}`);
        const updatedThread = await contextApi.threads.get({ id: thread.id });
        if (updatedThread.metrics) {
            console.log(`${C.dim}Metrics:${C.reset}`);
            console.log(`  • Total Duration: ${(updatedThread.metrics.total_duration || 0) / 1e9}s`);
            console.log(`  • Load Duration: ${(updatedThread.metrics.load_duration || 0) / 1e9}s`);
            console.log(`  • Generation Speed: ${updatedThread.metrics.eval_count} tokens / ${(updatedThread.metrics.eval_duration || 0) / 1e9}s`);
        }

    } catch (err: unknown) {
        console.error(`\n${C.red}✖ Demonstration error:${C.reset}`, err);
    } finally {
        console.log(`\n${C.yellow}Shutting down engine...${C.reset}`);
        await engine.shutdown();
        console.log(`${C.green}✔ Shutdown complete.${C.reset}\n`);
    }
}

void main();