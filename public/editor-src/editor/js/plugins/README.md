# Plugins

Plugin system that allows external packages (e.g. `@brizy/ai-chat`) to extend the editor UI and access editor internals at runtime.

## Architecture

```
PluginBootstrap (React)
    │
    ▼
createEditorAPI() ──► EditorAPI { toolServer, slots, filters, events, t, store, state queries }
    │
    ▼
PluginRegistry.registerAll(plugins)
    │  calls plugin.register(api) for each plugin
    │
    ▼
PluginProvider (React Context)
    │
    ├─► usePluginDrawerOptions()  → LeftSidebar drawers
    ├─► usePluginTabOptions()     → LeftSidebar tabs (top/bottom)
    └─► PluginPortals             → Floating panels
```

## Files

### Core

| File                 | Purpose                                                   |
|----------------------|-----------------------------------------------------------|
| `types.ts`           | All interfaces and type definitions                       |
| `EditorAPI.ts`       | Factory that assembles all parts into `EditorAPI`         |
| `PluginRegistry.ts`  | Manages plugin lifecycle (register, cleanup, destroy)     |
| `PluginBootstrap.tsx` | React component that initializes everything on mount     |
| `PluginProvider.tsx`  | React context + hooks for consuming slot contributions   |
| `PluginPortals.tsx`   | Renders `floatingPanel` slot contributions               |
| `index.ts`           | Public exports                                            |

### Infrastructure

| File                 | Purpose                                                   |
|----------------------|-----------------------------------------------------------|
| `ToolServer.ts`      | `IToolServer` impl — creates PageRepository + ProjectRepository, delegates to `ai/` module |
| `SlotRegistry.ts`    | Stores UI slot contributions, sorted by order             |
| `FilterRegistry.ts`  | Wraps editor's `addFilter`/`removeFilter` with cleanup tracking |
| `EventBus.ts`        | Wraps `UIEvents` (on/off/emit) with cleanup tracking     |
| `SharedStore.ts`     | Key-value `Map` for cross-bundle data sharing             |

## EditorAPI

The `EditorAPI` object is passed to every plugin's `register()` method. One flat interface serves all plugins — no plugin-specific sub-APIs:

```typescript
interface EditorAPI {
  // Infrastructure
  toolServer: IToolServer;   // AI tool discovery + execution
  slots: SlotRegistry;       // Register UI into named slots
  filters: FilterRegistry;   // Hook into editor filter pipeline
  events: EventBus;          // Subscribe to / emit editor events
  t: (key: string) => string; // i18n translation function
  store: ISharedStore;       // Cross-bundle shared state

  // Data access
  getBlocksHtml: () => Array<BlocksHTML & { id: string }>;
  getPageData: () => unknown;
  getProjectData: () => unknown;

  // State queries
  getPageId: () => string;
  getProjectId: () => string;
  getBlockCount: () => number;
  getStateSize: () => number;       // Cached, max 1x/5s, uses requestIdleCallback
  getHistoryInfo: () => { current: number; max: number; snapshotCount: number };
}
```

### Events

All editor events are centralized in the `UIEventType` enum (`visual/global/UIEvents.ts`). Plugins subscribe via `api.events.on(eventName, cb)` and receive an unsubscribe function.

| UIEventType | Value | Payload | Source |
|---|---|---|---|
| `ReduxActionPerf` | `redux:action:perf` | `{ type: string; duration: number; timestamp: number }` | Redux perf middleware |
| `DndSort` | `dnd.sort` | `{ from, to }` sort data | Sortable, AddElements |
| `DeviceModeChange` | `deviceMode.change` | `"mobile" \| "tablet" \| "desktop"` | DeviceModes |
| `ActiveElementChange` | `activeElement:change` | `ActiveElementMeta` | Redux sideEffects middleware |
| `NavigatorOpen` | `navigator.open` | `{ elementId: string \| null }?` | Editor, Navigator |
| `NavigatorClose` | `navigator.close` | none | Navigator |
| `MMenuClose` | `mMenu:close` | none | Menu |
| `EntranceOn` | `entrance.on` | `{ animationIsRunning, animationId }` | Animation |
| `EntranceOff` | `entrance.off` | `{ animationIsRunning, animationId }` | Animation |

