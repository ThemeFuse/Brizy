import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  FirstBlockAdder,
  MiddleBlockAdder,
  LastBlockAdder
} from "visual/component-new/BlockAdders";
import BlockErrorBoundary from "./BlockErrorBoundary";
import { hideToolbar } from "visual/component-new/Toolbar";
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
        <FirstBlockAdder onAddBlocks={this.handleBlocksAdd.bind(null, 0)} />
      );
    }

    return (
      <div className="brz-ed-wrap-block-wrap">
        {items}
        <LastBlockAdder
          onAddBlocks={this.handleBlocksAdd.bind(null, items.length)}
        />
      </div>
    );
  }
}

export default Blocks;
