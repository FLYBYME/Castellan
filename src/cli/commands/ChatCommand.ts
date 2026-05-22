import { Command } from 'commander';
import { BaseCommand } from '../core/BaseCommand.js';
import { C } from '../core/Utils.js';
import inquirer from 'inquirer';
import { nanoid } from 'nanoid';
import readline from 'readline';
import { CastellanClient } from '../../generated/client/CastellanClient.js';

interface AskUserPayload {
    id: string;
    threadId?: string;
    promptType: 'choice' | 'multiselect' | 'yesno' | 'text';
    question: string;
    options?: string[];
}

interface RequestApprovalPayload {
    id: string;
    toolName: string;
    arguments: Record<string, unknown>;
    reason?: string;
}

class DirectorateStreamManager {
    private isThinking = false;
    private isGenerating = false;

    constructor(
        private readonly client: CastellanClient,
        private readonly judgeApprovals: boolean,
        private readonly rules?: string,
        private readonly onApprovalRequest?: (toolCall: { id: string; toolName: string; arguments: Record<string, unknown> }) => Promise<void>
    ) { }

    public handleEvent = async (name: string, payload: unknown) => {
        try {
            if (name === 'infer:thinking_chunk') {
                const p = payload as { delta: string };
                if (!this.isThinking) {
                    process.stdout.write(`\n${C.magenta}${C.bold}[Directorate Planning]${C.reset} `);
                    this.isThinking = true;
                    this.isGenerating = false;
                }
                process.stdout.write(p.delta);
            } else if (name === 'infer:content_chunk') {
                const p = payload as { delta: string };
                if (!this.isGenerating) {
                    process.stdout.write(`\n\n${C.cyan}${C.bold}[Directorate Response]${C.reset} `);
                    this.isGenerating = true;
                    this.isThinking = false;
                }
                process.stdout.write(p.delta);
            } else if (name === 'infer:tool_call_requested') {
                const p = payload as { toolCallId: string };
                process.stdout.write('\n');
                const toolCall = await this.client.api.tool_calls.get({ id: p.toolCallId });
                if (toolCall && this.onApprovalRequest) {
                    await this.onApprovalRequest({
                        id: toolCall.id,
                        toolName: toolCall.name,
                        arguments: toolCall.arguments as Record<string, unknown>
                    });
                }
            }
        } catch (err) {
            console.error("Error inside stream manager event handler:", err);
        }
    };
}

function toObjectId(val: string): string {
    if (/^[0-9a-fA-F]{24}$/.test(val)) return val.toLowerCase();
    let hash = 0;
    for (let i = 0; i < val.length; i++) {
        hash = val.charCodeAt(i) + ((hash << 5) - hash);
    }
    let hex = '';
    for (let i = 0; i < 12; i++) {
        const byte = (hash >> (i % 4 * 8)) & 0xff;
        hex += ('00' + byte.toString(16)).slice(-2);
    }
    while (hex.length < 24) {
        hex += '0';
    }
    return hex.toLowerCase();
}

export class ChatCommand extends BaseCommand {
    public readonly name = 'chat';
    public readonly description = 'Connect to the Central Directorate to manage the estate.';
    public readonly category = 'Agent Tools (V2)';

    public register(program: Command): void {
        program
            .command(this.name)
            .description(this.description)
            .option('-t, --thread <id>', 'Directorate Thread ID')
            .option('-p, --prompt <text>', 'Single directive to the Directorate')
            .option('--judge-approvals', 'Enable LLM judge panel validation for approvals before manual prompt', false)
            .option('--rules <text>', 'Dynamic rules or constraints to evaluate approval requests against')
            .option('-l, --loop <goal>', 'Specify a high-level goal to execute in an autonomous auto-operator loop.')
            .option('-r, --rounds <number>', 'The maximum number of autonomous operator rounds to execute (default: 5).', '5')
            .action(async (options: { thread?: string; prompt?: string; judgeApprovals?: boolean; rules?: string; loop?: string; rounds?: string }) => {
                await this.execute(options, program);
            });
    }

