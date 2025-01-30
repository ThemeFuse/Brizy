import React from "react";
import {
  EditorMode,
  getCommonEditorMode
} from "visual/providers/EditorModeProvider";
import { Page } from "./View/Page";
import { Popup } from "./View/Popup";
import { Story } from "./View/Story";

const View = ({ editorMode }: { editorMode: EditorMode }) => {
  const type = getCommonEditorMode(editorMode);
  switch (type) {
    case "popup": {
      return <Popup />;
    }
    case "story": {
      return <Story />;
    }
    case "page": {
      return <Page />;
    }
  }
};

export default View;
