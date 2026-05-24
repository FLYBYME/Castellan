# Surgical Review: kanban Addon

## Findings

### 1. Type Sovereignty
- **VIOLATION**: `kanban.tools.ts` uses `(updated as any).title || (updated as any).name`. This violates the `any` ban. It should use a proper type guard or a shared interface/intersection.
- **STRENGTH**: Complex schemas for `KanbanProject`, `KanbanFeature`, and `KanbanWorkItem` are well-defined and exported with their types.

### 2. Async Generators & Streaming
- **N/A**: No streaming tools identified in this addon.

### 3. Backend Integration
- **SUCCESS**: `KanbanBoardView.ts` correctly interacts with the backend via `client.api.kanban_work_item`, `client.api.kanban_feature`, and the custom `client.api.kanban.move` tool.
- **SUCCESS**: Use of `mountCrudHook` in `kanban.skill.ts` demonstrates advanced integration of business logic with the persistence layer.

### 4. Jailed Sandbox
- **SUCCESS**: `kanban_work_item_after_create` correctly uses the Sandbox API (`ctx.api.sandbox.terminal_execute`) to perform git operations. This ensures that the Castellan Hub is not performing host-level filesystem mutations, adhering to the jailing mandate.

### 5. Event Augmentation
- **MISSING**: `kanban.contract.ts` does not augment `EventRegistry`. The UI emits `kanban:task_selected`, which is not registered in the contract. Domain events like `kanban:task_moved` or `kanban:provisioning_failed` should be added.

## Enhancement Plan

1. **Fix `any` usage**: Refactor the return object in `kanban_move` to avoid `as any`. Use a type guard or check `input.type`.
2. **Event Augmentation**: 
    - Register domain events in `kanban.contract.ts`.
    - Dispatch `kanban:item_moved` from `kanban_move` tool.
3. **Type the Client**: Update `KanbanBoardView.ts` to use a typed `CastellanClient`.

## Verification
- [x] IDs: Verified system auto-generates IDs.
- [x] Async Generators: Not required.
- [x] Backend Integration: Verified `extension/` calls `skills/` via API.
- [x] Strict Types: Identified one `any` violation in `kanban.tools.ts`.
- [x] Jailed Sandbox: Verified correct usage of `ctx.api.sandbox` for git operations.
- [x] Event Augmentation: Identified as missing.
