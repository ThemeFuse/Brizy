import { createContext } from "react";
import type { MValue } from "visual/utils/value";
import type { Sheet } from "../Sheet";

export interface StyleSheetManagerProvider {
  sheet: Readonly<Sheet>;
}

export const StyleSheetManagerContext =
  createContext<MValue<StyleSheetManagerProvider>>(undefined);
