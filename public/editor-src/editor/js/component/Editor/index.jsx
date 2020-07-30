import React from "react";
import EditorPage from "./EditorPage";
import LeftSidebar from "visual/component/LeftSidebar";
import BottomPanel from "visual/component/BottomPanel";
import Prompts from "visual/component/Prompts";
import HotKeys from "visual/component/HotKeys";
import Portal from "visual/component/Portal";
import Notifications from "visual/component/Notifications";
import { RightSidebar } from "visual/component/RightSidebar";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import EditorPopup from "./EditorPopup";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.parentWindowDocument = window.parent.document;
  }

  handleKeyDown() {
    Prompts.open({
      mode: "stack",
      prompt: "keyHelper"
    });
  }

  render() {
    return (
      <React.Fragment>
        {IS_GLOBAL_POPUP ? <EditorPopup /> : <EditorPage />}
        <Portal node={this.parentWindowDocument.body}>
          <LeftSidebar />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <RightSidebar />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <BottomPanel />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <Prompts />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <Notifications />
        </Portal>
        <HotKeys
          keyNames={["ctrl+/", "cmd+/", "right_cmd+/"]}
          id="key-helper-editor"
          onKeyDown={this.handleKeyDown}
        />
      </React.Fragment>
    );
  }
}

export default Editor;
