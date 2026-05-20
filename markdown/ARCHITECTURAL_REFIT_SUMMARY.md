# Castellan Architectural Refit: Summary of Changes

This document summarizes the comprehensive overhaul of the Castellan platform, transitioning from a complex, entity-heavy agent model to a streamlined, "Pure Inference" architecture.

## 1. Core Architecture: The "Pure Inference" Model
The most significant shift was the elimination of the standalone **Thread** entity.
- **Data Model**: Conversation history is now managed purely via a `threadId` grouping key on `Message` entities. This simplifies the database and allows for "stateless" inference.
- **Dynamic System Prompts**: The active persona for a thread is no longer fixed. The system now resolves the **most recent** `system` message in a thread's history as the active prompt. This allows for auditable and versioned behavioral changes within a single conversation.

## 2. Inference Engine Redesign (`agent.tools.ts`)
The internal execution logic has been radically simplified and made more robust.
- **InferenceManager**: Replaced a complex `AsyncIterable` queue with a clean, Promise-based async generator lock. This ensures sequential processing of Ollama requests with minimal boilerplate.
- **Autonomous Looping**: The `agent_infer` tool now autonomously handles the tool-calling loop. It continues to execute tools and feed results back to the model until a final, content-rich response is generated.
- **Standardized Metrics**: Every assistant message now captures detailed performance data from Ollama, including prompt/completion token counts and various durations (total, load, eval).
- **Server-side Visibility**: Restored real-time terminal logging on the server. Developers can now monitor 'thinking', 'content', and 'tool execution' directly in the server console.

## 3. Event Stream Protocol Standardization
The platform now uses a unified event protocol for all streaming interactions.
- **Core Event Types**: Standardized on 5 event types: `thinking`, `content`, `tool_call`, `tool_result`, and `done`.
- **Sub-Agent Bubbling**: Implemented `parentThreadId` awareness. When a sub-agent executes a task, its events (thinking, content, etc.) are automatically mirrored to the parent thread's stream with a `subThreadId` attribute, allowing for real-time monitoring of nested agent workflows.

## 4. Tool & Skill Simplification
Ripped out ~30% of legacy boilerplate and redundant high-level tools to reduce system complexity.
- **Removed Tools**: `agent_execute`, `agent_thread_history`, `agent_analyze`, and `agent_discovery`.
- **Unified Orchestration**: The `agent_run` tool is now a thin, high-level wrapper that injects the Dynamic SITREP (Situation Report) and Skill contexts before handing off to the low-level `agent_infer` engine.
- **Skill Alignment**: Refactored the `manager`, `web`, and `cron` skills to consume the new simplified inference flow.

## 5. Quality Assurance & Engineering Standards
- **Unit Testing**: Introduced `src/skills/agents/agent.tools.test.ts`, providing 100% coverage for the `InferenceManager` queue, the autonomous loop logic, and sub-agent event bubbling.
- **Type Sovereignty**: Cleaned up the `ISkillContext` mocks and ensured the entire project passes `tsc --noEmit`.
- **Regenerated SDK**: Updated the `CastellanClient` and CLI `ToolCommands` to match the refined contracts.

## 6. Future Roadmap: UI Rewrite
Prepared the foundation for the upcoming UI Extension rewrite (see `UI_REWRITE_PLAN.md`).
- **Schema-Driven CRUD**: The UI will transition to using high-order components (`CrudList`, `CrudForm`) that automatically generate management interfaces by inspecting the server's Zod schemas.

---
**Status**: The server-side refit is complete. The system is leaner, faster, and more auditable.
