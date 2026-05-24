# Manager Addon Review - Castellan Architect SITREP

## 1. Constraint Verification
| Constraint | Status | Notes |
| :--- | :--- | :--- |
| **IDs** | ✅ PASS | `PulseReportSchema` correctly omits `id` fields. |
| **Async Generators** | ✅ PASS | Chat and pulse tools are standard `async`. |
| **Backend Integration** | ✅ PASS | `ManagerExtension` correctly registers `GenesisDashboardView`. |
| **Strict Types** | ❌ FAIL | Found `(w as any).errorLog` and `z.array(z.any())` in contracts. |
| **Jailed Sandbox** | ⚠️ WARNING | `manager_load_prompts` uses raw `fs` to read from `config/prompts`. |
| **Event Augmentation** | ❌ FAIL | `EventRegistry` augmentation is missing in `manager.contract.ts`. |

## 2. Findings & Architectural Debt
- **Type Safety**: The use of `any` to access `errorLog` in `manager_pulse` violates the strict TS mandate.
- **Contract Safety**: `managerListToolErrorsContract` and `managerEvaluateApprovalContract` use `z.any()`, which bypasses Zod's validation benefits at the API boundary.
- **Sandbox Compliance**: While reading system prompts from `config/prompts` is necessary, it should ideally be performed via a system-level utility rather than raw `fs` in a tool to maintain architectural consistency.
- **Event Registry**: The manager orchestrates complex loops but does not declare its events in the global registry.

## 3. Enhancement Plan
1. **Strict Typing**: Replace `any` casts with proper interfaces or Zod `parse`.
2. **Contract Refinement**: Replace `z.any()` in contracts with specific schemas (e.g., `MessageSchema` for tool errors).
3. **Event Augmentation**: Register manager-specific orchestration events in `manager.contract.ts`.
4. **Service Extraction**: Move FS logic from `manager.tools.ts` to a dedicated configuration service or use a system-scoped sandbox.
