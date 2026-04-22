# Infrastructure

Concrete implementations of application interfaces. All Redux state access happens here.

## Repositories

### `PageRepository` (`repositories/page.repository.ts`)

Implements `IPageRepository`. Handles page structure, blocks, and elements.

- **Constructor:** `(getState: () => ReduxState, dispatch: TypedDispatch, config: ConfigCommon)`
- **Factory:** `createPageRepository(getState, dispatch, config)`
- **Redux actions used:** `addBlock`, `removeBlock`, `removeBlocks`, `reorderBlocks`, `updateBlockData`
- **DND integration:** Uses `changeValueAfterDND` for element add/move operations
- **Search:** Collects elements across all blocks, supports type match, text match, regex, and fuzzy search

### `ProjectRepository` (`repositories/project.repository.ts`)

Implements `IProjectRepository`. Handles styles and fonts.

- **Constructor:** `(getState: () => ReduxState, dispatch: TypedDispatch, config: ConfigCommon)`
- **Factory:** `createProjectRepository(getState, dispatch, config)`
- **Redux actions used:** `addFonts`, `addNewGlobalStyle`, `deleteFont`, `updateCurrentStyleId`, `updateDefaultFont`
- **External APIs:** `getGoogleFonts`, `addAdobeFonts`, `getAdobeFonts` for font operations
- **Font restore:** Checks for previously deleted fonts via `getGroupFontsById` before adding duplicates

## Utils (`repositories/utils/`)

Pure functions extracted from repositories. Each file is domain-specific.

### `block.ts`
| Function               | Purpose                                          |
|------------------------|--------------------------------------------------|
| `createDefaultBlock`   | Creates empty Section/Header/Footer block        |
| `cloneBlockWithNewIds` | Deep-clones block with fresh UUIDs               |
| `parseBackendBlockData`| Parses raw block JSON from backend API           |
| `buildElementSummary`  | Converts block tree to `ElementSummary` for LLM (recurses to `maxDepth`, defaults to full tree) |

### `dnd.ts`
| Function               | Purpose                                          |
|------------------------|--------------------------------------------------|
| `buildAddableFromTo`   | Creates DND from/to for element insertion         |
| `buildMoveFromTo`      | Creates DND from/to for element relocation        |
| `mapToDndContainerType`| Maps element type to DND container type           |

### `element.ts`
| Function                  | Purpose                                       |
|---------------------------|-----------------------------------------------|
| `createDefaultElement`    | Creates element with default values            |
| `correctContainerForElement` | Adjusts container (e.g., wraps in Row/Column) |
| `duplicateElementInBlock` | Clones element within a block                  |
| `removeElementFromBlock`  | Removes element and returns updated block      |
| `updateColumnInRow`       | Redistributes column widths on change          |
| `getNestedValue`          | Deep property access by dot path               |
| `isRowElement`, `isColumnElement`, `isWrappersTypeElement` | Type guards |
| `getShortcodeKey`         | Gets shortcode key for element type            |

### `richtext.ts`
| Function               | Purpose                                          |
|------------------------|--------------------------------------------------|
| `applyRichTextUpdates` | Orchestrates all RichText changes                |
| `findAndReplaceInHtml` | Find/replace in QuillJS HTML (preserves tags)    |
| `replaceAllTextInHtml` | Replaces all text content in HTML                |
| `updateRichTextColor`  | Updates color hex/opacity in RichText HTML spans |
| `applyTypographyStyles`| Applies font style presets or custom typography  |
| `isFontStyle`          | Checks if value is a valid font style preset     |

### `project.ts`
| Function / Schema       | Purpose                                          |
|-------------------------|--------------------------------------------------|
| `addStyleSchema`        | Zod schema for addStyle validation               |
| `updateStyleSchema`     | Zod schema for updateProjectStyle validation     |
| `toStyleSummary`        | `Style` → `StyleSummary` (id + title)            |
| `toFontStyleSummary`    | `FontStyle` → `FontStyleSummary` (desktop only)  |
| `toStyleDetail`         | `Style` → `StyleDetail` (palette + font styles)  |
| `toFontSummaries`       | `Fonts` → `FontSummary[]` via `fontTransform`    |
| `mergeStyleUpdate`      | Applies partial style update (merges font styles by id) |
| `buildNewStyle`         | Creates new style from partial params + current  |
| `duplicateCurrentStyle` | Clones current style with new UUID               |

### `search.ts`
| Function           | Purpose                                              |
|--------------------|------------------------------------------------------|
| `collectElements`  | Recursively collects all elements from a block tree  |
| `searchInElement`  | Matches single element against search criteria       |
| `applyFuzzySearch` | Fuzzy text matching on search candidates             |
| `toSearchResults`  | Converts internal results to `SearchElementsResult`  |

### Tests (`utils/__tests__/`)
- `dnd.test.ts` — DND from/to construction
- `element.test.ts` — Element creation, duplication, removal
- `richtext.test.ts` — HTML find/replace, color updates, typography
