import { Command } from 'commander';
import { CastellanClient } from '../client/CastellanClient.js';
import { ZodToCliMapper } from '../../cli/core/ZodToCliMapper.js';
import { C } from '../../cli/core/Utils.js';
import * as Contract_0 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_1 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_2 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_3 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_4 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_5 from '../../addons/settings/skills/settings.contract.js';


export function registerGeneratedCommands(program: Command, client: CastellanClient) {
    const demo = program.command('demo').description('demo tools');
    const cmd_demo_demoHelloContract_hello = demo.command('hello').description(`A simple hello world tool for demonstration.`);
    cmd_demo_demoHelloContract_hello.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:hello...' + C.reset);
            const res = await client.api.demo.hello(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoHelloContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoHelloContract_hello, Contract_0.demoHelloContract.inputSchema);
    const cmd_demo_demoStatusContract_status = demo.command('status').description(`Check the status of the demo environment.`);
    cmd_demo_demoStatusContract_status.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:status...' + C.reset);
            const res = await client.api.demo.status(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoStatusContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoStatusContract_status, Contract_0.demoStatusContract.inputSchema);
    const cmd_demo_demoNotifyContract_notify = demo.command('notify').description(`Send a notification via the system notifications service.`);
    cmd_demo_demoNotifyContract_notify.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:notify...' + C.reset);
            const res = await client.api.demo.notify(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoNotifyContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoNotifyContract_notify, Contract_0.demoNotifyContract.inputSchema);
    const cmd_demo_demoCrud_create_create = demo.command('create').description(`CRUD create for demo (demoCrud)`);
    cmd_demo_demoCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:create...' + C.reset);
            const res = await client.api.demo.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_create_create, Contract_0.demoCrud['create'].inputSchema);
    const cmd_demo_demoCrud_find_find = demo.command('find').description(`CRUD find for demo (demoCrud)`);
    cmd_demo_demoCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:find...' + C.reset);
            const res = await client.api.demo.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_find_find, Contract_0.demoCrud['find'].inputSchema);
    const cmd_demo_demoCrud_findOne_find_one = demo.command('find_one').description(`CRUD findOne for demo (demoCrud)`);
    cmd_demo_demoCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:find_one...' + C.reset);
            const res = await client.api.demo.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_findOne_find_one, Contract_0.demoCrud['findOne'].inputSchema);
    const cmd_demo_demoCrud_count_count = demo.command('count').description(`CRUD count for demo (demoCrud)`);
    cmd_demo_demoCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:count...' + C.reset);
            const res = await client.api.demo.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_count_count, Contract_0.demoCrud['count'].inputSchema);
    const cmd_demo_demoCrud_get_get = demo.command('get').description(`CRUD get for demo (demoCrud)`);
    cmd_demo_demoCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:get...' + C.reset);
            const res = await client.api.demo.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_get_get, Contract_0.demoCrud['get'].inputSchema);
    const cmd_demo_demoCrud_update_update = demo.command('update').description(`CRUD update for demo (demoCrud)`);
    cmd_demo_demoCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:update...' + C.reset);
            const res = await client.api.demo.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_update_update, Contract_0.demoCrud['update'].inputSchema);
    const cmd_demo_demoCrud_delete_delete = demo.command('delete').description(`CRUD delete for demo (demoCrud)`);
    cmd_demo_demoCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing demo:delete...' + C.reset);
            const res = await client.api.demo.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_0.demoCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_delete_delete, Contract_0.demoCrud['delete'].inputSchema);
    const infer = program.command('infer').description('infer tools');
    const cmd_infer_inferChatContract_chat = infer.command('chat').description(`Perform stateful chat completion within a thread.`);
    cmd_infer_inferChatContract_chat.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:chat...' + C.reset);
            const res = await client.api.infer.chat(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.inferChatContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferChatContract_chat, Contract_1.inferChatContract.inputSchema);
    const cmd_infer_inferApproveToolContract_approve_tool = infer.command('approve_tool').description(`Approve a pending tool call for execution.`);
    cmd_infer_inferApproveToolContract_approve_tool.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:approve_tool...' + C.reset);
            const res = await client.api.infer.approve_tool(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.inferApproveToolContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferApproveToolContract_approve_tool, Contract_1.inferApproveToolContract.inputSchema);
    const cmd_infer_inferRefreshInventoryContract_refresh_inventory = infer.command('refresh_inventory').description(`Force a refresh of the model inventory from all registered Ollama instances.`);
    cmd_infer_inferRefreshInventoryContract_refresh_inventory.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:refresh_inventory...' + C.reset);
            const res = await client.api.infer.refresh_inventory(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.inferRefreshInventoryContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferRefreshInventoryContract_refresh_inventory, Contract_1.inferRefreshInventoryContract.inputSchema);
    const cmd_infer_inferAcquireOllamaContract_acquire_ollama = infer.command('acquire_ollama').description(`Atomically acquire the next available online Ollama instance.`);
    cmd_infer_inferAcquireOllamaContract_acquire_ollama.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:acquire_ollama...' + C.reset);
            const res = await client.api.infer.acquire_ollama(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.inferAcquireOllamaContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferAcquireOllamaContract_acquire_ollama, Contract_1.inferAcquireOllamaContract.inputSchema);
    const cmd_infer_inferReleaseOllamaContract_release_ollama = infer.command('release_ollama').description(`Release an acquired Ollama instance, decrementing its active request count.`);
    cmd_infer_inferReleaseOllamaContract_release_ollama.action(async (o) => {
        try {
            console.log(C.dim + 'Executing infer:release_ollama...' + C.reset);
            const res = await client.api.infer.release_ollama(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.inferReleaseOllamaContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_infer_inferReleaseOllamaContract_release_ollama, Contract_1.inferReleaseOllamaContract.inputSchema);
    const ollama = program.command('ollama').description('ollama tools');
    const cmd_ollama_ollamaCrud_create_create = ollama.command('create').description(`CRUD create for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:create...' + C.reset);
            const res = await client.api.ollama.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.ollamaCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_create_create, Contract_1.ollamaCrud['create'].inputSchema);
    const cmd_ollama_ollamaCrud_find_find = ollama.command('find').description(`CRUD find for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:find...' + C.reset);
            const res = await client.api.ollama.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.ollamaCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_find_find, Contract_1.ollamaCrud['find'].inputSchema);
    const cmd_ollama_ollamaCrud_findOne_find_one = ollama.command('find_one').description(`CRUD findOne for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:find_one...' + C.reset);
            const res = await client.api.ollama.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.ollamaCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_findOne_find_one, Contract_1.ollamaCrud['findOne'].inputSchema);
    const cmd_ollama_ollamaCrud_count_count = ollama.command('count').description(`CRUD count for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:count...' + C.reset);
            const res = await client.api.ollama.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.ollamaCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_count_count, Contract_1.ollamaCrud['count'].inputSchema);
    const cmd_ollama_ollamaCrud_get_get = ollama.command('get').description(`CRUD get for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:get...' + C.reset);
            const res = await client.api.ollama.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.ollamaCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_get_get, Contract_1.ollamaCrud['get'].inputSchema);
    const cmd_ollama_ollamaCrud_update_update = ollama.command('update').description(`CRUD update for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:update...' + C.reset);
            const res = await client.api.ollama.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.ollamaCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_update_update, Contract_1.ollamaCrud['update'].inputSchema);
    const cmd_ollama_ollamaCrud_delete_delete = ollama.command('delete').description(`CRUD delete for ollama (ollamaCrud)`);
    cmd_ollama_ollamaCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ollama:delete...' + C.reset);
            const res = await client.api.ollama.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.ollamaCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_ollama_ollamaCrud_delete_delete, Contract_1.ollamaCrud['delete'].inputSchema);
    const models = program.command('models').description('models tools');
    const cmd_models_modelCrud_create_create = models.command('create').description(`CRUD create for models (modelCrud)`);
    cmd_models_modelCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:create...' + C.reset);
            const res = await client.api.models.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.modelCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_create_create, Contract_1.modelCrud['create'].inputSchema);
    const cmd_models_modelCrud_find_find = models.command('find').description(`CRUD find for models (modelCrud)`);
    cmd_models_modelCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:find...' + C.reset);
            const res = await client.api.models.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.modelCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_find_find, Contract_1.modelCrud['find'].inputSchema);
    const cmd_models_modelCrud_findOne_find_one = models.command('find_one').description(`CRUD findOne for models (modelCrud)`);
    cmd_models_modelCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:find_one...' + C.reset);
            const res = await client.api.models.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.modelCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_findOne_find_one, Contract_1.modelCrud['findOne'].inputSchema);
    const cmd_models_modelCrud_count_count = models.command('count').description(`CRUD count for models (modelCrud)`);
    cmd_models_modelCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:count...' + C.reset);
            const res = await client.api.models.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.modelCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_count_count, Contract_1.modelCrud['count'].inputSchema);
    const cmd_models_modelCrud_get_get = models.command('get').description(`CRUD get for models (modelCrud)`);
    cmd_models_modelCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:get...' + C.reset);
            const res = await client.api.models.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.modelCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_get_get, Contract_1.modelCrud['get'].inputSchema);
    const cmd_models_modelCrud_update_update = models.command('update').description(`CRUD update for models (modelCrud)`);
    cmd_models_modelCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:update...' + C.reset);
            const res = await client.api.models.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.modelCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_update_update, Contract_1.modelCrud['update'].inputSchema);
    const cmd_models_modelCrud_delete_delete = models.command('delete').description(`CRUD delete for models (modelCrud)`);
    cmd_models_modelCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing models:delete...' + C.reset);
            const res = await client.api.models.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.modelCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_models_modelCrud_delete_delete, Contract_1.modelCrud['delete'].inputSchema);
    const threads = program.command('threads').description('threads tools');
    const cmd_threads_threadCrud_create_create = threads.command('create').description(`CRUD create for threads (threadCrud)`);
    cmd_threads_threadCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:create...' + C.reset);
            const res = await client.api.threads.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.threadCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_create_create, Contract_1.threadCrud['create'].inputSchema);
    const cmd_threads_threadCrud_find_find = threads.command('find').description(`CRUD find for threads (threadCrud)`);
    cmd_threads_threadCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:find...' + C.reset);
            const res = await client.api.threads.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.threadCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_find_find, Contract_1.threadCrud['find'].inputSchema);
    const cmd_threads_threadCrud_findOne_find_one = threads.command('find_one').description(`CRUD findOne for threads (threadCrud)`);
    cmd_threads_threadCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:find_one...' + C.reset);
            const res = await client.api.threads.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.threadCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_findOne_find_one, Contract_1.threadCrud['findOne'].inputSchema);
    const cmd_threads_threadCrud_count_count = threads.command('count').description(`CRUD count for threads (threadCrud)`);
    cmd_threads_threadCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:count...' + C.reset);
            const res = await client.api.threads.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.threadCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_count_count, Contract_1.threadCrud['count'].inputSchema);
    const cmd_threads_threadCrud_get_get = threads.command('get').description(`CRUD get for threads (threadCrud)`);
    cmd_threads_threadCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:get...' + C.reset);
            const res = await client.api.threads.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.threadCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_get_get, Contract_1.threadCrud['get'].inputSchema);
    const cmd_threads_threadCrud_update_update = threads.command('update').description(`CRUD update for threads (threadCrud)`);
    cmd_threads_threadCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:update...' + C.reset);
            const res = await client.api.threads.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.threadCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_update_update, Contract_1.threadCrud['update'].inputSchema);
    const cmd_threads_threadCrud_delete_delete = threads.command('delete').description(`CRUD delete for threads (threadCrud)`);
    cmd_threads_threadCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing threads:delete...' + C.reset);
            const res = await client.api.threads.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.threadCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_threads_threadCrud_delete_delete, Contract_1.threadCrud['delete'].inputSchema);
    const messages = program.command('messages').description('messages tools');
    const cmd_messages_messageCrud_create_create = messages.command('create').description(`CRUD create for messages (messageCrud)`);
    cmd_messages_messageCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:create...' + C.reset);
            const res = await client.api.messages.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.messageCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_create_create, Contract_1.messageCrud['create'].inputSchema);
    const cmd_messages_messageCrud_find_find = messages.command('find').description(`CRUD find for messages (messageCrud)`);
    cmd_messages_messageCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:find...' + C.reset);
            const res = await client.api.messages.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.messageCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_find_find, Contract_1.messageCrud['find'].inputSchema);
    const cmd_messages_messageCrud_findOne_find_one = messages.command('find_one').description(`CRUD findOne for messages (messageCrud)`);
    cmd_messages_messageCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:find_one...' + C.reset);
            const res = await client.api.messages.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.messageCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_findOne_find_one, Contract_1.messageCrud['findOne'].inputSchema);
    const cmd_messages_messageCrud_count_count = messages.command('count').description(`CRUD count for messages (messageCrud)`);
    cmd_messages_messageCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:count...' + C.reset);
            const res = await client.api.messages.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.messageCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_count_count, Contract_1.messageCrud['count'].inputSchema);
    const cmd_messages_messageCrud_get_get = messages.command('get').description(`CRUD get for messages (messageCrud)`);
    cmd_messages_messageCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:get...' + C.reset);
            const res = await client.api.messages.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.messageCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_get_get, Contract_1.messageCrud['get'].inputSchema);
    const cmd_messages_messageCrud_update_update = messages.command('update').description(`CRUD update for messages (messageCrud)`);
    cmd_messages_messageCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:update...' + C.reset);
            const res = await client.api.messages.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.messageCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_update_update, Contract_1.messageCrud['update'].inputSchema);
    const cmd_messages_messageCrud_delete_delete = messages.command('delete').description(`CRUD delete for messages (messageCrud)`);
    cmd_messages_messageCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing messages:delete...' + C.reset);
            const res = await client.api.messages.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.messageCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_messages_messageCrud_delete_delete, Contract_1.messageCrud['delete'].inputSchema);
    const tool_calls = program.command('tool_calls').description('tool_calls tools');
    const cmd_tool_calls_toolCallCrud_create_create = tool_calls.command('create').description(`CRUD create for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:create...' + C.reset);
            const res = await client.api.tool_calls.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.toolCallCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_create_create, Contract_1.toolCallCrud['create'].inputSchema);
    const cmd_tool_calls_toolCallCrud_find_find = tool_calls.command('find').description(`CRUD find for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:find...' + C.reset);
            const res = await client.api.tool_calls.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.toolCallCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_find_find, Contract_1.toolCallCrud['find'].inputSchema);
    const cmd_tool_calls_toolCallCrud_findOne_find_one = tool_calls.command('find_one').description(`CRUD findOne for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:find_one...' + C.reset);
            const res = await client.api.tool_calls.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.toolCallCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_findOne_find_one, Contract_1.toolCallCrud['findOne'].inputSchema);
    const cmd_tool_calls_toolCallCrud_count_count = tool_calls.command('count').description(`CRUD count for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:count...' + C.reset);
            const res = await client.api.tool_calls.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.toolCallCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_count_count, Contract_1.toolCallCrud['count'].inputSchema);
    const cmd_tool_calls_toolCallCrud_get_get = tool_calls.command('get').description(`CRUD get for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:get...' + C.reset);
            const res = await client.api.tool_calls.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.toolCallCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_get_get, Contract_1.toolCallCrud['get'].inputSchema);
    const cmd_tool_calls_toolCallCrud_update_update = tool_calls.command('update').description(`CRUD update for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:update...' + C.reset);
            const res = await client.api.tool_calls.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.toolCallCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_update_update, Contract_1.toolCallCrud['update'].inputSchema);
    const cmd_tool_calls_toolCallCrud_delete_delete = tool_calls.command('delete').description(`CRUD delete for tool_calls (toolCallCrud)`);
    cmd_tool_calls_toolCallCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing tool_calls:delete...' + C.reset);
            const res = await client.api.tool_calls.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_1.toolCallCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_tool_calls_toolCallCrud_delete_delete, Contract_1.toolCallCrud['delete'].inputSchema);
    const marketplace = program.command('marketplace').description('marketplace tools');
    const cmd_marketplace_marketplaceListContract_list = marketplace.command('list').description(`List available and installed addons`);
    cmd_marketplace_marketplaceListContract_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing marketplace:list...' + C.reset);
            const res = await client.api.marketplace.list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.marketplaceListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_marketplace_marketplaceListContract_list, Contract_2.marketplaceListContract.inputSchema);
    const cmd_marketplace_marketplaceInstallContract_install = marketplace.command('install').description(`Install an addon`);
    cmd_marketplace_marketplaceInstallContract_install.action(async (o) => {
        try {
            console.log(C.dim + 'Executing marketplace:install...' + C.reset);
            const res = await client.api.marketplace.install(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_2.marketplaceInstallContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_marketplace_marketplaceInstallContract_install, Contract_2.marketplaceInstallContract.inputSchema);
    const notifications = program.command('notifications').description('notifications tools');
    const cmd_notifications_notificationsSendContract_send = notifications.command('send').description(`Trigger a new system notification`);
    cmd_notifications_notificationsSendContract_send.action(async (o) => {
        try {
            console.log(C.dim + 'Executing notifications:send...' + C.reset);
            const res = await client.api.notifications.send(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.notificationsSendContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_notifications_notificationsSendContract_send, Contract_3.notificationsSendContract.inputSchema);
    const cmd_notifications_notificationsListContract_list = notifications.command('list').description(`List recent notifications`);
    cmd_notifications_notificationsListContract_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing notifications:list...' + C.reset);
            const res = await client.api.notifications.list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_3.notificationsListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_notifications_notificationsListContract_list, Contract_3.notificationsListContract.inputSchema);
    const sandbox = program.command('sandbox').description('sandbox tools');
    const cmd_sandbox_sandboxSetActiveContract_set_active = sandbox.command('set_active').description(`Step into a specific sandbox. All subsequent FS and Terminal tools will target this sandbox.`);
    cmd_sandbox_sandboxSetActiveContract_set_active.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:set_active...' + C.reset);
            const res = await client.api.sandbox.set_active(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxSetActiveContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxSetActiveContract_set_active, Contract_4.sandboxSetActiveContract.inputSchema);
    const cmd_sandbox_sandboxPruneContract_prune = sandbox.command('prune').description(`Clean up stale or stopped sandbox containers running on the Docker host.`);
    cmd_sandbox_sandboxPruneContract_prune.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:prune...' + C.reset);
            const res = await client.api.sandbox.prune(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxPruneContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxPruneContract_prune, Contract_4.sandboxPruneContract.inputSchema);
    const cmd_sandbox_sandboxFsReadContract_fs_read = sandbox.command('fs_read').description(`Read a file from the current sandbox.`);
    cmd_sandbox_sandboxFsReadContract_fs_read.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_read...' + C.reset);
            const res = await client.api.sandbox.fs_read(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxFsReadContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsReadContract_fs_read, Contract_4.sandboxFsReadContract.inputSchema);
    const cmd_sandbox_sandboxFsWriteContract_fs_write = sandbox.command('fs_write').description(`Write a file to the current sandbox.`);
    cmd_sandbox_sandboxFsWriteContract_fs_write.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_write...' + C.reset);
            const res = await client.api.sandbox.fs_write(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxFsWriteContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsWriteContract_fs_write, Contract_4.sandboxFsWriteContract.inputSchema);
    const cmd_sandbox_sandboxFsListContract_fs_list = sandbox.command('fs_list').description(`List contents of a directory in the current sandbox.`);
    cmd_sandbox_sandboxFsListContract_fs_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_list...' + C.reset);
            const res = await client.api.sandbox.fs_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxFsListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsListContract_fs_list, Contract_4.sandboxFsListContract.inputSchema);
    const cmd_sandbox_sandboxFsPatchContract_fs_patch = sandbox.command('fs_patch').description(`Apply targeted changes to a file in the current sandbox.`);
    cmd_sandbox_sandboxFsPatchContract_fs_patch.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_patch...' + C.reset);
            const res = await client.api.sandbox.fs_patch(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxFsPatchContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsPatchContract_fs_patch, Contract_4.sandboxFsPatchContract.inputSchema);
    const cmd_sandbox_sandboxFsRemoveContract_fs_remove = sandbox.command('fs_remove').description(`Remove a file or directory from the current sandbox.`);
    cmd_sandbox_sandboxFsRemoveContract_fs_remove.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_remove...' + C.reset);
            const res = await client.api.sandbox.fs_remove(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxFsRemoveContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsRemoveContract_fs_remove, Contract_4.sandboxFsRemoveContract.inputSchema);
    const cmd_sandbox_sandboxFsMkdirContract_fs_mkdir = sandbox.command('fs_mkdir').description(`Create a new directory in the current sandbox.`);
    cmd_sandbox_sandboxFsMkdirContract_fs_mkdir.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_mkdir...' + C.reset);
            const res = await client.api.sandbox.fs_mkdir(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxFsMkdirContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsMkdirContract_fs_mkdir, Contract_4.sandboxFsMkdirContract.inputSchema);
    const cmd_sandbox_sandboxFsMoveContract_fs_move = sandbox.command('fs_move').description(`Move or rename a file/directory in the current sandbox.`);
    cmd_sandbox_sandboxFsMoveContract_fs_move.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:fs_move...' + C.reset);
            const res = await client.api.sandbox.fs_move(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxFsMoveContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxFsMoveContract_fs_move, Contract_4.sandboxFsMoveContract.inputSchema);
    const cmd_sandbox_sandboxTerminalExecuteContract_terminal_execute = sandbox.command('terminal_execute').description(`Execute a short-lived command in the current sandbox.`);
    cmd_sandbox_sandboxTerminalExecuteContract_terminal_execute.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_execute...' + C.reset);
            const res = await client.api.sandbox.terminal_execute(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalExecuteContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalExecuteContract_terminal_execute, Contract_4.sandboxTerminalExecuteContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSpawnContract_terminal_spawn = sandbox.command('terminal_spawn').description(`Spawn a background service in the current sandbox.`);
    cmd_sandbox_sandboxTerminalSpawnContract_terminal_spawn.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_spawn...' + C.reset);
            const res = await client.api.sandbox.terminal_spawn(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalSpawnContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSpawnContract_terminal_spawn, Contract_4.sandboxTerminalSpawnContract.inputSchema);
    const cmd_sandbox_sandboxTerminalListContract_terminal_list = sandbox.command('terminal_list').description(`List all background services running in the current sandbox.`);
    cmd_sandbox_sandboxTerminalListContract_terminal_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_list...' + C.reset);
            const res = await client.api.sandbox.terminal_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalListContract_terminal_list, Contract_4.sandboxTerminalListContract.inputSchema);
    const cmd_sandbox_sandboxTerminalKillContract_terminal_kill = sandbox.command('terminal_kill').description(`Kill a background service in the current sandbox.`);
    cmd_sandbox_sandboxTerminalKillContract_terminal_kill.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_kill...' + C.reset);
            const res = await client.api.sandbox.terminal_kill(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalKillContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalKillContract_terminal_kill, Contract_4.sandboxTerminalKillContract.inputSchema);
    const cmd_sandbox_sandboxTerminalLogsContract_terminal_logs = sandbox.command('terminal_logs').description(`Get logs for a background service in the current sandbox.`);
    cmd_sandbox_sandboxTerminalLogsContract_terminal_logs.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_logs...' + C.reset);
            const res = await client.api.sandbox.terminal_logs(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalLogsContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalLogsContract_terminal_logs, Contract_4.sandboxTerminalLogsContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionOpenContract_terminal_session_open = sandbox.command('terminal_session_open').description(`Open a persistent PTY session (e.g. bash) in the current sandbox.`);
    cmd_sandbox_sandboxTerminalSessionOpenContract_terminal_session_open.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_open...' + C.reset);
            const res = await client.api.sandbox.terminal_session_open(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalSessionOpenContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionOpenContract_terminal_session_open, Contract_4.sandboxTerminalSessionOpenContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionListContract_terminal_session_list = sandbox.command('terminal_session_list').description(`List all active PTY sessions in the current sandbox.`);
    cmd_sandbox_sandboxTerminalSessionListContract_terminal_session_list.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_list...' + C.reset);
            const res = await client.api.sandbox.terminal_session_list(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalSessionListContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionListContract_terminal_session_list, Contract_4.sandboxTerminalSessionListContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionWriteContract_terminal_session_write = sandbox.command('terminal_session_write').description(`Write data to a PTY session stdin.`);
    cmd_sandbox_sandboxTerminalSessionWriteContract_terminal_session_write.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_write...' + C.reset);
            const res = await client.api.sandbox.terminal_session_write(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalSessionWriteContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionWriteContract_terminal_session_write, Contract_4.sandboxTerminalSessionWriteContract.inputSchema);
    const cmd_sandbox_sandboxTerminalSessionResizeContract_terminal_session_resize = sandbox.command('terminal_session_resize').description(`Resize a PTY session window.`);
    cmd_sandbox_sandboxTerminalSessionResizeContract_terminal_session_resize.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:terminal_session_resize...' + C.reset);
            const res = await client.api.sandbox.terminal_session_resize(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxTerminalSessionResizeContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxTerminalSessionResizeContract_terminal_session_resize, Contract_4.sandboxTerminalSessionResizeContract.inputSchema);
    const cmd_sandbox_sandboxCrud_create_create = sandbox.command('create').description(`CRUD create for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_create_create.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:create...' + C.reset);
            const res = await client.api.sandbox.create(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxCrud['create'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_create_create, Contract_4.sandboxCrud['create'].inputSchema);
    const cmd_sandbox_sandboxCrud_find_find = sandbox.command('find').description(`CRUD find for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_find_find.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:find...' + C.reset);
            const res = await client.api.sandbox.find(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxCrud['find'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_find_find, Contract_4.sandboxCrud['find'].inputSchema);
    const cmd_sandbox_sandboxCrud_findOne_find_one = sandbox.command('find_one').description(`CRUD findOne for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_findOne_find_one.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:find_one...' + C.reset);
            const res = await client.api.sandbox.find_one(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxCrud['findOne'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_findOne_find_one, Contract_4.sandboxCrud['findOne'].inputSchema);
    const cmd_sandbox_sandboxCrud_count_count = sandbox.command('count').description(`CRUD count for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_count_count.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:count...' + C.reset);
            const res = await client.api.sandbox.count(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxCrud['count'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_count_count, Contract_4.sandboxCrud['count'].inputSchema);
    const cmd_sandbox_sandboxCrud_get_get = sandbox.command('get').description(`CRUD get for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_get_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:get...' + C.reset);
            const res = await client.api.sandbox.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxCrud['get'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_get_get, Contract_4.sandboxCrud['get'].inputSchema);
    const cmd_sandbox_sandboxCrud_update_update = sandbox.command('update').description(`CRUD update for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_update_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:update...' + C.reset);
            const res = await client.api.sandbox.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxCrud['update'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_update_update, Contract_4.sandboxCrud['update'].inputSchema);
    const cmd_sandbox_sandboxCrud_delete_delete = sandbox.command('delete').description(`CRUD delete for sandbox (sandboxCrud)`);
    cmd_sandbox_sandboxCrud_delete_delete.action(async (o) => {
        try {
            console.log(C.dim + 'Executing sandbox:delete...' + C.reset);
            const res = await client.api.sandbox.delete(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_4.sandboxCrud['delete'].inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_sandbox_sandboxCrud_delete_delete, Contract_4.sandboxCrud['delete'].inputSchema);
    const settings = program.command('settings').description('settings tools');
    const cmd_settings_settingsGetContract_get = settings.command('get').description(`Get a configuration value`);
    cmd_settings_settingsGetContract_get.action(async (o) => {
        try {
            console.log(C.dim + 'Executing settings:get...' + C.reset);
            const res = await client.api.settings.get(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_5.settingsGetContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_settings_settingsGetContract_get, Contract_5.settingsGetContract.inputSchema);
    const cmd_settings_settingsUpdateContract_update = settings.command('update').description(`Update a configuration value`);
    cmd_settings_settingsUpdateContract_update.action(async (o) => {
        try {
            console.log(C.dim + 'Executing settings:update...' + C.reset);
            const res = await client.api.settings.update(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_5.settingsUpdateContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_settings_settingsUpdateContract_update, Contract_5.settingsUpdateContract.inputSchema);
    const cmd_settings_settingsGetAllContract_getAll = settings.command('getAll').description(`Get all configuration values`);
    cmd_settings_settingsGetAllContract_getAll.action(async (o) => {
        try {
            console.log(C.dim + 'Executing settings:getAll...' + C.reset);
            const res = await client.api.settings.getAll(ZodToCliMapper.parseOptions(o as Record<string, unknown>, Contract_5.settingsGetAllContract.inputSchema));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_settings_settingsGetAllContract_getAll, Contract_5.settingsGetAllContract.inputSchema);
}
