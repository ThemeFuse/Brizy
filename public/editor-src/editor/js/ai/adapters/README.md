# Adapters

Outermost layer — wires tool definitions, Zod validation, and handlers together. This is where the AI chat client connects to the editor internals.

## Files

### `brizy-tool-server.ts`

`BrizyToolServer` implements `IToolServer`. Entry point for the AI chat client.

- **Constructor:** `(pageRepository, projectRepository, store)`
- **Factory:** `createBrizyToolServer(pageRepository, projectRepository, store)`
- Combines definitions from `tool-registry` with handlers
- `callTool()` looks up handler by name, measures execution time, catches errors

### `tool-registry.ts`

Central registry that assembles all tool definitions and handlers.

- `getBrizyToolDefinitions(t)` — returns all `ToolDefinition[]` (infrastructure + component), building the confirmation copy with the editor's `t`
- `createBrizyToolHandlers(pageRepository, projectRepository, store)` — returns `Record<string, ToolHandler>`
- Component tools imported from each `editorComponents/*/definitions.ts` file

### `infrastructure-definitions.ts`

`ToolDefinition` objects for non-component tools. Each definition has:
- `name` — tool identifier
- `description` — LLM-facing documentation
- `parameters` — JSON Schema for arguments
- `category` — read | block | project | element | history
- `strict` — enables strict JSON mode

Definitions: `getPageStructure` (optional `depth` param, no upper limit — defaults to full tree), `getElementById`, `searchElements`, `getAvailableIcons`, `isPro`, `getGoogleFonts`, `addBlock`, `addBlankBlock`, `removeBlock`, `clearPage`, `moveBlock`, `duplicateBlock`, `getProjectStyles`, `changeStyle`, `addStyle`, `duplicateStyle`, `getProjectFonts`, `addFont`, `deleteFont`, `changeDefaultFont`, `removeElement`, `duplicateElement`, `moveElement`, `undoLastChange` (no params).

### `infrastructure-handlers.ts`

Handler functions for infrastructure tools. Connects tool calls to repository methods.

- **Read tools** → `pageRepository` (getPageStructure — defaults to full depth when `depth` omitted, getElementById, searchElements, isPro, getAvailableIcons)
- **Block tools** → `pageRepository` (addBlock, addBlankBlock, removeBlock, moveBlock, duplicateBlock, clearPage)
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

Components that need custom validation (e.g., font family checks) use the `handler` escape hatch to run their own flow in `definitions.ts` rather than adding generic validation to the factory. These custom handlers run the same `containerIdSchema` check inline (Button, RichText, Chart, Switcher, AnimatedHeadline, Paypal, Login).

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
- Restoring color opacity (`restoreColorOpacity` in `prop-defaults.ts`) mirrors the toolbar's `setHex` rule so a hex applied to a stored-transparent color (default `*ColorOpacity: 0`) is visible. Currently wired per-tool (Menu); candidate to lift into the update handler if it recurs — see the `ponytail:` note in `Menu/definitions.ts`.
- Wrong-tool errors should name the right tool (`page.repository.ts` uses `update${type}`) so the agent recovers instead of falsely reporting the capability as unsupported.

**Form2 container rules** (`infrastructure/repositories/utils/element.ts`):

- `Form2` and `Form2Step` redirect to their `items[0]` (`Form2Fields`), so the
  agent can pass a form id or a step id wherever a container is expected.
- `Form2Field` has `REQUIRED_PARENT = Form2Fields`; anywhere else the add/move
  fails with a message naming the `searchElements` call to make next.
- `Form2` has `minChildren: 5` and `Form2Fields` `minChildren: 1`. `Form2.items`
  is positional — removing a direct child silently reassigns the roles of the
  rest — and the editor itself forbids deleting a group's last field.

### `schema-primitives.ts`

Reusable Zod primitives shared across all tool schemas.

| Primitive            | Type / Constraint                                 |
|----------------------|---------------------------------------------------|
| `hexColorRequired`   | `string` matching `#RRGGBB`                       |
| `hexColor`           | Optional variant of above                         |
| `opacity`            | `number` 0–1, optional                            |
| `paletteIdEnum`      | `color1`–`color8`                                 |
| `colorPalette`       | `string`, optional (palette slot or empty)        |
| `paletteColorSchema` | `{ id: paletteIdEnum, hex: hexColorRequired }`    |
| `containerIdSchema`  | `string` min 1 — target Section/Column id, validated at add-handler entry |
| `linkTypes`          | `"external"`                                      |
| `onOff`              | `"on" \| "off"`                                   |
| `plainText`          | `string` rejecting HTML tags                      |
| `fontStyleEnum`      | paragraph, subtitle, abovetitle, heading1–6, button |
| `fontFamilyTypeEnum` | google, upload, adobe, system                     |
| `fontFamilySchema`   | `string` min 1, optional — element-level font     |
| `fontFamilyPropertyDefinition` | Shared tool param definition for fontFamily |
| `fontSize`           | `number` 1–200                                    |
| `fontWeight`         | `number` 100–900                                  |
| `lineHeight`         | `number` 0.5–5                                    |
| `letterSpacing`      | `number`                                          |
| `textAlignEnum`      | left, center, right, justify                      |

### `prop-defaults.ts`

Prop transformation and validation utilities used in component `definitions.ts` files.

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

### Tests (`__tests__/handler-factory.ts`)

Tests for `buildHandler` covering:
- Add tool with schema validation
- Update tool with schema validation
- Type validation on update
- containerId rejection on add / addNoProps (missing, empty, non-string)
- Custom handler escape hatch
- `afterAdd` and `beforeUpdate` hooks
- `transformProps` pipeline
