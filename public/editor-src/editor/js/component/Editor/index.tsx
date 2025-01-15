import React, { KeyboardEvent, ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import { noop } from "underscore";
import BottomPanel from "visual/component/BottomPanel";
import HotKeys from "visual/component/HotKeys";
import { LeftSidebar } from "visual/component/LeftSidebar";
import Notifications from "visual/component/Notifications";
import Portal from "visual/component/Portal";
import Prompts from "visual/component/Prompts";
import { RightSidebar } from "visual/component/RightSidebar";
import { CustomFile } from "visual/global/Config/types/configs/ConfigCommon";
import {
  EditorMode,
  getCommonEditorMode
} from "visual/global/EditorModeContext";
import Page from "./Editor/Page";
import Popup from "./Editor/Popup";
import Story from "./Editor/Story";

interface Props {
  addFile: CustomFile["addFile"];
  editorMode: EditorMode;
}

class Editor extends React.Component<Props> {
  parentWindowDocument = () => {
    if (typeof window !== "undefined") {
      return window.parent.document;
    }
  };

  handleKeyDown = (
    _: KeyboardEvent,
    { keyName }: { keyName: string }
  ): void => {
    switch (keyName) {
      case "ctrl+/":
      case "cmd+/":
      case "right_cmd+/":
        Prompts.open({ mode: "stack", prompt: "keyHelper" });
        break;
      case "ctrl+L":
      case "cmd+L":
      case "right_cmd+L":
        {
          this.props.addFile?.handler(noop, noop, {
            acceptedExtensions: [],
            insertFilesType: "none"
          });
        }
        break;
    }
  };

  getEditor(): ReactElement {
    const editorMode = this.props.editorMode;
    const type = getCommonEditorMode(editorMode);
    switch (type) {
      case "page": {
        return <Page mode={editorMode} />;
      }
      case "popup": {
        return <Popup mode={editorMode} />;
      }
      case "story": {
        return <Story mode={editorMode} />;
      }
    }
  }

  renderEditorPortals(element: HTMLElement): ReactElement {
    return (
      <>
        <Portal node={element}>
          <LeftSidebar />
        </Portal>
        <Portal node={element}>
          <RightSidebar />
        </Portal>
        <Portal node={element}>
          <BottomPanel />
        </Portal>
        <Portal node={element}>
          <Prompts editorMode={this.props.editorMode} />
        </Portal>
        <Portal node={element}>
          <Notifications />
        </Portal>
        <Portal node={element}>
          <ToastContainer />
        </Portal>
      </>
    );
  }

  render(): ReactElement {
    const doc = this.parentWindowDocument();

    return (
      <>
        {this.getEditor()}
        {doc && this.renderEditorPortals(doc.body)}
        <HotKeys
          keyNames={[
            "ctrl+/",
            "cmd+/",
            "right_cmd+/",
            "ctrl+L",
            "cmd+L",
            "right_cmd+L"
          ]}
          id="key-helper-editor"
          onKeyDown={this.handleKeyDown}
        />
      </>
    );
  }
}

export default Editor;
