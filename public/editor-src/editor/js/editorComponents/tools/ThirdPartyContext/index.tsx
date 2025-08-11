import React, { useMemo } from "react";
import { ThirdPartyContext } from "./context";
import { Props } from "./types";

export const ThirdPartyContextProvider = (props: Props): JSX.Element => {
  const { children, editorProps } = props;
  const value = useMemo(() => ({ editorProps }), [editorProps]);

  return (
    <ThirdPartyContext.Provider value={value}>
      {children}
    </ThirdPartyContext.Provider>
  );
};
