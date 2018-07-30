import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import UIEvents from "visual/global/UIEvents";
import Blocks from "./Blocks";
import { changeValueAfterDND } from "./utils";
import defaultValue from "./defaultValue.json";

class Page extends EditorComponent {
  static get componentId() {
    return "Page";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    UIEvents.on("dnd.sort", this.handleDNDSort);
  }

  componentWillUnmount() {
    UIEvents.off("dnd.sort", this.handleDNDSort);
  }

  handleDNDSort = data => {
    const { dbValue } = this.props;
    const newValue = changeValueAfterDND(dbValue, data);

    this.props.onChange(newValue);
  };

  renderForEdit(v) {
    const blocksProps = this.makeSubcomponentProps({
      bindWithKey: "items"
    });

    return (
      <div className="brz-root__container brz-reset-all">
        <Blocks {...blocksProps} />
      </div>
    );
  }
}

export default Page;
