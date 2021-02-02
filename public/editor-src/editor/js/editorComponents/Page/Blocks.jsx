import React from "react";
import { connect } from "react-redux";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  FirstBlockAdder,
  MiddleBlockAdder,
  LastBlockAdder
} from "visual/component/BlockAdders";
import Prompts from "visual/component/Prompts";
import HotKeys from "visual/component/HotKeys";
import { hideToolbar } from "visual/component/Toolbar";
import { addBlock, importTemplate } from "visual/redux/actions2";
import { addGlobalBlock, removeBlock } from "visual/redux/actions2";
import { blocksDataSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";

import { stripSystemKeys, setIds } from "visual/utils/models";

class Blocks extends EditorArrayComponent {
  static get componentId() {
    return "Page.Items";
  }

  blockAdderRef = React.createRef();

  handleAddTemplate = (data, insertIndex) => {
    const meta = { insertIndex };
    const { blocks, ...rest } = data;
    const blocksStripped = stripSystemKeys(blocks);
    const blocksWithIds = setIds(blocksStripped);

    this.props.dispatch(
      importTemplate({ blocks: blocksWithIds, ...rest }, meta)
    );
  };

  handleAddBlock = (data, insertIndex) => {
    const { dispatch } = this.props;
    const meta = { insertIndex };
    const { block, ...rest } = data;

    if (block.type === "GlobalBlock") {
      dispatch(addGlobalBlock(data, meta));

      return;
    }

    const blockStripped = stripSystemKeys(block);
    const blockWithIds = setIds(blockStripped);

    dispatch(addBlock({ block: blockWithIds, ...rest }, meta));
  };

  handleKeyDown = () => {
    const insertIndex = this.getValue().length;
    const changeBlockCb = data => this.handleAddBlock(data, insertIndex);
    const changeTemplateCb = data => this.handleAddTemplate(data, insertIndex);

    Prompts.open({
      prompt: "blocks",
      mode: "single",
      props: {
        type: "normal",
        onChangeBlocks: changeBlockCb,
        onChangeGlobal: changeBlockCb,
        onChangeSaved: changeTemplateCb,
        onChangeTemplate: changeTemplateCb
      }
    });
  };

  getItemProps(itemData, itemIndex) {
    const { blockId } = itemData;
    let disabled = false;
    if (itemData.type === "GlobalBlock") {
      const blocksData = blocksDataSelector(getStore().getState());
      const slider = blocksData[itemData.value._id]?.value?.slider;

      disabled = !slider || slider === "off";
    }
    const cloneRemoveConfig = {
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 200,
          disabled,
          onChange: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          icon: "nc-trash",
          title: t("Delete"),
          position: 250,
          onChange: () => {
            const { dispatch } = this.props;
            hideToolbar();
            dispatch(removeBlock({ index: itemIndex, id: itemData.value._id }));
          }
        }
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig(cloneRemoveConfig);

    return { blockId, toolbarExtend };
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData, itemsArray) {
    if (IS_PREVIEW) {
      return item;
    }

    const nextItemIndex = itemIndex + 1;
    const showMiddleAdder =
      itemData.value._blockVisibility !== "unlisted" &&
      // if this item is the last not unlisted one
      itemsArray
        .slice(itemIndex + 1)
        .some(item => item.value._blockVisibility !== "unlisted");

    return (
      <div key={itemKey} className="brz-ed-wrap-block-item">
        {item}
        {showMiddleAdder && (
          <MiddleBlockAdder
            onAddBlock={data => this.handleAddBlock(data, nextItemIndex)}
            onAddTemplate={data => this.handleAddTemplate(data, nextItemIndex)}
          />
        )}
      </div>
    );
  }

  renderItemsContainer(items, itemsValue) {
    if (IS_PREVIEW) {
      return items;
    }

    const allItemsAreUnlisted = itemsValue.every(
      item => item.value._blockVisibility === "unlisted"
    );

    if (items.length === 0 || allItemsAreUnlisted) {
      return (
        <>
          <FirstBlockAdder
            ref={this.blockAdderRef}
            onAddBlock={data => this.handleAddBlock(data, 0)}
            onAddTemplate={data => this.handleAddTemplate(data, 0)}
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
            onKeyDown={this.handleKeyDown}
          />
        </>
      );
    }

    return (
      <div className="brz-ed-wrap-block-wrap">
        <div id="brz-ed-page__blocks">{items}</div>
        <LastBlockAdder
          ref={this.blockAdderRef}
          onAddBlock={data => this.handleAddBlock(data, items.length)}
          onAddTemplate={data => this.handleAddTemplate(data, items.length)}
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
          onKeyDown={this.handleKeyDown}
        />
      </div>
    );
  }
}

export default connect()(Blocks);
