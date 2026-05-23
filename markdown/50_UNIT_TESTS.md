# 50 Comprehensive Unit Tests for Castellan Git Flow

This document defines 50 unit tests required to verify the integrity, security, and automation of the Castellan platform following the Git Flow Kanban overhaul.

## 1. Kanban Domain (Projects, Features, WorkItems)
1.  **Project Creation**: Verify `kanban_project_create` saves all required fields (gitUrl, defaultBranch, sandboxImage) correctly to MongoDB.
2.  **Duplicate Projects**: Ensure creating a project with a duplicate `gitUrl` is handled (either rejected or resolved).
3.  **Feature Linking**: Verify `kanban_feature_create` fails if a non-existent `projectId` is provided.
4.  **Feature Hierarchy**: Confirm that deleting a Project also prunes or orphans its associated Features.
5.  **WorkItem Linking**: Verify `kanban_work_item_create` fails if a non-existent `featureId` is provided.
6.  **WorkItem Validation**: Ensure `kanban_work_item_create` rejects calls missing `branchName` or `title`.
7.  **Legacy Compatibility**: Verify that the `KanbanTask` type alias correctly maps to `KanbanWorkItem` for UI consumers.
8.  **Stage Transitions**: Test `kanban_move` for a WorkItem from `Backlog` -> `Ready`.
9.  **Invalid Transitions**: Verify `kanban_move` rejects illegal jumps (e.g., `Backlog` -> `Done` without `Testing`).
10. **Feature Status Rollup**: Test if a Feature's status automatically updates when all its WorkItems are `Done`.
11. **WorkItem Search**: Verify `kanban_work_item_find` filters correctly by `featureId`.
12. **Priority Sorting**: Ensure Kanban queries correctly respect the `PriorityLevel` enum order (Critical > High > Medium > Low).
13. **Dependency Blocking**: Verify `kanban_move` to `In Progress` is blocked if a WorkItem has uncompleted `dependencies`.
14. **Error Logging**: Confirm that the `errorLog` array in WorkItems correctly persists stack traces from failed hooks.
15. **Timestamps**: Verify `createdAt` and `updatedAt` are automatically managed for all Kanban entities.

## 2. Automated Provisioning (Hooks)
16. **Auto-Sandbox Creation**: Verify that `kanban_work_item_after_create` triggers `sandbox_create` when a valid project context exists.
17. **Sandbox Reuse**: Ensure the hook reuses an existing active sandbox for the same `gitUrl` instead of creating a duplicate.
18. **Branch Checkout**: Verify the hook executes `git checkout -b <branch>` inside the sandbox after creation.
19. **Sandbox Linking**: Confirm the `sandboxId` is correctly updated on the WorkItem record after the hook completes.
20. **Hook Failure Recovery**: If `git checkout` fails, verify the WorkItem remains but includes the error in its `errorLog`.
21. **Atomic Teardown**: Verify `kanban_work_item_after_delete` successfully removes the associated Docker container and host folder.
22. **Orphaned Sandbox Cleanup**: Ensure that if a WorkItem is deleted but the sandbox delete fails, the system logs the leak for the `prune` tool.
23. **Concurrent Provisioning**: Test creating 5 WorkItems for the same Project simultaneously and verify only 1 sandbox is created (locking).
24. **Image Inheritance**: Verify the sandbox is created with the `sandboxImage` defined in the parent Project.
25. **Default Sandbox Configuration**: Ensure a WorkItem created without a specific project configuration defaults to `node:18`.

## 3. Manager & Delegation
26. **Automated Context Switching**: Verify `manager_execute` updates the `active_sandbox` global setting to match the WorkItem's `sandboxId`.
27. **Thread ID Propagation**: Ensure sub-agents are spawned with the `threadId` already associated with the WorkItem.
28. **Tool List Injection**: Verify the sub-agent prompt contains the `### Your Authorized Tools` section with the correct tool list.
29. **Engineer Toolset**: Confirm the Engineer sub-agent receives `sandbox_terminal_execute` but NOT `sandbox_delete`.
30. **Inquirer Toolset**: Confirm the Inquirer sub-agent receives `sandbox_fs_read` but NOT `sandbox_fs_write`.
31. **Recursive Delegation**: Test if the Orchestrator can call `manager_execute` which then uses `manager_inquire`.
32. **Pulse Health Check**: Verify `manager_pulse` correctly counts failed WorkItems vs active sandboxes.
33. **SITREP Accuracy**: Ensure `manager_pulse` generates a report that matches the actual database state.
34. **Wait Semantics**: Verify `manager_run` with `wait: true` only returns after the agent run enters a terminal state (`done`, `failed`).
35. **Multi-Judge Consensus**: Test `manager_evaluate_approval` with conflicting judge verdicts (2 PASS, 1 FAIL) and verify result is REJECTED.

## 4. Core Platform & Registry
36. **Domain-Action Matching**: Verify `SkillRegistry.getTool` correctly distinguishes between `kanban_project_create` and `kanban_feature_create`.
37. **Underscore Naming**: Ensure `parseToolKey` correctly splits `domain_action` using the underscore convention.
38. **Print High-Signal List**: Verify `sandbox_fs_list` print function outputs a Markdown table, not just a count.
39. **Print High-Signal Content**: Verify `sandbox_fs_read` print function outputs a code block with the file content.
40. **Server Context in Errors**: Confirm that a failed tool call returns a JSON response containing the `domain`, `action`, and `input` for the client.
41. **Client-Side Error Enrichment**: Verify `BaseClient` throws an Error object that includes the `serverContext` property.
42. **Tool Validation**: Ensure `ToolExecutor` rejects inputs that violate the Zod `inputSchema` before calling the tool.
43. **CRUD Interception**: Verify that tools with `isCrud: true` bypass the manual `execute` method and route to `executeCrud`.
44. **Streaming Telemetry**: Verify `ToolExecutor` logs the start, duration, and chunk count for streaming tools.
45. **Global Setting Fallback**: Confirm `getActiveSandbox` correctly resolves from settings if `ctx.sandboxId` is missing.

## 5. Sandbox Core & Security
46. **Jailing Enforcement**: Verify `Sandbox.resolvePath` prevents access to files outside the `/workspace` mount (e.g., `/etc/passwd`).
47. **Output Capping**: Test `terminal_execute` with 1MB of stdout and verify it is truncated to 50,000 characters (tail preserved).
48. **Real-time Logging**: Ensure `terminal_execute` streams output to the host `process.stdout` in real-time.
49. **Timeout Cleanup**: Verify that a timed-out `terminal_execute` call correctly kills the underlying shell process in the container.
50. **Environment Isolation**: Confirm that environment variables set in Sandbox A are not visible to processes running in Sandbox B.
