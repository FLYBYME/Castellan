import { z } from 'zod';

/**
 * PlatformEventSchema: The unified event shape for the entire Castellan ecosystem.
 */
export const PlatformEventSchema = z.object({
    threadId: z.string().describe("The unique identifier for the execution thread or session."),
    domain: z.string().describe("The functional domain that emitted the event (e.g., 'sandbox', 'agent', 'git')."),
    action: z.string().describe("The specific action or event type within the domain."),
    data: z.record(z.string(), z.unknown()).describe("The event payload containing domain-specific details."),
    seq: z.number().optional().describe("Sequence number for de-duplication."),
});

export type PlatformEvent = z.infer<typeof PlatformEventSchema>;
