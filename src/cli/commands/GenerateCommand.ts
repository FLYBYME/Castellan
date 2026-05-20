import { Command } from 'commander';
import { BaseCommand } from '../core/BaseCommand.js';
import { Bundler } from '../core/Bundler.js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ContractDiscovery {
    exportName: string;
    domain: string;
    action: string;
    description: string;
    method: string;
    path: string;
    isStream: boolean;
}

/**
 * GenerateCommand: Consolidated Artifact Generator.
 */
export class GenerateCommand extends BaseCommand {
    public readonly name = 'generate';
    public readonly description = 'Generate strictly-typed artifacts (SDK, CLI, Context API) and bundle UI/Addons using esbuild.';
    public readonly category = 'System Tools';

    private readonly artifactRoot = path.resolve('./src/generated');
    private readonly bundleRoot = path.resolve('./dist');

    public register(program: Command): void {
        program
            .command(this.name)
            .description(this.description)
            .option('--skip-tsc', 'Skip the TypeScript compiler diagnostics check')
            .action(async (options: { skipTsc?: boolean }) => {
                await this.execute(options);
            });
    }

    protected async execute(options: { skipTsc?: boolean } = {}): Promise<void> {
        console.log('--- Generating Castellan Artifacts ---');
        const start = Date.now();

        [this.artifactRoot, this.bundleRoot].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        const { discovery, files } = this.discoverContracts();

        await this.generateApiInterface(discovery, files);
        await this.generateContextApi(discovery, files);
        await this.generateSDK(discovery, files);
        await this.generateCLI(discovery, files);

        console.log('\n--- Bundling UI and Extensions ---');
        await this.bundleCore();
        await this.bundleAddons();

        console.log('\n--- Generation Complete ---');

        if (!options.skipTsc) {
            console.log('\n--- Running TypeScript compiler ---');
            try {
                execSync('npx tsc --noEmit', { stdio: 'inherit' });
            } catch (err) {
                console.error('✔ Diagnostics complete (errors found).');
            }
        } else {
            console.log('\n--- Skipping TypeScript diagnostics (requested) ---');
        }

        const end = Date.now();
        console.log(`Generation completed in ${(end - start) / 1000} seconds`);
    }

    private async bundleCore(): Promise<void> {
        console.log('Bundling Core UI...');
        const clientDir = path.resolve('./src/client');
        const outDir = path.join(this.bundleRoot, 'client');

        await Bundler.bundleCoreUI(path.join(clientDir, 'index.ts'), outDir);
        Bundler.copyAssets(clientDir, outDir);
        console.log('✔ Core UI bundled.');
    }

    private async bundleAddons(): Promise<void> {
        console.log('Bundling Addons...');
        const addonsDir = path.resolve('./src/addons');
        const outDir = path.join(this.bundleRoot, 'extensions');
        const manifestPath = path.join(outDir, 'manifest.json');

        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const addonNames = fs.readdirSync(addonsDir).filter(name => {
            const fullPath = path.join(addonsDir, name);
            return fs.statSync(fullPath).isDirectory();
        });

        const masterManifest: any[] = [];

        for (const name of addonNames) {
            const addonDir = path.join(addonsDir, name);
            const jsonPath = path.join(addonDir, 'addon.json');
            const extensionEntry = path.join(addonDir, 'extension', 'index.ts');

            if (fs.existsSync(jsonPath) && fs.existsSync(extensionEntry)) {
                console.log(`  Bundling extension: ${name}...`);

                // 1. Bundle the JS
                await Bundler.bundleExtension(extensionEntry, outDir, name);

                // 2. Read the JSON and add it to the master list
                const addonMetadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
                addonMetadata.entry = `${name}.bundle.js`; // Tell the client where the code is
                masterManifest.push(addonMetadata);
            }
        }

        fs.writeFileSync(manifestPath, JSON.stringify(masterManifest, null, 2));
        console.log('✔ Addons bundled.');
    }

