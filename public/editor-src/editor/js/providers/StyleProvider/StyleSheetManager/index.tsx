import React, { useContext, useMemo } from "react";
import { StyleSheetManagerContext } from "./context";
import { Props } from "./types";

// These components are wrapper
// React Component used from third-party
// Used together with ServerStyleSheet

export function StyleSheetManager(props: Props) {
  const { children, sheet } = props;
  const value = useMemo(() => ({ sheet }), [sheet]);
  return (
    <StyleSheetManagerContext.Provider value={value}>
      {children}
    </StyleSheetManagerContext.Provider>
  );
}

export const useStyleSheetManager = () => {
  return useContext(StyleSheetManagerContext);
};
