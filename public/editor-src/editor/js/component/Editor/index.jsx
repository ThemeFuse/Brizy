import React from "react";
import UIState from "visual/global/UIState";
import EditorPage from "./EditorPage";
import LeftSidebar from "visual/component/LeftSidebar";
import BottomPanel from "visual/component/BottomPanel";
import Prompts from "visual/component/Prompts";
import HotKeys from "visual/component/HotKeys";
import Portal from "visual/component/Portal";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.parentWindowDocument = window.parent.document;
  }

  handleKeyDown() {
    UIState.set("prompt", {
      prompt: "key-helper"
    });
  }

  render() {
    return (
      <React.Fragment>
        <EditorPage />
        <Portal node={this.parentWindowDocument.body}>
          <LeftSidebar />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <BottomPanel />
        </Portal>
        <Portal node={this.parentWindowDocument.body}>
          <Prompts />
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