    private async generateApiInterface(discovery: ContractDiscovery[], files: Record<string, string[]>): Promise<void> {
        console.log('Generating ICastellanApi interface...');
        const filePath = path.join(this.artifactRoot, 'api.ts');
        const aliasMap = this.getAliasMap(files, this.artifactRoot);

        let code = `import { z } from 'zod';\n`;
        code += `import { ICastellanApi } from '../core/api.js';\n`;
        Object.values(aliasMap).forEach(m => {
            code += `import * as ${m.alias} from '${m.path}';\n`;
        });

        code += `\ndeclare module '../core/api.js' {\n`;
        code += `    interface ICastellanApi {\n`;

        const byDomain: Record<string, ContractDiscovery[]> = {};
        discovery.forEach(d => {
            if (!byDomain[d.domain]) byDomain[d.domain] = [];
            byDomain[d.domain].push(d);
        });

        for (const [domain, methods] of Object.entries(byDomain)) {
            code += `        readonly ${domain}: {\n`;
            const domainFiles = files[domain];
            if (!domainFiles || domainFiles.length === 0) continue;
            const alias = aliasMap[domainFiles[0]!]?.alias;
            if (!alias) continue;

            for (const m of methods) {
                let inputType = 'unknown', outputType = 'unknown';

                if (m.exportName.includes('.')) {
                    const [c, k] = m.exportName.split('.');
                    inputType = `z.input<typeof ${alias}.${c}['${k}']['inputSchema']>`;
                    outputType = `z.infer<typeof ${alias}.${c}['${k}']['outputSchema']>`;
                } else {
                    inputType = `z.input<typeof ${alias}.${m.exportName}['inputSchema']>`;
                    outputType = `z.infer<typeof ${alias}.${m.exportName}['outputSchema']>`;
                }

                const retType = m.isStream ? `AsyncIterable<${outputType}>` : `Promise<${outputType}>`;
                code += `            /** ${m.description} */\n`;
                code += `            readonly ${m.action}: (args: ${inputType}) => ${retType};\n`;
            }
            code += `        };\n`;
        }

        code += `    }\n}\n`;
        code += `\nexport { ICastellanApi };\n`;
        fs.writeFileSync(filePath, code);
    }

    private async generateContextApi(discovery: ContractDiscovery[], files: Record<string, string[]>): Promise<void> {
        console.log('Generating ContextApi implementation...');
        const outDir = path.join(this.artifactRoot, 'server');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const filePath = path.join(outDir, 'ContextApi.ts');

        const aliasMap = this.getAliasMap(files, outDir);

        let code = `import { z } from 'zod';\n`;
        code += `import { ICastellanApi } from '../api.js';\n`;
        code += `import { ISkillContext } from '@castellan/core/index.js';\n`;
        code += `import { ToolExecutor } from '@castellan/engine/core/ToolExecutor.js';\n`;
        Object.values(aliasMap).forEach(m => {
            code += `import * as ${m.alias} from '${m.path}';\n`;
        });

        code += `\nexport class ContextApi implements ICastellanApi {\n`;
        code += `    constructor(private executor: ToolExecutor<ContextApi>, private context: ISkillContext<ContextApi>) {}\n\n`;

        const byDomain: Record<string, ContractDiscovery[]> = {};
        discovery.forEach(d => {
            if (!byDomain[d.domain]) byDomain[d.domain] = [];
            byDomain[d.domain].push(d);
        });

        for (const [domain, methods] of Object.entries(byDomain)) {
            code += `    public readonly ${domain} = {\n`;
            const domainFiles = files[domain];
            if (!domainFiles || domainFiles.length === 0) continue;
            const alias = aliasMap[domainFiles[0]!]?.alias;
            if (!alias) continue;

            for (const m of methods) {
                let inputType = 'unknown', outputType = 'unknown';

                if (m.exportName.includes('.')) {
                    const [c, k] = m.exportName.split('.');
                    inputType = `z.input<typeof ${alias}.${c}['${k}']['inputSchema']>`;
                    outputType = `z.infer<typeof ${alias}.${c}['${k}']['outputSchema']>`;
                } else {
                    inputType = `z.input<typeof ${alias}.${m.exportName}['inputSchema']>`;
                    outputType = `z.infer<typeof ${alias}.${m.exportName}['outputSchema']>`;
                }

                const execMethod = m.isStream ? 'executeStream' : 'execute';
                code += `        ${m.action}: (args: ${inputType}): ${m.isStream ? 'AsyncIterable' : 'Promise'}<${outputType}> => \n`;
                code += `            this.executor.${execMethod}<${outputType}>('${domain}', '${m.action}', args, this.context),\n`;
            }
            code += `    };\n`;
        }

        code += `}\n`;
        fs.writeFileSync(filePath, code);
    }

