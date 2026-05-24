# Surgical Review: infer Addon

## Findings

### 1. Type Sovereignty
- **VIOLATION**: `ThreadSchema` in `infer.schema.ts` uses `format: z.any().optional()`. This violates the absolute ban on `any`. It should be `z.unknown()` or a more specific schema if possible (e.g., for JSON schema).
- **VIOLATION**: `infer.tools.ts` uses `zodToJsonSchema(contract.inputSchema as any)`. This is a hard violation of the `any` ban.
- **STRENGTH**: Schema and Type pairs are correctly exported for all entities.

### 2. Async Generators & Streaming
- **VIOLATION**: `infer_chat` in `infer.tools.ts` is defined as `async function`, but it performs streaming inference and dispatches chunk events. Per the mandate, streaming tools (chat, logs) MUST use `async function*`. 
- **NOTE**: The function is marked with `// DO NOT CHANGE THIS FUNCTION`, which may indicate a legacy constraint or a delicate implementation that needs careful refactoring to the generator pattern.

### 3. Backend Integration
- **SUCCESS**: `InferenceManagerView.ts` correctly utilizes the generated SDK (`client.api.ollama`, `client.api.models`, `client.api.infer`) to interact with the backend.
- **NOTE**: The extension uses `this.context.ide.getClient() as any`, which should be typed with the generated `CastellanClient`.

### 4. Jailed Sandbox
- **VERIFIED**: The `infer` addon primarily performs network-based operations (Ollama API). It does not perform host filesystem operations, thus complying with the jailing principle by omission. If it were to save logs or models locally, it would need to use `ctx.sandbox.getSandbox()`.

### 5. Event Augmentation
- **SUCCESS**: `infer.contract.ts` correctly augments `EventRegistry` with a comprehensive list of domain-specific events (`infer:thinking_chunk`, `infer:content_chunk`, etc.).

## Enhancement Plan

1. **Fix `any` usage**: 
    - Replace `z.any()` in `ThreadSchema` with `z.record(z.string(), z.unknown()).optional()`.
    - Fix the `as any` in `getToolDefinition` by providing a proper type or using `unknown`.
2. **Refactor to Async Generator**:
    - Transition `infer_chat` to `async function*` to yield chunks directly instead of (or in addition to) dispatching events. This aligns with the "Streaming tools = `async function*`" mandate.
3. **Type the Client**:
    - Update the extension views to use `import type { CastellanClient } from '../../../generated/client/CastellanClient.js'` and cast the client appropriately if the IDE interface isn't generic.

## Verification
- [x] IDs: Verified system auto-generates IDs; base schemas are clean.
- [x] Async Generators: Identified as needing refactoring for `infer_chat`.
- [x] Backend Integration: Verified `extension/` calls `skills/` via API.
- [x] Strict Types: Identified two `any` violations.
- [x] Jailed Sandbox: Verified no host FS leakage.
- [x] Event Augmentation: Verified `EventRegistry` is correctly populated.
