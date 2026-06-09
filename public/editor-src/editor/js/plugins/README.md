# Plugins

Plugin system that allows external packages (e.g. `@brizy/ai-chat`) to extend the editor UI and access editor internals at runtime.

## Architecture

```
PluginBootstrap (React)
    │
    ▼
createEditorAPI() ──► EditorAPI { toolServer, slots, filters, events, t, store }
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

The `EditorAPI` object is passed to every plugin's `register()` method:

```typescript
interface EditorAPI {
  toolServer: IToolServer;   // AI tool discovery + execution
  slots: SlotRegistry;       // Register UI into named slots
  filters: FilterRegistry;   // Hook into editor filter pipeline
  events: EventBus;          // Subscribe to / emit editor events
  t: (key: string) => string; // i18n translation function
  store: ISharedStore;       // Cross-bundle shared state
}
```

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
