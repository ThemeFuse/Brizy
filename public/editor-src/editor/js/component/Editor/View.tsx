import React from "react";
import {
  EditorMode,
  getCommonEditorMode
} from "visual/global/EditorModeContext";
import { Page } from "./View/Page";
import { Popup } from "./View/Popup";
import { Story } from "./View/Story";

const View = ({ editorMode }: { editorMode: EditorMode }) => {
  const type = getCommonEditorMode(editorMode);
  switch (type) {
    case "popup": {
      return <Popup mode={editorMode} />;
    }
    case "story": {
      return <Story mode={editorMode} />;
    }
    case "page": {
      return <Page mode={editorMode} />;
    }
  }
};

export default View;
