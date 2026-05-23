# Addon Review: manager

## 1. Compliance with GEMINI.md Standards

### Type Sovereignty (STRICT ENFORCEMENT)
- **Violations**:
    - `manager.contract.ts`: `managerListToolErrorsContract` uses `z.array(z.any())` in `outputSchema`.
    - `manager.contract.ts`: `managerEvaluateApprovalContract` uses `z.array(z.any())` in `outputSchema`.
    - `manager.tools.ts`: `manager_pulse` uses `(w as any).errorLog`.
    - `manager.tools.ts`: `manager_list_tool_errors` uses `(m as { tool_call_id?: string }).tool_call_id` which is a partial bypass of strict typing.

### Distributed Microkernel Architecture
- **Status**: Backend skills are isolated in `manager.skill.ts`.
- **Message Passing**: Handled via contracts.

### CLI & Lifecycle
- **Status**: Contracts are defined, but some are under-utilized.

### Implementation
- **Async Generators**: **MISSING**. None of the tools in `manager.tools.ts` use the `async function*` syntax, even though `manager_chat` and `manager_run` are long-running operations that could benefit from streaming status updates.
- **Sandbox Jailing**: **VIOLATION**. `manager_load_prompts` uses `fs` and `path` directly to read from `config/prompts` on the host filesystem. While these are system configurations, the mandate requires all FS operations to be jailed via `ctx.sandbox.getSandbox()`.
- **Event Augmentation**: **MISSING**. There is no `declare module '../../../core/events.js'` in `manager.contract.ts`, even though the manager is a central hub that likely should dispatch system-wide events.

## 2. Extension Review (`extension/`)

- **Backend Integration**: The `GenesisDashboardView.ts` is largely a UI stub. It contains placeholder comments like `// Execution logic would go here` instead of calling `this.context.ide.getClient().api.manager.chat(...)`.
- **Inconsistencies**: The UI shows a "Genesis" and "Bootstrap" process, but these don't map directly to the tools defined in the contract (e.g., `manager_chat`, `manager_pulse`).

## 3. Findings & Architectural Inconsistencies

1.  **Type Safety**: The use of `z.any()` in contracts is a critical failure that will break the SDK generation's type safety.
2.  **Sandbox Escape**: Reading system prompts directly from the host FS bypasses the security model.
3.  **UI/Backend Disconnect**: The extension provides a dashboard for a "Genesis" process that isn't fully reflected in the backend contract.

## 4. Enhancement Plan

1.  **Fix Types**: Replace `z.any()` with specific Zod schemas in `manager.contract.ts`. Eliminate `as any` in `manager.tools.ts`.
2.  **Jail Filesystem**: Refactor `manager_load_prompts` to use `ctx.sandbox.getSandbox()` if possible, or define a safe system-level read utility if host access is truly required for config.
3.  **Implement Async Generators**: Convert `manager_chat` and `manager_run` to async generators to provide real-time SITREP updates to the frontend.
4.  **Complete Extension**: Implement the `runGenesis` and `runBootstrap` methods in `GenesisDashboardView.ts` to call the appropriate backend tools.
5.  **Event Augmentation**: Add module augmentation for manager events (e.g., `manager:pulse_completed`, `manager:mission_started`).
