# Agents Addon Architecture Review

## Overview
The `agents` addon is responsible for orchestrating autonomous execution turns and event-driven tool loops. It manages the lifecycle of `AgentRun`s.

## 1. Skills Directory (`skills/`)

### Compliance Checks
- **Async Generators (`async function*`)**: Not utilized in `agent.tools.ts`. While not explicitly streaming here, the standard emphasizes this syntax for tool executions if appropriate.
- **`ctx.sandbox` Usage**: No direct filesystem or process operations are present, making the absence of `ctx.sandbox` acceptable.
- **Typed Contracts**: `agent.contract.ts` defines structured, Zod-typed schemas for both Inputs and Outputs, following standards correctly.
- **Module Augmentation for Events**: **MISSING**. `agent.contract.ts` does not use `declare module` to augment the event registry for domain-specific events, despite the `agent.skill.ts` actively listening to events like `infer:tool_call_requested` and `infer:completed`. If these are core events, it might be acceptable, but if they belong to `agents` or `infer`, they should be strictly typed.
- **No `any`**: `agent.tools.ts` avoids `any` but uses `unknown` and casts when accessing the unified API: `(ctx.api as unknown as Record<string, Record<string, (args: unknown) => Promise<unknown>>>)`.
- **Schema & Type Pair**: `agent.schema.ts` properly exports both Zod schemas and inferred types (`AgentSchema`, `Agent`, `AgentRunSchema`, `AgentRun`).

### Findings
- **Redundant Context Wrapper**: In `agent.skill.ts`, there is a manual mapping (`createEventHandlerContext`) to pass `api`, `skills`, and `events` into `ISkillContext`. This should preferably be handled natively by `mountEventHandler` to avoid redundant state and potential race conditions during initialization.
- **Missing Event Registry Augmentations**: The domain events used or listened to should be explicitly registered in a `.contract.ts` to ensure type safety.

## 2. Extension Directory (`extension/`)

### Compliance Checks
- **Presence**: The `extension/` directory is virtually empty. It only contains an empty `views/` folder and no `index.ts`.
- **`addon.json`**: The manifest does not declare an `extension` entry point.

### Findings
- The `agents` addon operates purely as a backend system service at this point and does not contribute to the IDE frontend UI.

## 3. Architectural Inconsistencies & Missed Opportunities
- **Unified API Call Hack**: Both `agents` and `cron` use a brittle type-casting hack `(ctx.api as unknown as Record<...>)` to invoke tools dynamically. This indicates a gap in the `ISkillContext` typing for dynamic tool invocation.
- **Missing UI**: For an orchestration engine, the lack of an extension UI limits visibility into running agents, active threads, and execution states. 

## 4. Enhancement Plan
1. **Fix Typings & Event Registry**: Add `declare module` augmentation for events in `agent.contract.ts`. Refactor `agent.skill.ts` to properly consume `ISkillContext` in event handlers without manual wrapper methods.
2. **Standardize Dynamic API Invocations**: Provide a native method on `ISkillContext` or `ISkillRegistry` for strongly typed dynamic tool invocation, removing the need for `unknown` casting.
3. **Build Frontend Extension**: Create `extension/index.ts` to register UI panels (e.g., "Agent Monitor" view) that subscribe to `agent_run` updates and list active autonomous agents using the `getClient().api.agent_run.find()` API.
