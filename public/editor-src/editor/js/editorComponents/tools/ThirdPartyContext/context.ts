import { createContext } from "react";
import { ThirdPartyContextType } from "./types";

export const ThirdPartyContext = createContext<
  ThirdPartyContextType | undefined
>(undefined);
