import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import {
    JournalEntrySchema,
    DirectiveSchema,
    JournalNoteInputSchema,
    JournalResolveInputSchema,
    JournalListInputSchema,
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
    outputSchema: JournalEntrySchema,
    rest: { method: 'POST', path: '/journal/note' },
    destructive: false
});

export const journalResolveContract = defineContract({
    domain: 'journal',
    action: 'resolve',
    description: 'Approve or reject a proposed action in the journal. Requires a correction if rejected.',
    inputSchema: JournalResolveInputSchema,
    outputSchema: JournalEntrySchema,
    rest: { method: 'POST', path: '/journal/resolve' },
    destructive: true
});

export const journalCompressContract = defineContract({
    domain: 'journal',
    action: 'compress',
    description: 'The Nightly Sleep Cycle: Compress recent journal entries and extract permanent directives.',
    inputSchema: z.object({}),
    outputSchema: JournalCompressOutputSchema,
    rest: { method: 'POST', path: '/journal/compress' },
    destructive: true
});
