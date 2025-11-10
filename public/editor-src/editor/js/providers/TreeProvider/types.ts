import { Dispatch, SetStateAction } from "react";

export interface TreeContextType {
  activeId: string | null;
  toggleExpandAll: VoidFunction;
  allExpanded: boolean;
  items: TreeItems;
  setItems: Dispatch<SetStateAction<TreeItems>>;
  toggleExpand: (id: string) => void;
  toggleShowElement: (id: string) => void;
  onClickItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  setActiveId: (id: string | null) => void;
}

export interface TreeItem {
  id: string;
  type: string;
  title: string;
  children: TreeItem[] | null;
  icon: string | null;
  collapsed?: boolean;
  isHidden: boolean;
  // Whether this node should be displayed in the Navigator UI
  // Invisible nodes are preserved structurally for merge/reorder, but not shown (like SectionItem,Wrapper,Cloneable)
  visible?: boolean;
}

export type TreeItems = TreeItem[];
