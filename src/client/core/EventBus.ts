import { EventRegistry } from '../../core/events.js';

export type EventCallback<T = any> = (data: T) => void;

interface Subscription {
    id: number;
    callback: EventCallback;
    once: boolean;
}

/**
 * EventBus - Central Pub/Sub system for inter-component communication.
 * Refined to support strict typing from the global EventRegistry.
 */
export class EventBus {
    private events: Map<string, Subscription[]> = new Map();
    private subscriptionId: number = 0;

    constructor() { }

    /**
     * Subscribe to a strictly-typed event from the registry.
     */
    public on<K extends keyof EventRegistry>(event: K, callback: (data: EventRegistry[K]) => void): number;
    /**
     * Subscribe to an arbitrary string event.
     */
    public on<T = any>(event: string, callback: EventCallback<T>): number;
    public on(event: string, callback: EventCallback): number {
        const id = ++this.subscriptionId;
        const subscriptions = this.events.get(event) || [];
        subscriptions.push({ id, callback, once: false });
        this.events.set(event, subscriptions);
        return id;
    }

    /**
     * Subscribe to an event once.
     */
    public once<K extends keyof EventRegistry>(event: K, callback: (data: EventRegistry[K]) => void): number;
    public once<T = any>(event: string, callback: EventCallback<T>): number;
    public once(event: string, callback: EventCallback): number {
        const id = ++this.subscriptionId;
        const subscriptions = this.events.get(event) || [];
        subscriptions.push({ id, callback, once: true });
        this.events.set(event, subscriptions);
        return id;
    }

    /**
     * Emit a strictly-typed event.
     */
    public emit<K extends keyof EventRegistry>(event: K, data: EventRegistry[K]): void;
    /**
     * Emit an arbitrary string event.
     */
    public emit<T = any>(event: string, data?: T): void;
    public emit(event: string, data?: any): void {
        const subscriptions = this.events.get(event);
        if (!subscriptions) return;

        const toRemove: number[] = [];

        for (const sub of subscriptions) {
            try {
                sub.callback(data);
                if (sub.once) {
                    toRemove.push(sub.id);
                }
            } catch (error) {
                console.error(`EventBus: Error in handler for "${event}"`, error);
            }
        }

        if (toRemove.length > 0) {
            this.events.set(
                event,
                subscriptions.filter((s) => !toRemove.includes(s.id))
            );
        }
    }

    /**
     * Unsubscribe from an event.
     */
    public off(subscriptionId: number): boolean;
    public off(event: string, callback: EventCallback): boolean;
    public off(arg1: number | string, arg2?: EventCallback): boolean {
        if (typeof arg1 === 'number') {
            for (const [, subscriptions] of this.events) {
                const index = subscriptions.findIndex((s) => s.id === arg1);
                if (index !== -1) {
                    subscriptions.splice(index, 1);
                    return true;
                }
            }
            return false;
        } else if (typeof arg1 === 'string' && arg2) {
            const subscriptions = this.events.get(arg1);
            if (!subscriptions) return false;
            const index = subscriptions.findIndex((s) => s.callback === arg2);
            if (index !== -1) {
                subscriptions.splice(index, 1);
                return true;
            }
            return false;
        }
        return false;
    }

    public offAll(event: string): void {
        this.events.delete(event);
    }

    public clear(): void {
        this.events.clear();
        this.subscriptionId = 0;
    }

    public getSubscriptionCount(event?: string): number {
        if (event) {
            return this.events.get(event)?.length || 0;
        }
        let count = 0;
        for (const subs of this.events.values()) {
            count += subs.length;
        }
        return count;
    }
}
