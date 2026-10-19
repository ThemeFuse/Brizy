import { createContext } from "react";
import type { TreeContextType } from "./types";

export const TreeContext = createContext<TreeContextType | null>(null);
