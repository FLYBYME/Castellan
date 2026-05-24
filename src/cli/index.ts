#!/usr/bin/env -S npx tsx
import 'dotenv/config';
import { Command } from 'commander';
import { CommandRegistry } from './core/CommandRegistry.js';
import { StartCommand } from './commands/StartCommand.js';
import { GenerateCommand } from './commands/GenerateCommand.js';
import { ChatCommand } from './commands/ChatCommand.js';
import { ThreadViewCommand } from './commands/ThreadViewCommand.js';
import { C } from './core/Utils.js';
import fs from 'fs';
import path from 'path';

const program = new Command();
const registry = new CommandRegistry();

// Register Commands
registry.register(new StartCommand());
registry.register(new GenerateCommand());
registry.register(new ChatCommand());
registry.register(new ThreadViewCommand());


program
    .name('castellan')
    .description('Castellan AI Agent Platform CLI')
    .version('1.0.0')
    .option('--api-url <url>', 'Server URL (global)', 'http://localhost:3000/api/v2');

// Attach registry commands to program
registry.attachToProgram(program);

// Load Generated Tool Commands if they exist
async function loadGeneratedCommands() {
    let targetGeneratedPath = path.resolve('./src/generated/cli/ToolCommands.ts');
    let targetClientPath = path.resolve('./src/generated/client/CastellanClient.ts');

    if (!fs.existsSync(targetGeneratedPath)) {
        targetGeneratedPath = path.resolve('./src/generated/cli/ToolCommands.js');
        targetClientPath = path.resolve('./src/generated/client/CastellanClient.js');
    }

    if (fs.existsSync(targetGeneratedPath) && fs.existsSync(targetClientPath)) {
        try {
            // Use file:// URL to force ESM import to resolve relative to current working directory
            const { registerGeneratedCommands } = await import('file://' + targetGeneratedPath);
            const { CastellanClient } = await import('file://' + targetClientPath);
            const options = program.opts();
            const client = new CastellanClient(options.apiUrl || 'http://localhost:3000/api/v2');
            registerGeneratedCommands(program, client);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`\n${C.yellow}${C.bold}⚠ Warning:${C.reset} Failed to load generated tool commands: ${message}`);
        }
    }
}

// Disable default help
program
    .helpCommand(false)
    .addHelpCommand(false);

// Override help to use our stylized output
program.helpInformation = () => {
    registry.printHelp(program);
    return '';
};

// Handle unknown commands
program.on('command:*', () => {
    console.error(`\n${C.red}${C.bold}✖ Error:${C.reset} Invalid command.`);
    registry.printHelp(program);
    process.exit(1);
});

async function main() {
    try {
        await loadGeneratedCommands();

        // If no arguments provided, show help and exit
        if (process.argv.length <= 2) {
            registry.printHelp(program);
            process.exit(0);
        }

        await program.parseAsync(process.argv);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`\n${C.red}${C.bold}✖ Critical Failure:${C.reset} ${error.message}`);
        process.exit(1);
    }
}

void main();
