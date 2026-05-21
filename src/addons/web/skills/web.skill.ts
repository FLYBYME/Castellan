import { BaseSkillModule, ISkillContext } from 'castellan/core';
import { rssFeedCrud, webFetchFeedContract, webSearxngSearchContract } from './web.contract.js';
import { web_fetch_feed, web_searxng_search } from './web.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * WebSkill: Manages external data ingestion.
 * Focuses on RSS feeds and structured data extraction.
 */
export class WebSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'web';

    public async getGlobalContext(ctx: ISkillContext<ContextApi>): Promise<string> {
        const feeds = await ctx.api.web.find({});
        const feedSummary = feeds.length > 0
            ? feeds.map(f => f.name).join(', ')
            : "No external sensors (feeds) available.";

        return `### EXTERNAL SENSORS (Available Feeds)\n- ${feedSummary}`;
    }

    public async getSkillContext(_ctx: ISkillContext<ContextApi>): Promise<string> {
        return `
## External Reality (Web)
This is your interface with the world outside the estate. 
- **EXTERNAL CONTEXT**: Access real-time data like weather, transit, or news.
- **CROSS-DOMAIN AWARENESS**: Monitor external sensors for real-world events.
- **SOURCE MANAGEMENT**: Manage information sources to maintain situational awareness.
        `.trim();
    }

    constructor() {
        super();

        // 1. Storage
        this.mountCrud(rssFeedCrud);

        // 2. Behavioral Tools
        this.mountTool(webFetchFeedContract, web_fetch_feed);
        this.mountTool(webSearxngSearchContract, web_searxng_search);
    }
}
