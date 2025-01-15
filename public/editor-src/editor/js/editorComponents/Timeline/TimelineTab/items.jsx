import React from "react";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import contextMenuExtendConfigFn from "visual/editorComponents/Tabs/Tab/contextMenu";
import { isView } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";

export default class TimelineTabItems extends EditorArrayComponent {
  static get componentId() {
    return "TimelineTab.Items";
  }

  static defaultProps = {
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
    const toolbarExtendConfig = {
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
            devices: "desktop",
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
            devices: "desktop",
            position: 210,
            onClick: () => {
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
    const { className } = this.props;

    if (isView(this.renderContext)) {
      return <div className={className}>{items}</div>;
    }

    if (items.length === 0) {
      return (
        <div className={className}>
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
        <div className={className}>{items}</div>
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
