import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import contextMenuExtendConfigFn from "./contextMenu";
import { t } from "visual/utils/i18n";

class SwitcherTab extends EditorArrayComponent {
  static get componentId() {
    return "SwitcherTab.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  handleSortableAcceptElements = from => {
    const meta = this.props.meta;

    if (meta.row && meta.row.isInner) {
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

  getItemProps(itemData, itemIndex) {
    const toolbarExtendSetting = {
      getItems: () => {
        return [
          {
            id: "duplicate",
            type: "button",
            title: t("Duplicate"),
            icon: "nc-duplicate",
            position: 200,
            onChange: () => {
              this.cloneItem(itemIndex);
            }
          },
          {
            id: "remove",
            type: "button",
            title: t("Delete"),
            icon: "nc-trash",
            position: 210,
            onChange: () => {
              hideToolbar();
              this.removeItem(itemIndex);
            }
          }
        ];
      }
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendSetting
    );

    return {
      meta: this.props.meta,
      toolbarExtend
    };
  }

  renderItemsContainer(items) {
    if (IS_PREVIEW) {
      return items;
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

export default SwitcherTab;
