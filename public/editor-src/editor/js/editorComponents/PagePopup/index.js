import React from "react";
import { FirstPopupBlockAdder } from "visual/component/BlockAdders";
import HotKeys from "visual/component/HotKeys";
import Prompts from "visual/component/Prompts";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
// should we move this util folder to another place?
import { changeValueAfterDND } from "visual/editorComponents/Page/utils";
import UIEvents from "visual/global/UIEvents";
import { addBlock, addGlobalPopup } from "visual/redux/actions2";
import { setIds, stripSystemKeys } from "visual/utils/models";
import { uuid } from "visual/utils/uuid";
import defaultValue from "./defaultValue.json";

class PagePopup extends EditorComponent {
  static get componentId() {
    return "PagePopup";
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

  handleClose = () => {
    this.patchValue({
      items: []
    });
  };

  handleDNDSort = (data) => {
    const { dbValue } = this.props;
    const store = this.getReduxStore();
    const newValue = changeValueAfterDND(dbValue, data, store);

    this.props.onChange(newValue);
  };

  handleAddGlobalPopup = (data) => {
    const dispatch = this.getReduxDispatch();
    const meta = { insertIndex: 0 };
    dispatch(addGlobalPopup(data, meta));
  };

  handleBlocksAdd = (data) => {
    const dispatch = this.getReduxDispatch();
    const meta = { insertIndex: 0 };
    const { block, ...rest } = data;
    const blockStripped = stripSystemKeys(block);
    const blockWithIds = setIds(blockStripped);

    dispatch(addBlock({ block: blockWithIds, ...rest }, meta));
  };

  handlePromptOpen = () => {
    const data = {
      prompt: "blocks",
      mode: "single",
      props: {
        type: "popup",
        showTemplate: false,
        blocksType: false,
        globalSearch: false,
        onChangeBlocks: this.handleBlocksAdd,
        onChangeGlobal: this.handleAddGlobalPopup
      }
    };
    Prompts.open(data);
  };

  renderItems() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: () => ({
        isOpened: true,
        // Send global project className
        className: this.props.className,
        onClose: this.handleClose
      })
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v) {
    if (v.items.length === 0) {
      return (
        <>
          <FirstPopupBlockAdder
            onAddGlobalPopup={this.handleAddGlobalPopup}
            onAddBlock={this.handleBlocksAdd}
          />
          <HotKeys
            keyNames={[
              "ctrl+shift+A",
              "cmd+shift+A",
              "right_cmd+shift+A",
              "shift+ctrl+A",
              "shift+cmd+A",
              "shift+right_cmd+A"
            ]}
            id="key-helper-blocks"
            onKeyDown={this.handlePromptOpen}
          />
        </>
      );
    }

    return (
      <>
        {this.renderItems()}
        <div className="brz-root__container-after" />
      </>
    );
  }

  renderForView() {
    return this.renderItems();
  }
}

export default PagePopup;
