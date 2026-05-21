import { z } from 'zod';

// --- Entity Schemas ---

export const JournalTypeSchema = z.preprocess((val) => {
    if (typeof val === 'string') {
        const clean = val.toLowerCase().trim();
        if (clean === 'log' || clean === 'info') return 'observation';
        return clean;
    }
    return val;
}, z.enum(['observation', 'reasoning', 'proposal'])) as unknown as z.ZodType<'observation' | 'reasoning' | 'proposal'>;

export const JournalStatusSchema = z.preprocess((val) => {
    if (typeof val === 'string') {
        return val.toLowerCase().trim();
    }
    return val;
}, z.enum(['noted', 'pending', 'approved', 'rejected', 'completed'])) as unknown as z.ZodType<'noted' | 'pending' | 'approved' | 'rejected' | 'completed'>;

export const JournalEntrySchema = z.object({
    timestamp: z.coerce.date().describe("When the entry was recorded"),
    type: JournalTypeSchema,
    domain: z.string().describe("The skill domain involved (e.g., 'gmail', 'fs')"),
    content: z.string().describe("Human-readable description of the observation or reasoning"),
    payload: z.record(z.string(), z.unknown()).nullish().describe("Raw tool call arguments for proposals"),
    status: JournalStatusSchema.describe("The current state of a proposal or event"),
    correction: z.string().nullish().describe("Feedback provided by the human during review"),
    threadId: z.string().nullish().describe("Associated conversation thread ID"),
}).describe("A single record in the episodic memory ledger");

export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const DirectiveSchema = z.object({
    rule: z.string().describe("The permanent rule or correction extracted from memory"),
    sourceEntryId: z.string().nullish().describe("Reference to the journal entry that triggered this rule"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
}).describe("A permanent architectural rule learned from human feedback");

export type Directive = z.infer<typeof DirectiveSchema>;

// --- IO Schemas ---

export const JournalNoteInputSchema = z.object({
    type: JournalTypeSchema.describe("The nature of this entry. MUST be exactly 'observation' | 'reasoning' | 'proposal'."),
    domain: z.string().describe("The specific operational domain (e.g., 'System Operations', 'Testing', 'Directorate', 'SafetyAudit', 'API_DISCOVERY')"),
    content: z.string().describe("Factual log message describing the action, reasoning step, or state verification."),
    payload: z.record(z.string(), z.unknown()).nullish().describe("Optional raw structured data supporting this entry"),
    threadId: z.string().nullish().describe("Optional active thread identifier"),
});

export const JournalResolveInputSchema = z.object({
    entryId: z.string().describe("The journal entry to resolve"),
    status: z.enum(['approved', 'rejected']).describe("Whether to approve or reject the proposal"),
    correction: z.string().nullish().describe("Mandatory if rejected: why was it wrong?"),
});

export const JournalListInputSchema = z.object({
    status: JournalStatusSchema.nullish(),
    type: JournalTypeSchema.nullish(),
});

export const DirectiveListInputSchema = z.object({});

export const JournalCompressOutputSchema = z.object({
    entriesProcessed: z.number(),
    directivesCreated: z.number(),
    summary: z.string(),
});
