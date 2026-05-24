# Sandbox Addon Review - Castellan Architect SITREP

## 1. Constraint Verification
| Constraint | Status | Notes |
| :--- | :--- | :--- |
| **IDs** | ✅ PASS | `SandboxSchema` correctly omits `id` fields. |
| **Async Generators** | ⚠️ WARNING | PTY output uses events instead of `async function*`. `terminal_logs` is a standard `async` tool. |
| **Backend Integration** | ⚠️ WARNING | `SandboxExtension` exists but its `activate` method is empty. |
| **Strict Types** | ❌ FAIL | Multiple uses of `any` in `sandbox.skill.ts` and `sandbox.tools.ts`. |
| **Jailed Sandbox** | ✅ PASS | Acting as the provider, it uses host tools appropriately. |
| **Event Augmentation** | ✅ PASS | `EventRegistry` is correctly augmented in `sandbox.contract.ts`. |

## 2. Findings & Architectural Debt
- **Type Safety**: High usage of `any` in `SandboxSkill` (e.g., `doc: any`, `(c: any)`, `(this.fs as any)`). This is a critical violation of the `any` ban.
- **Generator Usage**: The directive for streaming tools suggests `async function*`. While events work for PTY, `terminal_logs` could benefit from a streaming generator approach.
- **Extension Completeness**: The frontend extension is currently a skeleton and does not provide views for sandbox management or terminal interaction.

## 3. Enhancement Plan
1. **Total `any` Elimination**: Perform a surgical refactor of `SandboxSkill` and `sandbox.tools.ts` to replace all `any` with strict types and Zod schemas.
2. **Stream Refactoring**: Evaluate if `terminal_logs` and PTY interaction should transition to `async function*` for direct client streaming.
3. **Extension Implementation**: Develop the `SandboxExtension` to include a terminal view and sandbox resource dashboard.
4. **Error Handling**: Standardize error reporting across FS and Terminal tools to ensure they follow the `SuccessOutputSchema` or throw specific TypedErrors.
