import { z } from 'zod';

/**
 * ICastellanApi: Marker interface for the Unified API.
 * The code generator will produce the concrete implementation.
 * We allow empty object type here as it is a marker for augmentation.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICastellanApi {}

/**
 * PlatformEvent: The unified event shape for the entire Castellan ecosystem.
 */
export const PlatformEventSchema = z.object({
    id: z.string().uuid(),
    timestamp: z.date(),
    correlationId: z.string().describe("Trace ID for request lifecycle tracking"),
    domain: z.string(),
    action: z.string(),
    payload: z.record(z.string(), z.unknown())
});

export type PlatformEvent = z.infer<typeof PlatformEventSchema>;