    private async generateSDK(discovery: ContractDiscovery[], files: Record<string, string[]>): Promise<void> {
        console.log('Generating SDK Client...');
        const outDir = path.join(this.artifactRoot, 'client');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const filePath = path.join(outDir, 'CastellanClient.ts');

        const aliasMap = this.getAliasMap(files, outDir);

        let code = `import { z } from 'zod';\n`;
        code += `import { BaseClient } from '@castellan/core/index.js';\n`;
        Object.values(aliasMap).forEach(m => {
            code += `import * as ${m.alias} from '${m.path}';\n`;
        });

        code += `\nexport class CastellanClient extends BaseClient {\n`;
        code += `    protected async getWebSocket(): Promise<any> {\n`;
        code += `        const getWsState = (ws: any) => {\n`;
        code += `            if (!ws) return 3; // CLOSED\n`;
        code += `            return typeof ws.readyState !== 'undefined' ? ws.readyState : (ws as any).status;\n`;
        code += `        };\n`;
        code += `        const state = getWsState(this.socket);\n`;
        code += `        if (this.socket && state === 1) return this.socket; // 1 = OPEN\n`;
        code += `        if (this.connectingPromise && (state === 0 || state === 1)) return this.connectingPromise; // 0 = CONNECTING\n`;
        code += `        \n`;
        code += `        this.connectingPromise = new Promise(async (resolve, reject) => {\n`;
        code += `            try {\n`;
        code += `                const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;\n`;
        code += `                const WS = isNode ? (await import('ws')).default : WebSocket;\n`;
        code += `                let url = this.serverUrl.replace(/^http/, 'ws');\n`;
        code += `                if (!url.endsWith('/ws')) url += '/ws';\n`;
        code += `                if (this.sandboxId) url += \`?sandboxId=\${this.sandboxId}\`;\n`;
        code += `                const ws = new (WS as any)(url);\n`;
        code += `                const cleanup = () => { this.connectingPromise = null; };\n`;
        code += `                let resolved = false;\n`;
        code += `                const onOpen = () => { resolved = true; this.socket = ws; cleanup(); resolve(ws); };\n`;
        code += `                const onMessage = (e: any) => this.handleIncomingMessage(isNode ? e : e.data);\n`;
        code += `                const onError = (e: any) => { cleanup(); reject(e); };\n`;
        code += `                const onClose = () => { this.socket = null; cleanup(); if (!resolved) reject(new Error('WebSocket closed before connection could be established')); };\n`;
        code += `                if (isNode) { ws.on('open', onOpen); ws.on('message', onMessage); ws.on('error', onError); ws.on('close', onClose); }\n`;
        code += `                else { ws.onopen = onOpen; ws.onmessage = onMessage; ws.onerror = onError; ws.onclose = onClose; }\n`;
        code += `            } catch (err) { this.connectingPromise = null; reject(err); }\n`;
        code += `        });\n`;
        code += `        return this.connectingPromise;\n`;
        code += `    }\n\n`;
        code += `    protected send(ws: any, payload: any): void {\n`;
        code += `        ws.send(JSON.stringify(payload));\n`;
        code += `    }\n\n`;
        code += `    public async connect(): Promise<void> { await this.getWebSocket(); }\n\n`;
        code += `    public close(): void { if (this.socket) { (this.socket as any).close(); this.socket = null; } }\n\n`;
        code += `    public readonly api = {\n`;

        const byDomain: Record<string, ContractDiscovery[]> = {};
        discovery.forEach(d => {
            if (!byDomain[d.domain]) byDomain[d.domain] = [];
            byDomain[d.domain].push(d);
        });

        for (const [domain, methods] of Object.entries(byDomain)) {
            code += `        ${domain}: {\n`;
            for (const m of methods) {
                const alias = aliasMap[files[domain]![0]]!.alias;
                let inputType = 'unknown', outputType = 'unknown', outputSchema = 'unknown';

                if (m.exportName.includes('.')) {
                    const [c, k] = m.exportName.split('.');
                    inputType = `z.input<typeof ${alias}.${c}['${k}']['inputSchema']>`;
                    outputType = `z.infer<typeof ${alias}.${c}['${k}']['outputSchema']>`;
                    outputSchema = `${alias}.${c}['${k}'].outputSchema`;
                } else {
                    inputType = `z.input<typeof ${alias}.${m.exportName}['inputSchema']>`;
                    outputType = `z.infer<typeof ${alias}.${m.exportName}['outputSchema']>`;
                    outputSchema = `${alias}.${m.exportName}.outputSchema`;
                }

                const toolKey = `${domain}_${m.action}`;
                const method = m.isStream ? 'stream' : 'request';

                code += `            ${m.action}: (args: ${inputType}): ${m.isStream ? 'AsyncIterable' : 'Promise'}<${outputType}> => \n`;
                code += `                this.${method}<${outputType}>('${toolKey}', args, ${outputSchema}),\n`;
            }
            code += `        },\n`;
        }
        code += `    };\n}\n`;
        fs.writeFileSync(filePath, code);
        console.log('✔ SDK Client generated.');
    }

