# UI Extension Manifest & Implementation Roadmap

This document serves as the master blueprint for the Castellan UI rewrite. It maps backend domains to frontend extensions, defines view-to-docking-target assignments, and specifies the required UI primitives.

---

## 1. Extension Registry

### 1.1 Core & Workspace (`ext.castellan.core`)
*The foundational shell of the IDE.*
- **Views**:
    - `ExplorerView` (Target: Primary Sidebar)
    - `SettingsView` (Target: Editor Area)
    - `OutputView` (Target: Bottom Panel)
- **Primitives**: `FileTree`, `TreeItem`, `ContextMenu`, `PropertyGrid`, `Switch`, `NumberInput`, `Select`, `CodeBlock`, `VirtualList`.

### 1.2 Agent Orchestration (`ext.castellan.agents`)
*The interface for Manager, Thinker, and Doer interactions.*
- **Views**:
    - `AgentChatView` (Target: Primary Sidebar / Editor Area)
    - `RosterView` (Target: Secondary Sidebar)
- **Primitives**: `Timeline`, `AgentControl`, `JsonTree`, `TextArea`, `Avatar`, `Badge`, `Spinner`, `Card`.

### 1.3 Execution & Infrastructure (`ext.castellan.sandbox`)
*Observability for isolated Node.js Docker containers.*
- **Views**:
    - `LiveTerminalView` (Target: Bottom Panel)
    - `ContainerManagerView` (Target: Bottom Panel / Editor Area)
    - `RemoteExplorerView` (Target: Primary Sidebar)
- **Primitives**: `CodeBlock`, `ScrollArea`, `Table`, `ProgressBar`, `ButtonGroup`, `FileTree`, `ForceColorBadge`.

### 1.4 Episodic Memory (`ext.castellan.journal`)
*The memory ledger and human feedback loop.*
- **Views**:
    - `LedgerView` (Target: Editor Area)
    - `DirectiveView` (Target: Editor Area)
- **Primitives**: `Table`, `VirtualList`, `Tag`, `Badge`, `Card`, `Heading`, `Text`, `InlineEditWidget`.

### 1.5 Evaluation & Regression (`ext.castellan.audit`)
*Testing and LLM-as-a-judge framework.*
- **Views**:
    - `TriageDeskView` (Target: Editor Area)
    - `RegressionArenaView` (Target: Editor Area)
    - `ScorecardView` (Target: Editor Area)
- **Primitives**: `SplitView`, `TextArea`, `CodeBlock`, `Table`, `StepProgress`, `GaugeCluster`, `Accordion`.

### 1.6 State & Task Management (`ext.castellan.kanban`)
*Visualizing the agent's DAG and plan execution.*
- **Views**:
    - `KanbanBoardView` (Target: Editor Area)
    - `TaskInspectorView` (Target: Secondary Sidebar)
- **Primitives**: `Row`, `Column`, `Card`, `Avatar`, `PropertyGrid`, `Text`, `Tag`.

### 1.7 Version Control (`ext.castellan.github`)
*State synchronization and diff visualization.*
- **Views**:
    - `SourceControlView` (Target: Primary Sidebar)
    - `DiffEditorView` (Target: Editor Area)
- **Primitives**: `TreeItem`, `Checkbox`, `TextArea`, `Button`, `SplitView`, `CodeBlock`, `InlineEditWidget`.

### 1.8 Web & Research (`ext.castellan.web`)
*Tools for external information gathering.*
- **Views**:
    - `BrowserPreviewView` (Target: Editor Area)
    - `SearchConsoleView` (Target: Bottom Panel)
- **Primitives**: `ScrollArea`, `Heading`, `Text`, `Table`, `SearchInput`.

### 1.9 Automation & Operations (`ext.castellan.cron`)
*Monitoring background scheduled tasks.*
- **Views**:
    - `JobSchedulerView` (Target: Bottom Panel)
- **Primitives**: `Table`, `Switch`, `Badge`.

