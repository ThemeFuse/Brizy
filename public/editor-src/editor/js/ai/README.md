# AI Module

Server-side tool system that exposes the Brizy editor's capabilities to an external AI chat client. The AI client discovers available tools, sends tool calls, and the editor executes them against the live Redux state.

## Architecture

Follows **Clean Architecture** with four layers:

```
ai/
├── entities/          Domain models (page/element result types; tool types re-exported from @brizy/ai-tools)
├── application/       Interfaces (IPageRepository, IProjectRepository, IToolServer)
├── infrastructure/    Implementations (Redux-backed repositories + utils)
├── adapters/          Handlers, per-element wiring, validation, and the tool server
└── utils/             Shared utilities (logger)
```

**The catalog is not here.** Every tool the LLM sees — its name, its
description, its arguments — lives in `@brizy/ai-tools`. What lives here is
what runs: the handlers, the element types, and the hooks that need an
element's stored state. The two halves are joined by `alias`; see
"The catalog and the wiring" below.

**Dependency rule:** inner layers never import runtime code from outer layers; one application
interface takes a type-only import from infrastructure.

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
| `read`      | getPageStructure, getElementById, searchElements, getAvailableMenus, isPro | PageRepository  |
| `block`     | addBlocks, addBlankBlock, removeBlock, moveBlock, clearPage | PageRepository  |
| `element`   | removeElement, duplicateElement, moveElement| PageRepository  |
| `project`   | changeStyle, updateColorPalette, updateFontStyle, updateFontStyleTablet, updateFontStyleMobile, addFont, deleteFont, setPageStatus | ProjectRepository|
| `site`      | createPage, createMenu, createGlobalBlock, deletePage, deleteAllPages, uploadFile | *(in `@brizy/ai-chat`; global blocks call back through `GlobalBlockRepository`)* |
| `history`   | undoLastChange                              | PageRepository  |
| (component) | addButton, updateImageContent, updateButtonBackground | PageRepository  |

### Site tools (multi-page website generation)

These tools generate a whole site and are **order-dependent**: one
`createPage` per page (in navigation order) → `createMenu` → one
`createGlobalBlock` per header/footer.

The ordering is enforced in code, not only in the prompt: `createMenu` fails
when the run already created its menu, and `createGlobalBlock` warns when a block
contains a `Menu` element but no menu was created. `createMenu` also leads the
menu with the site homepage — the run only records what `createPage` made, so
without it the landing page has no link in its own navigation. A run that
created no page (a site generated as its homepage alone) gets a menu linking
the homepage by itself; only a run with neither pages nor a homepage fails.

**Which page is the homepage** comes from the `index_item_id` project metafield,
not from `collectionItem.isHomepage`: that flag defaults to false and most
projects never set it (the CMS UI ignores it and reads the metafield too).
`isHomepageOf` checks the flag first and honours the metafield as a fallback —
it is what `createMenu`, `deletePage` and `deleteAllPages` all resolve through.

