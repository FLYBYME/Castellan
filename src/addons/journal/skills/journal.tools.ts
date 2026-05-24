import { z } from 'zod';
import { ISkillContext } from '@flybyme/castellan/core';
import {
    journalNoteContract,
    journalResolveContract,
    journalCompressContract
} from './journal.contract.js';
import {
    JournalEntry
} from './journal.schema.js';

/**
 * journal_note: Appends an entry to the ledger.
 */
export async function journal_note(
    input: z.infer<typeof journalNoteContract.inputSchema>,
    ctx: ISkillContext
): Promise<JournalEntry & { id: string }> {
    const entry = await ctx.api.journal.create({
        timestamp: new Date(),
        type: input.type,
        domain: input.domain,
        content: input.content,
        payload: input.payload ?? null,
        status: input.type === 'proposal' ? 'pending' : 'noted',
        threadId: input.threadId ?? null,
        correction: null
    });

    return entry;
}

/**
 * journal_resolve: Resolves a pending proposal.
 */
export async function journal_resolve(
    input: z.infer<typeof journalResolveContract.inputSchema>,
    ctx: ISkillContext
): Promise<JournalEntry & { id: string }> {
    const entry = await ctx.api.journal.get({ id: input.entryId });
    if (!entry) throw new Error(`Journal entry not found: ${input.entryId}`);

    if (entry.type !== 'proposal') {
        throw new Error(`Only entries of type 'proposal' can be resolved. This entry is a '${entry.type}'.`);
    }

    if (input.status === 'rejected' && !input.correction) {
        throw new Error('A correction must be provided when rejecting a proposal.');
    }

    const updated = await ctx.api.journal.update({
        id: input.entryId,
        status: input.status,
        correction: input.correction ?? null
    });

    return updated;
}

/**
 * journal_compress: The Nightly Sleep Cycle.
 * Extracts corrections into permanent directives using the LLM.
 */
export async function journal_compress(
    _input: z.infer<typeof journalCompressContract.inputSchema>,
    ctx: ISkillContext
) {
    // 1. Fetch rejected proposals with corrections
    const rejectedEntries = await ctx.api.journal.find({ query: { status: 'rejected' } });
    const unprocessed = rejectedEntries.filter(e => e.correction);

    if (unprocessed.length === 0) {
        return {
            entriesProcessed: 0,
            directivesCreated: 0,
            summary: "No new corrections found for compression."
        };
    }

    let createdCount = 0;
    for (const entry of unprocessed) {
        if (!entry.correction) continue;

        await ctx.api.directive.create({
            rule: entry.correction,
            sourceEntryId: entry.id,
        });
        createdCount++;

        // Mark as completed to avoid double processing
        await ctx.api.journal.update({ id: entry.id, status: 'completed' });
    }

    return {
        entriesProcessed: unprocessed.length,
        directivesCreated: createdCount,
        summary: `Sleep cycle complete. Distilled ${createdCount} directives from ${unprocessed.length} rejected proposals.`
    };
}
