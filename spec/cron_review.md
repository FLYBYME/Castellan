# Cron Addon Architecture Review

## Overview
The `cron` addon provides background automation and scheduled tasks, managing `CronJob` and `CronJobRun` entities through a polling `CronScheduler`.

## 1. Skills Directory (`skills/`)

### Compliance Checks
- **Async Generators (`async function*`)**: Not utilized. The `cron_trigger` and scheduler handle tool executions via standard async/await.
- **`ctx.sandbox` Usage**: No direct filesystem operations, so `ctx.sandbox` is not used.
- **Typed Contracts**: `cron.contract.ts` is excellently structured with specialized input/output schemas for triggering, resetting, and status checking.
- **Module Augmentation for Events**: **PRESENT**. `cron.skill.ts` properly augments `EventRegistry` for `cron:job_completed`. **CRITIQUE**: The result property uses `any`. Standard requires `unknown` and validation at boundaries.
- **No `any`**: `CronScheduler.ts` uses `any` in its parser type cast: `parser as unknown as { parse: ... }`. This is acceptable for library wrappers but should be minimized.
- **Schema & Type Pair**: `cron.schema.ts` follows the standard correctly.

### Findings
- **Stuck Status Risk**: The `cron_trigger` implementation uses an inline `Promise` with a 5-minute timeout. This could lead to memory leaks if many triggers are fired and time out without proper disposal of event listeners.
- **Dynamic API Call Hack**: Like `agents`, it uses `(this.context.api as unknown as Record<...>)`. This should be abstracted.

## 2. Extension Directory (`extension/`)

### Compliance Checks
- **`getClient().api`**: Used extensively in `JobSchedulerView.ts`.
- **`any` Violation**: `const client = this.context.ide.getClient() as any;` - **FAILURE**. The extension uses `any` several times to bypass TypeScript checks for the client.
- **Standard UI Library**: Correctly uses `@ui-lib` components (Toolbar, Stack, Card, Button, etc.).

### Findings
- **Manual Data Polling**: The view manually calls `this.refreshData()` after operations. While it does listen for `data:updated` events, the implementation relies on `any` for the payload and could be more robustly typed with `unknown` and property checks.
- **Direct Property Access**: Accessing `(job as any).id` is necessary because the `CronJob` schema in `skills/` doesn't include the DB-injected `id` field. This mismatch between DB entities and Zod schemas should be resolved at the schema definition level or via a common base interface.

## 3. Architectural Inconsistencies & Missed Opportunities
- **Scheduler Scalability**: The `GLOBAL_MAX_CONCURRENCY` is hardcoded to 1. While safe, it severely limits the background processing capability of the system. This should be a configuration option.
- **Wait Trigger Reliability**: Waiting for a job completion via the event stream is brittle. If the server restarts while a job is running, the client waiting for the event will hang or timeout, even if the job is eventually reclaimed.

## 4. Enhancement Plan
1. **Strongly Type the Client**: Import the generated `CastellanClient` type in `JobSchedulerView.ts` and use it instead of `any`.
2. **Schema Alignment**: Add an `id: z.string()` field to a derived version of `CronJob` in `cron.schema.ts` or ensure the CRUD generator exposes an `Identifiable<T>` type.
3. **Refactor Event Listeners**: Use a more robust pattern for the `wait` trigger in `cron_trigger`, ensuring that listeners are cleaned up under all failure conditions.
4. **Remove `any` from Events**: Update `EventRegistry` augmentation to use `unknown` instead of `any` for the `result` payload.
