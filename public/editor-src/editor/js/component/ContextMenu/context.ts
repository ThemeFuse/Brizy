import { createContext } from "react";
import { Item } from "./types";

interface ContextType {
  getParentContextMenuItems: () => Item[];
  getParentContextMenuExtendItems?: () => Item[];
}

export const ContextMenuContext = createContext<ContextType>({
  getParentContextMenuItems: () => []
});
