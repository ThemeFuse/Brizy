import { createContext } from "react";
import type { ComponentMenuEntry } from "./types";

interface ContextType {
  getParentContextMenuItems: () => ComponentMenuEntry[];
  getParentContextMenuExtendItems?: () => ComponentMenuEntry[];
}

export const ContextMenuContext = createContext<ContextType>({
  getParentContextMenuItems: () => []
});
