# Audit Skill, HITL & Evaluation Framework Plan

## Overview
The goal is to introduce a new `AuditSkill` that not only post-processes historical message runs to identify bugs but also provides a structured **Evaluation Framework**. This ensures that when a human provides feedback (via the Journal), we can empirically **prove** that the agent's behavior has changed. 

This bridges the gap between identifying an issue, creating a rule (`Directive`), and verifying the fix through automated "LLM-as-a-Judge" testing within an environment-anchored sandbox.

---

## 1. Schema Additions

### `Scenario` (The World State)
A snapshot of a specific environment state used for testing.
- `id`: string
- `name`: string
- `gitUrl`: string (The repository serving as the "world")
- `commitHash`: string (The exact version of the repository)
- `vaguePrompt`: string (The minimal context user prompt, e.g., "where are we?")
- `goldStandardSITREP`: string[] (Knowledge points the agent MUST discover)

### `AuditRun` (The Investigation)
Tracks the progress of background audits over the message history.
- `id`: string
- `threadId`: string (The historical thread being audited)
- `auditorPersona`: string (Which specialized auditor ran this)
- `status`: 'pending' | 'processing' | 'completed' | 'failed'

### `Bug` / `Violation`
When an audit identifies an issue, it creates a tracked entity.
- `id`: string
- `severity`: 'low' | 'medium' | 'high' | 'critical'
- `description`: What went wrong.
- `messageId`: The specific message that caused the violation.
- `scenarioId`: Link to the Scenario generated to reproduce this bug.

### `Evaluation` (The Grade)
A grading record created when an agent is tested against a Scenario.
- `id`: string
- `scenarioId`: string
- `agentId`: string (The agent being tested)
- `scores`: { manager: number, thinker: number, doer: number, overall: number }
- `consensusCritique`: string (The merged reasoning from the multi-judge ensemble)
- `testThreadId`: string (The isolated sandbox thread where the test occurred)

---

## 2. Specialized Auditor Agents
Specialized LLM personas look for specific categories of failure during the "Sweep" phase:
1. **Security Auditor**: Looks for secrets in text, unauthorized filesystem access, or dangerous terminal commands.
2. **Loop Auditor**: Looks for repeating tool calls or agents getting stuck in conversational dead-ends.
3. **Style & Convention Auditor**: Looks for violations of project guidelines (e.g., using `any`, ignoring `GEMINI.md`).

---

## 3. The Human-In-The-Loop (HITL) Workflow

1. **Sweep & Report**: The `audit_sweep` cron job runs auditors over historical threads. Findings are logged as `JournalEntry` proposals.
2. **Human Review**: The user reviews a pending bug and provides a `correction`.
3. **Distillation**: `journal_compress` turns this into a permanent `Directive` (Rule).
4. **Regression Setup**: The system automatically generates a `Scenario` (Git URL + Commit + Prompt) that reproduces the failure.

---

## 4. Environment-Anchored Triad Evaluation

Evaluation is anchored in a **Node.js Docker Sandbox**. We test the agent's ability to **autonomously discover context** without being spoon-fed.

### A. The Triad Testbed
Every test evaluates the three distinct roles to find the exact point of failure:

1. **The Manager Test (Context Resolution)**:
   - *Goal*: Can the Manager translate a vague prompt ("where are we?") into specific discovery tasks?
   - *Pass Criteria*: Does it identify correct entry points (e.g., `package.json`, `git status`)? 
2. **The Thinker Test (Investigative Planning)**:
   - *Goal*: Does the Thinker's plan cover all necessary steps to satisfy the Manager's discovery task?
   - *Pass Criteria*: Includes tools like `ls -la`, `cat`, or `npm test`.
3. **The Doer Test (Execution in Docker)**:
   - *Goal*: Can the Doer execute commands accurately within the Node.js Docker container?
   - *Pass Criteria*: Commands are syntactically correct and use valid paths.

### B. State Delta & Discovery Grade
The ultimate metric is whether the agent's updated `SITREP` matches the `goldStandardSITREP` for that specific Git commit after the discovery turn.

---