Its **menu label** is then re-cased to match the other items (`matchLabelCase`):
a CMS homepage is routinely titled "home" while generated pages arrive as
"Gallery" / "About", and the odd one out is visible in the navigation. Only the
label sent to `createMenu` changes — the collection item keeps its own title —
and only when every other item agrees on a style. Per-run state (pages in
order, the run's menu, per-align position counters) lives in
`ai-chat/src/infrastructure/site-tools/run-context.ts` on top of the shared
store — private to that package, since all twelve tools run there.

Pages and menus are **CMS entities created through GraphQL** — a page is a
collection item (`createCollectionItem`), a menu is created with all its items
in a single `createMenu` mutation. There is no REST endpoint for either.

### Where the CMS requests live

**No site tool lives here any more.** `@brizy/ai-chat` owns all of them —
pages, menus, global blocks and the media upload — end to end: definitions,
schemas, handlers and the orchestration around them
(`infrastructure/site-tools/`). The CMS calls behind pages and menus are in
`.../site-api/` (Apollo against the collections GraphQL api, endpoint and
credentials from `window.aiChatConfig.collectionsApi`, never from
`window.__CLOUD_ENV__`); the media library call is in `.../media-api/`, with a
config block of its own. Its plugin merges the two catalogs with a
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
Most of the surface is `plugins/EditorSite.ts`, mirrored by `i-editor-site.ts`, with `getPageId`
added directly in `plugins/EditorAPI.ts`; it also carries which page is open and the live
`config.menuData`. A host that
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

`deleteEntireSite` is the one path that removes the *old* homepage. A generation
started from any other page builds the new landing page on the open page, so
just before the pages phase that page takes the homepage over: the
`index_item_id` metafield is pointed at it and it takes the old homepage's title
(`Home` when there is none). The pages phase resolves the homepage afresh, finds
the open page, and deletes the old one like any other page. `createMenu` then
leads with the open page. Only the title moves, never the slug: the editor saves
the open page with the slug it loaded, which would undo a slug rename. A switch
that fails leaves the metafield alone, so the old homepage stays protected and a
warning says why.

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
`deleteEntireSite` also makes the LLM pass. Each `confirmationMessage` says why it is being
asked and names what confirming destroys. Single-entity deletes require the same explicit
confirmation as the multi-entity ones.

The flag says a tool *can* destroy things; whether one call *would* is asked of
the tool server (`needsConfirmation`) just before the prompt. `SiteToolServer`
lifts the prompt in exactly one case: `deleteEntireSite` on a site that is
already empty (`SiteTools.isSiteEmpty` — no header or footer, no menu, no page
besides the one open in the editor), which is what a website generation on a
fresh project runs into. A check that cannot run asks, as does every tool with
no check of its own — the editor's tools included, since its server is never
asked.

### Uploading to the media library

**`uploadFile` is called by the backend, not chosen by the model.**
`ai-chatbot-api` sends it when it holds a file's bytes the page needs, e.g. an
image it generated because Unsplash found nothing. It takes the whole file —
`{ fileName, mimeType, base64 }` — and answers `{ uid, fileName, url }`; the
backend then writes `url` into the tool calls it held back and sends those.

**It is a site tool, so nothing of it lives in this bundle.** The editor needs
no upload api of its own for it: `SiteTools.uploadFile` in `@brizy/ai-chat`
calls `ApiMedia` (`infrastructure/media-api/`), which makes the same
`POST /projects/{id}/media` the media gallery makes for a file picked from disk.
The endpoint comes from `window.aiChatConfig.mediaApi`, which the backend
publishes next to `collectionsApi` — again never `window.__CLOUD_ENV__` — and
authenticates the same way: a token in that block where the host publishes one
(the dev server does), the session cookie where it does not. A page without the
block (WordPress today) answers the call with "not supported on this platform".

## Entry Points

- **`ai/index.ts`** — re-exports all public API from each layer
- **`plugins/ToolServer.ts`** — creates repositories and wires everything together
- **`adapters/tool-registry.ts`** — `getBrizyToolDefinitions(t)` and `createBrizyToolHandlers()`

## The catalog and the wiring

An element is exposed to the LLM as several small tools, each covering one
concern, and all of them carry the same `alias` — the element's handler key:

```
updateButtonBackground ─┐
updateButtonPadding    ─┼─ alias "updateButton" ─→ updateButtonConfig ─→ pageRepository.updateElement
updateButtonHoverBorder ┘
```

`tool-registry.ts` builds one handler per config and registers it under every
catalog name that aliases to it. Splitting an element further is a change to
`@brizy/ai-tools` alone; nothing here has to move.

The bare alias (`updateButton`) is a handler key, **not** a tool the model can
call — it is not in the catalog.

**Why the tools are small.** They reach the agent through a retrieval index
built by `ai-db-api`, which embeds only a tool's name, its description and its
property descriptions. A tool with seventy properties was split there, by
property-name prefix, and its handwritten description discarded. The catalog
now does that itself, by hand, with descriptions written for retrieval.

**What the catalog deliberately does not ask for.** Several stored properties
only render once a companion flag is set — a gradient needs
`bgColorType: "gradient"`, a shadow needs `boxShadow: "on"`. Splitting an
element would scatter each pair across two tools, so those flags left the
LLM-facing surface and are derived in `inferStoredFlags` (in `@brizy/ai-tools`)
from what was actually sent, against the element's own schema. Elements
disagree about these flags — one spells a radius mode `"grouped"`, another
`"custom"` — so each rule offers candidates and the first the schema accepts
wins. An element that has no such flag gets nothing.

## Adding a New Tool

1. **Catalog** — in `@brizy/ai-tools`: add the property to the element's
   `schema.ts`, then name the concern it belongs to in its `tools.ts`. For a
   tool that is not about an element, add it to `infrastructure/tools.ts`.
2. **Wiring** — `adapters/tool-configs/<element>.ts` for a component, or a
   handler in `adapters/infrastructure-handlers.ts` otherwise. A component tool
   only needs a new config if its `alias` is new.
3. **Repository** — if new data access is needed, add a method to the
   appropriate repository interface + implementation.

The catalog's guard tests will fail if the tool exceeds ten properties,
collides with a sibling, omits its "When to use:", or offers an argument the
element's schema does not declare.

## Key Conventions

- Repository methods return `BrizyToolResult<T>` — `{ success, data?, error? }`
- LLM-facing data uses lightweight summary types to avoid sending large JSON payloads
- Zod schemas validate all LLM input at the handler layer before reaching repositories
- **containerId guard** — the standard and `addNoProps` add flows validate the target
  `containerId` with `containerIdSchema` (non-empty string) before calling `addElement`; a
  custom handler bypasses this shared check and is responsible for its own; a missing/blank id
  fails fast with a clear error
- Component tools use a declarative `ToolConfig` pattern (add/update/addNoProps) built by `handler-factory.ts`
- Infrastructure tools use imperative handlers in `infrastructure-handlers.ts`
- **Font validation** — Components that accept `fontFamily` use the `handler` escape hatch with `validateFonts()` (from `prop-defaults.ts`) to verify fonts exist in the project before applying. Tool descriptions instruct the LLM to call `getProjectFonts` before setting any font.
