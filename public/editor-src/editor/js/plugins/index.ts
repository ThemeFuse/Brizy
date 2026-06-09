/**
 * Public API for the plugin system.
 * Re-exports types and React bindings consumed by host apps and plugins.
 */
export {
  PluginProvider,
  usePluginDrawerOptions,
  usePluginRegistry,
  usePluginSlot,
  usePluginTabOptions
} from "./PluginProvider";
export type { ISharedStore } from "./SharedStore";
export type { ActiveElementMeta } from "visual/redux/types";
export type {
  EditorAPI,
  EditorPlugin,
  EventBus,
  FilterRegistry,
  FloatingPanelMeta,
  LeftSidebarDrawerMeta,
  LeftSidebarTabMeta,
  SlotContribution,
  SlotMeta,
  SlotName,
  SlotRegistry
} from "./types";
