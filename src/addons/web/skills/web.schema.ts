import { z } from 'zod';

// --- Entity Schemas ---

export const RssFeedSchema = z.object({
    name: z.string().describe("Human-readable name of the feed"),
    url: z.string().url().describe("The URL of the RSS feed"),
    extractionPrompt: z.string().describe("Instructions for the cleaning agent on how to filter and structure this feed's data"),
    transformer: z.string().nullish().describe("Optional JavaScript code to transform raw data before it is passed to the LLM. The variable 'data' contains the raw content."),
    createdAt: z.coerce.date().nullish(),
    updatedAt: z.coerce.date().nullish(),
}).describe("A managed RSS feed source");

export type RssFeed = z.infer<typeof RssFeedSchema>;

// --- IO Schemas ---

export const WebFetchFeedInputSchema = z.object({
    feedId: z.string().describe("The ID of the feed to fetch and clean"),
});

export const WebFetchFeedOutputSchema = z.object({
    feedId: z.string(),
    feedName: z.string(),
    data: z.unknown().describe("The cleaned, structured data extracted from the feed"),
    timestamp: z.coerce.date(),
});

export type WebFetchFeedOutput = z.infer<typeof WebFetchFeedOutputSchema>;

// --- SearXNG Schemas ---

export const SearxngSearchInputSchema = z.object({
    query: z.string().describe("The search query to send to SearXNG"),
    categories: z.string().optional().describe("Comma-separated list of search categories (e.g. 'general', 'news', 'images', 'science')"),
    engines: z.string().optional().describe("Comma-separated list of specific engines to query"),
    pageno: z.number().int().positive().optional().describe("The page number of the search results to fetch"),
    timeRange: z.enum(['day', 'week', 'month', 'year']).optional().describe("Time range filter for search results"),
});

export type SearxngSearchInput = z.infer<typeof SearxngSearchInputSchema>;

export const SearxngResultItemSchema = z.object({
    title: z.string().describe("The title of the search result page"),
    url: z.string().describe("The URL of the search result page"),
    content: z.string().optional().describe("A short snippet of text summarizing the page content"),
    engine: z.string().optional().describe("The engine name that sourced the search result"),
    score: z.number().optional().describe("Rank or score assigned to this result item"),
});

export type SearxngResultItem = z.infer<typeof SearxngResultItemSchema>;

export const SearxngSearchOutputSchema = z.object({
    results: z.array(SearxngResultItemSchema).describe("An array of search results matched by SearXNG"),
    suggestions: z.array(z.string()).optional().describe("Search term suggestions for refining the query"),
});

export type SearxngSearchOutput = z.infer<typeof SearxngSearchOutputSchema>;
