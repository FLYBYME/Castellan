import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import {
    RssFeedSchema,
    WebFetchFeedInputSchema,
    WebFetchFeedOutputSchema,
    SearxngSearchInputSchema,
    SearxngSearchOutputSchema
} from './web.schema.js';

/**
 * RSS Feed CRUD: Manage the list of trusted data sources.
 */
export const rssFeedCrud = defineCrud('web', RssFeedSchema, {
    pluralPath: 'rss-feeds'
});

/**
 * web_fetch_feed: Orchestrated tool to fetch and clean RSS data.
 */
export const webFetchFeedContract = defineContract({
    domain: 'web',
    action: 'fetch_feed',
    description: 'Fetch a managed RSS feed and use an internal agent to clean and structure the data.',
    inputSchema: WebFetchFeedInputSchema,
    outputSchema: WebFetchFeedOutputSchema,
    rest: { method: 'POST', path: '/web/feeds/:feedId/fetch' },
    destructive: false
});

/**
 * web_searxng_search: Query a private SearXNG instance for real-time web search results.
 */
export const webSearxngSearchContract = defineContract({
    domain: 'web',
    action: 'searxng_search',
    description: 'Query a private SearXNG instance for real-time web search results.',
    inputSchema: SearxngSearchInputSchema,
    outputSchema: SearxngSearchOutputSchema,
    rest: { method: 'POST', path: '/web/searxng-search' },
    destructive: false
});
