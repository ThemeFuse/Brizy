# Adapters

Outermost layer — wires the tool catalog, Zod validation, and handlers
together. This is where the AI chat client connects to the editor internals.

The catalog itself lives in `@brizy/ai-tools`: every tool name, description and
argument schema. What is here is what runs. The two are joined by `alias` — an
element is exposed as several small tools that all carry one alias and so all
resolve to the single handler its config builds.

## Files

### `brizy-tool-server.ts`

`BrizyToolServer` implements `IToolServer`. Entry point for the AI chat client.

- **Constructor:** `(pageRepository, projectRepository, store, t)`
- **Factory:** `createBrizyToolServer(pageRepository, projectRepository, store, t)`
- Combines definitions from `tool-registry` with handlers
- `callTool()` looks up handler by name, measures execution time, catches errors

### `tool-registry.ts`

Central registry that assembles all tool definitions and handlers.

- `getBrizyToolDefinitions(t)` — the catalog from `@brizy/ai-tools`, with the
  confirmation copy built through the editor's `t`
- `createBrizyToolHandlers(pageRepository, projectRepository, store)` — builds
  one handler per `ToolConfig` and registers it under **every** catalog name
  that aliases to it, so `updateButtonBackground` and `updateButtonPadding`
  share one handler
- Component wiring comes from `tool-configs/`, not from the element folders

### `tool-configs/`

One file per element, holding only what the editor can supply: the
`ElementTypes` value, the prop-normalisation pipeline, and any hooks that need
the element's stored state. `tool-configs/index.ts` collects them into
`componentConfigs`.

A config carries an `alias`, not a definition — the definitions live in
`@brizy/ai-tools`. Adding a concern to an element is a change there alone.

### `infrastructure-handlers.ts`

Handler functions for infrastructure tools. Connects tool calls to repository methods.

- **Read tools** → `pageRepository` (getPageStructure — defaults to full depth when `depth` omitted, getElementById, searchElements, isPro, getAvailableIcons)
- **Block tools** → `pageRepository` (addBlocks, addBlankBlock, removeBlock, moveBlock, duplicateBlock, clearPage)
- **Project tools** → `projectRepository` (getProjectStyles, changeStyle, addStyle, duplicateStyle, getProjectFonts, getGoogleFonts, addFont, deleteFont, changeDefaultFont)
- **Element tools** → `pageRepository` (removeElement, duplicateElement, moveElement)
- **History tools** → `pageRepository` (undoLastChange — reverts the last change via the editor history; no-op when there is nothing to undo)
- `addStyle` handler validates input with `addStyleSchema` (Zod) before calling repository

### `handler-factory.ts`

Builds handlers from declarative `ToolConfig` objects. Three patterns:

| Config kind  | Flow                                                        |
|-------------|--------------------------------------------------------------|
| `add`       | extract containerId → validate containerId → defaults → Zod parse → `addElement` |
| `update`    | extract elementId → optional type check → defaults → Zod parse → `updateElement` |
| `addNoProps`| extract containerId → validate containerId → `addElement` (no schema needed) |

Both add flows validate `containerId` with `containerIdSchema` (non-empty string) before touching the repository. A missing or blank `containerId` returns `{ success: false, error }` and never calls `addElement`, so the failure is clear instead of surfacing as a vague downstream error.

Supports escape hatches: `handler` override, `afterAdd` hook, `beforeUpdate` hook, `transformProps`, `validateType`.

Both flows do two things before the element's own `defaults` run:

- **`inferStoredFlags(config.schema, props)`** fills in the render toggles the
  catalog never asks the LLM for — `bgColorType`, `boxShadow`,
  `borderRadiusType` and the rest. Each rule offers candidate values and the
  first the element's schema accepts is used, so an element that spells a mode
  differently, or does not have the flag at all, is left alone.
- **`validateFonts(deps, parsed)`** checks every `*FontFamily` against the
  project. It walks the keys and does nothing when there are none, so detecting
  them beats a per-config flag a new element could forget to set.