    protected async execute(options: { thread?: string; prompt?: string; judgeApprovals?: boolean; rules?: string; loop?: string; rounds?: string }, program: Command): Promise<void> {
        const client = new CastellanClient(program.opts().apiUrl || 'http://localhost:3000/api/v2');
        const rawThreadId = options.thread || `directorate_${nanoid(8)}`;
        const threadId = toObjectId(rawThreadId);
        const judgeApprovals = !!options.judgeApprovals;
        const rules = options.rules || undefined;
        const loopGoal = options.loop || undefined;
        const maxRounds = parseInt(options.rounds || '5', 10);

        try {
            console.log(`${C.cyan}${C.bold}Establishing connection to Central Directorate...${C.reset}`);
            console.log(`\n${C.bold}--- CASTELLAN DIRECTORATE INTERACTIVE ---${C.reset}`);

            if (loopGoal) {
                await this.startAutonomousLoop(client, threadId, loopGoal, maxRounds, judgeApprovals, rules);
                process.exit(0);
            } else if (options.prompt) {
                await this.sendMessage(client, threadId, options.prompt, judgeApprovals, rules);
                process.exit(0);
            } else {
                await this.startInteractiveLoop(client, threadId, judgeApprovals, rules);
            }
        } catch (err: unknown) {
            const error = err as Error;
            console.error(`\n${C.red}${C.bold}✖ Error:${C.reset} ${error.message}`);
        }
    }

    private async startAutonomousLoop(
        client: CastellanClient,
        threadId: string,
        goal: string,
        maxRounds: number,
        judgeApprovals: boolean,
        rules?: string
    ) {
        console.log(`\n${C.cyan}${C.bold}🤖 Starting Autonomous Auto-Operator Closed-Loop...${C.reset}`);
        console.log(`${C.bold}Overall Goal:${C.reset} ${goal}`);
        console.log(`${C.bold}Max Rounds:${C.reset} ${maxRounds}\n`);

        let nudgerAgentId = `nudger_${nanoid(8)}`;
        const nudgerThreadId = toObjectId(`${threadId}_nudger`);

        const nudgerSystemPrompt = `You are working with the manager to achieve the following goal: ${goal}
`;

        console.log(`${C.cyan}Registering stateful Nudger agent in the database...${C.reset}`);
        try {
            const res = await client.api.agent.create({
                name: 'Nudger',
                systemPrompt: nudgerSystemPrompt,
                model: process.env.OLLAMA_MODEL_MEDIUM || 'gemma4:e4b',
                tools: []
            });
            nudgerAgentId = res.id || nudgerAgentId;
            console.log(`${C.green}✅ Nudger agent registered:${C.reset} ${nudgerAgentId}`);
        } catch (err: unknown) {
            const error = err as Error;
            console.error(`${C.red}✖ Failed to register Nudger agent:${C.reset} ${error.message}`);
            throw err;
        }

        let currentRound = 1;
        const isDone = false;

        while (currentRound <= maxRounds && !isDone) {
            console.log(`\n${C.magenta}${C.bold}=== ROUND ${currentRound} of ${maxRounds} ===${C.reset}`);

            // 1. Gather Context (Manager's latest message)
            const messages = await client.api.messages.find({
                query: { threadId },
                limit: 1,
                sort: ['-createdAt']
            }) || [];
            const lastMessage = messages[0];
            const content = lastMessage?.content;

            let decision: string;
            try {
                const runResponse = await client.api.agent.run({
                    threadId: nudgerThreadId,
                    agentId: nudgerAgentId,
                    prompt: content || 'Continue the operation.',
                    autoApprove: true
                });

                // Wait for the run to complete
                await new Promise<void>((resolveRun, rejectRun) => {
                    const runHandler = (name: string, payload: unknown) => {
                        if (name === 'data:updated') {
                            const p = payload as { domain?: string; id?: string; patch?: Record<string, unknown> };
                            if (p.domain === 'agent_run' && p.id === runResponse.runId) {
                                const status = p.patch?.status;
                                if (status === 'finished') {
                                    client.offEvent(runHandler);
                                    resolveRun();
                                } else if (status === 'failed') {
                                    client.offEvent(runHandler);
                                    rejectRun(new Error(`Agent run failed: ${String(p.patch?.error || 'Unknown error')}`));
                                }
                            }
                        }
                    };
                    client.onEvent(runHandler);
                });

                // Get run response message from nudger thread
                const nudgerMessages = await client.api.messages.find({
                    query: { threadId: nudgerThreadId },
                    limit: 1,
                    sort: ['-createdAt']
                }) || [];
                const nudgerMessage = nudgerMessages[0];

                if (!nudgerMessage || !nudgerMessage.content) {
                    throw new Error("No response message returned from the Nudger agent run.");
                }
                decision = nudgerMessage.content;
                if (decision.trim() === '') {
                    console.log(`${C.yellow}Nudger returned empty response. Exiting.${C.reset}`);
                    break;
                }
            } catch (err: unknown) {
                const error = err as Error;
                console.error(`${C.red}✖ Nudger Run Failed:${C.reset} ${error.message}`);
                break;
            }

            console.log(`${C.green}${C.bold}Nudging Manager with instruction:${C.reset} ${decision}`);

            // 3. Send Prompt and execute manager turn
            try {
                await this.sendMessage(client, threadId, decision, judgeApprovals, rules);
            } catch (err: unknown) {
                const error = err as Error;
                console.error(`\n${C.red}✖ Error in Round ${currentRound}:${C.reset} ${error.message}`);
            }

            currentRound++;
        }

        if (!isDone) {
            console.log(`\n${C.red}${C.bold}✖ Reached maximum rounds limit (${maxRounds}) without completing the goal.${C.reset}\n`);
        } else {
            console.log(`\n${C.green}${C.bold}🎉 Autonomous loop completed successfully!${C.reset}\n`);
        }
    }