## 5. Multi-Judge Ensemble & Thread Isolation

To ensure judgments are unbiased and comprehensive, we use isolated threads and multiple personas.

### A. Thread Isolation (Transcript Injection)
1. **Snapshoting**: Fetch and serialize the `testThreadId` into a Markdown transcript.
2. **Context Injection**: Inject the transcript into N isolated audit threads as **Evidence Context**. Judges see the history as data to analyze, preventing thread pollution.

### B. The Ensemble & Consensus
1. **The Judges**: Multiple personas (The Skeptic, The Security Officer, The User Advocate, The Architect) run in parallel.
2. **The Synthesis**: A **Consensus Judge** (Chief Justice) receives all JSON outputs and identifies points of agreement, contradictions, and calculates a final weighted score.

---

## 6. Required CRUD & Tools

- **`audit_generate_scenario`**: Analyzes a failure and creates a `Scenario` (Git + Commit + Gold Standard).
- **`audit_create_testbed`**: Spawns a Sandbox, clones the repo, and checks out the specific commit.
- **`audit_get_transcript`**: Serializes any `threadId` into a clean Markdown evidence block.
- **`audit_evaluate_triad`**: 
    1. Injects transcript into isolated threads.
    2. Runs the Multi-Judge Ensemble.
    3. Merges results via the Consensus Judge.
- **`scenarioCrud`**, **`bugCrud`**, **`evaluationCrud`**: Standard CRUD for the framework.

---

## 7. Benefits
- **Empirical Fixes**: Every new Journal Directive is proven to work via an automated "Before vs After" regression test.
- **Autonomy Benchmarking**: Measures how "lazy-friendly" the agents are by tracking their discovery success on vague prompts.
- **Regression Suite**: Confirmed bugs become a permanent test suite for evaluating new models.

---

## 8. System Genesis & Interactive CLI

The platform's identity and its agents are dynamically generated via an LLM "Genesis" process that utilizes a new **Interactive CLI Protocol**.

### A. The Interactive CLI Protocol (Inquirer Integration)
To support rich human-AI collaboration, the CLI (both `chat` and `genesis` commands) will be updated to handle structured UI events from the agent:
- **`ask_user` Event**: Instead of just text, agents can dispatch a structured object:
    ```json
    {
      "type": "choice | text | yesno",
      "question": "Which tech stack are you using?",
      "options": ["Node.js", "Python", "Go"]
    }
    ```
- **Inquirer Implementation**: The CLI will use `inquirer` to present these as native terminal prompts (multi-choice lists, free-form text, etc.), providing a much cleaner experience than raw text parsing.

### B. The Genesis Discovery Interview
- **Genesis Command**: `npm run cli -- genesis`
- **The Flow**:
    1. The CLI spawns a temporary "Genesis Agent."
    2. The Agent uses the `ask_user` protocol to interview the human about the project's "Soul" (Purpose, Style, Constraints).
    3. The LLM distills these answers into a set of global **System Directives**.
    4. The LLM then generates the **Manager**, **Thinker**, and **Doer** agent personas in the database.

---

## 9. Tool Interception & Stateful HITL Approvals

To ensure safety and human control, the Audit system can intercept any tool call, run a judgment against its inputs, and block execution until a human explicitly approves it.

### A. The Interception Workflow
1. **Interception**: When a "Doer" attempts to call a tool, the `AuditSkill` intercepts the request before it reaches the target skill.
2. **Pre-Flight Judgment**: A specialized "Safety Judge" analyzes the tool name and arguments. 
3. **Escalation**: If the Safety Judge flags the call (e.g., "Deleting a root directory" or "Sending an email to a client"), the tool execution is **paused**.
4. **Approval Record**: A stateful `Approval` entity is created in the database.

### B. Stateful Approvals (Surviving Restarts)
`Approval` entities are persistent and track:
- `id`: string
- `toolName`: string
- `arguments`: JSON object
- `reason`: Why the Safety Judge flagged it.
- `status`: 'pending' | 'approved' | 'denied' | 'refine'
- `threadId`: To link it back to the active conversation.

