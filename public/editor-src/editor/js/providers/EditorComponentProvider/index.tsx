import React, { useMemo } from "react";
import { EditorComponentContext } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { useStyleProvider } from "visual/providers/StyleProvider";
import { Props } from "./types";

export const EditorComponentProvider = (props: Props) => {
  const { children, pageId, groups } = props;
  const { sheet } = useStyleProvider();

  const value = useMemo(() => {
    return {
      sheet,
      dynamicContent: {
        itemId: pageId,
        config: groups
      }
    };
  }, [pageId, groups, sheet]);

  return (
    <EditorComponentContext.Provider value={value}>
      {children}
    </EditorComponentContext.Provider>
  );
};
