import deepMerge from "deepmerge";
import React from "react";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import contextMenuExtendConfigFn from "./contextMenuExtend";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Column.Items";
  }

  static defaultProps = {
    containerClassName: "",
    meta: {},
    itemProps: {}
  };

  handleSortableAcceptElements = (from) => {
    const { row } = this.props.meta;

    const sortableType = makeDataAttrString({
      name: "sortable-type",
      value: "row"
    });

    const sortableElement = makeDataAttrString({
      name: "sortable-element",
      value: "true"
    });

    if (row && row.isInner) {
      if (from.elementType === "column" || from.elementType === "row") {
        return false;
      }

      if (from.elementType === "addable") {
        const addableSubtype = from.elementNode.getAttribute(
          makeAttr("sortable-subtype")
        );

        return addableSubtype !== "row" && addableSubtype !== "columns";
      }
    } else {
      if (from.elementType === "row" || from.elementType === "column") {
        return (
          from.elementNode.querySelector(
            `${sortableType}${sortableElement}`
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
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          position: 200,
          onClick: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          devices: "desktop",
          config: { icon: "nc-trash", title: t("Delete"), reverseTheme: true },
          position: 250,
          onClick: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      ...this.props.itemProps,
      meta,
      toolbarExtend
    };
  }

  getAlignments() {
    return ["top", "center", "bottom", "between"];
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "horizontalAlign",
      "showSidebarStyling",
      "showSidebarAdvanced"
    ];

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <HotKeys
          shortcutsTypes={shortcutsTypes}
          id={itemKey}
          onKeyDown={this.handleKeyDown}
        >
          {item}
        </HotKeys>
      </ContextMenuExtend>
    );
  }

  renderItemsContainer(items) {
    const { containerClassName: className } = this.props;

    if (IS_PREVIEW) {
      return <div className={className}>{items}</div>;
    }

    if (items.length === 0) {
      return (
        <SortableEmpty
          path={this.getId()}
          type="column"
          acceptElements={this.handleSortableAcceptElements}
        />
      );
    }

    return (
      <Sortable
        path={this.getId()}
        type="column"
        acceptElements={this.handleSortableAcceptElements}
      >
        <div className={className}>{items}</div>
      </Sortable>
    );
  }
}

export default Items;
