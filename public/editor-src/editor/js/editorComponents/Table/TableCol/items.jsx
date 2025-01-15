import React from "react";
import { isView } from "visual/providers/RenderProvider";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import contextMenuExtendConfigFn from "./contextMenu";

class TableColItems extends EditorArrayComponent {
  static get componentId() {
    return "TableCol.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  handleSortableAcceptElements = (from) => {
    const meta = this.props.meta;

    const sortableType = makeDataAttrString({
      name: "sortable-type",
      value: "row"
    });

    const sortableElement = makeDataAttrString({
      name: "sortable-element",
      value: "true"
    });

    if (meta.row && meta.row.isInner) {
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
    const props = super.getItemProps(itemData, itemIndex, items);
    const cloneRemoveConfig = {
      getItems: () => {
        return [
          {
            id: "duplicate",
            type: "button",
            config: {
              title: t("Duplicate"),
              icon: "nc-duplicate",
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
            config: {
              title: t("Delete"),
              icon: "nc-trash",
              reverseTheme: true
            },
            position: 210,
            onClick: () => {
              hideToolbar();
              this.removeItem(itemIndex);
            }
          }
        ];
      }
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      ...props,
      meta: this.props.meta,
      toolbarExtend
    };
  }

  renderItemsContainer(items) {
    if (isView(this.renderContext)) {
      return <div className={this.props.className}>{items}</div>;
    }

    if (items.length === 0) {
      return (
        <div className={this.props.className}>
          <SortableEmpty
            path={this.getId()}
            type="column"
            acceptElements={this.handleSortableAcceptElements}
          />
        </div>
      );
    }

    return (
      <Sortable
        path={this.getId()}
        type="column"
        acceptElements={this.handleSortableAcceptElements}
      >
        <div className={this.props.className}>{items}</div>
      </Sortable>
    );
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
}

export default TableColItems;
