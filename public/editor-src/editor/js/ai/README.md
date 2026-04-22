# AI Module

Server-side tool system that exposes the Brizy editor's capabilities to an external AI chat client. The AI client discovers available tools, sends tool calls, and the editor executes them against the live Redux state.

## Architecture

Follows **Clean Architecture** with four layers:

```
ai/
├── entities/          Domain models (tool types, page/element result types)
├── application/       Interfaces (IPageRepository, IProjectRepository, IToolServer)
├── infrastructure/    Implementations (Redux-backed repositories + utils)
├── adapters/          Tool definitions, handlers, validation, and the tool server
└── utils/             Shared utilities (logger)
```

**Dependency rule:** inner layers never import from outer layers.

```
entities ← application ← infrastructure
                ↑               ↑
              adapters ─────────┘
```

## Data Flow

```
AI Chat Client
    │
    ▼
IToolServer.callTool({ name, arguments })
    │
    ▼
BrizyToolServer → handler lookup → ToolHandler(args)
    │                                    │
    │                          ┌─────────┴──────────┐
    │                          ▼                     ▼
    │                  Infrastructure          Component
    │                    Handlers               Handlers
    │                      │                       │
    │            ┌─────────┴─────────┐             │
    │            ▼                   ▼             ▼
    │     IPageRepository    IProjectRepository   IPageRepository
    │            │                   │             │
    │            ▼                   ▼             ▼
    │         Redux              Redux          Redux
    │        dispatch            dispatch       dispatch
    │
    ▼
ToolExecutionResponse { success, data, error, duration }
```

## Tool Categories

| Category    | Examples                                    | Repository      |
|-------------|---------------------------------------------|-----------------|
| `read`      | getPageStructure, getElementById, isPro     | PageRepository  |
| `block`     | addBlock, removeBlock, moveBlock            | PageRepository  |
| `element`   | removeElement, duplicateElement, moveElement| PageRepository  |
| `project`   | changeStyle, addStyle, addFont, deleteFont  | ProjectRepository|
| (component) | addButton, updateImage, updateRichText      | PageRepository  |

## Entry Points

- **`ai/index.ts`** — re-exports all public API from each layer
- **`plugins/ToolServer.ts`** — creates repositories and wires everything together
- **`adapters/tool-registry.ts`** — `getBrizyToolDefinitions()` and `createBrizyToolHandlers()`

## Adding a New Tool

1. **Definition** — add a `ToolDefinition` to `adapters/infrastructure-definitions.ts` (infrastructure) or a component's `definitions.ts` file
2. **Schema** — add Zod validation in `adapters/schema-primitives.ts` (shared) or alongside the definition
3. **Handler** — add handler in `adapters/infrastructure-handlers.ts` or use `ToolConfig` pattern for components
4. **Repository** — if new data access is needed, add method to the appropriate repository interface + implementation

## Key Conventions

- Repository methods return `BrizyToolResult<T>` — `{ success, data?, error? }`
- LLM-facing data uses lightweight summary types to avoid sending large JSON payloads
- Zod schemas validate all LLM input at the handler layer before reaching repositories
- Component tools use a declarative `ToolConfig` pattern (add/update/addNoProps) built by `handler-factory.ts`
- Infrastructure tools use imperative handlers in `infrastructure-handlers.ts`
- **Font validation** — Components that accept `fontFamily` use the `handler` escape hatch with `validateFonts()` (from `prop-defaults.ts`) to verify fonts exist in the project before applying. Tool descriptions instruct the LLM to call `getProjectFonts` before setting any font.