### 1.10 System Telemetry (`ext.castellan.telemetry`)
*Aggregated health and metric dashboards.*
- **Views**:
    - `MapHUDView` (Target: Editor Area)
- **Primitives**: `MapHUD`, `MiniMap`, `Vector3Field`.

### 1.11 The Editor Surface (`ext.castellan.editor`)
*Tabbed code editing and LSP integration.*
- **Views**:
    - `CodeEditorView` (Target: Editor Area)
    - `BreadcrumbBar` (Target: Editor Area - Header)
- **Primitives**: `MonacoEditor`, `Tabs`, `SymbolTree`.

### 1.12 Live Debugger (`ext.castellan.debugger`)
*Interactive debugging for sandbox processes.*
- **Views**:
    - `DebugControlView` (Target: Bottom Panel)
    - `VariableWatchView` (Target: Secondary Sidebar)
    - `CallStackView` (Target: Secondary Sidebar)
- **Primitives**: `Toolbar`, `TreeItem`, `Gutter`.

### 1.13 LLM Observability & Tracing (`ext.castellan.tracing`)
*Technical deep-dives into the agent's thought tree.*
- **Views**:
    - `TraceTreeView` (Target: Editor Area)
    - `CostDashboard` (Target: Bottom Panel)
- **Primitives**: `FlowGraph`, `GaugeCluster`, `Timeline`.

### 1.14 Database Explorer (`ext.castellan.db`)
*Direct visibility into the database state.*
- **Views**:
    - `CollectionBrowserView` (Target: Editor Area)
    - `QueryConsoleView` (Target: Bottom Panel)
- **Primitives**: `Table`, `SqlEditor`, `VirtualList`.

### 1.15 Extension & Skill Marketplace (`ext.castellan.registry`)
*Management of system capabilities and auth tokens.*
- **Views**:
    - `ExtensionMarketplaceView` (Target: Editor Area)
    - `SkillRegistryView` (Target: Editor Area)
- **Primitives**: `Grid`, `Card`, `SearchInput`.

---

## 2. Implementation Roadmap

### Phase 1: Foundation (The Shell)
- [ ] Implement `IExtension` and `ExtensionRegistry`.
- [ ] Build the `LayoutManager` with Docking System (Sidebar, Bottom Panel, Editor Area).
- [ ] Create `ui-lib` core primitives: `Button`, `Text`, `Card`, `Heading`.
- [ ] Implement `ext.castellan.core`.

### Phase 2: Cognitive Loop
- [ ] Implement `ext.castellan.agents`.
- [ ] Build the `Timeline` and `AgentChatView` with real-time streaming support.
- [ ] Build the `RosterView` for persona monitoring.

### Phase 3: Environment Control
- [ ] Implement `ext.castellan.sandbox`.
- [ ] Build `LiveTerminalView` (xterm.js integration).
- [ ] Build `RemoteExplorerView` for virtual filesystem browsing.
- [ ] Implement `ext.castellan.github` (Source Control & Diff).

### Phase 4: Memory & Audit
- [ ] Implement `ext.castellan.journal` (Ledger & Directives).
- [ ] Implement `ext.castellan.audit` (Triage Desk & Regression Arena).
- [ ] Build specialized grading primitives (GaugeCluster, StepProgress).

### Phase 5: State & Automation
- [ ] Implement `ext.castellan.kanban`.
- [ ] Implement `ext.castellan.web`.
- [ ] Implement `ext.castellan.cron`.

### Phase 6: Telemetry & Polish
- [ ] Implement `ext.castellan.telemetry`.
- [ ] Global Theme Refinement.
- [ ] Performance Optimization for large message histories.

### Phase 7: Advanced Tooling
- [ ] Implement `ext.castellan.editor` (Monaco integration).
- [ ] Implement `ext.castellan.db` (Database browsing).
- [ ] Implement `ext.castellan.debugger`.
- [ ] Implement `ext.castellan.tracing` & `ext.castellan.registry`.
