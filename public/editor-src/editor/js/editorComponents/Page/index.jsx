import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import UIEvents from "visual/global/UIEvents";
import { uuid } from "visual/utils/uuid";
import Blocks from "./Blocks";
import defaultValue from "./defaultValue.json";
import { changeValueAfterDND } from "./utils";

class Page extends EditorComponent {
  static get componentId() {
    return ElementTypes.Page;
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

  handleDNDSort = (data) => {
    const { dbValue } = this.props;
    const store = this.getReduxStore();
    const newValue = changeValueAfterDND(
      dbValue,
      data,
      store,
      this.getGlobalConfig()
    );

    this.props.onChange(newValue);
  };

  renderForEdit() {
    const blocksProps = this.makeSubcomponentProps({
      bindWithKey: "items"
    });

    return <Blocks {...blocksProps} />;
  }
}

export default Page;
