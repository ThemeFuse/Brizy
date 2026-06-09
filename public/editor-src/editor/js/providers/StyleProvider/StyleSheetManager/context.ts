import { createContext } from "react";
import { MValue } from "visual/utils/value";
import { Sheet } from "../Sheet";

export interface StyleSheetManagerProvider {
  sheet: Readonly<Sheet>;
}

export const StyleSheetManagerContext =
  createContext<MValue<StyleSheetManagerProvider>>(undefined);
