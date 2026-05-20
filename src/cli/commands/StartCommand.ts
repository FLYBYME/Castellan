import { Command as CommanderCommand } from 'commander';
import { BaseCommand } from '../core/BaseCommand.js';
import { C } from '../core/Utils.js';
import { spawn } from 'child_process';
import { CastellanEngine } from '../../engine/CastellanEngine.js';
import { GatewayServer } from '../../server/GatewayServer.js';
import path from 'path';
import { ContextApi } from '../../generated/server/ContextApi.js';

interface StartOptions {
    port?: number;
    ollamaHost?: string;
    logLevel: string;
    addons: string;
}

export class StartCommand extends BaseCommand {
    public readonly name = 'start';
    public readonly description = 'Start the Castellan Agent Engine and UI';
    public readonly category = 'System';

    public register(program: CommanderCommand): void {
        program
            .command(this.name)
            .description(this.description)
            .option('-p, --port <number>', 'Port to listen on (Server)', (val) => parseInt(val, 10))
            .option('--ollama-host <host>', 'Host for the Ollama server')
            .option('-l, --log-level <level>', 'Log level (debug, info, warn, error)', 'info')
            .option('--addons <dir>', 'Directory to load addons from', './src/addons')
            .action((options: StartOptions) => {
                void this.execute(options);
            });
    }

    protected async execute(options: StartOptions): Promise<void> {
        await this.startEngine(options.port || 3000, options.addons, options.ollamaHost);
    }

    private async startEngine(port: number, skillsPath: string, ollamaHost?: string): Promise<void> {
        console.log(`${C.blue}${C.bold}Starting Castellan Engine...${C.reset}`);

        try {
            if (ollamaHost) {
                process.env.OLLAMA_HOST = ollamaHost;
            }

            // 1. Instantiate the Headless Engine
            const engine = new CastellanEngine<ContextApi>();

            // 2. Boot the Engine
            // Load built-in addons first
            const builtInDir = path.resolve('./src/addons');
            const userSkillsDir = path.resolve(skillsPath);
            
            const contextApi = new ContextApi(engine.executor, engine.createContext(undefined, 'boot'));
            
            await engine.boot(contextApi, builtInDir);
            
            if (userSkillsDir !== builtInDir) {
                await engine.loader.loadFromDirectory(userSkillsDir);
            }

            // 3. Start Gateway Server
            const server = new GatewayServer(port);
            await server.start(engine);
            
            console.log(`${C.green}${C.bold}✔ Castellan Gateway is up and running on port ${port}${C.reset}`);
            console.log(`${C.dim}Press Ctrl+C to stop both Engine and UI${C.reset}\n`);

            process.on('SIGINT', () => {
                console.log(`\n${C.yellow}Stopping engine...${C.reset}`);
                void server.stop().then(() => engine.shutdown()).then(() => process.exit(0));
            });

        } catch (err: unknown) {
            const error = err as Error;
            console.error(`\n${C.red}${C.bold}✖ Failed to start engine:${C.reset} ${error.message}`);
            process.exit(1);
        }
    }
}
