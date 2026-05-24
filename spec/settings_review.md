# Settings Addon Review - Castellan Architect SITREP

## 1. Constraint Verification
| Constraint | Status | Notes |
| :--- | :--- | :--- |
| **IDs** | ✅ PASS | Settings use keys as IDs; correctly handled. |
| **Async Generators** | ✅ PASS | Standard `async` used. |
| **Backend Integration** | ✅ PASS | Extension calls the backend tools for configuration. |
| **Strict Types** | ❌ FAIL | Extensive use of `z.any()` and `Record<string, any>`. |
| **Jailed Sandbox** | ❌ FAIL | **CRITICAL VIOLATION**: Uses host `fs` to read/write `castellan.json`. |
| **Event Augmentation** | ❌ FAIL | Missing `EventRegistry` augmentation. |

## 2. Findings & Architectural Debt
- **Sandbox Breach**: Direct access to `castellan.json` on the host bypasses the jailed sandbox mandate. Configuration should be stored in the database or accessed via a jailed filesystem.
- **Type Sovereignty**: `z.any()` in the contract and `any` in the config loading functions completely bypass the type system. This is a hard violation of the `any` ban.

## 3. Enhancement Plan
1. **Remediate Sandbox**: Move configuration storage to the `Database` or use `ctx.sandbox.getSandbox()` to manage the config file within the jail.
2. **Schema Definition**: Replace `z.any()` with a specific `ConfigSchema` that defines known settings, using a catch-all `unknown` only where strictly necessary for extensibility.
3. **Implement Events**: Dispatch `settings:updated` events and register them in the `EventRegistry`.

## Verification
- [x] IDs: Verified.
- [x] Async Generators: Verified.
- [x] Backend Integration: Verified.
- [x] Strict Types: **FAILED** - Excessive `any` usage.
- [x] Jailed Sandbox: **FAILED** - Requires immediate remediation.
- [x] Event Augmentation: **FAILED** - Missing.
