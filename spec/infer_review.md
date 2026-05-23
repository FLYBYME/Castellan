# Addon Review: Infer

## Findings

### 1. Type Sovereignty & `any` Ban
- **Schema Violation**: `ThreadSchema` in `infer.schema.ts` uses `format: z.any()`. This is a direct violation of the engineering standards.
- **Casting Violation**: `getToolDefinition` in `infer.tools.ts` uses `zodToJsonSchema(contract.inputSchema as any)`. 
- **Extension Violation**: `InferenceManagerView.ts` and `ModelInventoryView.ts` use `as any` when accessing the client API.

### 2. Async Generators
- **Implementation**: `infer_chat` consumes an async generator from Ollama but is not implemented as an async generator itself. It uses `ctx.events.dispatch` for streaming chunks. While functional, it diverges from the mandated `async function*` pattern for streaming tools.

### 3. Architecture & Consistency
- **Module Augmentation**: Well-implemented in `infer.contract.ts`.
- **Sandbox Jailing**: No direct filesystem operations detected, but future model exports/imports should use `ctx.sandbox`.
- **Concurrency**: `acquire_ollama` and `release_ollama` provide a good foundation for multi-node inference.

## Enhancement Plan

1. **Fix Type Violations**:
    - Replace `z.any()` in `ThreadSchema` with `z.unknown()` or a more specific `JsonSchema` type.
    - Remove `as any` from `getToolDefinition`. Use a generic constraint if necessary.
    - Create a typed interface for the client in the extension and remove `as any` casts.

2. **Refactor `infer_chat`**:
    - Convert `infer_chat` to an async generator (`async function*`) to follow the standard for streaming tools. This will allow the platform to handle chunking more natively.

3. **Improve Inventory Management**:
    - Move the periodic refresh logic (currently commented out in `index.ts`) into a dedicated background worker or cron task within the skill.

4. **Add Model Tagging**:
    - Extend `ModelSchema` to support user-defined tags or categories for better organization in the inventory.