    private async generateCLI(discovery: ContractDiscovery[], files: Record<string, string[]>): Promise<void> {
        console.log('Generating V2 CLI Command Tree...');
        const outDir = path.join(this.artifactRoot, 'cli');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const filePath = path.join(outDir, 'ToolCommands.ts');

        const aliasMap = this.getAliasMap(files, outDir);

        let importBlock = '';
        Object.values(aliasMap).forEach(m => {
            importBlock += `import * as ${m.alias} from '${m.path}';\n`;
        });

        let code = `import { Command } from 'commander';
import { CastellanClient } from '../client/CastellanClient.js';
import { ZodToCliMapper } from '../../cli/core/ZodToCliMapper.js';
import { C } from '../../cli/core/Utils.js';
${importBlock}

export function registerGeneratedCommands(program: Command, client: CastellanClient) {
`;

        const byDomain: Record<string, ContractDiscovery[]> = {};
        discovery.forEach(d => {
            if (!byDomain[d.domain]) byDomain[d.domain] = [];
            byDomain[d.domain].push(d);
        });

        for (const [domain, methods] of Object.entries(byDomain)) {
            code += `    const ${domain} = program.command('${domain}').description('${domain} tools');\n`;
            for (const m of methods) {
                const alias = aliasMap[files[domain]![0]]!.alias;
                let inputSchema = '';
                if (m.exportName.includes('.')) {
                    const [c, k] = m.exportName.split('.');
                    inputSchema = `${alias}.${c}['${k}'].inputSchema`;
                } else {
                    inputSchema = `${alias}.${m.exportName}.inputSchema`;
                }

                const safeVarName = `${domain}_${m.exportName}_${m.action}`.replace(/[^a-zA-Z0-9_]/g, '_');
                code += `    const cmd_${safeVarName} = ${domain}.command('${m.action}').description(\`${m.description}\`);
    cmd_${safeVarName}.action(async (o) => {
        try {
            console.log(C.dim + 'Executing ${domain}:${m.action}...' + C.reset);
            const res = await client.api.${domain}.${m.action}(ZodToCliMapper.parseOptions(o as Record<string, unknown>, ${inputSchema}));
            console.log(JSON.stringify(res, null, 2));
            client.close();
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_${safeVarName}, ${inputSchema});\n`;
            }
        }
        code += `}\n`;
        fs.writeFileSync(filePath, code);
        console.log('✔ CLI Tree generated.');
    }

