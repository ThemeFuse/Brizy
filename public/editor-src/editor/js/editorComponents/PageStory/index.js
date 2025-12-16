import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
// should we move this util folder to another place?
import { changeValueAfterDND } from "visual/editorComponents/Page/utils";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import UIEvents from "visual/global/UIEvents";
import { uuid } from "visual/utils/uuid";
import defaultValue from "./defaultValue.json";

class PageStory extends EditorComponent {
  static get componentId() {
    return ElementTypes.PageStory;
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

  blocksFilter(blocks) {
    /* eslint-disable no-unused-vars */
    return blocks.filter(([_, block]) => block.type === "StoryItem");
    /* eslint-enabled no-unused-vars */
  }

  handleClose = () => {
    this.patchValue({
      items: []
    });
  };

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

  renderForEdit(v) {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: () => ({
        isOpened: true,
        onClose: this.handleClose
      })
    });

    return <EditorArrayComponent {...popupsProps} />;
  }
}

export default PageStory;
