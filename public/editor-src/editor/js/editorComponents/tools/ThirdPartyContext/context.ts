import { createContext } from "react";
import type { ThirdPartyContextType } from "./types";

export const ThirdPartyContext = createContext<
  ThirdPartyContextType | undefined
>(undefined);
