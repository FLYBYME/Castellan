import { Command } from 'commander';
import { BaseCommand } from '../core/BaseCommand.js';
import { C } from '../core/Utils.js';
import inquirer from 'inquirer';
import readline from 'readline';
import { CastellanClient } from '../../generated/client/CastellanClient.js';


export class ThreadViewCommand extends BaseCommand {
    public readonly name = 'thread';
    public readonly description = 'View a thread.';
    public readonly category = 'Management';

    public register(program: Command): void {
        program
            .command(this.name)
            .description(this.description)
            .option('-t, --thread <id>', 'Thread ID')
            .action(async (options: { thread?: string }) => {
                await this.execute(options, program);
            });
    }

    protected async execute(options: { thread?: string }, program: Command): Promise<void> {
        if (!options.thread) {
            throw new Error('Thread ID is required');
        }

        const client = new CastellanClient(program.opts().apiUrl || 'http://localhost:3000/api/v2');

        const outputLog = [];

        const thread = await client.api.threads.get({
            id: options.thread
        });
        outputLog.push(`Thread Model: ${thread.model}`);
        outputLog.push(`Thread ID: ${thread.id}`);
        outputLog.push(`Thread Status: ${thread.status}`);
        outputLog.push(`Thread Created At: ${thread.createdAt}`);
        outputLog.push(`Thread Updated At: ${thread.updatedAt}`);


        // console.log(thread);

        const messages = await client.api.messages.find({
            query: {
                threadId: options.thread
            },
            sort: ['createdAt']
        });

        outputLog.push(`Message Count: ${messages.length}`);

        for (const message of messages) {
            if (message.role === 'assistant' && message.toolCallCount === 0) {
                outputLog.push('');
                outputLog.push(`Assistant:`)
                outputLog.push("```markdown");
                outputLog.push(message.content);
                outputLog.push("```");
            } else if (message.role === 'user') {
                outputLog.push('');
                outputLog.push(`User:`)
                outputLog.push("```markdown");
                outputLog.push(message.content);
                outputLog.push("```");
            }
        }


        console.log(outputLog.join('\n'));


        const analysisThread = await this.analyzeMessages(client, outputLog);


        client.close();
    }

    private async analyzeMessages(client: CastellanClient, messages: string[]) {
        const systemPrompt = `You are the ultimate Castellan Agent Performance Analyzer.
Your task is to analyze the provided conversation history between a User and an AI Agent, and write a structured, objective, and highly professional critique of the agent's performance.

Evaluate the agent across the following criteria:
1. GOAL ALIGNMENT & TASK SUCCESS: Did the agent understand the user's requests accurately? Did it successfully accomplish what the user asked, or did it fail/leave tasks incomplete?
2. TOOL USAGE & FALLBACKS: Did the agent choose and execute the correct tools? If a tool failed (e.g., sandbox execution/compilation errors), did the agent handle the error gracefully, explain the failure clearly, and provide correct manual/local alternatives?
3. PLANNING & STRATEGY: Did the agent formulate logical plans? Did it adapt the plan when constraints changed?
4. COMMUNICATION & TONE: Was the agent polite, professional, precise, and humble? Did it avoid overconfident language or unwarranted claims of success?

Your response MUST be formatted in clean Markdown with the following sections:
### 📊 Executive Summary
[A 2-3 sentence overview of the conversation, key outcomes, and whether the agent met the user's goals.]

### 🎯 Key Performance Pillars
- **Goal Alignment & Success Rate**: [Detailed score/critique]
- **Tool Execution & Error Handling**: [Critique of tool usage and fallback paths, e.g. handling broken sandbox commands]
- **Strategy & Plan Adherence**: [Assessment of plan generation and execution tracking]
- **Clarity, Tone & Professionalism**: [Evaluation of communication style, formatting, and humility]

### 🔍 Issues & Gaps Identified
- [Bullet points describing specific failures, loops, incorrect tool calls, or lack of progress.]

### 💡 Actionable Recommendations
- [Concrete, high-value suggestions to help the agent perform better next time.]`;

        const agent = await client.api.agent.create({
            model: 'gpt-oss:20b',
            name: "Thread Analyzer " + Math.floor(Math.random() * 10000),
            systemPrompt,
            tools: []
        });

        const thread = await client.api.threads.create({
            title: "Analysis of " + new Date().toISOString(),
            model: 'gpt-oss:20b',
            status: 'active'
        });

        console.log(`\n${C.yellow}⌛ Running agent performance analysis on thread messages...${C.reset}`);

        await client.api.agent.run({
            agentId: agent.id,
            threadId: thread.id,
            autoApprove: false,
            prompt: `Here is the conversation log between the User and the Agent:\n\n${messages.join('\n')}\n\nPlease analyze this conversation thoroughly according to your system prompt instructions.`,
            wait: true
        });

        // Fetch the generated assistant analysis message
        const lastMessage = await client.api.messages.find_one({
            query: {
                threadId: thread.id,
                role: 'assistant'
            },
            sort: ['-createdAt']
        });

        // Delete temporary agent and thread resources to prevent database bloat
        await client.api.agent.delete({ id: agent.id });
        await client.api.threads.delete({ id: thread.id });

        if (lastMessage && lastMessage.content) {
            console.log(`\n${C.cyan}${C.bold}================================================================================${C.reset}`);
            console.log(`${C.cyan}${C.bold}🔍 CASTELLAN AGENT PERFORMANCE ANALYSIS REPORT${C.reset}`);
            console.log(`${C.cyan}${C.bold}================================================================================${C.reset}\n`);
            console.log(lastMessage.content);
            console.log(`\n${C.cyan}${C.bold}================================================================================${C.reset}\n`);
        } else {
            console.log(`\n${C.red}${C.bold}✖ Error:${C.reset} Could not retrieve analysis report from the Thread Analyzer agent.`);
        }
    }
}
