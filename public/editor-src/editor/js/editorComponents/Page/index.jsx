import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import UIEvents from "visual/global/UIEvents";
import Blocks from "./Blocks";
import { uuid } from "visual/utils/uuid";
import { changeValueAfterDND } from "./utils";
import defaultValue from "./defaultValue.json";

class Page extends EditorComponent {
  static get componentId() {
    return "Page";
  }

  static defaultValue = defaultValue;

  getDBValue() {
    const dbValue = super.getDBValue();

    if (dbValue._id) {
      return dbValue;
    } else {
      if (!this._id) {
        this._id = uuid();
      }

      return { ...dbValue, _id: this._id };
    }
  }

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
        <div className="brz-root__container-after" />
      </div>
    );
  }
}

export default Page;
