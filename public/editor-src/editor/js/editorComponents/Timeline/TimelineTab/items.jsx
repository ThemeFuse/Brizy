import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import contextMenuExtendConfigFn from "visual/editorComponents/Tabs/Tab/contextMenu";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import { t } from "visual/utils/i18n";
import { hideToolbar } from "visual/component/Toolbar";

export default class TimelineTabItems extends EditorArrayComponent {
  static get componentId() {
    return "TimelineTab.Items";
  }

  static defaultProps = {
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

  getItemProps(itemData, itemIndex, items) {
    const props = super.getItemProps(itemData, itemIndex, items);
    const toolbarExtendConfig = {
      getItems: () => {
        return [
          {
            id: "duplicate",
            type: "button",
            title: t("Duplicate"),
            icon: "nc-duplicate",
            devices: "desktop",
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
            devices: "desktop",
            position: 210,
            onChange: () => {
              hideToolbar();
              this.removeItem(itemIndex);
            }
          }
        ];
      }
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(toolbarExtendConfig);

    return {
      ...props,
      toolbarExtend
    };
  }

  renderItemsContainer(items) {
    if (IS_PREVIEW) {
      return items;
    }

    const sortableContent = items.length ? (
      <div className={this.props.className}>{items}</div>
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

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);
    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "horizontalAlign"
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
