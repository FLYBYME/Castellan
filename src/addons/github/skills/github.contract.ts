import { z } from 'zod';
import { defineContract } from 'castellan/core';
import { GitHubRepoSchema, GitHubRepoSummarySchema, GitHubIssueSchema, GitHubPullRequestSchema } from './github.schema.js';

/**
 * github_list_repos: List all repositories in the organization.
 */
export const githubListReposContract = defineContract({
    domain: 'github',
    action: 'list_repos',
    description: 'List all repositories in the configured organization.',
    inputSchema: z.object({
        type: z.enum(['all', 'public', 'private', 'forks', 'sources', 'member']).default('all').describe("The type of repositories to list"),
        sort: z.enum(['created', 'updated', 'pushed', 'full_name']).default('updated').describe("The property to sort by"),
        direction: z.enum(['asc', 'desc']).default('desc').describe("The sort direction")
    }),
    outputSchema: z.array(GitHubRepoSummarySchema),
    rest: { method: 'GET', path: '/github/repos' },
    destructive: false
});

/**
 * github_get_repo: Get details for a specific repository.
 */
export const githubGetRepoContract = defineContract({
    domain: 'github',
    action: 'get_repo',
    description: 'Get detailed information for a specific repository in the organization.',
    inputSchema: z.object({
        repo: z.string().describe("The name of the repository (without the org name)")
    }),
    outputSchema: GitHubRepoSchema,
    rest: { method: 'GET', path: '/github/repos/:repo' },
    destructive: false
});

/**
 * github_list_issues: List issues for a repository.
 */
export const githubListIssuesContract = defineContract({
    domain: 'github',
    action: 'list_issues',
    description: 'List open issues for a specific repository.',
    inputSchema: z.object({
        repo: z.string().describe("The name of the repository"),
        state: z.enum(['open', 'closed', 'all']).default('open').describe("Filter by issue state")
    }),
    outputSchema: z.array(GitHubIssueSchema),
    rest: { method: 'GET', path: '/github/repos/:repo/issues' },
    destructive: false
});

/**
 * github_list_pulls: List pull requests for a repository.
 */
export const githubListPullsContract = defineContract({
    domain: 'github',
    action: 'list_pulls',
    description: 'List open pull requests for a specific repository.',
    inputSchema: z.object({
        repo: z.string().describe("The name of the repository"),
        state: z.enum(['open', 'closed', 'all']).default('open').describe("Filter by PR state")
    }),
    outputSchema: z.array(GitHubPullRequestSchema),
    rest: { method: 'GET', path: '/github/repos/:repo/pulls' },
    destructive: false
});

/**
 * github_status: Check integration health and rate limits.
 */
export const githubStatusContract = defineContract({
    domain: 'github',
    action: 'status',
    description: 'Check the health of the GitHub integration, token scopes, and current rate limits.',
    inputSchema: z.object({}),
    outputSchema: z.object({
        org: z.string(),
        authenticated: z.boolean(),
        scopes: z.array(z.string()),
        rateLimit: z.object({
            limit: z.number(),
            remaining: z.number(),
            reset: z.string()
        })
    }),
    rest: { method: 'GET', path: '/github/status' },
    destructive: false
});

/**
 * github_clone: Clone a repository into the active sandbox.
 */
export const githubCloneContract = defineContract({
    domain: 'github',
    action: 'clone',
    description: 'Clone a repository from GitHub into the active sandbox workspace.',
    inputSchema: z.object({
        repo: z.string().describe("The name of the repository (e.g., 'my-repo')"),
        org: z.string().optional().describe("Override the default organization/user name"),
        path: z.string().optional().describe("Sub-directory within the sandbox to clone into (default: same as repo name)")
    }),
    outputSchema: z.object({
        success: z.boolean(),
        path: z.string().describe("The absolute path where the repository was cloned"),
        error: z.string().optional()
    }),
    rest: { method: 'POST', path: '/github/repos/clone' },
    destructive: true
});
