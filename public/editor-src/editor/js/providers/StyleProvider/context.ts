import { createContext } from "react";
import { MValue } from "visual/utils/value";
import { Sheet } from "./Sheet";

interface SheetProvider {
  sheet: Sheet;
}

export const SheetContext = createContext<MValue<SheetProvider>>(undefined);
