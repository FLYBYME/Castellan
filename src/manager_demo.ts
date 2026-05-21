import 'dotenv/config';
import path from 'path';
import { CastellanEngine } from './engine/CastellanEngine.js';
import { ContextApi } from './generated/server/ContextApi.js';
import { C } from './cli/core/Utils.js';

async function setup() {
    console.log(`\n${C.blue}${C.bold}=== Booting Castellan Central Directorate ===${C.reset}`);

    // 1. Instantiate the Headless Engine
    const engine = new CastellanEngine<ContextApi>();

    // 2. Boot the Engine and load all addons
    const builtInDir = path.resolve('./src/addons');
    const contextApi = new ContextApi(engine.executor, engine.createContext(undefined, 'boot'));

    await engine.boot(contextApi, builtInDir);

    console.log(`${C.green}✔ Directorate Engine active.${C.reset}`);
    return { engine, contextApi };
}

async function main() {
    const { engine, contextApi } = await setup();

    // 3. Subscription for progress monitoring
    console.log(`\n${C.yellow}${C.bold}=== Monitoring Mission Progress ===${C.reset}`);

    let isThinking = false;
    let isGenerating = false;

    engine.events.subscribeAll((name, payload) => {
        console.log(name, payload);
        if (name === 'infer:thinking_chunk') {
            const p = payload as { delta: string };
            if (!isThinking) {
                process.stdout.write(`\n${C.magenta}${C.bold}[Directorate Planning]${C.reset} `);
                isThinking = true;
            }
            process.stdout.write(p.delta);
        } else if (name === 'infer:content_chunk') {
            const p = payload as { delta: string };
            if (!isGenerating) {
                process.stdout.write(`\n\n${C.cyan}${C.bold}[Directorate Response]${C.reset} `);
                isGenerating = true;
            }
            process.stdout.write(p.delta);
        } else if (name === 'infer:tool_call_requested') {
            const p = payload as { toolCallId: string };
            console.log(`\n\n${C.yellow}🔔 Delegation Request: ${p.toolCallId}${C.reset}`);
        } else if (name === 'infer:completed') {
            console.log(`\n\n${C.green}✔ Turn Complete.${C.reset}`);
            isThinking = false;
            isGenerating = false;
        }
    });

    try {
        // 4. Ensure Ollama is ready
        console.log(`\n${C.blue}${C.bold}=== Resolving Infrastructure ===${C.reset}`);
        let instance = await contextApi.ollama.find_one({ query: { url: 'http://localhost:11434' } });
        if (!instance) {
            instance = await contextApi.ollama.create({
                url: 'http://localhost:11434',
                name: 'Local Mesh',
                status: 'online'
            });
        }
        await contextApi.infer.refresh_inventory({ instanceId: instance.id });

        // 5. Setup Orchestrator Agent
        console.log(`\n${C.blue}${C.bold}=== Provisioning Central Orchestrator ===${C.reset}`);

        // We need to ensure the agent exists with the ID the manager expects.
        // If the DB doesn't support manual IDs, we find by name.
        let orchestrator = await contextApi.agent.find_one({ query: { name: 'Castellan Orchestrator' } });
        if (!orchestrator) {
            orchestrator = await contextApi.agent.create({
                name: 'Castellan Orchestrator',
                systemPrompt: 'You are the Central Directorate. You translate user intent into specialized agent missions. Use the available tools to delegate tasks.',
                model: 'gpt-oss:20b',
                tools: ['manager_inquire', 'manager_execute', 'manager_research', 'kanban_move'],
                config: { temperature: 0.1 }
            });
        }

        // 6. Initiate Mission
        const missionPrompt = 'Perform a system pulse and then create a task in the Backlog to optimize the inference queue scheduler.';
        console.log(`\n${C.white}${C.bold}[User Intent]${C.reset} ${missionPrompt}`);

        const result = await contextApi.manager.chat({
            prompt: missionPrompt
        });

        console.log(`\n${C.blue}${C.bold}=== Directorate SITREP ===${C.reset}`);
        console.log(result.response);
        console.log(`${C.dim}Mission Thread: ${result.threadId}${C.reset}`);

        // 7. Monitor for completion
        console.log(`\n${C.yellow}Waiting for autonomous reconciliation...${C.reset}`);

        // Keep process alive to see the event-driven loop finish
        await new Promise<void>((resolve) => {
            let lastStatus = '';
            const checker = setInterval(async () => {
                const runs = await contextApi.agent_run.find({ query: { threadId: result.threadId } });
                const run = runs[0];
                if (run && run.status !== lastStatus) {
                    lastStatus = run.status;
                    console.log(`\n${C.cyan}[Run Status]${C.reset} ${run.status}`);
                    if (run.status === 'finished' || run.status === 'failed') {
                        clearInterval(checker);
                        resolve();
                    }
                }
            }, 2000);
        });

        // 8. Final Results
        console.log(`\n${C.blue}${C.bold}=== Final System State ===${C.reset}`);
        const tasks = await contextApi.kanban.find({});
        console.log(`${C.bold}Kanban Board:${C.reset}`);
        tasks.forEach(t => console.log(`  [${t.status}] ${t.title}`));

        const reports = await contextApi.pulse_report.find({ limit: 1, sort: ['-timestamp'] });
        if (reports[0]) {
            console.log(`\n${C.bold}Latest Pulse Report:${C.reset}`);
            console.log(reports[0].summary);
        }

    } catch (err) {
        console.error(`\n${C.red}✖ Manager Error:${C.reset}`, err);
    } finally {
        console.log(`\n${C.yellow}Shutting down Directorate...${C.reset}`);
        await engine.shutdown();
    }
}

main().catch(console.error);
