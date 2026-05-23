import { z } from 'zod';
import { defineContract, defineCrud, defaultPrint } from 'castellan/core';
import {
    JournalEntrySchema,
    DirectiveSchema,
    JournalNoteInputSchema,
    JournalResolveInputSchema,
    JournalCompressOutputSchema
} from './journal.schema.js';

/**
 * Journal Entry CRUD (Internal platform use mostly)
 */
export const journalCrud = defineCrud('journal', JournalEntrySchema, {
    pluralPath: 'journal'
});

/**
 * Directive CRUD (The extracted rules)
 */
export const directiveCrud = defineCrud('directive', DirectiveSchema, {
    pluralPath: 'directives'
});

// --- Custom Journal Tools ---

export const journalNoteContract = defineContract({
    domain: 'journal',
    action: 'note',
    description: 'Record an observation, reasoning step, or proposal in the episodic memory ledger.',
    inputSchema: JournalNoteInputSchema,
    outputSchema: JournalEntrySchema.extend({ id: z.string() }),
    rest: { method: 'POST', path: '/journal/note' },
    destructive: false,
    print: (output) => `
### Episodic Entry Recorded
- **Type**: ${output.type || 'NOTE'}
- **Domain**: ${output.domain}
- **Timestamp**: ${output.timestamp.toISOString()}
- **Entry ID**: ${output.id}

**Content**:
> ${output.content}
    `.trim()
});

export const journalResolveContract = defineContract({
    domain: 'journal',
    action: 'resolve',
    description: 'Approve or reject a proposed action in the journal. Requires a correction if rejected.',
    inputSchema: JournalResolveInputSchema,
    outputSchema: JournalEntrySchema.extend({ id: z.string() }),
    rest: { method: 'POST', path: '/journal/resolve' },
    destructive: true,
    print: (output) => `
### Journal Entry Resolved
- **Status**: ${output.status === 'approved' || output.status === 'completed' ? '✅ RESOLVED/APPROVED' : '❌ REJECTED'}
- **Domain**: ${output.domain}
- **Entry ID**: ${output.id}

**Content**:
> ${output.content}
    `.trim()
});

export const journalCompressContract = defineContract({
    domain: 'journal',
    action: 'compress',
    description: 'The Nightly Sleep Cycle: Compress recent journal entries and extract permanent directives.',
    inputSchema: z.object({}),
    outputSchema: JournalCompressOutputSchema,
    rest: { method: 'POST', path: '/journal/compress' },
    destructive: true,
    print: (output) => `
### Memory Consolidation Complete
**Summary**: ${output.summary}

- **Episodic Entries Processed**: ${output.entriesProcessed}
- **Permanent Directives Created**: ${output.directivesCreated}
    `.trim()
});