`addFormField` uses the `handler` escape hatch for a different reason: it is a
**composite** — `duplicateElement` on the group's last field, then
`updateElement` on the clone. The editor has no create-field primitive
(`addElement` cannot build a `Form2Field`; there is no shortcode for one) and
its own add-field affordance is the per-field Duplicate button. The handler
also resolves `formId` from a `Form2`, `Form2Step`, `Form2Fields` or
`Form2Field` id, so the agent never picks the container itself.

**`beforeUpdate` conventions** (stateful normalization — the patch alone is not enough):

- The LLM sends only the props it wants to change; `defaults`/`transformProps` see just that patch. When correctness depends on the element's **stored** value, do it in `beforeUpdate`, which gets `deps` + `elementId` and can call `deps.pageRepository.getElementById(elementId)`. Precedents: `Table` (resize items when rows/columns change), `Menu` (restore color opacity, route alignment).
- A `beforeUpdate` may **write to another element**: `Menu.horizontalAlign` is routed to the parent Wrapper (the Menu has no page-align prop of its own) via a `pageRepository.updateElement` on `parentId`, and stripped from the returned menu changes.
- Restoring color opacity (`restoreColorOpacity` in `prop-defaults.ts`) mirrors the toolbar's `setHex` rule so a hex applied to a stored-transparent color (default `*ColorOpacity: 0`) is visible. Currently wired per-tool (Menu); candidate to lift into the update handler if it recurs — see the `ponytail:` note in `tool-configs/menu.ts`.
- Wrong-tool errors should name the right tool (`handler-factory.ts` substitutes `${type}` into
  the component's `validateType.errorMessage`) so the agent recovers instead of falsely
  reporting the capability as unsupported.

**Form2 container rules** (`infrastructure/repositories/utils/element.ts`):

- `Form2` and `Form2Step` redirect to their `items[0]` (`Form2Fields`), so the
  agent can pass a form id or a step id wherever a container is expected.
- `Form2Field` has `REQUIRED_PARENT = Form2Fields`; anywhere else the add/move
  fails with a message naming what to look up next.
- `Form2` has `minChildren: 5` and `Form2Fields` `minChildren: 1`. `Form2.items`
  is positional — removing a direct child silently reassigns the roles of the
  rest — and the editor itself forbids deleting a group's last field.

### Shared zod primitives

`hexColor`, `opacity`, `containerIdSchema`, `fontStyleEnum` and the rest now
live in `@brizy/ai-tools` (`primitives/zod.ts`), because the catalog and the
handlers validate against the same shapes.

### `prop-defaults.ts`

Prop transformation and validation utilities used by the configs in `tool-configs/`.

| Function                | Purpose                                                       |
|-------------------------|---------------------------------------------------------------|
| `withColorDefaults`     | Auto-clears palette when LLM sends hex without it             |
| `withFontFamilyNormalize` | Normalizes fontFamily to builder format (`tripId`), auto-clears fontStyle |
| `validateFonts`         | Checks that all `*FontFamily` values in parsed data exist in project fonts via `projectRepository.fontExists()`. Returns error if font not found. |

### `types.ts`

Type definitions for the adapter layer.

| Type               | Purpose                                                    |
|--------------------|------------------------------------------------------------|
| `ToolArgs`         | `Record<string, unknown>` — raw tool arguments             |
| `HandlerDeps`      | `{ pageRepository, projectRepository, store }` — injected deps |
| `AddToolConfig`    | Declarative config for "add element" tools                 |
| `UpdateToolConfig` | Declarative config for "update element" tools              |
| `AddNoPropsToolConfig` | Config for simple add tools (no schema)                |
| `ToolConfig`       | Union of all config types                                  |

Each config carries an `alias` — the handler key every catalog tool for that
element resolves through.

### Tests (`__tests__/`)

Tests for `buildHandler` covering:
- Add tool with schema validation
- Update tool with schema validation
- Type validation on update
- containerId rejection on add / addNoProps (missing, empty, non-string)
- Custom handler escape hatch
- `afterAdd` and `beforeUpdate` hooks
- `transformProps` pipeline
