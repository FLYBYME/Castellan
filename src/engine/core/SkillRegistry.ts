import { ICastellanApi } from '../../core/api.js';
import { ISkillModule } from '../../core/SkillModule.js';

/**
 * SkillRegistry: A headless manager for all active skill modules.
 */
export class SkillRegistry<TApi extends ICastellanApi = ICastellanApi> {
    private modules: Map<string, ISkillModule<TApi>> = new Map();

    /**
     * register: Adds a skill to the platform.
     */
    public register(skill: ISkillModule<TApi>): void {
        this.registerByDomain(skill.domain, skill);
    }

    /**
     * registerByDomain: Registers a skill for a specific domain.
     */
    public registerByDomain(domain: string, skill: ISkillModule<TApi>): void {
        if (this.modules.has(domain)) {
            const existing = this.modules.get(domain);
            if (existing !== skill) {
                console.warn(`[SkillRegistry] Domain "${domain}" is already registered by another skill. Overwriting.`);
            }
        }
        this.modules.set(domain, skill);
    }

    /**
     * registerAll: Batch registration of multiple skills.
     */
    public registerAll(skills: ISkillModule<TApi>[]): void {
        for (const skill of skills) {
            this.register(skill);
        }
    }

    public getSkill(domain: string): ISkillModule<TApi> | undefined {
        return this.modules.get(domain);
    }

    public allSkills(): ISkillModule<TApi>[] {
        return Array.from(new Set(this.modules.values()));
    }

    public clear(): void {
        this.modules.clear();
    }


}
