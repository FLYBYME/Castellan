# Plan: Cleanup and Standardization of `tmp/` Directory

## Overview
The `/home/ubuntu/code/Castellan/tmp` directory currently contains a significant amount of legacy code, experimental commands, and outdated services from before the **Castellan Architectural Refit**. These files often reference old paths and are not used by the current build or runtime systems.

## Objective
To clean up the project structure, reduce technical debt, and ensure that `tmp/` is used correctly according to modern standards as a place for transient, non-committed data.

---

## Proposed Action Plan

### Phase 1: Impact Audit
1.  **Dependency Verification**: Confirm that `npm run build`, `npm run test`, and `npm run start` execute successfully without any files in `tmp/`.
2.  **Reference Search**: Final check for any hidden references to `tmp/` in `.vscode/`, scripts, or environment configurations.

### Phase 2: Selective Salvage
1.  **Example Migration**: Identify files that serve as useful functional examples (e.g., `sdk_demo.ts`, `web_agent_chat.ts`).
    *   **Action**: Move these to the `scratch/` directory for developer reference.
2.  **Logic Extraction**: Check `MonacoService.ts` and `ChatCommand.ts` for any specific configuration logic that hasn't been implemented in the new `src/` architecture.
    *   **Action**: Document findings and integrate into the new core if necessary.

### Phase 3: Archival and Purge
1.  **Archival**: Move all subdirectories (`editor/`, `extensions/`, `lsp/`, etc.) into a single `tmp/legacy/archive/` folder to isolate them.
2.  **Purge**: Delete high-clutter files that are confirmed as redundant:
    *   `BootstrapCommand.ts`
    *   `GenesisCommand.ts`
    *   `ResetCommand.ts`
    *   `TestToolsCommand.ts`
    *   `WebChatCommand.ts`

### Phase 4: Standardization
1.  **Repurpose**: Redefine `tmp/` as a directory exclusively for:
    *   Transient build artifacts (not handled by `dist/`).
    *   Local logs or debug dumps (e.g., `agent_debug.log`).
    *   Runtime sandbox data.
2.  **Documentation**: Add a `README.md` to `tmp/` explaining its purpose and the "no commit" rule.
3.  **Git Maintenance**: Ensure `.gitignore` correctly ignores all contents of `tmp/` except for the placeholder `README.md`.

---

## Success Criteria
- [ ] No build or test regressions after cleanup.
- [ ] Reduced root directory noise.
- [ ] All useful legacy logic is either integrated into `src/` or safely stored in `scratch/`.
