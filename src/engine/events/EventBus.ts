import { EventRegistry, IEventBus } from '../../core/events.js';

/**
 * EventBus: The strictly-typed communication hub for the Castellan Engine.
 * 
 * Mandate: No 'any' in public API. Internal storage uses a safely-guarded
 * map to manage the union of possible event types.
 */
export class EventBus implements IEventBus {
    private handlers: {
        [K in keyof EventRegistry]?: Set<(payload: EventRegistry[K], correlationId: string) => void | Promise<void>>
    } = {};

    private wildcardListeners: Set<(name: string, payload: unknown, correlationId: string) => void> = new Set();

    public async dispatch<K extends keyof EventRegistry>(
        name: K,
        correlationId: string,
        payload: EventRegistry[K]
    ): Promise<void> {
        const subscribers = this.handlers[name] as Set<(p: EventRegistry[K], c: string) => void | Promise<void>> | undefined;
        if (name !== 'infer:thinking_chunk' && name !== 'infer:content_chunk') {
            console.log(`[EventBus] Dispatching ${name} to ${subscribers?.size || 0} subscribers. CorrelationId: ${correlationId}`);
        }

        if (subscribers) {
            const promises: Promise<void>[] = [];
            let i = 0;
            for (const handler of subscribers) {
                try {
                    console.log(`[EventBus] Calling handler ${++i} (${handler.name || 'anonymous'}) for ${name}`);
                    const r = handler(payload, correlationId);
                    if (r instanceof Promise) {
                        promises.push(r.catch(err => console.error(`[EventBus] Async handler error for ${name}:`, String(err))));
                    }
                } catch (err) {
                    console.error(`[EventBus] Sync handler error for ${name}:`, String(err));
                }
            }
            if (promises.length > 0) {
                await Promise.allSettled(promises);
            }
        }

        // Notify wildcard listeners (Transports/Logging)
        for (const listener of this.wildcardListeners) {
            try {
                listener(name as string, payload, correlationId);
            } catch {
                // Ignore wildcard failures
            }
        }
    }

    public subscribe<K extends keyof EventRegistry>(
        name: K,
        handler: (payload: EventRegistry[K], correlationId: string) => void | Promise<void>
    ): () => void {
        console.log(`[EventBus] New subscription for event: ${name}`);
        if (!this.handlers[name]) {
            // We use an internal cast here to satisfy the Record/Set structure
            // while preserving the strict public signature.
            const newSet = new Set<(payload: EventRegistry[K], correlationId: string) => void | Promise<void>>();
            const handlers = this.handlers as Record<string, unknown>;
            handlers[name] = newSet;
        }

        const set = this.handlers[name] as Set<(p: EventRegistry[K], c: string) => void | Promise<void>>;
        set.add(handler);

        return () => {
            const currentSet = this.handlers[name] as Set<(p: EventRegistry[K], c: string) => void | Promise<void>> | undefined;
            if (currentSet) {
                currentSet.delete(handler);
                if (currentSet.size === 0) {
                    delete this.handlers[name];
                }
            }
        };
    }

    public subscribeAll(
        listener: (name: string, payload: unknown, correlationId: string) => void
    ): () => void {
        this.wildcardListeners.add(listener);
        return () => this.wildcardListeners.delete(listener);
    }
}
