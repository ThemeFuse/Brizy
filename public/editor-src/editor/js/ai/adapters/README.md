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

- `getBrizyToolDefinitions()` — returns all `ToolDefinition[]` (infrastructure + component)
- `createBrizyToolHandlers(pageRepository, projectRepository, store)` — returns `Record<string, ToolHandler>`
- Component tools imported from each `editorComponents/*/definitions.ts` file

### `infrastructure-definitions.ts`

`ToolDefinition` objects for non-component tools. Each definition has:
- `name` — tool identifier
- `description` — LLM-facing documentation
- `parameters` — JSON Schema for arguments
- `category` — read | block | project | element
- `strict` — enables strict JSON mode

Definitions: `getPageStructure` (optional `depth` param, no upper limit — defaults to full tree), `getElementById`, `searchElements`, `getAvailableIcons`, `isPro`, `getGoogleFonts`, `addBlock`, `addBlankBlock`, `removeBlock`, `clearPage`, `moveBlock`, `duplicateBlock`, `getProjectStyles`, `changeStyle`, `addStyle`, `duplicateStyle`, `getProjectFonts`, `addFont`, `deleteFont`, `changeDefaultFont`, `removeElement`, `duplicateElement`, `moveElement`.

### `infrastructure-handlers.ts`

Handler functions for infrastructure tools. Connects tool calls to repository methods.

- **Read tools** → `pageRepository` (getPageStructure — defaults to full depth when `depth` omitted, getElementById, searchElements, isPro, getAvailableIcons)
- **Block tools** → `pageRepository` (addBlock, addBlankBlock, removeBlock, moveBlock, duplicateBlock, clearPage)
- **Project tools** → `projectRepository` (getProjectStyles, changeStyle, addStyle, duplicateStyle, getProjectFonts, getGoogleFonts, addFont, deleteFont, changeDefaultFont)
- **Element tools** → `pageRepository` (removeElement, duplicateElement, moveElement)
- `addStyle` handler validates input with `addStyleSchema` (Zod) before calling repository

### `handler-factory.ts`

Builds handlers from declarative `ToolConfig` objects. Three patterns:

| Config kind  | Flow                                                        |
|-------------|--------------------------------------------------------------|
| `add`       | extract containerId → defaults → Zod parse → `addElement`   |
| `update`    | extract elementId → optional type check → defaults → Zod parse → `updateElement` |
| `addNoProps`| extract containerId → `addElement` (no schema needed)        |

Supports escape hatches: `handler` override, `afterAdd` hook, `beforeUpdate` hook, `transformProps`, `validateType`.

Components that need custom validation (e.g., font family checks) use the `handler` escape hatch to run their own flow in `definitions.ts` rather than adding generic validation to the factory.

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
- Custom handler escape hatch
- `afterAdd` and `beforeUpdate` hooks
- `transformProps` pipeline
