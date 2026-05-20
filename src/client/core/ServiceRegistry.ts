/**
 * ServiceRegistry - A global registry for IDE services.
 * Allows extensions to register and retrieve cross-cutting services.
 */
export class ServiceRegistry {
    private services: Map<string, any> = new Map();

    /**
     * Register a new service instance.
     * @param id The unique identifier for the service.
     * @param service The service instance.
     */
    public registerService<T>(id: string, service: T): void {
        if (this.services.has(id)) {
            console.warn(`[ServiceRegistry] Service "${id}" is already registered. Overwriting.`);
        }
        this.services.set(id, service);
    }

    /**
     * Retrieve a service instance.
     * @param id The unique identifier for the service.
     */
    public getService<T>(id: string): T | undefined {
        return this.services.get(id);
    }

    /**
     * Unregister a service.
     * @param id The unique identifier for the service.
     */
    public unregisterService(id: string): void {
        this.services.delete(id);
    }

    /**
     * Check if a service is registered.
     */
    public hasService(id: string): boolean {
        return this.services.has(id);
    }
}
