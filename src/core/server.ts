/**
 * IServer: Interface for transport layers (Addons).
 * 
 * A server is an addon that exposes the Castellan Engine to the outside world
 * (e.g., via HTTP, WebSockets, gRPC, or even a local UI).
 */
export interface IServer {
    /** Unique name of the server implementation */
    readonly name: string;
    
    /**
     * start: Initializes the transport and hooks it into the engine.
     * @param engine The headless Castellan Engine instance.
     */
    start(engine: unknown): Promise<void>;
    
    /**
     * stop: Gracefully shuts down the transport layer.
     */
    stop(): Promise<void>;
}