    private async startInteractiveLoop(client: CastellanClient, threadId: string, judgeApprovals: boolean, rules?: string) {
        let currentThreadId = threadId;

        let active = true;
        while (active) {
            const { prompt } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'prompt',
                    message: `${C.green}${C.bold}Operator:${C.reset}`,
                    validate: (input: string) => input.trim().length > 0 || 'Prompt cannot be empty.'
                }
            ]);

            if (prompt.toLowerCase() === 'exit' || prompt.toLowerCase() === 'quit') {
                console.log(`\n${C.dim}Directorate session closed.${C.reset}\n`);
                active = false;
                break;
            }

            try {
                currentThreadId = await this.sendMessage(client, currentThreadId, prompt, judgeApprovals, rules);
            } catch (err: unknown) {
                const error = err as Error;
                console.error(`\n${C.red}✖ Command Error:${C.reset} ${error.message}`);
            }
        }
    }

    private async sendMessage(client: CastellanClient, threadId: string, prompt: string, judgeApprovals: boolean, rules?: string): Promise<string> {
        const streamManager = new DirectorateStreamManager(client, judgeApprovals, rules, async (toolCall) => {
            await this.handleApprovalRequest(client, {
                id: toolCall.id,
                toolName: toolCall.toolName,
                arguments: toolCall.arguments,
                reason: undefined
            }, judgeApprovals, rules);
        });

        client.onEvent(streamManager.handleEvent);

        try {
            await client.api.manager.chat({
                threadId,
                prompt,
                wait: true
            });
            return threadId;
        } finally {
            client.offEvent(streamManager.handleEvent);
        }
    }

    private askQuestion(query: string): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve) => {
            rl.question(query, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    private async handleAskUser(client: CastellanClient, payload: AskUserPayload) {
        let answer: string | string[];

        console.log(`\n${C.yellow}${C.bold}📥 QUESTION FROM AGENT:${C.reset} ${payload.question}`);

        if (payload.promptType === 'choice') {
            const options = payload.options || [];
            options.forEach((opt: string, idx: number) => {
                console.log(`  ${C.cyan}${idx + 1}.${C.reset} ${opt}`);
            });
            let selectedIdx: number | null = null;
            while (selectedIdx === null) {
                const ans = await this.askQuestion(`${C.bold}Select choice (1-${options.length}):${C.reset} `);
                const idx = parseInt(ans.trim(), 10) - 1;
                if (idx >= 0 && idx < options.length) {
                    selectedIdx = idx;
                } else {
                    console.log(`${C.red}Invalid index. Please select a number between 1 and ${options.length}.${C.reset}`);
                }
            }
            answer = options[selectedIdx];
        } else if (payload.promptType === 'multiselect') {
            const options = payload.options || [];
            options.forEach((opt: string, idx: number) => {
                console.log(`  ${C.cyan}${idx + 1}.${C.reset} ${opt}`);
            });
            let selectedList: string[] | null = null;
            while (selectedList === null) {
                const ans = await this.askQuestion(`${C.bold}Select choices (comma-separated indices, e.g. 1,3):${C.reset} `);
                const indices = ans.split(',').map(s => parseInt(s.trim(), 10) - 1);
                const validIndices = indices.filter(idx => idx >= 0 && idx < options.length);
                if (validIndices.length > 0) {
                    selectedList = validIndices.map(idx => options[idx]);
                } else {
                    console.log(`${C.red}No valid choices selected. Please try again.${C.reset}`);
                }
            }
            answer = selectedList;
        } else if (payload.promptType === 'yesno') {
            let choice: boolean | null = null;
            while (choice === null) {
                const ans = await this.askQuestion(`${C.bold}Confirm [Y]es / [N]o:${C.reset} `);
                const val = ans.trim().toLowerCase();
                if (val === 'y' || val === 'yes') choice = true;
                else if (val === 'n' || val === 'no') choice = false;
                else console.log(`${C.red}Invalid entry. Please enter Y or N.${C.reset}`);
            }
            answer = choice ? 'yes' : 'no';
        } else {
            answer = await this.askQuestion(`${C.bold}Input Answer:${C.reset} `);
        }

        await client.api.messages.create({
            threadId: payload.threadId || 'system',
            role: 'user',
            content: `[USER RESPONSE to ${payload.id}]: ${typeof answer === 'string' ? answer : JSON.stringify(answer)}`
        });
        console.log(`${C.green}✔ Response submitted successfully.${C.reset}\n`);
    }

    private async handleApprovalRequest(client: CastellanClient, payload: RequestApprovalPayload, judgeApprovals: boolean, rules?: string) {
        if (judgeApprovals) {
            console.log(`\n🤖 ${C.cyan}${C.bold}[Auto-Judging] Evaluating tool call '${payload.toolName}' via multi-judge safety ensemble...${C.reset}`);

            try {
                const response = await client.api.manager.evaluate_approval({ id: payload.id, rules });

                if (response.approved) {
                    console.log(`\n🤖 ${C.green}${C.bold}[Auto-Judging] Consensus APPROVED (All judges cleared the action).${C.reset}`);
                    console.log(`Consensus Critique: ${response.consensusCritique}`);

                    // Auto-resolve approval
                    await client.api.infer.approve_tool({
                        toolCallId: payload.id
                    });
                    console.log(`${C.green}✔ Auto-approved successfully.${C.reset}\n`);
                    return;
                } else {
                    console.log(`\n🤖 ${C.red}${C.bold}⚠️ [Auto-Judging] Consensus REJECTED! Requiring manual operator sign-off.${C.reset}`);
                    console.log(`Consensus Critique: ${response.consensusCritique}`);
                    console.log(`\nJudges Scorecard:`);
                    response.judges.forEach((ev: { judge: string; approved: boolean; critique: string }) => {
                        const color = ev.approved ? C.green : C.red;
                        const symbol = ev.approved ? '✔' : '✖';
                        console.log(`  ${color}${symbol} ${ev.judge} Judge:${C.reset} ${ev.approved ? 'Approved' : 'Flagged Risk'}`);
                        console.log(`     Critique: ${ev.critique}`);
                    });
                    console.log('\n');
                }
            } catch (err: unknown) {
                const error = err as Error;
                console.error(`\n🤖 ${C.red}✖ Auto-judgement failed: ${error.message}. Falling back to manual prompt.${C.reset}\n`);
            }
        }

        process.stdout.write(`\n${C.yellow}${C.bold}APPROVAL REQUESTED:${C.reset} ${payload.toolName}\n`);
        process.stdout.write(`Reason: ${payload.reason || 'None'}\n`);
        process.stdout.write(`Arguments: ${JSON.stringify(payload.arguments, null, 2)}\n\n`);

        let action: 'approved' | 'denied' | 'refine' | null = null;
        while (!action) {
            const answer = await this.askQuestion(`${C.cyan}${C.bold}Resolve Approval [A]pprove / [D]eny / [R]efine:${C.reset} `);
            const choice = answer.trim().toLowerCase();
            if (choice === 'a' || choice === 'approve' || choice === 'approved') {
                action = 'approved';
            } else if (choice === 'd' || choice === 'deny' || choice === 'denied') {
                action = 'denied';
            } else if (choice === 'r' || choice === 'refine') {
                action = 'refine';
            } else {
                console.log(`${C.red}Invalid selection. Please type A, D, or R.${C.reset}`);
            }
        }

        let reason: string | undefined;
        if (action === 'refine' || action === 'denied') {
            reason = await this.askQuestion(`${C.yellow}Provide a reason/feedback:${C.reset} `);
        }

        try {
            if (action === 'approved') {
                await client.api.infer.approve_tool({
                    toolCallId: payload.id
                });
            } else {
                await client.api.infer.reject_tool({
                    toolCallId: payload.id,
                    reason
                });
            }
            console.log(`${C.green}✔ Approval resolved as: ${action}${C.reset}\n`);
        } catch (err: unknown) {
            const error = err as Error;
            console.error(`\n${C.red}✖ Failed to resolve approval:${C.reset} ${error.message}`);
        }
    }
}
