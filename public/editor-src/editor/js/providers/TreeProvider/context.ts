import { createContext } from "react";
import { TreeContextType } from "./types";

export const TreeContext = createContext<TreeContextType | null>(null);
