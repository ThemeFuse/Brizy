import React from "react";
import UIState from "visual/global/UIState";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { FirstBlockAdder } from "visual/component/BlockAdders";
import HotKeys from "visual/component/HotKeys";
import UIEvents from "visual/global/UIEvents";
import { getStore } from "visual/redux/store";
import { triggersAmountSelector } from "visual/redux/selectors";
import { updateTriggers } from "visual/redux/actions";
import { addFonts } from "visual/redux/actions2";
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

  blocksFilter(blocks) {
    /* eslint-disable no-unused-vars */
    return blocks.filter(
      ([_, block]) =>
        block.type === "SectionPopup" || block.type === "SectionPopup2"
    );
    /* eslint-enabled no-unused-vars */
  }

  getPromptData() {
    return {
      prompt: "blocks",
      tabs: {
        templates: false
      },
      tabProps: {
        blocks: {
          showSidebar: false,
          showCategories: false,
          showType: false,
          showSearch: false,
          type: "popups",
          onAddBlocks: this.handleBlocksAdd
        },

        saved: {
          showSearch: false,
          blocksFilter: this.blocksFilter,
          onAddBlocks: this.handleBlocksAdd
        },
        global: {
          showSearch: false,
          blocksFilter: this.blocksFilter,
          onAddBlocks: this.handleBlocksAdd
        }
      }
    };
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

  handleBlocksAdd = ({ fonts, block }) => {
    const { dispatch } = getStore();

    if (fonts) {
      dispatch(addFonts(fonts));
    }

    const itemDataStripped = stripSystemKeys(block);
    const itemDataWithIds = setIds(itemDataStripped);
    this.patchValue({
      items: [itemDataWithIds]
    });
  };

  handlePromptOpen = () => {
    UIState.set("prompt", this.getPromptData());
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
          <FirstBlockAdder
            insertIndex={0}
            promptData={this.getPromptData()}
            onAddBlocks={this.handleBlocksAdd}
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
