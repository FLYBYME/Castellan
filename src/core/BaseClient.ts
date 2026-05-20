import { z } from 'zod';

/**
 * BaseClient: Core transport implementation for the Castellan SDK.
 * Handles the low-level WebSocket and REST communication.
 */
export abstract class BaseClient {
    protected socket: unknown | null = null;
    protected connectingPromise: Promise<unknown> | null = null;
    protected messageListeners: Set<(msg: string) => void> = new Set();
    protected eventListeners: Set<(name: string, payload: unknown, correlationId: string) => void> = new Set();
    protected sandboxId: string | null = null;

    constructor(protected readonly serverUrl: string) { }

    public setSandboxId(id: string | null): void {
        if (this.sandboxId !== id) {
            this.sandboxId = id;
            this.close();
        }
    }

    /**
     * onEvent: Register a callback for server-pushed events.
     */
    public onEvent(callback: (name: string, payload: unknown, correlationId: string) => void): void {
        this.eventListeners.add(callback);
    }

    /**
     * offEvent: Unregister an event callback.
     */
    public offEvent(callback: (name: string, payload: unknown, correlationId: string) => void): void {
        this.eventListeners.delete(callback);
    }

    /**
     * setWebSocket: Injects an existing WebSocket connection.
     * Used by StreamService to share a single connection.
     */
    public setWebSocket(ws: unknown | null): void {
        this.socket = ws;
    }

    /**
     * handleIncomingMessage: Dispatches raw socket data to internal listeners.
     */
    public handleIncomingMessage(msg: unknown): void {
        let dataStr: string;
        if (typeof msg === 'string') {
            dataStr = msg;
        } else if (typeof msg === 'object' && msg !== null && 'toString' in msg && typeof (msg as any).toString === 'function' && !(msg instanceof Array)) {
            // Handle Buffer or similar objects that have a toString method
            dataStr = (msg as any).toString();
        } else {
            dataStr = JSON.stringify(msg);
        }

        // 1. Notify tool-specific listeners (for requests/streams)
        for (const listener of this.messageListeners) {
            listener(dataStr);
        }

        // 2. Notify global event listeners
        try {
            const data = JSON.parse(dataStr) as Record<string, unknown>;
            if (data['type'] === 'event') {
                const name = String(data['name']);
                const payload = data['payload'];
                const correlationId = String(data['correlationId'] || '');
                for (const listener of this.eventListeners) {
                    listener(name, payload, correlationId);
                }
            }
        } catch {
            // Ignore malformed messages for event dispatch
        }
    }

    /**
     * request: Perform a unary tool execution over WebSocket.
     */
    protected async request<TOut>(
        toolKey: string,
        args: Record<string, unknown>,
        schema: z.ZodType<TOut, any, any>
    ): Promise<TOut> {
        const ws = await this.getWebSocket();
        const requestId = Math.random().toString(36).substring(7);
        const firstUnderscore = toolKey.indexOf('_');
        const domain = toolKey.substring(0, firstUnderscore);
        const action = toolKey.substring(firstUnderscore + 1);

        return new Promise<TOut>((resolve, reject) => {
            const listener = (msg: string) => {
                try {
                    const data = JSON.parse(msg) as Record<string, unknown>;

                    if (data.type === 'error' && data.requestId === requestId) {
                        this.messageListeners.delete(listener);
                        reject(new Error(String(data.error)));
                        return;
                    }

                    if (data.type === 'tool_result' && data.requestId === requestId) {
                        this.messageListeners.delete(listener);
                        resolve(schema.parse(data.data));
                    }
                } catch {
                    // Ignore malformed messages
                }
            };

            this.messageListeners.add(listener);
            this.send(ws, {
                type: 'tool_exec',
                domain: String(domain),
                action: String(action),
                input: args,
                requestId
            });
        });
    }

    /**
     * stream: Perform a streaming tool execution over WebSocket.
     */
    protected async *stream<TOut>(
        toolKey: string,
        args: Record<string, unknown>,
        schema: z.ZodType<TOut, any, any>
    ): AsyncIterable<TOut> {
        const ws = await this.getWebSocket();
        const requestId = Math.random().toString(36).substring(7);
        const firstUnderscore = toolKey.indexOf('_');
        const domain = toolKey.substring(0, firstUnderscore);
        const action = toolKey.substring(firstUnderscore + 1);

        const queue: TOut[] = [];
        let resolveNext: ((value: IteratorResult<TOut>) => void) | null = null;
        let finished = false;
        let error: Error | null = null;

        const listener = (msg: string) => {
            try {
                const data = JSON.parse(msg) as Record<string, unknown>;

                if (data.type === 'error' && data.requestId === requestId) {
                    error = new Error(String(data.error));
                    if (resolveNext) resolveNext({ value: undefined as never, done: true });
                    return;
                }

                if (data.type === 'tool_chunk' && data.requestId === requestId) {
                    const parsed = schema.parse(data.data);
                    if (resolveNext) {
                        const resolve = resolveNext;
                        resolveNext = null;
                        resolve({ value: parsed, done: false });
                    } else {
                        queue.push(parsed);
                    }
                } else if ((data.type === 'tool_end' || data.type === 'tool_result') && data.requestId === requestId) {
                    finished = true;
                    if (resolveNext) {
                        resolveNext({ value: undefined as never, done: true });
                        resolveNext = null;
                    }
                }
            } catch {
                // Ignore malformed messages
            }
        };

        this.messageListeners.add(listener);
        this.send(ws, {
            type: 'tool_exec',
            domain: String(domain),
            action: String(action),
            input: args,
            requestId
        });

        try {
            while (!finished || queue.length > 0) {
                if (error) throw error;
                if (queue.length > 0) {
                    const val = queue.shift();
                    if (val !== undefined) yield val;
                } else {
                    const result = await new Promise<IteratorResult<TOut>>((resolve) => {
                        resolveNext = resolve;
                    });
                    if (result.done) break;
                    yield result.value;
                }
            }
        } finally {
            this.messageListeners.delete(listener);
        }
    }

    protected abstract getWebSocket(): Promise<unknown>;

    protected abstract send(ws: unknown, payload: Record<string, unknown>): void;

    public abstract close(): void;
}
