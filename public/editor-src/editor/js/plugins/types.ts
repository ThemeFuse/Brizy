/**
 * Core type definitions for the plugin system.
 * Defines the contracts that plugins, registries, and the editor API follow.
 */
import type { ComponentType } from "react";
import type { IToolServer } from "visual/ai/application/interfaces/i-tool-server";
import { BlocksHTML } from "visual/types/Block";
import type { ISharedStore } from "./SharedStore";

// --- Plugin Definition ---

export interface EditorPlugin {
  id: string;
  name: string;
  register(api: EditorAPI): void | (() => void);
}

// --- Editor API ---

export interface EditorAPI {
  toolServer: IToolServer;
  slots: SlotRegistry;
  filters: FilterRegistry;
  events: EventBus;
  t: (key: string) => string;
  store: ISharedStore;
  getBlocksHtml: () => Array<BlocksHTML & { id: string }>;
  getPageData: () => unknown;
  getProjectData: () => unknown;
}

// --- Slots ---

export type SlotName =
  | "leftSidebar.drawer"
  | "leftSidebar.tab"
  | "floatingPanel";

export interface SlotContribution {
  id: string;
  component?: ComponentType;
  meta?: SlotMeta;
  order?: number;
}

export interface LeftSidebarDrawerMeta {
  icon: string;
  title: string;
  drawerTitle: string;
}

export interface FloatingPanelMeta {
  defaultPosition?: { x: number; y: number };
  draggable?: boolean;
  resizable?: boolean;
}

export interface LeftSidebarTabMeta {
  icon?: string;
  iconComponent?: ComponentType;
  title: string;
  onClick: () => void;
  active?: boolean;
  position?: "top" | "bottom";
}

export type SlotMeta =
  | LeftSidebarDrawerMeta
  | LeftSidebarTabMeta
  | FloatingPanelMeta;

// --- Registries ---

export interface SlotRegistry {
  add(slot: SlotName, contribution: SlotContribution): () => void;
}

export interface FilterRegistry {
  add(
    name: string,
    callback: (...args: unknown[]) => unknown,
    priority?: number
  ): () => void;
}

// --- Event Bus ---

export interface EventBus {
  on(event: string, handler: (...args: unknown[]) => void): () => void;
  emit(event: string, data?: unknown): void;
}
