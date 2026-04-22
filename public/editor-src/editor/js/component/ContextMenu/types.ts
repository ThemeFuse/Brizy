import type { MutableRefObject, ReactNode } from "react";
import type { ContextMenuItem } from "visual/editorComponents/EditorComponent/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemDisabledFn = (item: any, meta: any) => boolean | void;

export interface Item {
  id: string;
  type: "button" | "group";
  items?: Item[];
  disabled?: boolean | ItemDisabledFn;
}

export interface ComponentMenuEntry {
  componentId: string;
  items: Item[];
}

export interface MenuPosition {
  x: number;
  y: number;
}

export interface Meta {
  depth: number;
  isInSubMenu: boolean;
}

export interface ContextMenuProviderProps {
  getItems: () => ContextMenuItem[];
  children:
    | ReactNode
    | ((props: { ref: MutableRefObject<HTMLElement | null> }) => ReactNode);
  componentId: string;
  onContextMenu?: () => void;
}
