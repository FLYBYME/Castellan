import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { ISkillModule } from '../../core/SkillModule.js';
import { SkillRegistry } from './SkillRegistry.js';
import { ICastellanApi } from '../../core/api.js';

/**
 * SkillLoader: Dynamically discovers and loads skills in-process.
 */
export class SkillLoader<TApi extends ICastellanApi = ICastellanApi> {
    constructor(private registry: SkillRegistry<TApi>) {}

    /**
     * loadFromDirectory: Scans a directory for .skill.ts files and registers them.
     */
    public async loadFromDirectory(dir: string): Promise<void> {
        if (!fs.existsSync(dir)) {
            console.warn(`[SkillLoader] Directory "${dir}" not found. No skills loaded.`);
            return;
        }

        const files = this.walkDir(dir).filter(f => f.endsWith('.skill.ts'));

        for (const file of files) {
            try {
                // Convert the path to a file:// URL for safe ESM dynamic import
                const fileUrl = pathToFileURL(path.resolve(file)).href;
                const skillModule = await import(fileUrl) as Record<string, unknown>;

                // Find a class implementing ISkillModule
                const SkillClass = Object.values(skillModule).find((v): v is new () => ISkillModule<TApi> => 
                    typeof v === 'function' && v.prototype && typeof v.prototype.execute === 'function'
                );

                if (!SkillClass) {
                    throw new Error(`No valid Skill class implementing ISkillModule found in ${file}`);
                }

                const skillInstance = new SkillClass();
                
                // Register for the primary domain
                this.registry.register(skillInstance);

                // Register for all additional domains found in contracts
                const contracts = skillInstance.getContracts();
                const domains = new Set(contracts.map(c => c.domain));
                for (const d of domains) {
                    if (d !== skillInstance.domain) {
                        this.registry.registerByDomain(d, skillInstance);
                    }
                }
                
                console.log(`[SkillLoader] Registered skill in-process: ${skillInstance.domain} (domains: ${Array.from(domains).join(', ')})`);
            } catch (err) {
                console.error(`[SkillLoader] Failed to load skill from ${file}:`, String(err));
            }
        }
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
}
