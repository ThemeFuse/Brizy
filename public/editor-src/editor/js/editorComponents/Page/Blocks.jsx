import React from "react";
import { connect } from "react-redux";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  FirstBlockAdder,
  MiddleBlockAdder,
  LastBlockAdder
} from "visual/component/BlockAdders";
import HotKeys from "visual/component/HotKeys";
import UIState from "visual/global/UIState";
import BlockErrorBoundary from "./BlockErrorBoundary";
import { hideToolbar } from "visual/component/Toolbar";
import { addBlock, importTemplate } from "visual/redux/actions";
import { t } from "visual/utils/i18n";

class Blocks extends EditorArrayComponent {
  static get componentId() {
    return "Page.Items";
  }

  blockAdderRef = React.createRef();

  handleTemplateAdd = data => {
    const meta = { insertIndex: this.getValue().length };
    this.props.dispatch(importTemplate(data, meta));
  };

  handleBlockAdd = data => {
    const meta = { insertIndex: this.getValue().length };
    this.props.dispatch(addBlock(data, meta));
  };

  handleKeyDown = () => {
    /**
     * this will replace all below code once we update react-redux
     * (version 5.x does not support ref forwarding)
     */
    // this.blockAdderRef.current.open();

    UIState.set("prompt", {
      prompt: "blocks",
      tabProps: {
        blocks: {
          categoriesFilter: categories => {
            return categories.filter(({ slug }) => slug !== "popup");
          },
          onAddBlocks: this.handleBlockAdd
        },
        saved: {
          blocksFilter: blocks => {
            return blocks.filter((_, { type }) => type !== "SectionPopup");
          },
          onAddBlocks: this.handleBlockAdd
        },
        global: {
          blocksFilter: blocks => {
            return blocks.filter((_, { type }) => type !== "SectionPopup");
          },
          onAddBlocks: this.handleBlockAdd
        },
        templates: {
          onAddBlocks: this.handleTemplateAdd
        }
      }
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
        {showMiddleAdder && <MiddleBlockAdder insertIndex={nextItemIndex} />}
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
          <FirstBlockAdder ref={this.blockAdderRef} insertIndex={0} />
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
        <LastBlockAdder ref={this.blockAdderRef} insertIndex={items.length} />
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
