import dotenv from 'dotenv';
dotenv.config();

import { web_searxng_search } from '../src/skills/web/web.tools.js';
import { ISkillContext } from '../src/skills/SkillModule.js';

async function test() {
    console.log("Testing SearXNG integration...");
    console.log("SEARXNG_URL:", process.env.SEARXNG_URL);
    
    const mockCtx = {
        signal: new AbortController().signal,
    } as unknown as ISkillContext;
    
    try {
        const result = await web_searxng_search({
            query: "typescript",
            pageno: 1
        }, mockCtx);
        
        console.log("\n--- SEARCH SUCCESS ---");
        console.log("Results count:", result.results.length);
        if (result.results.length > 0) {
            console.log("First result:", result.results[0]);
        }
        console.log("Suggestions:", result.suggestions);
    } catch (err) {
        console.error("Search failed:", err);
    }
}

test();
