# Castellan Refactor Mandates: Strict Type Sovereignty & Headless Architecture

This document codifies the absolute architectural constraints for the Castellan refactor. These are not guidelines; they are hard mandates for the engineering of the new core.

## 1. Zero-Trust Typing (The "Anti-Any" Rule)

- **THE `any` BAN:** The use of `any` is strictly prohibited across the entire project. If a type cannot be resolved, a native TypeScript generic interface must be declared.
- **NO TYPE ASSERTIONS:** The use of the `as` keyword (e.g., `as T`, `as any`, `as Promise<unknown>`) is forbidden. Use strict runtime type guards (e.g., `isAsyncIterable`) to narrow types.
- **NO DOUBLE ASSERTIONS:** `as unknown as T` is a hard failure. Transitions between generic types and concrete schemas must be handled via Zod parsing or type guards.
- **NO TYPE ERASURE:** Forbid "erasing" types into `unknown` or `any` inside registries or maps. Use generics or Module Augmentation to maintain the type chain from dispatch to handler.
- **EVENT REGISTRY PATTERN:** Every event must be registered in a global `EventRegistry` interface using Module Augmentation. The `EventBus` must use this registry to provide 100% strict, autocomplete-friendly event handling.
- **NO HIDDEN PROPERTY ACCESS:** Accessing properties by casting to `any` (e.g., `(obj as any)._internal`) is strictly forbidden. All inter-module communication must happen through public, typed interfaces.
- **NO INDEX SIGNATURES:** Interfaces must not use dynamic index signatures (e.g., `[key: string]: unknown`). All properties must be explicitly declared or generated.
- **NO DYNAMIC PROXIES:** Core application interfaces (like `ctx.api`) must not be implemented using `Proxy`. They must be physically generated as TypeScript classes/objects by the `generate` command.
- **EXPORTED SCHEMAS:** Zod objects must never be defined inline within a function or contract. Every schema MUST be exported alongside its inferred type:
    ```typescript
    export const UserSchema = z.object({...});
    export type User = z.infer<typeof UserSchema>;
    ```

## 2. Headless Engine Architecture

- **DECOUPLED CORE:** The system core (`src/engine/`) must be a "Headless Engine." It must boot, connect to the DB, load skills, and execute tools entirely in-memory.
- **AGNOSTIC BOOT SEQUENCE:** The framework must be able to boot with an empty registry. There must be zero hardcoded imports of specific skill modules in the core engine.
- **STRICT GENERIC CONTEXT:** `ISkillContext` and `CastellanEngine` must be generic. The engine must be initialized with a specific `ICastellanApi` type, ensuring the context is fully typed at construction without proxies or casts.
- **TRANSPORT AS ADDON:** The HTTP/WebSocket Server (`src/server/`) and the CLI (`src/cli/`) are merely "addons" or transport layers. They instantiate the engine but contain zero core logic.
- **SKILL DECOUPLING:** If the `src/skills/` folder is deleted, the framework core must still function.
- **NON-CORE SKILLS:** `SystemSkill`, `AuditSkill`, and `SandboxSkill` are domain plugins, NOT core framework components. They must be treated like any other skill.

## 3. Unified API & Artifacts

- **CONSOLIDATED GENERATION:** All generated code must reside in a single root directory: `src/generated/`. 
- **CONTEXT API SENSITIVITY:** The `ctx.api` used inside skills must be a generated implementation that mirrors the client SDK. **DYNAMIC PROXIES ARE FORBIDDEN.** The implementation must be a physically generated TypeScript class.
- **DATABASE JAILING:** Skills are strictly FORBIDDEN from accessing the database or repositories directly (no `ctx.db`). All data persistence must route through the generated `ctx.api`.

## 4. Strict Persistence Layer

- **ZOD-NATIVE REPOSITORY:** The `DomainRepository` is the sole source of database interaction. It must be mathematically bound to Zod schemas.
- **ID SOVEREIGNTY:** 
    - MongoDB's `_id` (ObjectId) is the single source of truth. 
    - The application uses `id` (string). 
    - The repository is responsible for transparently mapping `_id` <=> `id`.
    - MongoDB MUST generate all IDs; the application layer is forbidden from manual ID generation.

## 5. Event System Overhaul

- **STRICT DEFINITIONS:** Every event must have a unique name and a strictly defined payload schema/type (e.g., `DataCreatedEvent`).
- **CORRELATION TRACING:** Every event and tool execution MUST be tagged with a `correlationId` (UUID). This is the only mechanism for tracing request lifecycles.
- **PURGE AGENT LOGIC:** The core engine must have zero knowledge of agent-specific concepts like `threadId`. Tracing is handled purely via `correlationId`.

## 6. Implementation Lifecycle

1. **BOOTSTRAP:** Move core primitives to `src/core/`.
2. **ENGINE:** Implement the headless `src/engine/`.
3. **GENERATOR:** Update `GenerateCommand` to produce the consolidated `src/generated/` artifacts.
4. **MIGRATION:** Move current skills to `tmp/skills/` and re-implement only the `demo` skill to verify the new architecture.
