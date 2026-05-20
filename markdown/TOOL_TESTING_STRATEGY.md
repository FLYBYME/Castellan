# Tool Testing Strategy

This document defines the mandatory standards for testing tools in the Castellan project.

## 1. Structure
* **One Test File Per Tool**: Each tool defined in a contract (e.g., `sandbox_fs_read`) MUST have its own dedicated test file in `src/tool-tests/`.
* **Naming Convention**: Test files must follow the pattern `<domain>_<action>.test.ts` (e.g., `sandbox_fs_read.test.ts`).
* **Test Framework**: Use the custom BDD-style framework located in `src/tool-tests/framework/`.
* **Execution**: Run tests using the CLI: `npm run cli -- test-tools --file <path_to_test>`.

## 2. Test Coverage Requirements
Each tool MUST have a minimum of **10-20 test cases** covering the following categories:

### A. Happy Path
* **Standard Usage**: Verify the tool works with typical, valid inputs.
* **Full Payload**: Test with all optional fields provided.
* **Minimal Payload**: Test with only mandatory fields.

### B. Boundary & Edge Cases
* **Empty Inputs**: Test with empty strings, arrays, or objects where allowed by schema.
* **Large Payloads**: Test with large strings (e.g., 1MB+) or deep objects.
* **Nesting**: For filesystem tools, test deep directory structures (e.g., 5+ levels).
* **Special Characters**: Paths or names containing spaces, emojis, or symbols (`!@#$%^&*()`).

### C. Error Handling
* **Resource Missing**: Test with non-existent IDs, paths, or keys.
* **Type Mismatch**: Test with paths that are files when directories are expected (and vice-versa).
* **Invalid Formats**: Test with malformed IDs or strings that violate regex constraints.
* **Timeout/Failure**: (Where possible) simulate underlying system failures.

### D. Security & Jailing
* **Path Traversal**: Attempt to access files outside the sandbox using `../` or absolute paths.
* **Resource Exhaustion**: (Where applicable) attempt to write extremely large files or spawn too many processes.
* **Permission Denied**: Attempt to access restricted system resources if the sandbox is intended to be jailed.

### E. Schema Validation
* **Zod Enforcement**: Ensure the tool correctly rejects inputs that violate the Zod contract.
* **Output Integrity**: Verify that the tool's output strictly matches the `outputSchema` defined in the contract.

## 3. Test Implementation Guidelines
* **Isolation**: Use `TestEnvironment.beforeAll` to provision a clean sandbox and `TestEnvironment.afterAll` to destroy it.
* **Assertions**: Use Node's native `assert` module.
* **Clarity**: Give each `it` block a clear, descriptive name explaining exactly what scenario is being tested.
* **Cleanup**: Ensure all resources (files, processes, sandboxes) are cleaned up even if tests fail.
