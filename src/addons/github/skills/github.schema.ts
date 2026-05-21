import { z } from 'zod';

export const GitHubRepoSchema = z.object({
    id: z.number(),
    node_id: z.string(),
    name: z.string(),
    full_name: z.string(),
    private: z.boolean(),
    html_url: z.string(),
    description: z.string().nullish(),
    fork: z.boolean(),
    url: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    pushed_at: z.string(),
    size: z.number(),
    stargazers_count: z.number(),
    watchers_count: z.number(),
    language: z.string().nullish(),
    forks_count: z.number(),
    open_issues_count: z.number(),
    default_branch: z.string(),
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

export const GitHubRepoSummarySchema = z.object({
    name: z.string(),
    full_name: z.string(),
    description: z.string().nullish(),
    url: z.string(),
    pushed_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    language: z.string().nullish(),
    stars: z.number()
});

export type GitHubRepoSummary = z.infer<typeof GitHubRepoSummarySchema>;

export const GitHubIssueSchema = z.object({
    id: z.number(),
    node_id: z.string(),
    url: z.string(),
    repository_url: z.string(),
    html_url: z.string(),
    number: z.number(),
    state: z.string(),
    title: z.string(),
    body: z.string().nullish(),
    user: z.object({
        login: z.string(),
        id: z.number(),
    }),
    labels: z.array(z.object({
        name: z.string(),
        color: z.string(),
    })),
    created_at: z.string(),
    updated_at: z.string(),
    closed_at: z.string().nullish(),
});

export type GitHubIssue = z.infer<typeof GitHubIssueSchema>;

export const GitHubPullRequestSchema = z.object({
    id: z.number(),
    node_id: z.string(),
    html_url: z.string(),
    diff_url: z.string(),
    patch_url: z.string(),
    number: z.number(),
    state: z.string(),
    title: z.string(),
    user: z.object({
        login: z.string(),
    }),
    body: z.string().nullish(),
    created_at: z.string(),
    updated_at: z.string(),
    closed_at: z.string().nullish(),
    merged_at: z.string().nullish(),
    base: z.object({
        label: z.string(),
        ref: z.string(),
    }),
    head: z.object({
        label: z.string(),
        ref: z.string(),
    }),
});

export type GitHubPullRequest = z.infer<typeof GitHubPullRequestSchema>;
