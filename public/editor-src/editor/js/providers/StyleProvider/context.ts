import { createContext } from "react";
import { MValue } from "visual/utils/value";
import { Sheet } from "./Sheet";

interface SheetProvider {
  sheet: Readonly<Sheet>;
  setDoc: (doc: Document) => void;
}

export const SheetContext = createContext<MValue<SheetProvider>>(undefined);