**Note:** `perf-monitor` runs as a separate package and cannot import `UIEventType`. It defines `PERF_ACTION_EVENT` locally — must stay in sync with `UIEventType.ReduxActionPerf`.

## Plugin Contract

```typescript
interface EditorPlugin {
  id: string;
  name: string;
  register(api: EditorAPI): void | (() => void);  // return cleanup fn
}
```

- `register()` is called **synchronously** during `useMemo` (not `useEffect`) so contributions are available on first render
- Return a cleanup function to unsubscribe filters, events, and remove slot contributions
- Duplicate plugin IDs are skipped with a console warning

## Slots

| Slot Name              | Wired To                    | Meta Type               |
|------------------------|-----------------------------|-------------------------|
| `leftSidebar.drawer`   | LeftSidebar drawer options  | `LeftSidebarDrawerMeta` |
| `leftSidebar.tab`      | LeftSidebar tab icons       | `LeftSidebarTabMeta`    |
| `floatingPanel`         | PluginPortals component    | `FloatingPanelMeta`     |
| `bottomPanel`           | BottomPanel container      | none                    |

### `bottomPanel` semantics

- The editor has no targeting concept. All `bottomPanel` contributions render, unwrapped from
  meta, inside the `.brz-ed-fixed-bottom-panel` container, after the existing `<ul>`, wrapped
  together in `SlotErrorBoundary` so a crashing contribution can't take down the panel.
- Native panel items (Help, Preview, etc.) carry an identity attribute — `data-bzelm="<name>"`,
  the same convention used elsewhere in the editor (e.g. `PreviewButton`'s
  `data-bzelm="preview"`) — and the panel's `&__item` provides `position: relative`. A
  contribution that wants to decorate a specific item (e.g. a notification dot on Help) finds
  it itself: scope a DOM query from its own rendered node
  (`el.closest(".brz-ed-fixed-bottom-panel")` → `querySelector('[data-bzelm="help"]')`) and
  portal into it with `ReactDOM.createPortal`. If the target item isn't present in the DOM
  (e.g. `config.ui.help.showIcon` is falsy), the contribution simply finds nothing and renders
  nothing — no editor-side wiring required.
- Future extension (not built): meta-driven native bottom-panel items (icon/title/onClick),
  in the spirit of `leftSidebar.tab`.

## React Hooks

| Hook                       | Returns                                     |
|----------------------------|---------------------------------------------|
| `usePluginRegistry()`      | `PluginRegistry \| undefined`               |
| `usePluginSlot(slot)`      | `SlotContribution[]` for the given slot     |
| `usePluginDrawerOptions()` | `Option[]` for LeftSidebar drawers          |
| `usePluginTabOptions()`    | `{ top: Option[], bottom: Option[] }` for sidebar tabs |

## SharedStore

Cross-bundle key-value store. Used when module-scoped state doesn't work across separately bundled code (e.g. `init.js` writes data that `editor.min.js` reads).

```typescript
interface ISharedStore {
  get(key: string): unknown | undefined;
  set(key: string, value: unknown): void;
  delete(key: string): boolean;
  clear(): void;
}
```

Primary use case: `generateBlock` (in ai-chat's `init.js`) stores block data via `store.set(ref, data)`, then `addBlock` handler reads it via `store.get(ref)`.

## Bootstrap Flow

1. `PluginBootstrap` mounts inside `RegisterParts` in `bootstraps/module/Editor/index.tsx`
2. `createEditorAPI()` instantiates ToolServer, SlotRegistry, FilterRegistry, EventBus, SharedStore
3. `PluginRegistry.registerAll()` calls each plugin's `register(api)` synchronously
4. `PluginProvider` wraps children with React context
5. `PluginPortals` renders floating panel contributions via Portal
6. On unmount, `registry.destroy()` cleans up all plugins, registries, and event subscriptions
