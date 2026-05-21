import { Command } from 'commander';
import { CastellanClient } from '../client/CastellanClient.js';
import { ZodToCliMapper } from '../../cli/core/ZodToCliMapper.js';
import { C } from '../../cli/core/Utils.js';
import * as Contract_0 from '../../addons/agents/skills/agent.contract.js';
import * as Contract_1 from '../../addons/audit/skills/approval.contract.js';
import * as Contract_2 from '../../addons/cron/skills/cron.contract.js';
import * as Contract_3 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_4 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_5 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_6 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_7 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_8 from '../../addons/settings/skills/settings.contract.js';


export function registerGeneratedCommands(program: Command, client: CastellanClient) {
    const agent = program.command('agent').description('agent tools');
    const cmd_agent_agentRunContract_run = agent.command('run').description(`Start an autonomous execution turn for a specific agent.`);
    cmd_agent_agentRunContract_run.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:run...' + C.reset);
            const res = await client.api.agent.run(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentRunContract_run, Contract_0.agentRunContract.inputSchema);
    const cmd_agent_agentCrud_create_create = agent.command('create').description(`CRUD create for agent (agentCrud)`);
    cmd_agent_agentCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:create...' + C.reset);
            const res = await client.api.agent.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentCrud_create_create, Contract_0.agentCrud['create'].inputSchema);
    const cmd_agent_agentCrud_find_find = agent.command('find').description(`CRUD find for agent (agentCrud)`);
    cmd_agent_agentCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:find...' + C.reset);
            const res = await client.api.agent.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentCrud_find_find, Contract_0.agentCrud['find'].inputSchema);
    const cmd_agent_agentCrud_findOne_find_one = agent.command('find_one').description(`CRUD findOne for agent (agentCrud)`);
    cmd_agent_agentCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:find_one...' + C.reset);
            const res = await client.api.agent.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentCrud_findOne_find_one, Contract_0.agentCrud['findOne'].inputSchema);
    const cmd_agent_agentCrud_count_count = agent.command('count').description(`CRUD count for agent (agentCrud)`);
    cmd_agent_agentCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:count...' + C.reset);
            const res = await client.api.agent.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentCrud_count_count, Contract_0.agentCrud['count'].inputSchema);
    const cmd_agent_agentCrud_get_get = agent.command('get').description(`CRUD get for agent (agentCrud)`);
    cmd_agent_agentCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:get...' + C.reset);
            const res = await client.api.agent.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentCrud_get_get, Contract_0.agentCrud['get'].inputSchema);
    const cmd_agent_agentCrud_update_update = agent.command('update').description(`CRUD update for agent (agentCrud)`);
    cmd_agent_agentCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:update...' + C.reset);
            const res = await client.api.agent.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentCrud_update_update, Contract_0.agentCrud['update'].inputSchema);
    const cmd_agent_agentCrud_delete_delete = agent.command('delete').description(`CRUD delete for agent (agentCrud)`);
    cmd_agent_agentCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent:delete...' + C.reset);
            const res = await client.api.agent.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_agentCrud_delete_delete, Contract_0.agentCrud['delete'].inputSchema);
    const agent_run = program.command('agent_run').description('agent_run tools');
    const cmd_agent_run_agentRunCrud_create_create = agent_run.command('create').description(`CRUD create for agent_run (agentRunCrud)`);
    cmd_agent_run_agentRunCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent_run:create...' + C.reset);
            const res = await client.api.agent_run.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_run_agentRunCrud_create_create, Contract_0.agentRunCrud['create'].inputSchema);
    const cmd_agent_run_agentRunCrud_find_find = agent_run.command('find').description(`CRUD find for agent_run (agentRunCrud)`);
    cmd_agent_run_agentRunCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent_run:find...' + C.reset);
            const res = await client.api.agent_run.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_run_agentRunCrud_find_find, Contract_0.agentRunCrud['find'].inputSchema);
    const cmd_agent_run_agentRunCrud_findOne_find_one = agent_run.command('find_one').description(`CRUD findOne for agent_run (agentRunCrud)`);
    cmd_agent_run_agentRunCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent_run:find_one...' + C.reset);
            const res = await client.api.agent_run.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_run_agentRunCrud_findOne_find_one, Contract_0.agentRunCrud['findOne'].inputSchema);
    const cmd_agent_run_agentRunCrud_count_count = agent_run.command('count').description(`CRUD count for agent_run (agentRunCrud)`);
    cmd_agent_run_agentRunCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent_run:count...' + C.reset);
            const res = await client.api.agent_run.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_run_agentRunCrud_count_count, Contract_0.agentRunCrud['count'].inputSchema);
    const cmd_agent_run_agentRunCrud_get_get = agent_run.command('get').description(`CRUD get for agent_run (agentRunCrud)`);
    cmd_agent_run_agentRunCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent_run:get...' + C.reset);
            const res = await client.api.agent_run.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_run_agentRunCrud_get_get, Contract_0.agentRunCrud['get'].inputSchema);
    const cmd_agent_run_agentRunCrud_update_update = agent_run.command('update').description(`CRUD update for agent_run (agentRunCrud)`);
    cmd_agent_run_agentRunCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent_run:update...' + C.reset);
            const res = await client.api.agent_run.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_run_agentRunCrud_update_update, Contract_0.agentRunCrud['update'].inputSchema);
    const cmd_agent_run_agentRunCrud_delete_delete = agent_run.command('delete').description(`CRUD delete for agent_run (agentRunCrud)`);
    cmd_agent_run_agentRunCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing agent_run:delete...' + C.reset);
            const res = await client.api.agent_run.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.agentRunCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_agent_run_agentRunCrud_delete_delete, Contract_0.agentRunCrud['delete'].inputSchema);
    const audit = program.command('audit').description('audit tools');
    const cmd_audit_approvalResolveContract_approval_resolve = audit.command('approval_resolve').description(`Resolve a pending tool call approval request.`);
    cmd_audit_approvalResolveContract_approval_resolve.action(async (o) => {
        try {
            console.log(C.dim + 'Executing audit:approval_resolve...' + C.reset);
            const res = await client.api.audit.approval_resolve(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalResolveContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_audit_approvalResolveContract_approval_resolve, Contract_1.approvalResolveContract.inputSchema);
    const cmd_audit_auditRunContract_run = audit.command('run').description(`Trigger a multi-judge audit on a thread.`);
    cmd_audit_auditRunContract_run.action(async (o) => {
        try {
            console.log(C.dim + 'Executing audit:run...' + C.reset);
            const res = await client.api.audit.run(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.auditRunContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_audit_auditRunContract_run, Contract_1.auditRunContract.inputSchema);
    const cmd_audit_auditCreateTestbedContract_create_testbed = audit.command('create_testbed').description(`Spawn a fresh sandbox and clone a git repository to create a consistent world state for testing.`);
    cmd_audit_auditCreateTestbedContract_create_testbed.action(async (o) => {
        try {
            console.log(C.dim + 'Executing audit:create_testbed...' + C.reset);
            const res = await client.api.audit.create_testbed(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.auditCreateTestbedContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_audit_auditCreateTestbedContract_create_testbed, Contract_1.auditCreateTestbedContract.inputSchema);
    const cmd_audit_auditGenerateScenarioContract_generate_scenario = audit.command('generate_scenario').description(`Analyze a historical failure and generate a gold-standard Scenario for regression testing.`);
    cmd_audit_auditGenerateScenarioContract_generate_scenario.action(async (o) => {
        try {
            console.log(C.dim + 'Executing audit:generate_scenario...' + C.reset);
            const res = await client.api.audit.generate_scenario(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.auditGenerateScenarioContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_audit_auditGenerateScenarioContract_generate_scenario, Contract_1.auditGenerateScenarioContract.inputSchema);
    const cmd_audit_auditEvaluateTriadContract_evaluate_triad = audit.command('evaluate_triad').description(`Run a triad (Manager/Thinker/Doer) simulation against a Scenario and grade the autonomy and accuracy.`);
    cmd_audit_auditEvaluateTriadContract_evaluate_triad.action(async (o) => {
        try {
            console.log(C.dim + 'Executing audit:evaluate_triad...' + C.reset);
            const res = await client.api.audit.evaluate_triad(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.auditEvaluateTriadContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_audit_auditEvaluateTriadContract_evaluate_triad, Contract_1.auditEvaluateTriadContract.inputSchema);
    const cmd_audit_auditEvaluateApprovalContract_evaluate_approval = audit.command('evaluate_approval').description(`Trigger a multi-judge safety audit on a pending tool call approval request.`);
    cmd_audit_auditEvaluateApprovalContract_evaluate_approval.action(async (o) => {
        try {
            console.log(C.dim + 'Executing audit:evaluate_approval...' + C.reset);
            const res = await client.api.audit.evaluate_approval(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.auditEvaluateApprovalContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_audit_auditEvaluateApprovalContract_evaluate_approval, Contract_1.auditEvaluateApprovalContract.inputSchema);
    const approval = program.command('approval').description('approval tools');
    const cmd_approval_approvalCrud_create_create = approval.command('create').description(`CRUD create for approval (approvalCrud)`);
    cmd_approval_approvalCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing approval:create...' + C.reset);
            const res = await client.api.approval.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_approval_approvalCrud_create_create, Contract_1.approvalCrud['create'].inputSchema);
    const cmd_approval_approvalCrud_find_find = approval.command('find').description(`CRUD find for approval (approvalCrud)`);
    cmd_approval_approvalCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing approval:find...' + C.reset);
            const res = await client.api.approval.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_approval_approvalCrud_find_find, Contract_1.approvalCrud['find'].inputSchema);
    const cmd_approval_approvalCrud_findOne_find_one = approval.command('find_one').description(`CRUD findOne for approval (approvalCrud)`);
    cmd_approval_approvalCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing approval:find_one...' + C.reset);
            const res = await client.api.approval.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_approval_approvalCrud_findOne_find_one, Contract_1.approvalCrud['findOne'].inputSchema);
    const cmd_approval_approvalCrud_count_count = approval.command('count').description(`CRUD count for approval (approvalCrud)`);
    cmd_approval_approvalCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing approval:count...' + C.reset);
            const res = await client.api.approval.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_approval_approvalCrud_count_count, Contract_1.approvalCrud['count'].inputSchema);
    const cmd_approval_approvalCrud_get_get = approval.command('get').description(`CRUD get for approval (approvalCrud)`);
    cmd_approval_approvalCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing approval:get...' + C.reset);
            const res = await client.api.approval.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_approval_approvalCrud_get_get, Contract_1.approvalCrud['get'].inputSchema);
    const cmd_approval_approvalCrud_update_update = approval.command('update').description(`CRUD update for approval (approvalCrud)`);
    cmd_approval_approvalCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing approval:update...' + C.reset);
            const res = await client.api.approval.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_approval_approvalCrud_update_update, Contract_1.approvalCrud['update'].inputSchema);
    const cmd_approval_approvalCrud_delete_delete = approval.command('delete').description(`CRUD delete for approval (approvalCrud)`);
    cmd_approval_approvalCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing approval:delete...' + C.reset);
            const res = await client.api.approval.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.approvalCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_approval_approvalCrud_delete_delete, Contract_1.approvalCrud['delete'].inputSchema);
    const scenario = program.command('scenario').description('scenario tools');
    const cmd_scenario_scenarioCrud_create_create = scenario.command('create').description(`CRUD create for scenario (scenarioCrud)`);
    cmd_scenario_scenarioCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing scenario:create...' + C.reset);
            const res = await client.api.scenario.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.scenarioCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_scenario_scenarioCrud_create_create, Contract_1.scenarioCrud['create'].inputSchema);
    const cmd_scenario_scenarioCrud_find_find = scenario.command('find').description(`CRUD find for scenario (scenarioCrud)`);
    cmd_scenario_scenarioCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing scenario:find...' + C.reset);
            const res = await client.api.scenario.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.scenarioCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_scenario_scenarioCrud_find_find, Contract_1.scenarioCrud['find'].inputSchema);
    const cmd_scenario_scenarioCrud_findOne_find_one = scenario.command('find_one').description(`CRUD findOne for scenario (scenarioCrud)`);
    cmd_scenario_scenarioCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing scenario:find_one...' + C.reset);
            const res = await client.api.scenario.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.scenarioCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_scenario_scenarioCrud_findOne_find_one, Contract_1.scenarioCrud['findOne'].inputSchema);
    const cmd_scenario_scenarioCrud_count_count = scenario.command('count').description(`CRUD count for scenario (scenarioCrud)`);
    cmd_scenario_scenarioCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing scenario:count...' + C.reset);
            const res = await client.api.scenario.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.scenarioCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_scenario_scenarioCrud_count_count, Contract_1.scenarioCrud['count'].inputSchema);
    const cmd_scenario_scenarioCrud_get_get = scenario.command('get').description(`CRUD get for scenario (scenarioCrud)`);
    cmd_scenario_scenarioCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing scenario:get...' + C.reset);
            const res = await client.api.scenario.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.scenarioCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_scenario_scenarioCrud_get_get, Contract_1.scenarioCrud['get'].inputSchema);
    const cmd_scenario_scenarioCrud_update_update = scenario.command('update').description(`CRUD update for scenario (scenarioCrud)`);
    cmd_scenario_scenarioCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing scenario:update...' + C.reset);
            const res = await client.api.scenario.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.scenarioCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_scenario_scenarioCrud_update_update, Contract_1.scenarioCrud['update'].inputSchema);
    const cmd_scenario_scenarioCrud_delete_delete = scenario.command('delete').description(`CRUD delete for scenario (scenarioCrud)`);
    cmd_scenario_scenarioCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing scenario:delete...' + C.reset);
            const res = await client.api.scenario.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.scenarioCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_scenario_scenarioCrud_delete_delete, Contract_1.scenarioCrud['delete'].inputSchema);
    const evaluation = program.command('evaluation').description('evaluation tools');
    const cmd_evaluation_evaluationCrud_create_create = evaluation.command('create').description(`CRUD create for evaluation (evaluationCrud)`);
    cmd_evaluation_evaluationCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing evaluation:create...' + C.reset);
            const res = await client.api.evaluation.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.evaluationCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_evaluation_evaluationCrud_create_create, Contract_1.evaluationCrud['create'].inputSchema);
    const cmd_evaluation_evaluationCrud_find_find = evaluation.command('find').description(`CRUD find for evaluation (evaluationCrud)`);
    cmd_evaluation_evaluationCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing evaluation:find...' + C.reset);
            const res = await client.api.evaluation.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.evaluationCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_evaluation_evaluationCrud_find_find, Contract_1.evaluationCrud['find'].inputSchema);
    const cmd_evaluation_evaluationCrud_findOne_find_one = evaluation.command('find_one').description(`CRUD findOne for evaluation (evaluationCrud)`);
    cmd_evaluation_evaluationCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing evaluation:find_one...' + C.reset);
            const res = await client.api.evaluation.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.evaluationCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_evaluation_evaluationCrud_findOne_find_one, Contract_1.evaluationCrud['findOne'].inputSchema);
    const cmd_evaluation_evaluationCrud_count_count = evaluation.command('count').description(`CRUD count for evaluation (evaluationCrud)`);
    cmd_evaluation_evaluationCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing evaluation:count...' + C.reset);
            const res = await client.api.evaluation.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.evaluationCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_evaluation_evaluationCrud_count_count, Contract_1.evaluationCrud['count'].inputSchema);
    const cmd_evaluation_evaluationCrud_get_get = evaluation.command('get').description(`CRUD get for evaluation (evaluationCrud)`);
    cmd_evaluation_evaluationCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing evaluation:get...' + C.reset);
            const res = await client.api.evaluation.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.evaluationCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_evaluation_evaluationCrud_get_get, Contract_1.evaluationCrud['get'].inputSchema);
    const cmd_evaluation_evaluationCrud_update_update = evaluation.command('update').description(`CRUD update for evaluation (evaluationCrud)`);
    cmd_evaluation_evaluationCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing evaluation:update...' + C.reset);
            const res = await client.api.evaluation.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.evaluationCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_evaluation_evaluationCrud_update_update, Contract_1.evaluationCrud['update'].inputSchema);
    const cmd_evaluation_evaluationCrud_delete_delete = evaluation.command('delete').description(`CRUD delete for evaluation (evaluationCrud)`);
    cmd_evaluation_evaluationCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing evaluation:delete...' + C.reset);
            const res = await client.api.evaluation.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.evaluationCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_evaluation_evaluationCrud_delete_delete, Contract_1.evaluationCrud['delete'].inputSchema);
    const cron = program.command('cron').description('cron tools');
    const cmd_cron_cronTriggerContract_trigger = cron.command('trigger').description(`Manually trigger a scheduled cron job to run as soon as possible.`);
    cmd_cron_cronTriggerContract_trigger.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:trigger...' + C.reset);
            const res = await client.api.cron.trigger(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronTriggerContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronTriggerContract_trigger, Contract_2.cronTriggerContract.inputSchema);
    const cmd_cron_cronResetContract_reset = cron.command('reset').description(`Reset a stuck or running cron job to queued state so it can be picked up by the scheduler again.`);
    cmd_cron_cronResetContract_reset.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:reset...' + C.reset);
            const res = await client.api.cron.reset(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronResetContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronResetContract_reset, Contract_2.cronResetContract.inputSchema);
    const cmd_cron_cronStatusContract_status = cron.command('status').description(`Get a summary of the cron scheduler status, including running jobs and queue depth.`);
    cmd_cron_cronStatusContract_status.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:status...' + C.reset);
            const res = await client.api.cron.status(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronStatusContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronStatusContract_status, Contract_2.cronStatusContract.inputSchema);
    const cmd_cron_cronJobCrud_create_create = cron.command('create').description(`CRUD create for cron (cronJobCrud)`);
    cmd_cron_cronJobCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:create...' + C.reset);
            const res = await client.api.cron.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronJobCrud_create_create, Contract_2.cronJobCrud['create'].inputSchema);
    const cmd_cron_cronJobCrud_find_find = cron.command('find').description(`CRUD find for cron (cronJobCrud)`);
    cmd_cron_cronJobCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:find...' + C.reset);
            const res = await client.api.cron.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronJobCrud_find_find, Contract_2.cronJobCrud['find'].inputSchema);
    const cmd_cron_cronJobCrud_findOne_find_one = cron.command('find_one').description(`CRUD findOne for cron (cronJobCrud)`);
    cmd_cron_cronJobCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:find_one...' + C.reset);
            const res = await client.api.cron.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronJobCrud_findOne_find_one, Contract_2.cronJobCrud['findOne'].inputSchema);
    const cmd_cron_cronJobCrud_count_count = cron.command('count').description(`CRUD count for cron (cronJobCrud)`);
    cmd_cron_cronJobCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:count...' + C.reset);
            const res = await client.api.cron.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronJobCrud_count_count, Contract_2.cronJobCrud['count'].inputSchema);
    const cmd_cron_cronJobCrud_get_get = cron.command('get').description(`CRUD get for cron (cronJobCrud)`);
    cmd_cron_cronJobCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:get...' + C.reset);
            const res = await client.api.cron.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronJobCrud_get_get, Contract_2.cronJobCrud['get'].inputSchema);
    const cmd_cron_cronJobCrud_update_update = cron.command('update').description(`CRUD update for cron (cronJobCrud)`);
    cmd_cron_cronJobCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:update...' + C.reset);
            const res = await client.api.cron.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronJobCrud_update_update, Contract_2.cronJobCrud['update'].inputSchema);
    const cmd_cron_cronJobCrud_delete_delete = cron.command('delete').description(`CRUD delete for cron (cronJobCrud)`);
    cmd_cron_cronJobCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron:delete...' + C.reset);
            const res = await client.api.cron.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_cronJobCrud_delete_delete, Contract_2.cronJobCrud['delete'].inputSchema);
    const cron_runs = program.command('cron_runs').description('cron_runs tools');
    const cmd_cron_runs_cronJobRunCrud_create_create = cron_runs.command('create').description(`CRUD create for cron_runs (cronJobRunCrud)`);
    cmd_cron_runs_cronJobRunCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron_runs:create...' + C.reset);
            const res = await client.api.cron_runs.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobRunCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_runs_cronJobRunCrud_create_create, Contract_2.cronJobRunCrud['create'].inputSchema);
    const cmd_cron_runs_cronJobRunCrud_find_find = cron_runs.command('find').description(`CRUD find for cron_runs (cronJobRunCrud)`);
    cmd_cron_runs_cronJobRunCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron_runs:find...' + C.reset);
            const res = await client.api.cron_runs.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobRunCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_runs_cronJobRunCrud_find_find, Contract_2.cronJobRunCrud['find'].inputSchema);
    const cmd_cron_runs_cronJobRunCrud_findOne_find_one = cron_runs.command('find_one').description(`CRUD findOne for cron_runs (cronJobRunCrud)`);
    cmd_cron_runs_cronJobRunCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron_runs:find_one...' + C.reset);
            const res = await client.api.cron_runs.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobRunCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_runs_cronJobRunCrud_findOne_find_one, Contract_2.cronJobRunCrud['findOne'].inputSchema);
    const cmd_cron_runs_cronJobRunCrud_count_count = cron_runs.command('count').description(`CRUD count for cron_runs (cronJobRunCrud)`);
    cmd_cron_runs_cronJobRunCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron_runs:count...' + C.reset);
            const res = await client.api.cron_runs.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobRunCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_runs_cronJobRunCrud_count_count, Contract_2.cronJobRunCrud['count'].inputSchema);
    const cmd_cron_runs_cronJobRunCrud_get_get = cron_runs.command('get').description(`CRUD get for cron_runs (cronJobRunCrud)`);
    cmd_cron_runs_cronJobRunCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron_runs:get...' + C.reset);
            const res = await client.api.cron_runs.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobRunCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_runs_cronJobRunCrud_get_get, Contract_2.cronJobRunCrud['get'].inputSchema);
    const cmd_cron_runs_cronJobRunCrud_update_update = cron_runs.command('update').description(`CRUD update for cron_runs (cronJobRunCrud)`);
    cmd_cron_runs_cronJobRunCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron_runs:update...' + C.reset);
            const res = await client.api.cron_runs.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobRunCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_runs_cronJobRunCrud_update_update, Contract_2.cronJobRunCrud['update'].inputSchema);
    const cmd_cron_runs_cronJobRunCrud_delete_delete = cron_runs.command('delete').description(`CRUD delete for cron_runs (cronJobRunCrud)`);
    cmd_cron_runs_cronJobRunCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing cron_runs:delete...' + C.reset);
            const res = await client.api.cron_runs.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.cronJobRunCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_cron_runs_cronJobRunCrud_delete_delete, Contract_2.cronJobRunCrud['delete'].inputSchema);
    const demo = program.command('demo').description('demo tools');
    const cmd_demo_demoHelloContract_hello = demo.command('hello').description(`A simple hello world tool for demonstration.`);
    cmd_demo_demoHelloContract_hello.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:hello...' + C.reset);
            const res = await client.api.demo.hello(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoHelloContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoHelloContract_hello, Contract_3.demoHelloContract.inputSchema);
    const cmd_demo_demoStatusContract_status = demo.command('status').description(`Check the status of the demo environment.`);
    cmd_demo_demoStatusContract_status.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:status...' + C.reset);
            const res = await client.api.demo.status(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoStatusContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoStatusContract_status, Contract_3.demoStatusContract.inputSchema);
    const cmd_demo_demoNotifyContract_notify = demo.command('notify').description(`Send a notification via the system notifications service.`);
    cmd_demo_demoNotifyContract_notify.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:notify...' + C.reset);
            const res = await client.api.demo.notify(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoNotifyContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoNotifyContract_notify, Contract_3.demoNotifyContract.inputSchema);
    const cmd_demo_demoCrud_create_create = demo.command('create').description(`CRUD create for demo (demoCrud)`);
    cmd_demo_demoCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:create...' + C.reset);
            const res = await client.api.demo.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_create_create, Contract_3.demoCrud['create'].inputSchema);
    const cmd_demo_demoCrud_find_find = demo.command('find').description(`CRUD find for demo (demoCrud)`);
    cmd_demo_demoCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:find...' + C.reset);
            const res = await client.api.demo.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_find_find, Contract_3.demoCrud['find'].inputSchema);
    const cmd_demo_demoCrud_findOne_find_one = demo.command('find_one').description(`CRUD findOne for demo (demoCrud)`);
    cmd_demo_demoCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:find_one...' + C.reset);
            const res = await client.api.demo.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_findOne_find_one, Contract_3.demoCrud['findOne'].inputSchema);
    const cmd_demo_demoCrud_count_count = demo.command('count').description(`CRUD count for demo (demoCrud)`);
    cmd_demo_demoCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:count...' + C.reset);
            const res = await client.api.demo.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_count_count, Contract_3.demoCrud['count'].inputSchema);
    const cmd_demo_demoCrud_get_get = demo.command('get').description(`CRUD get for demo (demoCrud)`);
    cmd_demo_demoCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:get...' + C.reset);
            const res = await client.api.demo.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_get_get, Contract_3.demoCrud['get'].inputSchema);
    const cmd_demo_demoCrud_update_update = demo.command('update').description(`CRUD update for demo (demoCrud)`);
    cmd_demo_demoCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:update...' + C.reset);
            const res = await client.api.demo.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_update_update, Contract_3.demoCrud['update'].inputSchema);
    const cmd_demo_demoCrud_delete_delete = demo.command('delete').description(`CRUD delete for demo (demoCrud)`);
    cmd_demo_demoCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:delete...' + C.reset);
            const res = await client.api.demo.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.demoCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_delete_delete, Contract_3.demoCrud['delete'].inputSchema);
    const infer = program.command('infer').description('infer tools');
    const cmd_infer_inferChatContract_chat = infer.command('chat').description(`Perform stateful chat completion within a thread.`);
    cmd_infer_inferChatContract_chat.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:chat...' + C.reset);
            const res = await client.api.infer.chat(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.inferChatContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferChatContract_chat, Contract_4.inferChatContract.inputSchema);
    const cmd_infer_inferApproveToolContract_approve_tool = infer.command('approve_tool').description(`Approve a pending tool call for execution.`);
    cmd_infer_inferApproveToolContract_approve_tool.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:approve_tool...' + C.reset);
            const res = await client.api.infer.approve_tool(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.inferApproveToolContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferApproveToolContract_approve_tool, Contract_4.inferApproveToolContract.inputSchema);
    const cmd_infer_inferRefreshInventoryContract_refresh_inventory = infer.command('refresh_inventory').description(`Force a refresh of the model inventory from all registered Ollama instances.`);
    cmd_infer_inferRefreshInventoryContract_refresh_inventory.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:refresh_inventory...' + C.reset);
            const res = await client.api.infer.refresh_inventory(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.inferRefreshInventoryContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferRefreshInventoryContract_refresh_inventory, Contract_4.inferRefreshInventoryContract.inputSchema);
    const cmd_infer_inferAcquireOllamaContract_acquire_ollama = infer.command('acquire_ollama').description(`Atomically acquire the next available online Ollama instance.`);
    cmd_infer_inferAcquireOllamaContract_acquire_ollama.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:acquire_ollama...' + C.reset);
            const res = await client.api.infer.acquire_ollama(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.inferAcquireOllamaContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferAcquireOllamaContract_acquire_ollama, Contract_4.inferAcquireOllamaContract.inputSchema);
    const cmd_infer_inferReleaseOllamaContract_release_ollama = infer.command('release_ollama').description(`Release an acquired Ollama instance, decrementing its active request count.`);
    cmd_infer_inferReleaseOllamaContract_release_ollama.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:release_ollama...' + C.reset);
            const res = await client.api.infer.release_ollama(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.inferReleaseOllamaContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferReleaseOllamaContract_release_ollama, Contract_4.inferReleaseOllamaContract.inputSchema);
    const ollama = program.command('ollama').description('ollama tools');
    const cmd_ollama_ollamaCrud_create_create = ollama.command('create').description(`CRUD create for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:create...' + C.reset);
            const res = await client.api.ollama.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.ollamaCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_create_create, Contract_4.ollamaCrud['create'].inputSchema);
    const cmd_ollama_ollamaCrud_find_find = ollama.command('find').description(`CRUD find for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:find...' + C.reset);
            const res = await client.api.ollama.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.ollamaCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_find_find, Contract_4.ollamaCrud['find'].inputSchema);
    const cmd_ollama_ollamaCrud_findOne_find_one = ollama.command('find_one').description(`CRUD findOne for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:find_one...' + C.reset);
            const res = await client.api.ollama.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.ollamaCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_findOne_find_one, Contract_4.ollamaCrud['findOne'].inputSchema);
    const cmd_ollama_ollamaCrud_count_count = ollama.command('count').description(`CRUD count for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:count...' + C.reset);
            const res = await client.api.ollama.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.ollamaCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_count_count, Contract_4.ollamaCrud['count'].inputSchema);
    const cmd_ollama_ollamaCrud_get_get = ollama.command('get').description(`CRUD get for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:get...' + C.reset);
            const res = await client.api.ollama.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.ollamaCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_get_get, Contract_4.ollamaCrud['get'].inputSchema);
    const cmd_ollama_ollamaCrud_update_update = ollama.command('update').description(`CRUD update for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:update...' + C.reset);
            const res = await client.api.ollama.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.ollamaCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_update_update, Contract_4.ollamaCrud['update'].inputSchema);
    const cmd_ollama_ollamaCrud_delete_delete = ollama.command('delete').description(`CRUD delete for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:delete...' + C.reset);
            const res = await client.api.ollama.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.ollamaCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_delete_delete, Contract_4.ollamaCrud['delete'].inputSchema);
    const models = program.command('models').description('models tools');
    const cmd_models_modelCrud_create_create = models.command('create').description(`CRUD create for models (modelCrud)`);
    cmd_models_modelCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:create...' + C.reset);
            const res = await client.api.models.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.modelCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_create_create, Contract_4.modelCrud['create'].inputSchema);
    const cmd_models_modelCrud_find_find = models.command('find').description(`CRUD find for models (modelCrud)`);
    cmd_models_modelCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:find...' + C.reset);
            const res = await client.api.models.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.modelCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_find_find, Contract_4.modelCrud['find'].inputSchema);
    const cmd_models_modelCrud_findOne_find_one = models.command('find_one').description(`CRUD findOne for models (modelCrud)`);
    cmd_models_modelCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:find_one...' + C.reset);
            const res = await client.api.models.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.modelCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_findOne_find_one, Contract_4.modelCrud['findOne'].inputSchema);
    const cmd_models_modelCrud_count_count = models.command('count').description(`CRUD count for models (modelCrud)`);
    cmd_models_modelCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:count...' + C.reset);
            const res = await client.api.models.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.modelCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_count_count, Contract_4.modelCrud['count'].inputSchema);
    const cmd_models_modelCrud_get_get = models.command('get').description(`CRUD get for models (modelCrud)`);
    cmd_models_modelCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:get...' + C.reset);
            const res = await client.api.models.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.modelCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_get_get, Contract_4.modelCrud['get'].inputSchema);
    const cmd_models_modelCrud_update_update = models.command('update').description(`CRUD update for models (modelCrud)`);
    cmd_models_modelCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:update...' + C.reset);
            const res = await client.api.models.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.modelCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_update_update, Contract_4.modelCrud['update'].inputSchema);
    const cmd_models_modelCrud_delete_delete = models.command('delete').description(`CRUD delete for models (modelCrud)`);
    cmd_models_modelCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:delete...' + C.reset);
            const res = await client.api.models.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.modelCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_delete_delete, Contract_4.modelCrud['delete'].inputSchema);
    const threads = program.command('threads').description('threads tools');
    const cmd_threads_threadCrud_create_create = threads.command('create').description(`CRUD create for threads (threadCrud)`);
    cmd_threads_threadCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:create...' + C.reset);
            const res = await client.api.threads.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.threadCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_create_create, Contract_4.threadCrud['create'].inputSchema);
    const cmd_threads_threadCrud_find_find = threads.command('find').description(`CRUD find for threads (threadCrud)`);
    cmd_threads_threadCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:find...' + C.reset);
            const res = await client.api.threads.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.threadCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_find_find, Contract_4.threadCrud['find'].inputSchema);
    const cmd_threads_threadCrud_findOne_find_one = threads.command('find_one').description(`CRUD findOne for threads (threadCrud)`);
    cmd_threads_threadCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:find_one...' + C.reset);
            const res = await client.api.threads.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.threadCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_findOne_find_one, Contract_4.threadCrud['findOne'].inputSchema);
    const cmd_threads_threadCrud_count_count = threads.command('count').description(`CRUD count for threads (threadCrud)`);
    cmd_threads_threadCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:count...' + C.reset);
            const res = await client.api.threads.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.threadCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_count_count, Contract_4.threadCrud['count'].inputSchema);
    const cmd_threads_threadCrud_get_get = threads.command('get').description(`CRUD get for threads (threadCrud)`);
    cmd_threads_threadCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:get...' + C.reset);
            const res = await client.api.threads.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.threadCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_get_get, Contract_4.threadCrud['get'].inputSchema);
    const cmd_threads_threadCrud_update_update = threads.command('update').description(`CRUD update for threads (threadCrud)`);
    cmd_threads_threadCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:update...' + C.reset);
            const res = await client.api.threads.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.threadCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_update_update, Contract_4.threadCrud['update'].inputSchema);
    const cmd_threads_threadCrud_delete_delete = threads.command('delete').description(`CRUD delete for threads (threadCrud)`);
    cmd_threads_threadCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:delete...' + C.reset);
            const res = await client.api.threads.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.threadCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_delete_delete, Contract_4.threadCrud['delete'].inputSchema);
    const messages = program.command('messages').description('messages tools');
    const cmd_messages_messageCrud_create_create = messages.command('create').description(`CRUD create for messages (messageCrud)`);
    cmd_messages_messageCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:create...' + C.reset);
            const res = await client.api.messages.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.messageCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_create_create, Contract_4.messageCrud['create'].inputSchema);
    const cmd_messages_messageCrud_find_find = messages.command('find').description(`CRUD find for messages (messageCrud)`);
    cmd_messages_messageCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:find...' + C.reset);
            const res = await client.api.messages.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.messageCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_find_find, Contract_4.messageCrud['find'].inputSchema);
    const cmd_messages_messageCrud_findOne_find_one = messages.command('find_one').description(`CRUD findOne for messages (messageCrud)`);
    cmd_messages_messageCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:find_one...' + C.reset);
            const res = await client.api.messages.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.messageCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_findOne_find_one, Contract_4.messageCrud['findOne'].inputSchema);
    const cmd_messages_messageCrud_count_count = messages.command('count').description(`CRUD count for messages (messageCrud)`);
    cmd_messages_messageCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:count...' + C.reset);
            const res = await client.api.messages.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.messageCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_count_count, Contract_4.messageCrud['count'].inputSchema);
    const cmd_messages_messageCrud_get_get = messages.command('get').description(`CRUD get for messages (messageCrud)`);
    cmd_messages_messageCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:get...' + C.reset);
            const res = await client.api.messages.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.messageCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_get_get, Contract_4.messageCrud['get'].inputSchema);
    const cmd_messages_messageCrud_update_update = messages.command('update').description(`CRUD update for messages (messageCrud)`);
    cmd_messages_messageCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:update...' + C.reset);
            const res = await client.api.messages.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.messageCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_update_update, Contract_4.messageCrud['update'].inputSchema);
    const cmd_messages_messageCrud_delete_delete = messages.command('delete').description(`CRUD delete for messages (messageCrud)`);
    cmd_messages_messageCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:delete...' + C.reset);
            const res = await client.api.messages.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.messageCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_delete_delete, Contract_4.messageCrud['delete'].inputSchema);
    const tool_calls = program.command('tool_calls').description('tool_calls tools');
    const cmd_tool_calls_toolCallCrud_create_create = tool_calls.command('create').description(`CRUD create for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:create...' + C.reset);
            const res = await client.api.tool_calls.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.toolCallCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_create_create, Contract_4.toolCallCrud['create'].inputSchema);
    const cmd_tool_calls_toolCallCrud_find_find = tool_calls.command('find').description(`CRUD find for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:find...' + C.reset);
            const res = await client.api.tool_calls.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.toolCallCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_find_find, Contract_4.toolCallCrud['find'].inputSchema);
    const cmd_tool_calls_toolCallCrud_findOne_find_one = tool_calls.command('find_one').description(`CRUD findOne for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:find_one...' + C.reset);
            const res = await client.api.tool_calls.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.toolCallCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_findOne_find_one, Contract_4.toolCallCrud['findOne'].inputSchema);
    const cmd_tool_calls_toolCallCrud_count_count = tool_calls.command('count').description(`CRUD count for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:count...' + C.reset);
            const res = await client.api.tool_calls.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.toolCallCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_count_count, Contract_4.toolCallCrud['count'].inputSchema);
    const cmd_tool_calls_toolCallCrud_get_get = tool_calls.command('get').description(`CRUD get for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:get...' + C.reset);
            const res = await client.api.tool_calls.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.toolCallCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_get_get, Contract_4.toolCallCrud['get'].inputSchema);
    const cmd_tool_calls_toolCallCrud_update_update = tool_calls.command('update').description(`CRUD update for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:update...' + C.reset);
            const res = await client.api.tool_calls.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.toolCallCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_update_update, Contract_4.toolCallCrud['update'].inputSchema);
    const cmd_tool_calls_toolCallCrud_delete_delete = tool_calls.command('delete').description(`CRUD delete for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:delete...' + C.reset);
            const res = await client.api.tool_calls.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.toolCallCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_delete_delete, Contract_4.toolCallCrud['delete'].inputSchema);
    const marketplace = program.command('marketplace').description('marketplace tools');
    const cmd_marketplace_marketplaceListContract_list = marketplace.command('list').description(`List available and installed addons`);
    cmd_marketplace_marketplaceListContract_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing marketplace:list...' + C.reset);
            const res = await client.api.marketplace.list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_5.marketplaceListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_marketplace_marketplaceListContract_list, Contract_5.marketplaceListContract.inputSchema);
    const cmd_marketplace_marketplaceInstallContract_install = marketplace.command('install').description(`Install an addon`);
    cmd_marketplace_marketplaceInstallContract_install.action(async (o) => {
        try {
            console.log(C.dim + 'Executing marketplace:install...' + C.reset);
            const res = await client.api.marketplace.install(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_5.marketplaceInstallContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_marketplace_marketplaceInstallContract_install, Contract_5.marketplaceInstallContract.inputSchema);
    const notifications = program.command('notifications').description('notifications tools');
    const cmd_notifications_notificationsSendContract_send = notifications.command('send').description(`Trigger a new system notification`);
    cmd_notifications_notificationsSendContract_send.action(async (o) => {
        try {
            console.log(C.dim + 'Executing notifications:send...' + C.reset);
            const res = await client.api.notifications.send(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_6.notificationsSendContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_notifications_notificationsSendContract_send, Contract_6.notificationsSendContract.inputSchema);
    const cmd_notifications_notificationsListContract_list = notifications.command('list').description(`List recent notifications`);
    cmd_notifications_notificationsListContract_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing notifications:list...' + C.reset);
            const res = await client.api.notifications.list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_6.notificationsListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_notifications_notificationsListContract_list, Contract_6.notificationsListContract.inputSchema);
    const sandbox = program.command('sandbox').description('sandbox tools');
    const cmd_sandbox_sandboxSetActiveContract_set_active = sandbox.command('set_active').description(`Step into a specific sandbox. All subsequent FS and Terminal tools will target this sandbox.`);
    cmd_sandbox_sandboxSetActiveContract_set_active.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:set_active...' + C.reset);
            const res = await client.api.sandbox.set_active(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxSetActiveContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxSetActiveContract_set_active, Contract_7.sandboxSetActiveContract.inputSchema);
    const cmd_sandbox_sandboxPruneContract_prune = sandbox.command('prune').description(`Clean up stale or stopped sandbox containers running on the Docker host.`);
    cmd_sandbox_sandboxPruneContract_prune.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:prune...' + C.reset);
            const res = await client.api.sandbox.prune(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxPruneContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxPruneContract_prune, Contract_7.sandboxPruneContract.inputSchema);
    const cmd_sandbox_sandboxFsReadContract_fs_read = sandbox.command('fs_read').description(`Read a file from the current sandbox.`);
    cmd_sandbox_sandboxFsReadContract_fs_read.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_read...' + C.reset);
            const res = await client.api.sandbox.fs_read(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxFsReadContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsReadContract_fs_read, Contract_7.sandboxFsReadContract.inputSchema);
    const cmd_sandbox_sandboxFsWriteContract_fs_write = sandbox.command('fs_write').description(`Write a file to the current sandbox.`);
    cmd_sandbox_sandboxFsWriteContract_fs_write.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_write...' + C.reset);
            const res = await client.api.sandbox.fs_write(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxFsWriteContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsWriteContract_fs_write, Contract_7.sandboxFsWriteContract.inputSchema);
    const cmd_sandbox_sandboxFsListContract_fs_list = sandbox.command('fs_list').description(`List contents of a directory in the current sandbox.`);
    cmd_sandbox_sandboxFsListContract_fs_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_list...' + C.reset);
            const res = await client.api.sandbox.fs_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxFsListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsListContract_fs_list, Contract_7.sandboxFsListContract.inputSchema);
    const cmd_sandbox_sandboxFsPatchContract_fs_patch = sandbox.command('fs_patch').description(`Apply targeted changes to a file in the current sandbox.`);
    cmd_sandbox_sandboxFsPatchContract_fs_patch.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_patch...' + C.reset);
            const res = await client.api.sandbox.fs_patch(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxFsPatchContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsPatchContract_fs_patch, Contract_7.sandboxFsPatchContract.inputSchema);
    const cmd_sandbox_sandboxFsRemoveContract_fs_remove = sandbox.command('fs_remove').description(`Remove a file or directory from the current sandbox.`);
    cmd_sandbox_sandboxFsRemoveContract_fs_remove.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_remove...' + C.reset);
            const res = await client.api.sandbox.fs_remove(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxFsRemoveContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsRemoveContract_fs_remove, Contract_7.sandboxFsRemoveContract.inputSchema);
    const cmd_sandbox_sandboxFsMkdirContract_fs_mkdir = sandbox.command('fs_mkdir').description(`Create a new directory in the current sandbox.`);
    cmd_sandbox_sandboxFsMkdirContract_fs_mkdir.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_mkdir...' + C.reset);
            const res = await client.api.sandbox.fs_mkdir(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxFsMkdirContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsMkdirContract_fs_mkdir, Contract_7.sandboxFsMkdirContract.inputSchema);
    const cmd_sandbox_sandboxFsMoveContract_fs_move = sandbox.command('fs_move').description(`Move or rename a file/directory in the current sandbox.`);
    cmd_sandbox_sandboxFsMoveContract_fs_move.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_move...' + C.reset);
            const res = await client.api.sandbox.fs_move(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxFsMoveContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsMoveContract_fs_move, Contract_7.sandboxFsMoveContract.inputSchema);
    const cmd_sandbox_sandboxTerminalExecuteContract_terminal_execute = sandbox.command('terminal_execute').description(`Execute a short-lived command in the current sandbox.`);
    cmd_sandbox_sandboxTerminalExecuteContract_terminal_execute.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_execute...' + C.reset);
            const res = await client.api.sandbox.terminal_execute(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalExecuteContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalExecuteContract_terminal_execute, Contract_7.sandboxTerminalExecuteContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSpawnContract_terminal_spawn = sandbox.command('terminal_spawn').description(`Spawn a background service in the current sandbox.`);
    cmd_sandbox_sandboxTerminalSpawnContract_terminal_spawn.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_spawn...' + C.reset);
            const res = await client.api.sandbox.terminal_spawn(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalSpawnContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSpawnContract_terminal_spawn, Contract_7.sandboxTerminalSpawnContract.inputSchema);
    const cmd_sandbox_sandboxTerminalListContract_terminal_list = sandbox.command('terminal_list').description(`List all background services running in the current sandbox.`);
    cmd_sandbox_sandboxTerminalListContract_terminal_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_list...' + C.reset);
            const res = await client.api.sandbox.terminal_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalListContract_terminal_list, Contract_7.sandboxTerminalListContract.inputSchema);
    const cmd_sandbox_sandboxTerminalKillContract_terminal_kill = sandbox.command('terminal_kill').description(`Kill a background service in the current sandbox.`);
    cmd_sandbox_sandboxTerminalKillContract_terminal_kill.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_kill...' + C.reset);
            const res = await client.api.sandbox.terminal_kill(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalKillContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalKillContract_terminal_kill, Contract_7.sandboxTerminalKillContract.inputSchema);
    const cmd_sandbox_sandboxTerminalLogsContract_terminal_logs = sandbox.command('terminal_logs').description(`Get logs for a background service in the current sandbox.`);
    cmd_sandbox_sandboxTerminalLogsContract_terminal_logs.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_logs...' + C.reset);
            const res = await client.api.sandbox.terminal_logs(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalLogsContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalLogsContract_terminal_logs, Contract_7.sandboxTerminalLogsContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionOpenContract_terminal_session_open = sandbox.command('terminal_session_open').description(`Open a persistent PTY session (e.g. bash) in the current sandbox.`);
    cmd_sandbox_sandboxTerminalSessionOpenContract_terminal_session_open.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_open...' + C.reset);
            const res = await client.api.sandbox.terminal_session_open(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalSessionOpenContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionOpenContract_terminal_session_open, Contract_7.sandboxTerminalSessionOpenContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionListContract_terminal_session_list = sandbox.command('terminal_session_list').description(`List all active PTY sessions in the current sandbox.`);
    cmd_sandbox_sandboxTerminalSessionListContract_terminal_session_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_list...' + C.reset);
            const res = await client.api.sandbox.terminal_session_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalSessionListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionListContract_terminal_session_list, Contract_7.sandboxTerminalSessionListContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionWriteContract_terminal_session_write = sandbox.command('terminal_session_write').description(`Write data to a PTY session stdin.`);
    cmd_sandbox_sandboxTerminalSessionWriteContract_terminal_session_write.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_write...' + C.reset);
            const res = await client.api.sandbox.terminal_session_write(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalSessionWriteContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionWriteContract_terminal_session_write, Contract_7.sandboxTerminalSessionWriteContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionResizeContract_terminal_session_resize = sandbox.command('terminal_session_resize').description(`Resize a PTY session window.`);
    cmd_sandbox_sandboxTerminalSessionResizeContract_terminal_session_resize.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_resize...' + C.reset);
            const res = await client.api.sandbox.terminal_session_resize(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxTerminalSessionResizeContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionResizeContract_terminal_session_resize, Contract_7.sandboxTerminalSessionResizeContract.inputSchema);
    const cmd_sandbox_sandboxNetworkExposeContract_network_expose = sandbox.command('network_expose').description(`Map a container port to the host or proxy.`);
    cmd_sandbox_sandboxNetworkExposeContract_network_expose.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:network_expose...' + C.reset);
            const res = await client.api.sandbox.network_expose(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxNetworkExposeContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxNetworkExposeContract_network_expose, Contract_7.sandboxNetworkExposeContract.inputSchema);
    const cmd_sandbox_sandboxNetworkUnexposeContract_network_unexpose = sandbox.command('network_unexpose').description(`Remove a port mapping.`);
    cmd_sandbox_sandboxNetworkUnexposeContract_network_unexpose.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:network_unexpose...' + C.reset);
            const res = await client.api.sandbox.network_unexpose(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxNetworkUnexposeContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxNetworkUnexposeContract_network_unexpose, Contract_7.sandboxNetworkUnexposeContract.inputSchema);
    const cmd_sandbox_sandboxNetworkListContract_network_list = sandbox.command('network_list').description(`List all active exposed ports.`);
    cmd_sandbox_sandboxNetworkListContract_network_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:network_list...' + C.reset);
            const res = await client.api.sandbox.network_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxNetworkListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxNetworkListContract_network_list, Contract_7.sandboxNetworkListContract.inputSchema);
    const cmd_sandbox_sandboxNetworkSetPolicyContract_network_set_policy = sandbox.command('network_set_policy').description(`Toggle external internet access for the sandbox.`);
    cmd_sandbox_sandboxNetworkSetPolicyContract_network_set_policy.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:network_set_policy...' + C.reset);
            const res = await client.api.sandbox.network_set_policy(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxNetworkSetPolicyContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxNetworkSetPolicyContract_network_set_policy, Contract_7.sandboxNetworkSetPolicyContract.inputSchema);
    const cmd_sandbox_sandboxEnvSetContract_env_set = sandbox.command('env_set').description(`Set a generic environment variable.`);
    cmd_sandbox_sandboxEnvSetContract_env_set.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:env_set...' + C.reset);
            const res = await client.api.sandbox.env_set(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxEnvSetContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxEnvSetContract_env_set, Contract_7.sandboxEnvSetContract.inputSchema);
    const cmd_sandbox_sandboxEnvSetSecretContract_env_set_secret = sandbox.command('env_set_secret').description(`Set a secret (hidden from logs/telemetry).`);
    cmd_sandbox_sandboxEnvSetSecretContract_env_set_secret.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:env_set_secret...' + C.reset);
            const res = await client.api.sandbox.env_set_secret(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxEnvSetSecretContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxEnvSetSecretContract_env_set_secret, Contract_7.sandboxEnvSetSecretContract.inputSchema);
    const cmd_sandbox_sandboxEnvListContract_env_list = sandbox.command('env_list').description(`List all non-secret environment variables.`);
    cmd_sandbox_sandboxEnvListContract_env_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:env_list...' + C.reset);
            const res = await client.api.sandbox.env_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxEnvListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxEnvListContract_env_list, Contract_7.sandboxEnvListContract.inputSchema);
    const cmd_sandbox_sandboxResourceUpdateLimitsContract_resource_update_limits = sandbox.command('resource_update_limits').description(`Update constraints on the active sandbox.`);
    cmd_sandbox_sandboxResourceUpdateLimitsContract_resource_update_limits.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:resource_update_limits...' + C.reset);
            const res = await client.api.sandbox.resource_update_limits(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxResourceUpdateLimitsContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxResourceUpdateLimitsContract_resource_update_limits, Contract_7.sandboxResourceUpdateLimitsContract.inputSchema);
    const cmd_sandbox_sandboxResourceGetStatsContract_resource_get_stats = sandbox.command('resource_get_stats').description(`Fetch current CPU/Memory usage metrics.`);
    cmd_sandbox_sandboxResourceGetStatsContract_resource_get_stats.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:resource_get_stats...' + C.reset);
            const res = await client.api.sandbox.resource_get_stats(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxResourceGetStatsContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxResourceGetStatsContract_resource_get_stats, Contract_7.sandboxResourceGetStatsContract.inputSchema);
    const cmd_sandbox_sandboxStateCommitContract_state_commit = sandbox.command('state_commit').description(`Save current container state as a named image.`);
    cmd_sandbox_sandboxStateCommitContract_state_commit.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:state_commit...' + C.reset);
            const res = await client.api.sandbox.state_commit(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxStateCommitContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxStateCommitContract_state_commit, Contract_7.sandboxStateCommitContract.inputSchema);
    const cmd_sandbox_sandboxStateCloneContract_state_clone = sandbox.command('state_clone').description(`Create a new sandbox from a saved snapshot.`);
    cmd_sandbox_sandboxStateCloneContract_state_clone.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:state_clone...' + C.reset);
            const res = await client.api.sandbox.state_clone(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxStateCloneContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxStateCloneContract_state_clone, Contract_7.sandboxStateCloneContract.inputSchema);
    const cmd_sandbox_sandboxCrud_create_create = sandbox.command('create').description(`CRUD create for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:create...' + C.reset);
            const res = await client.api.sandbox.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_create_create, Contract_7.sandboxCrud['create'].inputSchema);
    const cmd_sandbox_sandboxCrud_find_find = sandbox.command('find').description(`CRUD find for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:find...' + C.reset);
            const res = await client.api.sandbox.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_find_find, Contract_7.sandboxCrud['find'].inputSchema);
    const cmd_sandbox_sandboxCrud_findOne_find_one = sandbox.command('find_one').description(`CRUD findOne for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:find_one...' + C.reset);
            const res = await client.api.sandbox.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_findOne_find_one, Contract_7.sandboxCrud['findOne'].inputSchema);
    const cmd_sandbox_sandboxCrud_count_count = sandbox.command('count').description(`CRUD count for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:count...' + C.reset);
            const res = await client.api.sandbox.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_count_count, Contract_7.sandboxCrud['count'].inputSchema);
    const cmd_sandbox_sandboxCrud_get_get = sandbox.command('get').description(`CRUD get for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:get...' + C.reset);
            const res = await client.api.sandbox.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_get_get, Contract_7.sandboxCrud['get'].inputSchema);
    const cmd_sandbox_sandboxCrud_update_update = sandbox.command('update').description(`CRUD update for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:update...' + C.reset);
            const res = await client.api.sandbox.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_update_update, Contract_7.sandboxCrud['update'].inputSchema);
    const cmd_sandbox_sandboxCrud_delete_delete = sandbox.command('delete').description(`CRUD delete for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:delete...' + C.reset);
            const res = await client.api.sandbox.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_7.sandboxCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_delete_delete, Contract_7.sandboxCrud['delete'].inputSchema);
    const settings = program.command('settings').description('settings tools');
    const cmd_settings_settingsGetContract_get = settings.command('get').description(`Get a configuration value`);
    cmd_settings_settingsGetContract_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing settings:get...' + C.reset);
            const res = await client.api.settings.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_8.settingsGetContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_settings_settingsGetContract_get, Contract_8.settingsGetContract.inputSchema);
    const cmd_settings_settingsUpdateContract_update = settings.command('update').description(`Update a configuration value`);
    cmd_settings_settingsUpdateContract_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing settings:update...' + C.reset);
            const res = await client.api.settings.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_8.settingsUpdateContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_settings_settingsUpdateContract_update, Contract_8.settingsUpdateContract.inputSchema);
    const cmd_settings_settingsGetAllContract_getAll = settings.command('getAll').description(`Get all configuration values`);
    cmd_settings_settingsGetAllContract_getAll.action(async (o) => {
        try {
            console.log(C.dim + 'Executing settings:getAll...' + C.reset);
            const res = await client.api.settings.getAll(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_8.settingsGetAllContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_settings_settingsGetAllContract_getAll, Contract_8.settingsGetAllContract.inputSchema);
}
