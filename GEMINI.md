# Castellan Engineering Standards

**CRITICAL DIRECTIVE TO AI AGENT:** You are writing STRICT, advanced TypeScript. You are not writing JavaScript. If you cannot resolve a type natively without `any`, you must stop and declare a native TypeScript generic interface.

## 1. Type Sovereignty (STRICT ENFORCEMENT)
* **THE `any` BAN**: NEVER use `any` or `as any`. This is a hard constraint. If you use `any`, the build will fail. Use `unknown` and validate at boundaries with Zod.
* **ANTI-PATTERN**: Do not fix Zod dynamic key errors with `as any`.
    * ❌ BAD: `.extend({ [idField]: z.string() } as any)`
    * ✅ GOOD: Use native TS mapped types to define the exact shape, and cast the final schema as `unknown as z.ZodType<Output, Def, Input>`.
* **Schema & Type Pair**: Every Zod schema file MUST export both the schema AND its inferred type.
    * `export const UserSchema = z.object({...});`
    * `export type User = z.infer<typeof UserSchema>;`
* **Strict Type Safety**: Avoid `as Type` casting and non-null assertions (`!`). Use explicit `if` checks or type guards. Do not let Zod intersections (`.and()`) create `{ [x: string]: any }` index signatures. Use `Prettify<T>` to flatten complex types.

## 2. Distributed Microkernel Architecture
Castellan is a distributed system where the main process (The Hub) orchestrates isolated Workers.

* **Worker Isolation**: Backend skills MUST run in isolated Node.js `worker_threads`.
* **Message Passing**: All communication between Hub and Workers occurs via `MessagePort` (JSON-RPC). Logic MUST NOT depend on passing non-serializable objects (classes, symbols, functions) across the boundary.
* **Addon Structure**: Every feature is an Addon located in `src/addons/<name>`.
    * `skills/`: Backend logic (.contract.ts, .tools.ts, .skill.ts).
    * `extension/`: Frontend UI (index.ts, ViewProviders).

## 3. Tooling & Build Pipeline
* **Contract as Source of Truth**: All capabilities must be defined in `src/addons/<name>/skills` using `defineContract` or `defineCrud`.
* **esbuild Bundling**: We use `esbuild` for all bundling. Vite is deprecated and removed.
* **Output Separation**:
    * **Artifacts** (`src/generated/`): TypeScript source code generated from contracts (SDK, CLI, API interfaces). Commit these.
    * **Bundles** (`dist/`): Compiled JavaScript ready for execution or browser serving. Never commit this directory.
* **Generated SDK**: NEVER manually edit `src/generated/client/CastellanClient.ts`. It is overwritten by the generate command.

## 4. CLI & Lifecycle
* **Generate Artifacts**: `npm run build` (runs `npm run cli -- generate`). Execute this after altering ANY `.contract.ts` file.
* **Build Verification**: The build process includes a full `tsc --noEmit --diagnostics` check. Resolve all type errors before proceeding.
* **Start Server**: `npm run start` boots the Hub and spawns Worker threads.
* **Restarting**: Use hot-reloading (Worker restart) for skills. Never restart the Hub autonomously; ask the user.

## 5. Implementation
* **Separation of Concerns**: Server logic MUST live in `.tools.ts` or `.skill.ts` files. Contracts (`.contract.ts`) MUST remain purely declarative interfaces.
* **Async Generators**: Use exactly this syntax: `async function* (input, ctx) { ... }`. NEVER use arrow functions for generators.
* **Sandbox Jailing**: All filesystem and process operations must be jailed. You MUST resolve the target via `ctx.sandbox.getSandbox()`. Never write to the host OS filesystem.


# Example of good code

YOU MUST FOLLOW THIS STYLE NO EXCEPTIONS!!!

## Contact file:

