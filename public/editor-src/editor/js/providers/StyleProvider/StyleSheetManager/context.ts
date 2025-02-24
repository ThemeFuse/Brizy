import { createContext } from "react";
import { MValue } from "visual/utils/value";
import { Sheet } from "../Sheet";

interface StyleSheetManagerProvider {
  sheet: Readonly<Sheet>;
}

export const StyleSheetManagerContext =
  createContext<MValue<StyleSheetManagerProvider>>(undefined);
