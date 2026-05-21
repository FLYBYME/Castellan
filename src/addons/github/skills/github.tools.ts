import { Octokit } from 'octokit';
import { z } from 'zod';
import { ISkillContext } from 'castellan/core';
import { 
    githubListReposContract, 
    githubGetRepoContract, 
    githubListIssuesContract, 
    githubListPullsContract,
    githubStatusContract,
    githubCloneContract
} from './github.contract.js';

let _octokit: Octokit | null = null;

function getOctokit(): Octokit {
    if (!_octokit) {
        const token = process.env.GITHUB_TOKEN;
        if (!token) throw new Error("GITHUB_TOKEN not found in environment.");
        _octokit = new Octokit({ auth: token });
    }
    return _octokit;
}

function getOrg(): string {
    const org = process.env.GITHUB_ORG;
    if (!org) throw new Error("GITHUB_ORG not found in environment.");
    return org;
}

/**
 * github_list_repos: Implementation
 */
export async function github_list_repos(
    input: z.infer<typeof githubListReposContract.inputSchema>,
    _ctx: ISkillContext
) {
    const octokit = getOctokit();
    const org = getOrg();

    let repos: any[] = [];
    try {
        const response = await octokit.rest.repos.listForOrg({
            org,
            type: input.type as any,
            sort: 'pushed',
            direction: 'desc',
            per_page: 100
        });
        repos = response.data;
    } catch (err: any) {
        if (err.status === 404) {
            // Fallback to personal user repositories if org not found
            const response = await octokit.rest.repos.listForUser({
                username: org,
                type: input.type as any,
                sort: 'pushed',
                direction: 'desc',
                per_page: 100
            });
            repos = response.data;
        } else {
            throw err;
        }
    }

    // Clean up, sort by date (pushed_at), and take top 10
    return repos
        .map(repo => ({
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            pushed_at: repo.pushed_at,
            updated_at: repo.updated_at,
            language: repo.language,
            stars: repo.stargazers_count
        }))
        .sort((a, b) => new Date(b.pushed_at || '').getTime() - new Date(a.pushed_at || '').getTime())
        .slice(0, 10);
}

/**
 * github_get_repo: Implementation
 */
export async function github_get_repo(
    input: z.infer<typeof githubGetRepoContract.inputSchema>,
    _ctx: ISkillContext
) {
    const octokit = getOctokit();
    const org = getOrg();

    const response = await octokit.rest.repos.get({
        owner: org,
        repo: input.repo
    });

    return response.data as any;
}

/**
 * github_list_issues: Implementation
 */
export async function github_list_issues(
    input: z.infer<typeof githubListIssuesContract.inputSchema>,
    _ctx: ISkillContext
) {
    const octokit = getOctokit();
    const org = getOrg();

    const response = await octokit.rest.issues.listForRepo({
        owner: org,
        repo: input.repo,
        state: input.state as any,
        per_page: 100
    });

    // Octokit issues list includes Pull Requests. We want to filter them out for this tool.
    return response.data.filter(issue => !issue.pull_request) as any;
}

/**
 * github_list_pulls: Implementation
 */
export async function github_list_pulls(
    input: z.infer<typeof githubListPullsContract.inputSchema>,
    _ctx: ISkillContext
) {
    const octokit = getOctokit();
    const org = getOrg();

    const response = await octokit.rest.pulls.list({
        owner: org,
        repo: input.repo,
        state: input.state as any,
        per_page: 100
    });

    return response.data as any;
}

/**
 * github_status: Implementation
 */
export async function github_status(
    _input: z.infer<typeof githubStatusContract.inputSchema>,
    _ctx: ISkillContext
) {
    const octokit = getOctokit();
    const org = getOrg();

    const [userRes, rateRes] = await Promise.all([
        octokit.rest.users.getAuthenticated(),
        octokit.rest.rateLimit.get()
    ]);

    const scopes = userRes.headers['x-oauth-scopes']?.split(',').map(s => s.trim()) || [];

    return {
        org,
        authenticated: !!userRes.data.login,
        scopes,
        rateLimit: {
            limit: rateRes.data.rate.limit,
            remaining: rateRes.data.rate.remaining,
            reset: new Date(rateRes.data.rate.reset * 1000).toISOString()
        }
    };
}

/**
 * github_clone: Implementation
 */
export async function github_clone(
    input: z.infer<typeof githubCloneContract.inputSchema>,
    ctx: ISkillContext
) {
    const org = input.org || getOrg();
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN not found.");

    const targetPath = input.path || input.repo;
    
    // Authenticated clone URL
    const url = `https://x-access-token:${token}@github.com/${org}/${input.repo}.git`;
    
    const result = await (ctx.api as any).sandbox.terminal_execute({
        command: ['git', 'clone', url, targetPath],
        cwd: '.',
        timeoutMs: 60000
    });

    if (result.exitCode !== 0) {
        return {
            success: false,
            path: '',
            error: result.stderr || result.stdout || 'Clone failed'
        };
    }

    return {
        success: true,
        path: `./${targetPath}`
    };
}
