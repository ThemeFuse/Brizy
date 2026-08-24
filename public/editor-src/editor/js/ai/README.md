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
| `site`      | createPage, createMenu, createGlobalBlock, deletePage, deleteAllPages | *(in `@brizy/ai-chat`; global blocks call back through `GlobalBlockRepository`)* |
| `history`   | undoLastChange                              | PageRepository  |
| (component) | addButton, updateImage, updateRichText      | PageRepository  |

### Site tools (multi-page website generation)

These tools generate a whole site and are **order-dependent**: one
`createPage` per page (in navigation order) → `createMenu` → one
`createGlobalBlock` per header/footer.

The ordering is enforced in code, not only in the prompt: `createMenu` fails
when the run has no pages, and `createGlobalBlock` warns when a block contains a
`Menu` element but no menu was created. `createMenu` also leads the menu with
the site homepage — the run only records what `createPage` made, so without it
the landing page has no link in its own navigation.

**Which page is the homepage** comes from the `index_item_id` project metafield,
not from `collectionItem.isHomepage`: that flag defaults to false and most
projects never set it (the CMS UI ignores it and reads the metafield too).
`isHomepageOf` checks the metafield first and honours the flag as a fallback —
it is what `createMenu`, `deletePage` and `deleteAllPages` all resolve through.

Its **menu label** is then re-cased to match the other items (`matchLabelCase`):
a CMS homepage is routinely titled "home" while generated pages arrive as
"Gallery" / "About", and the odd one out is visible in the navigation. Only the
label sent to `createMenu` changes — the collection item keeps its own title —
and only when every other item agrees on a style. Per-run state (pages in
order, the run's menu, per-align position counters) lives in
`ai-chat/src/infrastructure/site-tools/run-context.ts` on top of the shared
store — private to that package, since all ten tools run there.

Pages and menus are **CMS entities created through GraphQL** — a page is a
collection item (`createCollectionItem`), a menu is created with all its items
in a single `createMenu` mutation. There is no REST endpoint for either.

### Where the CMS requests live

**No site tool lives here any more.** `@brizy/ai-chat` owns all ten — pages,
menus and global blocks — end to end: definitions, schemas, handlers and the
orchestration around them (`infrastructure/site-tools/`). The CMS calls behind
pages and menus are in `.../site-api/` (Apollo against the collections GraphQL
api, endpoint and credentials from `window.aiChatConfig.collectionsApi`, never
from `window.__CLOUD_ENV__`). Its plugin merges the two catalogs with a
`CompositeToolServer`, so the chat loop sees one tool list and cannot tell which
bundle answers a call.

**What this bundle still owns is the work only it can do.** Global blocks make
no CMS call — they are Redux entries persisted through `config.api.globalBlocks`
— so `global-block.repository.ts` keeps building the `GlobalBlockNormal`,
calling the handlers and dispatching, exposed as four decision-free primitives
(`isSupported`, `list`, `create`, `delete`).

The boundary is **ai-chat decides, the editor builds and commits**: which menu
to bind into a header, whether it duplicates existing chrome, whether a uid is
really a popup — all judged over there, from the listing this side hands over.
The whole surface is `plugins/EditorSite.ts`, mirrored by `i-editor-site.ts`;
it also carries which page is open and the live `config.menuData`. A host that
does not supply it gets no site tools at all.

The mirror set (`deletePage`, `deleteMenu`, `deleteGlobalBlock`, plus the
`deleteAllPages` / `deleteAllMenus` / `deleteAllGlobalBlocks` loops and the
`deleteEntireSite` wipe) takes down what the create tools built. Two invariants
live in the repository, not in the prompt: the page currently open in the editor
and the site homepage are never deleted (single deletes refuse, loops report them
under `skipped`), and `deleteEntireSite` deletes nothing without `confirm: true`.
Loops are continue-on-error — an entity the backend reports as already gone
(GraphQL `404` / `user`) counts as deleted — and `deleteEntireSite` runs global
blocks → menus → pages, then resets the run context.

The homepage half of that first invariant rests on `getHomePageId()`, because
`SitePage.isHomepage` is false on nearly every project — the CMS keeps the
homepage in the `index_item_id` project metafield. A lookup that *fails* is
therefore not "this site has no homepage": `deletePage` and `deleteAllPages`
delete nothing at all when it does, rather than fall back to a flag that would
protect nothing. Readers (`createMenu` building the home link) keep tolerating
it — there the cost is a missing menu entry, not a deleted homepage.

Every tool that deletes more than one entity in a single call is flagged
`requiresConfirmation` — `deleteAllPages`, `deleteAllMenus`,
`deleteAllGlobalBlocks` and `deleteEntireSite`. The chat client blocks each on an
explicit user decision before it runs, on top of the `confirm: true` argument
`deleteEntireSite` also makes the LLM pass. Each `confirmationMessage` says why
it is being asked and names both outcomes: what confirming destroys and what
cancelling preserves. Single-entity deletes stay ungated — a prompt on every one
would train the user to click through the one that matters.

## Entry Points

- **`ai/index.ts`** — re-exports all public API from each layer
- **`plugins/ToolServer.ts`** — creates repositories and wires everything together
- **`adapters/tool-registry.ts`** — `getBrizyToolDefinitions(t)` and `createBrizyToolHandlers()`

## Adding a New Tool

1. **Definition** — add a `ToolDefinition` to `adapters/infrastructure-definitions.ts` (infrastructure) or a component's `definitions.ts` file
2. **Schema** — add Zod validation in `adapters/schema-primitives.ts` (shared) or alongside the definition
3. **Handler** — add handler in `adapters/infrastructure-handlers.ts` or use `ToolConfig` pattern for components
4. **Repository** — if new data access is needed, add method to the appropriate repository interface + implementation

## Key Conventions

- Repository methods return `BrizyToolResult<T>` — `{ success, data?, error? }`
- LLM-facing data uses lightweight summary types to avoid sending large JSON payloads
- Zod schemas validate all LLM input at the handler layer before reaching repositories
- **containerId guard** — every add flow (standard, `addNoProps`, and custom-handler components) validates the target `containerId` with `containerIdSchema` (non-empty string) before calling `addElement`; a missing/blank id fails fast with a clear error
- Component tools use a declarative `ToolConfig` pattern (add/update/addNoProps) built by `handler-factory.ts`
- Infrastructure tools use imperative handlers in `infrastructure-handlers.ts`
- **Font validation** — Components that accept `fontFamily` use the `handler` escape hatch with `validateFonts()` (from `prop-defaults.ts`) to verify fonts exist in the project before applying. Tool descriptions instruct the LLM to call `getProjectFonts` before setting any font.
