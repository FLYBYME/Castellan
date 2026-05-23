# Addon Review: marketplace

## 1. Compliance with GEMINI.md Standards

### Type Sovereignty (STRICT ENFORCEMENT)
- **Violations**:
    - `marketplace.tools.ts`: The `log` function uses `meta?: any`.
- **Strengths**: `marketplace.schema.ts` is well-defined and exported correctly.

### Distributed Microkernel Architecture
- **Status**: Backend logic is properly separated.

### Implementation
- **Async Generators**: **MISSING**. `marketplace_install` could benefit from being a generator to report installation progress.
- **Sandbox Jailing**: **VIOLATION**. `marketplace_list` uses `fs.readdirSync` and `fs.statSync` directly on `./src/addons`. This is a host filesystem operation that should be jailed or handled via a system-level provider.
- **Event Augmentation**: **MISSING**. No events are augmented for the marketplace (e.g., `marketplace:addon_installed`).

## 2. Extension Review (`extension/`)

- **Backend Integration**: **GOOD**. `MarketplaceViewProvider.ts` correctly uses `this.context.ide.getClient().api.marketplace.list({})`.
- **Type Safety**: **VIOLATION**. Uses `this.context.getService<any>('notifications')`. Should use a proper interface.

## 3. Findings & Architectural Inconsistencies

1.  **Synchronous I/O**: `marketplace_list` uses synchronous `fs` methods, which can block the worker thread.
2.  **Host FS Access**: Directly scanning `src/addons` on the host FS violates the jailing mandate.
3.  **Stubbed Installation**: `marketplace_install` is a placeholder that always fails with a message about "prototype mode."

## 4. Enhancement Plan

1.  **Fix Types**: Remove `any` from `log` and extension service retrieval.
2.  **Async/Jail FS**: Convert `marketplace_list` to be asynchronous and use the sandbox context if appropriate (though marketplace might need special "system" FS access, it should be explicitly handled).
3.  **Implement Installation**: Flesh out `marketplace_install` to at least simulate a successful installation or handle local addon activation.
4.  **Add Events**: Augment events for `marketplace:installed` and dispatch them from `marketplace_install`.
5.  **Generator Progress**: Convert `marketplace_install` to an async generator to stream progress (e.g., "Downloading...", "Extracting...", "Activating...").