```typescript
import { z } from 'zod';
import { defineContract, defineCrud } from 'castellan/core';
import { DemoSchema } from './demo.schema.js';

/**
 * --- Event Augmentation ---
 * We augment the events module to register our domain-specific events.
 */
declare module '../../../core/events.js' {
    interface EventRegistry {
        'demo:hello_sent': DemoHelloEvent;
    }
}

export const DemoHelloEventSchema = z.object({
    name: z.string().describe("Name of the person greeted"),
    timestamp: z.date()
});
export type DemoHelloEvent = z.infer<typeof DemoHelloEventSchema>;

/**
 * --- Contracts ---
 */
export const demoCrud = defineCrud('demo', DemoSchema, {
    actions: {
        create: 'create',
        find: 'find',
        findOne: 'find_one',
        count: 'count'
    }
});

export const DemoHelloSchema = z.object({
    name: z.string().describe("Your name")
});
export type DemoHello = z.infer<typeof DemoHelloSchema>;

export const DemoHelloOutputSchema = z.object({
    message: z.string().describe("Greeting message")
});
export type DemoHelloOutput = z.infer<typeof DemoHelloOutputSchema>;

export const demoHelloContract = defineContract({
    domain: 'demo',
    action: 'hello',
    description: 'A simple hello world tool for demonstration.',
    inputSchema: DemoHelloSchema,
    outputSchema: DemoHelloOutputSchema,
    rest: { method: 'POST', path: '/demo/hello' },
    destructive: false
});

export const DemoStatusSchema = z.object({
    name: z.string().describe("Your name")
});
export type DemoStatus = z.infer<typeof DemoStatusSchema>;

export const DemoStatusOutputSchema = z.object({
    message: z.string().describe("Greeting message")
});
export type DemoStatusOutput = z.infer<typeof DemoStatusOutputSchema>;

export const demoStatusContract = defineContract({
    domain: 'demo',
    action: 'status',
    description: 'Check the status of the demo environment.',
    inputSchema: DemoStatusSchema,
    outputSchema: DemoStatusOutputSchema,
    rest: { method: 'GET', path: '/demo/status' },
    destructive: false
});
```

## Schema file:
```typescript
import { z } from 'zod';

export const DemoSchema = z.object({
    id: z.string().describe("Unique identifier for the demo item"),
    name: z.string().describe("Name of the demo item"),
    value: z.number().describe("Value of the demo item"),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Demo = z.infer<typeof DemoSchema>;

export const DemoCreateInputSchema = z.object({
    name: z.string().describe("Name of the item"),
    value: z.number().describe("Numeric value"),
});
export type DemoCreateInput = z.infer<typeof DemoCreateInputSchema>;
```

## Skill file:

```typescript
import { BaseSkillModule } from 'castellan/core';
import { demoHelloContract, demoStatusContract, demoCrud } from './demo.contract.js';
import { demo_hello, demo_status } from './demo.tools.js';

/**
 * DemoSkill: A simple skill to verify the new Headless Engine architecture.
 * 
 * Demonstrates:
 * 1. Extension of BaseSkillModule.
 * 2. Strict typing of handlers.
 * 3. Use of mountCrud for automated persistence routing.
 * 4. Use of mountEventHandler for declarative event handling.
 */
export class DemoSkill extends BaseSkillModule {
    public readonly domain = 'demo';

    constructor() {
        super();

        // 1. Mount custom tools
        this.mountTool(demoHelloContract, demo_hello);
        this.mountTool(demoStatusContract, demo_status);

        // 2. Mount CRUD (Automated interception)
        this.mountCrud(demoCrud);

        // 3. Mount Event Handlers (Declarative)
        this.mountEventHandler('demo:hello_sent', (payload) => {
            console.log(`[DemoSkill] Declarative handler received hello_sent for ${payload.name}`);
        });

        this.mountEventHandler('data:created', (payload) => {
            if (payload.domain === this.domain) {
                console.log(`[DemoSkill] Document auto-detected by declarative handler! ID: ${payload.id}`);
            }
        });
    }
}
```

## Tools file:

```typescript
import { ISkillContext } from 'castellan/core';
import { z } from 'zod';
import {
    demoHelloContract,
    demoStatusContract
} from './demo.contract.js';

export async function demo_hello(
    input: z.infer<typeof demoHelloContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof demoHelloContract.outputSchema>> {

    // 1. Create a demo record using the Unified API
    const doc = await ctx.api.demo.create({
        name: input.name,
        value: 100
    });

    // 2. Dispatch a strictly-typed custom event
    // The event name 'demo:hello_sent' is autocompleted and payload is type-checked
    // because of the module augmentation in demo.contract.ts
    await ctx.events.dispatch('demo:hello_sent', ctx.correlationId, {
        name: input.name,
        timestamp: new Date()
    });

    // 3. Perform other DB operations
    const docs = await ctx.api.demo.find({ limit: 10 });
    const single = await ctx.api.demo.find_one({ query: { name: input.name } });
    const count = await ctx.api.demo.count({ query: {} });

    // Cleanup: demo deleting
    for (const d of docs) {
        if (d.id !== doc.id) {
            void ctx.api.demo.delete({ id: d.id });
        }
    }

    return {
        message: `Hello, ${input.name}! Created ID: ${doc.id}, found ${single?.id}, total count ${count}. Event dispatched!`
    };
}

export async function demo_status(
    input: z.infer<typeof demoStatusContract.inputSchema>,
    _ctx: ISkillContext
): Promise<z.infer<typeof demoStatusContract.outputSchema>> {
    return {
        message: `Status check for ${input.name}: Engine is Healthy.`
    };
}
```

# TYPE SAFETY

Always run `npm run build` (which includes generate + tsc check) and `npm run lint` before responding to the user.
