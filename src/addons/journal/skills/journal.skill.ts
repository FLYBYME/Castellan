import { BaseSkillModule, ISkillContext } from 'castellan/core';
import {
    journalCrud,
    directiveCrud,
    journalNoteContract,
    journalResolveContract,
    journalCompressContract
} from './journal.contract.js';
import {
    journal_note,
    journal_resolve,
    journal_compress
} from './journal.tools.js';
import { ContextApi } from '../../../generated/server/ContextApi.js';

/**
 * JournalSkill: The episodic memory engine.
 * Records every thought and proposal, enabling human review and nightly rule extraction.
 */
export class JournalSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'journal';

    public async getSkillContext(ctx: ISkillContext<ContextApi>): Promise<string> {
        const [recentJournals, activeDirectives] = await Promise.all([
            ctx.api.journal.find({ limit: 3, sort: ['-timestamp'] }),
            ctx.api.directive.find({})
        ]);

        const journalSummary = recentJournals.length > 0
            ? recentJournals.map(j => `[${new Date(j.timestamp).toISOString()}] ${j.type || 'NOTE'}: ${j.content}`).join('\n')
            : "No recent ledger entries.";

        const directiveSummary = activeDirectives.length > 0
            ? activeDirectives.map(d => `- ${d.rule}`).join('\n')
            : "No active operational directives.";

        return `
## Journal & Episodic Memory
Record-keeping for reasoning, proposals, and long-term directives.
- **TRANSPARENCY**: Proactively record 'journal_note' for every significant reasoning step or intended action.
- **SAFETY PROTOCOL**: For high-risk operations, record a 'proposal' entry and wait for approval.
- **DIRECTIVE ADHERENCE**: Check 'directive_list' regularly to ensure you are following established operational rules.

### RECENT MEMORY (Last 3 Ledger Entries)
${journalSummary}

### OPERATIONAL DIRECTIVES
${directiveSummary}

You MUST call 'journal_note' to keep the user updated on your progress. (the user will only see the tool output, not your internal monologue)
        `.trim();
    }

    constructor() {
        super();

        // 1. Storage
        this.mountCrud(journalCrud);

        // 2. Behavioral Tools
        this.mountTool(journalNoteContract, journal_note);
        this.mountTool(journalResolveContract, journal_resolve);
        this.mountTool(journalCompressContract, journal_compress);
    }
}

/**
 * DirectiveSkill: Manages long-term active operational directives.
 */
export class DirectiveSkill extends BaseSkillModule<ContextApi> {
    public readonly domain = 'directive';

    constructor() {
        super();
        this.mountCrud(directiveCrud);
    }
}
