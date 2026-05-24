# Agents Addon Review - Castellan Architect SITREP

## 1. Constraint Verification
| Constraint | Status | Notes |
| :--- | :--- | :--- |
| **IDs** | ✅ PASS | `AgentSchema` and `AgentRunSchema` correctly omit `id` fields. |
| **Async Generators** | ⚠️ WARNING | `agentStructuredInferContract` is defined but not implemented in `AgentSkill`. |
| **Backend Integration** | ✅ PASS | Extension structure exists, though `views` is currently empty. Integration is primarily through core chat loops. |
| **Strict Types** | ❌ FAIL | Broad cast in `agent.tools.ts`: `(ctx.api as unknown as Record<string, Record<string, (args: unknown) => Promise<unknown>>>)`. |
| **Jailed Sandbox** | ✅ PASS | No direct host FS access detected. |
| **Event Augmentation** | ❌ FAIL | `EventRegistry` augmentation is missing in `agent.contract.ts`. |

## 2. Findings & Architectural Debt
- **Missing Implementation**: `agentStructuredInferContract` is declared in the contract but never mounted or implemented. This breaks the "Contract as Source of Truth" mandate.
- **Type Safety**: The dynamic tool execution in `handle_tool_completion` uses a broad object cast to access `ctx.api`. This should be replaced with a type-safe registry or a properly mapped type.
- **Event Registry**: Custom events like `infer:tool_call_requested` (if originating here) or others are used without registry augmentation, losing type safety on the bus.

## 3. Enhancement Plan
1. **Contract Alignment**: Mount `agentStructuredInferContract` in `AgentSkill` and implement the handler in `agent.tools.ts`.
2. **Type Sovereignty**: Refactor `handle_tool_completion` to avoid `unknown` records. Use a typed registry for tool lookups.
3. **Event Augmentation**: Add `declare module '../../../core/events.js'` to `agent.contract.ts` and register all domain events.
4. **Zod Validation**: Ensure all `z.any()` or `z.unknown()` in contracts are replaced with specific schemas or mapped types.
