import React, { useMemo } from "react";
import { useRef } from "react";
import { EditorComponentContext } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { useStyleProvider } from "visual/providers/StyleProvider";
import { ComponentTypes } from "./ComponentTypes";
import { Props } from "./types";

export const EditorComponentProvider = (props: Props) => {
  const { children, pageId, groups, componentTypes } = props;
  const { sheet } = useStyleProvider();
  const componentsRef = useRef(new ComponentTypes());
  const components = componentTypes ?? componentsRef.current;

  const value = useMemo(() => {
    return {
      sheet,
      componentTypes: components,
      dynamicContent: {
        itemId: pageId,
        config: groups
      }
    };
  }, [pageId, groups, sheet, components]);

  return (
    <EditorComponentContext.Provider value={value}>
      {children}
    </EditorComponentContext.Provider>
  );
};
