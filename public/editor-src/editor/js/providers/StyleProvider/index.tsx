import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";
import { Sheet } from "./Sheet";
import { useStyleSheetManager } from "./StyleSheetManager";
import { SheetContext } from "./context";
import { Props } from "./types";

export function StyleProvider(props: Props) {
  const { children } = props;
  const styleSheetManager = useStyleSheetManager();
  const sheetRef = useRef(new Sheet());
  const [doc, setDoc] = useState<Document>();
  const sheet = styleSheetManager?.sheet ?? sheetRef.current;

  const handleSetDoc = useCallback(
    (doc: Document) => {
      sheet.setDoc(doc);
      setDoc(doc);
    },
    [sheet]
  );

  const value = useMemo(
    () => ({ sheet, doc, setDoc: handleSetDoc }),
    [doc, handleSetDoc, sheet]
  );

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
}

export const useStyleProvider = () => {
  const context = useContext(SheetContext);

  if (!context) {
    throw new Error("useStyleProvider must be used within a StyleProvider");
  }

  return context;
};
