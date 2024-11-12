import React, { ReactElement, KeyboardEvent } from "react";
import { ToastContainer } from "react-toastify";
import { noop } from "underscore";
import BottomPanel from "visual/component/BottomPanel";
import HotKeys from "visual/component/HotKeys";
import { LeftSidebar } from "visual/component/LeftSidebar";
import Notifications from "visual/component/Notifications";
import Portal from "visual/component/Portal";
import Prompts from "visual/component/Prompts";
import { RightSidebar } from "visual/component/RightSidebar";
import Conf from "visual/global/Config";
import Page from "./Editor/Page";
import Popup from "./Editor/Popup";
import Story from "./Editor/Story";
import { getRenderType } from "./utils";

class Editor extends React.Component {
  parentWindowDocument = window.parent.document;

  handleKeyDown(_: KeyboardEvent, { keyName }: { keyName: string }): void {
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
          const { api } = Conf.getAll();
          api?.customFile?.addFile?.handler(noop, noop, {
            acceptedExtensions: [],
            insertFilesType: "none"
          });
        }
        break;
    }
  }

  getEditor(): ReactElement {
    const type = getRenderType(Conf.getAll());

    switch (type) {
      case "basic": {
        return <Page />;
      }
      case "popup": {
        return <Popup />;
      }
      case "story": {
        return <Story />;
      }
    }
  }

  render(): ReactElement {
    return (
      <>
        {this.getEditor()}
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
        <Portal node={this.parentWindowDocument.body}>
          <ToastContainer />
        </Portal>
      </>
    );
  }
}

export default Editor;
