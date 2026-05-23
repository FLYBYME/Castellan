# Demo Addon Architecture Review

## Overview
The `demo` addon serves as a reference implementation for the Castellan architecture, demonstrating CRUD operations, custom tools, and UI integration.

## 1. Skills Directory (`skills/`)

### Compliance Checks
- **Async Generators (`async function*`)**: Not used. All tools are standard async functions.
- **`ctx.sandbox` Usage**: Not applicable.
- **Typed Contracts**: `demo.contract.ts` is fully typed and serves as the template for other addons.
- **Module Augmentation for Events**: **PRESENT**. `demo:hello_sent` is correctly augmented.
- **No `any`**: `demo.tools.ts` is strictly typed.
- **Schema & Type Pair**: Correctly implemented in `demo.schema.ts`.

### Findings
- **Template Excellence**: The `demo` skills serve as an excellent baseline.
- **Typing Refinement**: `DemoSkill` does not pass `ContextApi` to `BaseSkillModule`. While it works, it loses some IDE autocompletion benefits within the class methods.

## 2. Extension Directory (`extension/`)

### Compliance Checks
- **`any` Violation**: `public activate(context: any): void` - **FAILURE**. It uses `any` for the activation context.
- **UI Library**: Good use of `ui.Stack`, `ui.Icon`, `ui.Heading`, etc.

### Findings
- **Architecture Mismatch**: The `demo` extension registers its view using `context.ide.layout.activityBar.registerProvider`, whereas the `cron` extension uses `context.ide.views.registerProvider`. The system should converge on a single standard for view registration.
- **Disconnected Backend**: The `demo` extension UI is purely visual and does not actually call any of the `demo` tools (like `hello` or `status`) or interact with the `demo` CRUD. It fails to "make the backend" by being purely static.

## 3. Architectural Inconsistencies & Missed Opportunities
- **Static vs. Dynamic UI**: The extension should be enhanced to demonstrate how to call backend tools using `getClient().api.demo.hello()` and display the results using the UI library's feedback components.

## 4. Enhancement Plan
1. **Remove `any`**: Update `index.ts` to use `ExtensionContext` and remove any other `any` usages.
2. **Connect to Backend**: Add buttons to the `DemoExtension` view that trigger `demo:hello` and `demo:status` tools.
3. **Display CRUD Data**: Implement a simple list in the UI that displays items from the `demo` domain using `client.api.demo.find()`.
4. **Consistency**: Align view registration with the pattern established in the `cron` addon (using `ide.views.registerProvider`).
