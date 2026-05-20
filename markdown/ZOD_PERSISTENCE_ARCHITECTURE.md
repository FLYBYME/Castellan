# Architecture Specification: Headless Engine & Zod-Native Persistence

**Objective:** Transform Castellan into a headless, pure framework (plumbing) that is decoupled from both its skills (abilities) and its transport layers (server/CLI). Enforce a unified, Zod-strict API for all data access and overhaul the event system.

## 1. The Headless Engine (Pure Core)

The Core consists ONLY of the execution engine located in `src/engine/`. It boots, connects to the DB, loads skills, and runs tools entirely in-memory. It knows nothing about HTTP, WebSockets, or the CLI.

- **`CastellanEngine`:** The central orchestrator. Boots the Database, initializes the EventBus, and loads the SkillRegistry.
- **Persistence Layer (`src/engine/db/`):** `DomainRepository` and `Database` (dynamic repository manager).
- **Execution Pipeline (`src/engine/core/`):** `ToolExecutor` (validates, executes, and intercepts tools), and the `SkillRegistry` (dynamic/lazy loading).
- **Overhauled EventBus (`src/engine/events/`):** A strictly-typed, hierarchical event emitter (e.g., `system:boot`, `agent:thinking`). Deeply integrated so every repository mutation and tool execution automatically fires events.

## 2. Transport Addons (The Interface)

The Engine is exposed to the outside world via independent transport wrappers.

- **The Server (`src/server/`):** An addon that instantiates the `CastellanEngine`.
  - **REST API:** Dynamically mounts Fastify routes using `ToolContract.rest` metadata, piping HTTP requests directly into the Engine's `ToolExecutor`.
  - **WebSocket Hub:** Attaches to the Engine's `EventBus` to stream events to clients, and accepts incoming WS messages to trigger the `ToolExecutor`.
- **The CLI (`src/cli/`):** An addon that boots the Engine in-memory to execute single commands.

## 3. ID Mapping Strategy (_id <=> id)

**Architectural Mandate:** MongoDB's `_id` is the single source of truth for identity. The application layer uses the field name `id` (string).

1. **Generation:** The application must NOT generate IDs. MongoDB's auto-generated `ObjectId` will be used.
2. **Output Mapping:** Every document retrieved from MongoDB must have its `_id` (ObjectId) converted to a string and assigned to the `id` field. The `_id` field must be deleted before Zod parsing.
3. **Input Mapping:** Every query or update referencing `id` must transparently target the `_id` field.

## 4. The Repository Boundary (`src/engine/db/DomainRepository.ts`)

**Purpose:** The *only* mechanism in the application allowed to interact with a MongoDB collection. It handles strict Zod validation, transparent ID mapping, and automatic EventBus dispatching upon mutation.

## 5. Consolidated Artifacts (`src/generated/`)

All code generation must be consolidated into a single directory. Manual edits to this folder are strictly forbidden.

- `src/generated/client/CastellanClient.ts`: The strictly-typed SDK.
- `src/generated/cli/ToolCommands.ts`: The auto-mapped CLI command tree.
- `src/generated/server/ContextApi.ts`: **NEW.** A server-side API proxy that allows skills to call other tools/CRUD operations internally.

## 6. The Unified Context API (`ctx.api`)

**Architectural Mandate:** Skills are **FORBIDDEN** from touching the database directly (no `ctx.db`). All data access must route through `ctx.api`.

1. **Symmetry:** `ctx.api` mirrors the structure of the client SDK.
   - Example: `await ctx.api.message.list({ query: { threadId } })`
2. **Local Execution:** Calls to `ctx.api` route directly through the `ToolExecutor`. This ensures that internal calls trigger the exact same validation, CRUD hooks, and event dispatching as external API calls.
3. **Type Safety:** The generated `ContextApi.ts` provides full IntelliSense for all registered domains, entirely free of `any`.
