import React from "react";
import Prompts from "visual/component/Prompts";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { FirstPopupBlockAdder } from "visual/component/BlockAdders";
import HotKeys from "visual/component/HotKeys";
import UIEvents from "visual/global/UIEvents";
import { getStore } from "visual/redux/store";
import { triggersAmountSelector } from "visual/redux/selectors";
import { updateTriggers } from "visual/redux/actions";
import { addBlock, addGlobalBlock } from "visual/redux/actions2";
// should we move this util folder to another place?
import { changeValueAfterDND } from "visual/editorComponents/Page/utils";
import defaultValue from "./defaultValue.json";
import { uuid } from "visual/utils/uuid";
import { stripSystemKeys, setIds } from "visual/utils/models";

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
    // it's a bit hacky. to find a better way to implement it
    const valuesAmount = triggersAmountSelector(getStore().getState());
    if (valuesAmount === null) {
      const defaultValue = [{ id: "pageLoad", active: true, value: "1" }];
      getStore().dispatch(updateTriggers(defaultValue));
    }

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

  handleDNDSort = data => {
    const { dbValue } = this.props;

    const newValue = changeValueAfterDND(dbValue, data);

    this.props.onChange(newValue);
  };

  handleBlocksAdd = data => {
    const { dispatch } = getStore();
    const meta = { insertIndex: 0 };
    const { block, ...rest } = data;

    if (block.type === "GlobalBlock") {
      dispatch(addGlobalBlock(data, meta));
    } else {
      const blockStripped = stripSystemKeys(block);
      const blockWithIds = setIds(blockStripped);

      dispatch(addBlock({ block: blockWithIds, ...rest }, meta));
    }
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
        onChangeGlobal: this.handleBlocksAdd,
        onChangeSaved: this.handleAddSavedBlock
      }
    };
    Prompts.open(data);
  };

  renderItems() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: () => ({
        isOpened: true,
        onClose: this.handleClose
      })
    });

    return (
      <React.Fragment>
        <EditorArrayComponent {...popupsProps} />
        <div className="brz-root__container-after" />
      </React.Fragment>
    );
  }

  renderForEdit(v) {
    if (IS_EDITOR && v.items.length === 0) {
      return (
        <React.Fragment>
          <FirstPopupBlockAdder
            insertIndex={0}
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
        </React.Fragment>
      );
    }

    return this.renderItems();
  }

  renderForView() {
    return this.renderItems();
  }
}

export default PagePopup;
