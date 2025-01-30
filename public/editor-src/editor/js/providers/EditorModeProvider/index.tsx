import React, { ReactNode, useMemo } from "react";
import {
  EditorMode,
  EditorModeContext,
  isPopup,
  isStory
} from "visual/providers/EditorModeProvider/context";

export * from "./context";

interface Props {
  children: ReactNode;
  mode: EditorMode;
}
export function EditorModeProvider(props: Props) {
  const { children, mode } = props;
  const value = useMemo(() => ({ mode }), [mode]);

  return (
    <EditorModeContext.Provider value={value}>
      {children}
    </EditorModeContext.Provider>
  );
}

type EditorCommonType = "page" | "story" | "popup";

export function getCommonEditorMode(editorMode: EditorMode): EditorCommonType {
  if (isPopup(editorMode)) {
    return "popup";
  }
  if (isStory(editorMode)) {
    return "story";
  }
  return "page";
}
