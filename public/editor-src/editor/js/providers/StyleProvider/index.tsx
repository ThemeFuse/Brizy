import React, { useContext, useRef } from "react";
import { Sheet } from "./Sheet";
import { useStyleSheetManager } from "./StyleSheetManager";
import { SheetContext } from "./context";
import { Props } from "./types";

export function StyleProvider(props: Props) {
  const { children } = props;
  const styleSheetManager = useStyleSheetManager();
  const sheetRef = useRef(new Sheet());

  if (styleSheetManager?.sheet) {
    return (
      <SheetContext.Provider value={{ sheet: styleSheetManager.sheet }}>
        {children}
      </SheetContext.Provider>
    );
  }

  return (
    <SheetContext.Provider value={{ sheet: sheetRef.current }}>
      {children}
    </SheetContext.Provider>
  );
}

export const useStyleProvider = () => {
  const context = useContext(SheetContext);

  if (!context) {
    throw new Error("useStyleProvider must be used within a StyleProvider");
  }

  return context;
};
