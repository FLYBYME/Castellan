# Addon Review: Journal

## Findings

### 1. Type Sovereignty & `any` Ban
- **Extension Violation**: `DirectiveView.ts` and `LedgerView.ts` use `as any` extensively when calling `client.api`.
- **Entity Identification**: The views use `(entry as any).id` because the `JournalEntry` type inferred from Zod does not include the `id` field (which is injected by the platform's storage layer).

### 2. Event Augmentation
- **Missing Augmentation**: `journal.contract.ts` does not use `declare module '../../../core/events.js'` to register journal-specific events. While it relies on generic `data:updated` events, domain-specific events (e.g., `journal:proposal_created`) would provide better signal.

### 3. Architecture & Consistency
- **Skill Context**: The implementation of `getSkillContext` in `JournalSkill` is excellent. It provides the LLM with a clear summary of recent history and active directives, effectively "closing the loop" on episodic memory.
- **Sleep Cycle**: `journal_compress` implements the "Nightly Sleep Cycle" for distilling directives, which is a key architectural feature for long-term learning.

## Enhancement Plan

1. **Strict Typing for Entities**:
    - Introduce a `WithId<T>` helper or use the platform's generated types to ensure entities have `id: string` without using `as any`.
    - Fix all `as any` casts in the extension views.

2. **Register Journal Events**:
    - Add module augmentation for events like `journal:entry_added`, `journal:proposal_resolved`, and `journal:directives_consolidated`.
    - Update the tools to dispatch these events.

3. **Enhance Resolution UI**:
    - In `LedgerView.ts`, replace the native `prompt()` for rejection reasons with a `ui.FormDialog` to maintain a consistent look and feel.

4. **Automated Sleep Cycle**:
    - Register a cron job (using the `cron` addon pattern if available) to run `journal_compress` automatically at set intervals.