    private discoverContracts(): { discovery: ContractDiscovery[], files: Record<string, string[]> } {
        const addonsDir = path.resolve('./src/addons');
        const allContracts: ContractDiscovery[] = [];
        const domainFiles: Record<string, string[]> = {};

        if (!fs.existsSync(addonsDir)) return { discovery: [], files: {} };

        const files = this.walkDir(addonsDir).filter(f => f.endsWith('.contract.ts'));

        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');

            // 1. Find defineContract calls
            const contractMatches = content.matchAll(/export\s+const\s+(\w+)\s*=\s*defineContract\(\{([\s\S]*?)\}\);/g);
            for (const match of contractMatches) {
                const exportName = match[1]!;
                const body = match[2]!;

                const domainMatch = /\bdomain:\s*['"]([^'"]+)['"]/.exec(body);
                const actionMatch = /\baction:\s*['"]([^'"]+)['"]/.exec(body);
                const descMatch = /\bdescription:\s*['"]([^'"]+)['"]/.exec(body) || /\bdescription:\s*`([\s\S]*?)`/.exec(body);
                const restMatch = /\brest:\s*\{([\s\S]*?)\}/.exec(body);

                let method = 'POST';
                let pathStr = '/';
                let isStream = false;

                if (restMatch) {
                    const restBody = restMatch[1]!;
                    const m = /\bmethod:\s*['"]([^'"]+)['"]/.exec(restBody);
                    const p = /\bpath:\s*['"]([^'"]+)['"]/.exec(restBody);
                    const s = /\bisStream:\s*(true|false)/.exec(restBody);
                    if (m) method = m[1]!;
                    if (p) pathStr = p[1]!;
                    if (s) isStream = s[1] === 'true';
                }

                if (domainMatch && actionMatch) {
                    const domain = domainMatch[1]!;
                    if (!domainFiles[domain]) domainFiles[domain] = [];
                    if (!domainFiles[domain].includes(file)) domainFiles[domain].push(file);

                    allContracts.push({
                        exportName,
                        domain,
                        action: actionMatch[1]!,
                        description: descMatch ? (descMatch[1] || descMatch[2] || '') : '',
                        method,
                        path: pathStr,
                        isStream
                    });
                }
            }

            // 2. Find defineCrud calls
            const crudMatches = content.matchAll(/export\s+const\s+(\w+)\s*=\s*defineCrud\(\s*['"]([^'"]+)['"]\s*,\s*(\w+)/g);
            for (const match of crudMatches) {
                const exportName = match[1]!;
                const domain = match[2]!;
                const schemaName = match[3]!;

                // Statically validate if the schema contains an 'id' field definition
                const importRegex = new RegExp(`import\\s+\\{[^}]*\\b${schemaName}\\b[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`);
                const importMatch = importRegex.exec(content);
                if (importMatch) {
                    const relativePath = importMatch[1]!.replace(/\.js$/, '.ts');
                    const schemaFilePath = path.resolve(path.dirname(file), relativePath);
                    if (fs.existsSync(schemaFilePath)) {
                        const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');
                        const schemaDefRegex = new RegExp(`export\\s+const\\s+${schemaName}\\s*=\\s*z\\.object\\(\\{([\\s\\S]*?)\\}\\)`);
                        const schemaDefMatch = schemaDefRegex.exec(schemaContent);
                        if (schemaDefMatch) {
                            const propertiesBody = schemaDefMatch[1]!;
                            const hasId = /\bid\s*:/i.test(propertiesBody);
                            if (hasId) {
                                throw new Error(`defineCrud Error: The ID field "id" must NOT be defined in the Zod baseSchema shape for domain "${domain}" in schema "${schemaName}". Document IDs are handled automatically by the database layer.`);
                            }
                        }
                    }
                }

                const actions = {
                    create: 'create',
                    find: 'find',
                    findOne: 'find_one',
                    count: 'count',
                    get: 'get',
                    update: 'update',
                    delete: 'delete'
                };

                const crudStart = content.indexOf(`export const ${exportName}`);
                const crudEnd = content.indexOf(');', crudStart);
                const fullCrudCall = content.substring(crudStart, crudEnd);

                const optionsMatch = /defineCrud\s*\(\s*['"][^'"]+['"]\s*,\s*[^,]+\s*,\s*(\{[\s\S]*\})\s*$/.exec(fullCrudCall);
                const optionsBody = optionsMatch ? optionsMatch[1]! : '';

                let plural = `${domain}s`;
                let idField = 'id';

                if (optionsBody) {
                    const pluralMatch = /\bpluralPath:\s*['"]([^'"]+)['"]/.exec(optionsBody);
                    const idMatch = /\bidField:\s*['"]([^'"]+)['"]/.exec(optionsBody);
                    if (pluralMatch) plural = pluralMatch[1]!;
                    if (idMatch) idField = idMatch[1]!;

                    const actionsMatch = /\bactions:\s*\{([\s\S]*?)\}/.exec(optionsBody);
                    if (actionsMatch) {
                        const ab = actionsMatch[1]!;
                        ['create', 'list', 'count', 'get', 'update', 'delete'].forEach(a => {
                            const m = new RegExp(`\\b${a}:\\s*['"]([^'"]+)['"]`).exec(ab);
                            if (m) (actions as Record<string, string>)[a] = m[1]!;
                        });
                    }
                }

                if (!domainFiles[domain]) domainFiles[domain] = [];
                if (!domainFiles[domain].includes(file)) domainFiles[domain].push(file);

                Object.entries(actions).forEach(([key, action]) => {
                    const m: Record<string, { method: string, path: string }> = {
                        create: { method: 'POST', path: `/${plural}` },
                        find: { method: 'GET', path: `/${plural}/all` },
                        findOne: { method: 'GET', path: `/${plural}/one` },
                        count: { method: 'GET', path: `/${plural}/count` },
                        get: { method: 'GET', path: `/${plural}/:${idField}` },
                        update: { method: 'PATCH', path: `/${plural}/:${idField}` },
                        delete: { method: 'DELETE', path: `/${plural}/:${idField}` }
                    };
                    const meta = m[key];
                    if (!meta) return;

                    allContracts.push({
                        exportName: `${exportName}.${key}`,
                        domain,
                        action,
                        description: `CRUD ${key} for ${domain} (${exportName})`,
                        method: meta.method,
                        path: meta.path,
                        isStream: false
                    });
                });
            }
        }
        return { discovery: allContracts, files: domainFiles };
    }

    private walkDir(dir: string): string[] {
        let results: string[] = [];
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(this.walkDir(filePath));
            } else {
                results.push(filePath);
            }
        });
        return results;
    }

    private getAliasMap(files: Record<string, string[]>, baseDir: string): Record<string, { alias: string, path: string }> {
        const allFiles = Array.from(new Set(Object.values(files).flat()));
        const map: Record<string, { alias: string, path: string }> = {};
        allFiles.forEach((file, idx) => {
            map[file] = {
                alias: `Contract_${idx}`,
                path: path.relative(baseDir, file).replace(/\\/g, '/').replace(/\.ts$/, '.js')
            };
        });
        return map;
    }
}
