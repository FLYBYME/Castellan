import { z } from 'zod';
import { ISkillContext } from 'castellan/core';
import { webFetchFeedContract, webSearxngSearchContract } from './web.contract.js';
import { RssFeedSchema } from './web.schema.js';
import { nanoid } from 'nanoid';

/**
 * web_fetch_feed: The orchestrated extraction pipeline.
 */
export async function web_fetch_feed(
    input: z.infer<typeof webFetchFeedContract.inputSchema>,
    ctx: ISkillContext
) {
    const feed = await ctx.api.web.get({ id: input.feedId });
    if (!feed) throw new Error(`RSS Feed not found: ${input.feedId}`);

    // 2. Fetch the raw data
    const response = await fetch(feed.url, { signal: ctx.signal });
    if (!response.ok) {
        throw new Error(`Failed to fetch feed ${feed.id} from ${feed.url}: ${response.status} ${response.statusText}`);
    }
    let rawData = await response.text();

    // 3. Apply Transformer (if any)
    if (feed.transformer) {
        try {
            const transformFn = new Function('data', feed.transformer);
            const transformed = transformFn(rawData);
            rawData = typeof transformed === 'string' ? transformed : JSON.stringify(transformed, null, 2);
        } catch (err) {
            throw new Error(`Transformer Error for feed ${feed.id}: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    // 4. Clean and Structure
    // Since structured_infer is being refactored, we'll use a standard chat for now
    // or assume the user will provide the tool.
    const extractionPrompt = `Extract findings and summary from this RSS feed "${feed.name}":\n${rawData.substring(0, 10000)}`;

    const threadId = `web_extract_${nanoid(8)}`;
    const cleaningResult = await ctx.api.agent.run({
        threadId,
        agentId: 'castellan.orchestrator',
        prompt: extractionPrompt
    });

    return {
        feedId: feed.id,
        feedName: feed.name,
        data: { message: "Extraction started. Run ID: " + cleaningResult.runId },
        timestamp: new Date()
    };
}

/**
 * web_searxng_search: Query SearXNG for web search results.
 */
export async function web_searxng_search(
    input: z.infer<typeof webSearxngSearchContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof webSearxngSearchContract.outputSchema>> {
    const baseUrl = process.env.SEARXNG_URL || 'http://localhost:8081';

    const url = new URL('/search', baseUrl);
    url.searchParams.set('q', input.query);
    url.searchParams.set('format', 'json');

    const response = await fetch(url.toString(), { signal: ctx.signal });
    if (!response.ok) {
        throw new Error(`SearXNG Search failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const results = (data.results || []).map((r: any) => ({
        title: String(r.title || ''),
        url: String(r.url || ''),
        content: String(r.content || '').substring(0, 500),
        engine: String(r.engine || ''),
        score: typeof r.score === 'number' ? r.score : undefined
    })).slice(0, 10);

    return {
        results,
        suggestions: data.suggestions || []
    };
}
