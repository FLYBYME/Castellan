import { BaseSkillModule, ISkillContext } from 'castellan/core';
import { 
    githubListReposContract, 
    githubGetRepoContract, 
    githubListIssuesContract, 
    githubListPullsContract,
    githubStatusContract,
    githubCloneContract
} from './github.contract.js';
import { 
    github_list_repos, 
    github_get_repo, 
    github_list_issues, 
    github_list_pulls,
    github_status,
    github_clone
} from './github.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * GitHubSkill: Manages Organization-level intelligence and repository orchestration.
 */
export class GitHubSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'github';

    public async getSkillContext(_ctx: ISkillContext): Promise<string> {
        const org = process.env.GITHUB_ORG || 'Not Configured';
        
        return `
## Organization Intelligence (GitHub)
You are the warden of the **${org}** GitHub organization.
- **PROACTIVE MONITORING**: Check 'github_list_repos' to see where the activity is.
- **COORDINATION**: Use 'github_list_pulls' to identify PRs that need review.
- **STRICT ORDER**: If a bug is found in a sandbox, use 'github_create_issue' to record it in the upstream repository.
- **ADMINISTRATION**: Use 'github_status' to verify your connection health and remaining API budget.
        `.trim();
    }

    constructor() {
        super();

        // Register Tools
        this.mountTool(githubListReposContract, github_list_repos);
        this.mountTool(githubGetRepoContract, github_get_repo);
        this.mountTool(githubListIssuesContract, github_list_issues);
        this.mountTool(githubListPullsContract, github_list_pulls);
        this.mountTool(githubStatusContract, github_status);
        this.mountTool(githubCloneContract, github_clone);
    }
}
