import React from "react";
import deepMerge from "deepmerge";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component-new/Sortable";
import { ContextMenuExtend } from "visual/component-new/ContextMenu";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { hideToolbar } from "visual/component-new/Toolbar";
import { t } from "visual/utils/i18n";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Column.Items";
  }

  static defaultProps = {
    containerClassName: "",
    meta: {},
    itemProps: {}
  };

  handleSortableAcceptElements = (from, to) => {
    const { row } = this.props.meta;

    if (row && row.isInner) {
      if (from.elementType === "column" || from.elementType === "row") {
        return false;
      }

      if (from.elementType === "addable") {
        const addableSubtype = from.elementNode.getAttribute(
          "data-sortable-subtype"
        );

        return addableSubtype !== "row" && addableSubtype !== "columns";
      }
    } else {
      if (from.elementType === "row" || from.elementType === "column") {
        return (
          from.elementNode.querySelector(
            "[data-sortable-type=row][data-sortable-element=true]"
          ) === null // hasn't inner row (thus avoiding level 3 columns)
        );
      }
    }

    return true;
  };

  getItemProps(itemData, itemIndex, items) {
    const meta = deepMerge(this.props.meta, {
      column: {
        item: {
          index: itemIndex,
          isFirst: itemIndex === 0,
          isLast: itemIndex === items.length - 1,
          isOnly: items.length === 1
        }
      }
    });
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

    return {
      ...this.props.itemProps,
      meta,
      toolbarExtend
    };
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        {item}
      </ContextMenuExtend>
    );
  }

  renderItemsContainer(items) {
    if (IS_PREVIEW) {
      return items;
    }

    const sortableContent = items.length ? (
      <div className={this.props.containerClassName}>{items}</div>
    ) : null;

    return (
      <Sortable
        path={this.getPath()}
        type="column"
        acceptElements={this.handleSortableAcceptElements}
      >
        {sortableContent}
      </Sortable>
    );
  }
}

export default Items;
