# Addon Review: Kanban

## Findings

### 1. Type Sovereignty & `any` Ban
- **Tool Violation**: `kanban_move` in `kanban.tools.ts` uses `(updated as any).title || (updated as any).name`.
- **Extension Violation**: `KanbanBoardView.ts` and `TaskInspectorView.ts` use `as any` for client access and entity IDs.
- **Strict TS**: The `VALID_TRANSITIONS` map is not strictly typed to ensure all `KanbanStage` keys are present.

### 2. Event Augmentation
- **Missing Augmentation**: No module augmentation for Kanban events in `kanban.contract.ts`. The extension uses a custom event `kanban:task_selected` which is not globally registered.

### 3. Architecture & Consistency
- **Distributed Sandbox usage**: The `kanban_work_item_after_create` hook correctly uses the `sandbox` skill's API for terminal execution, showing good inter-skill communication.
- **Rollup Logic**: The feature status rollup logic in `kanban_move` is a good example of business logic encapsulation in tools.
- **Skill Context**: `KanbanSkill` provides high-level visibility into active missions and ready features.

## Enhancement Plan

1. **Fix Type Violations**:
    - Remove `as any` from `kanban_move`. Use a type guard or a shared interface that includes both `title` and `name` (or handle them separately based on type).
    - Ensure `KanbanTask` and `KanbanFeature` include `id: string` in their view-level types.
    - Fix all `as any` casts in the extension views.

2. **Register Kanban Events**:
    - Register `kanban:task_selected`, `kanban:task_moved`, and `kanban:provisioning_failed` in `kanban.contract.ts`.
    - Use these events for reactive UI updates instead of just relying on `data:updated`.

3. **Improve Validation**:
    - Make `VALID_TRANSITIONS` a `Record<KanbanStage, readonly KanbanStage[]>` to enforce completeness.

4. **Sandbox Integration**:
    - Add a tool to "Open Sandbox Terminal" for a specific work item, using the stored `sandboxId`.
