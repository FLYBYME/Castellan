# Addon Review: notifications

## 1. Compliance with GEMINI.md Standards

### Type Sovereignty (STRICT ENFORCEMENT)
- **Violations**:
    - `notifications.tools.ts`: The `log` function uses `meta?: any`.
- **Strengths**: `notifications.schema.ts` is excellent, using `z.coerce.date()` and proper enums.

### Distributed Microkernel Architecture
- **Status**: Proper isolation and message passing.

### Implementation
- **Async Generators**: Not strictly necessary for current tools, but could be used for a notification stream if needed.
- **Sandbox Jailing**: No FS operations performed.
- **Event Augmentation**: **GOOD**. Correctly augments `notifications:new` in `notifications.contract.ts`.

## 2. Extension Review (`extension/`)

- **Backend Integration**: **EXCELLENT**. Uses both the client API for history and command listeners for real-time updates.
- **Service Registration**: Correctly registers a `notifications` service.

## 3. Findings & Architectural Inconsistencies

1.  **Weak ID Generation**: `Math.random().toString(36)` is used for notification IDs. Should use `crypto.randomUUID()`.
2.  **Console UI**: Toast notifications are routed to `console.info` in `NotificationService.ts`. This is a "stub" UI.
3.  **In-Memory Only**: Notifications are lost on server restart.

## 4. Enhancement Plan

1.  **Fix Types**: Remove `any` from the `log` helper.
2.  **Robust IDs**: Use `crypto.randomUUID()` for notification IDs.
3.  **Proper Toast UI**: Implement a `Toast` component in `ui-lib` and use it in `NotificationService` instead of `console.info`.
4.  **Persistence**: Move `notificationHistory` from an in-memory array to a `pulse_report`-style CRUD or a dedicated database collection.
5.  **Status Bar Integration**: Improve the status bar routing to handle multiple notifications or a queue.
