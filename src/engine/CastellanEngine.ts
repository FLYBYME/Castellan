import { nanoid } from 'nanoid';
import { ISkillContext } from '../core/SkillModule.js';
import { ICastellanApi } from '../core/api.js';
import { Database } from './db/Database.js';
import { EventBus } from './events/EventBus.js';
import { SkillRegistry } from './core/SkillRegistry.js';
import { ToolExecutor } from './core/ToolExecutor.js';
import { SkillLoader } from './core/SkillLoader.js';

/**
 * CastellanEngine: The headless orchestrator of the platform.
 */
export class CastellanEngine<TApi extends ICastellanApi = ICastellanApi> {
    public readonly db: Database;
    public readonly events: EventBus;
    public readonly registry: SkillRegistry<TApi>;
    public readonly executor: ToolExecutor<TApi>;
    public readonly loader: SkillLoader<TApi>;

    constructor() {
        this.events = new EventBus();
        this.db = new Database(this.events);
        this.registry = new SkillRegistry<TApi>();
        this.executor = new ToolExecutor<TApi>(this.registry, this.db);
        this.loader = new SkillLoader<TApi>(this.registry);
    }

    public api?: TApi;

    /**
     * boot: Starts the core services and loads skills.
     */
    public async boot(api: TApi, skillsDir?: string): Promise<void> {
        this.api = api;
        await this.db.connect();
        
        if (skillsDir) {
            await this.loader.loadFromDirectory(skillsDir);
        }

        // 5. Post-Init Skills & Subscribe Events
        const context = this.createContext(api, 'system-boot');
        for (const skill of this.registry.allSkills()) {
            // Subscribe declarative handlers
            if ('getEventHandlers' in skill && typeof skill.getEventHandlers === 'function') {
                const handlers = (skill as any).getEventHandlers() as Map<string, any>;
                for (const [name, handler] of handlers.entries()) {
                    console.log(`[Engine] Subscribing skill ${skill.domain} to event: ${name}`);
                    this.events.subscribe(name as any, handler.bind(skill));
                }
            }

            if (skill.postInit) {
                await skill.postInit(context);
            }
        }
    }

    /**
     * shutdown: Gracefully stops all services.
     */
    public async shutdown(): Promise<void> {
        console.log('[Engine] Shutting down workers...');
        for (const skill of this.registry.allSkills()) {
            if ('terminate' in skill && typeof skill.terminate === 'function') {
                await skill.terminate();
            }
        }
        await this.db.disconnect();
    }

    /**
     * createContext: Creates a strictly-typed execution context.
     */
    public createContext(
        api?: TApi,
        correlationId?: string,
        sandboxId?: string
    ): ISkillContext<TApi> {
        const self = this;
        return {
            get api(): TApi {
                if (api && Object.keys(api).length > 0) return api;
                return self.api || ({} as TApi);
            },
            events: this.events,
            skills: this.registry,
            sandboxId,
            correlationId: correlationId || nanoid(),
        };
    }
}