### C. User Notification & Interaction
Humans are notified and interact with approvals through two primary channels:
1. **The Live Stream**: A `request_approval` event is dispatched. The CLI uses `inquirer` to present an immediate `approve / deny / refine` choice to the user.
2. **Notification Tools**:
   - `approval_list`: Returns all currently pending approvals across the system.
   - **`approval_resolve`**: A tool the human calls to resolve a block.
     - **Actions**: `approve`, `deny`, or **`refine`**.
     - **Refinement**: If the user chooses `refine`, they MUST provide a `reason` (e.g., "The file path is wrong, use /tmp instead") and optional `refinedArguments`.

### D. Resume & Refinement Logic
Once an `Approval` is resolved, the `agent_infer` loop reacts:
- **If `approved`**: Resumes the tool execution with the original arguments.
- **If `denied`**: Cancels the tool call and returns an error message to the agent: "User denied permission for this action."
- **If `refine`**: The agent receives a specialized `tool_result` containing the human's feedback. It MUST then generate a new tool call using the human's guidance as a constraint.

---

## 10. Concurrency & Resource Optimization (Local LLM)

Since we are running in a **Single-Ollama-Request** environment, we must strictly manage latency and queue depth.

### A. The Triage Auditor
To avoid running 4-5 expensive LLM calls for every thread, the system uses a **Triage Auditor** (`qwen3.5:2b` or `functiongemma`).
1. **Sweep**: Triage scans the transcript for "Smell" (e.g., error logs, long loops, empty results).
2. **Decision**: If no smell is found, the audit ends immediately (Pass).
3. **Escalation**: Only if Triage flags a potential issue is the full Multi-Judge Ensemble enqueued.

### B. Role-to-Model Mapping
We assign available models to specific triad roles based on their strengths:
- **Thinker / Manager**: `qwen3:14b` (High reasoning and context window).
- **The Judges / Auditors**: `llama3.1:8b-instruct-q8_0` (Balanced, good at instruction following).
- **Triage / Doer**: `qwen3.5:2b` (Fast, efficient for tool calling and quick scans).
- **Large Context / Archive**: `gemma4:e4b` (For analyzing massive historical message batches).

### C. Loop Protection
- **AuditDepth Limit**: Audits are limited to a depth of 2. An Auditor can analyze a Thread, but an Auditor cannot be triggered to audit another Auditor's thread unless explicitly requested by a human.
- **Queue Priority**: Interactive Chat requests (`agent_run`) always bypass the `audit_sweep` queue to ensure the human experience remains responsive.

---

## 11. Implementation Roadmap

- [x] **Phase 1: Cleanup**: Delete `/models` folder and `agent_seed` tool.
- [x] **Phase 2: Interactive CLI**: 
   - Refactor `ChatCommand.ts` to use `inquirer` for inputs.
   - Implement the `ask_user` event handler in the CLI.
- [x] **Phase 3: System Management**: 
   - Implement the `genesis` command logic to build the "Soul".
   - Implement the `bootstrap` command to assign tools via multi-select.
   - Implement the `reset` command to wipe containers and databases.
- [x] **Phase 4: Approval System**: 
   - Implement `ApprovalSchema` and `approvalCrud`.
   - Add interception logic to `BaseSkillModule.execute`.
- [x] **Phase 5: Triage & Audit**: 
   - Implement the Environment-Anchored evaluation (`audit_create_testbed`, `audit_evaluate_triad`).
   - Implement the Multi-Judge Ensemble and Consensus synthesis.
- [ ] **Phase 6: Notification & Polish**: 
   - Standardize the `request_approval` event payload with `refine` support.
   - Write comprehensive E2E tests for the Genesis -> Triad Eval loop.

---

## Conclusion

The Castellan platform has transitioned from a rigid, pre-seeded agent system into a dynamic, learning engine. By anchoring evaluation in real Docker/Git environments and intercepting tool calls for human refinement, the system now guarantees safety while empirically proving that human feedback (via the Journal) actually improves the agent's autonomy. 

The introduction of the `Genesis` command ensures every deployment is custom-tailored to the user's specific "Soul", making Castellan a truly personalized AI infrastructure.
