import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  FirstBlockAdder,
  MiddleBlockAdder,
  LastBlockAdder
} from "visual/component/BlockAdders";
import HotKeys from "visual/component/HotKeys";
import UIState from "visual/global/UIState";
import { getBlocksConfig } from "visual/component/BlockAdders/utils";
import BlockErrorBoundary from "./BlockErrorBoundary";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

class Blocks extends EditorArrayComponent {
  static get componentId() {
    return "Page.Items";
  }

  handleBlocksAdd = (index, blockData) => {
    if (Array.isArray(blockData)) {
      this.insertItemsBatch(index, blockData);
    } else {
      this.insertItem(index, blockData);
    }
  };

  handleKeyDown = () => {
    const itemsLength = this.getValue().length;

    UIState.set("prompt", {
      prompt: "blocks",
      blocksConfig: getBlocksConfig(),
      onAddBlocks: this.handleBlocksAdd.bind(null, itemsLength)
    });
  };

  getItemProps(itemData, itemIndex) {
    const { blockId } = itemData;
    const cloneRemoveConfig = {
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 200,
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
            hideToolbar();
            this.removeItem(itemIndex);
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
        <BlockErrorBoundary onRemove={() => this.removeItem(itemIndex)}>
          {item}
        </BlockErrorBoundary>
        {showMiddleAdder && (
          <MiddleBlockAdder
            onAddBlocks={this.handleBlocksAdd.bind(null, nextItemIndex)}
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
        <React.Fragment>
          <FirstBlockAdder onAddBlocks={this.handleBlocksAdd.bind(null, 0)} />,
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
        </React.Fragment>
      );
    }

    return (
      <div className="brz-ed-wrap-block-wrap">
        {items}
        <LastBlockAdder
          onAddBlocks={this.handleBlocksAdd.bind(null, items.length)}
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

export default Blocks;
