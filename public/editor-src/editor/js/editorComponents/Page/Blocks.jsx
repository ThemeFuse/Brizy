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

  handleBlockAdd = (index, blockData) => {
    this.insertItem(index, blockData);
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
    const showMiddleAdder = nextItemIndex < itemsArray.length;

    return (
      <div key={itemKey} className="brz-ed-wrap-block-item">
        <BlockErrorBoundary onRemove={() => this.removeItem(itemIndex)}>
          {item}
        </BlockErrorBoundary>
        {showMiddleAdder && (
          <MiddleBlockAdder
            onAddBlock={this.handleBlockAdd.bind(null, nextItemIndex)}
          />
        )}
      </div>
    );
  }

  renderItemsContainer(items) {
    if (IS_PREVIEW) {
      return items;
    }

    if (items.length === 0) {
      return <FirstBlockAdder onAddBlock={this.handleBlockAdd.bind(null, 0)} />;
    }

    return (
      <div className="brz-ed-wrap-block-wrap">
        {items}
        <LastBlockAdder
          onAddBlock={this.handleBlockAdd.bind(null, items.length)}
        />
      </div>
    );
  }
}

export default Blocks;
