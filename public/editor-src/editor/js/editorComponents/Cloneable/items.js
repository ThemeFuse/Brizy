import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import { hideToolbar } from "visual/component/Toolbar/index";
import ContextMenu, { ContextMenuExtend } from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { t } from "visual/utils/i18n";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Cloneable.Items";
  }

  static defaultProps = {
    blockType: "div",
    containerClassName: "",
    itemClassName: "",
    minItems: 0,
    maxItems: 9999,
    toolbarExtend: null,
    meta: {},
    itemProps: {}
  };

  getItemProps(itemData, itemIndex) {
    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          devices: "desktop",
          position: 200,
          roles: ["admin"],
          onChange: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          icon: "nc-trash",
          title: t("Delete"),
          devices: "desktop",
          position: 250,
          roles: ["admin"],
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      ...this.props.itemProps,
      meta: this.props.meta,
      toolbarExtend
    };
  }

  // Div
  renderItemsContainerDiv(items) {
    const { containerClassName: className } = this.props;
    return <div className={className}>{items}</div>;
  }

  // List
  renderItemsContainerList(items) {
    const className = classnames(
      "brz-ul brz-list",
      this.props.containerClassName
    );
    return <ul className={className}>{items}</ul>;
  }

  renderItemsContainer(items) {
    const { blockType, onSortableStart, onSortableEnd } = this.props;
    const content =
      blockType === "div"
        ? this.renderItemsContainerDiv(items)
        : this.renderItemsContainerList(items);

    return (
      <Sortable
        path={this.getPath()}
        type="cloneable"
        acceptElements={null}
        onStart={onSortableStart}
        onEnd={onSortableEnd}
      >
        {content}
      </Sortable>
    );
  }

  renderItemWrapperDiv(item, itemKey, itemIndex) {
    const {
      itemClassName,
      meta: { inIconText }
    } = this.props;
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    let content = (
      <SortableElement key={itemKey} type="shortcode">
        <div className={itemClassName} id={itemKey}>
          {item}
        </div>
      </SortableElement>
    );

    if (!inIconText) {
      const shortcutsTypes = [
        "duplicate",
        "copy",
        "paste",
        "pasteStyles",
        "delete"
      ];

      content = (
        <ContextMenuExtend
          key={itemKey}
          {...this.makeContextMenuProps(contextMenuExtendConfig)}
        >
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            <HotKeys
              shortcutsTypes={shortcutsTypes}
              id={itemKey}
              onKeyDown={this.handleKeyDown}
            >
              {content}
            </HotKeys>
          </ContextMenu>
        </ContextMenuExtend>
      );
    }

    return content;
  }

  renderItemWrapperList(item, itemKey, itemIndex) {
    const {
      itemClassName,
      meta: { inIconText }
    } = this.props;

    const className = classnames("brz-li brz-list__item", itemClassName);
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    let content = (
      <SortableElement type="shortcode">
        <li key={itemKey} className={className}>
          {item}
        </li>
      </SortableElement>
    );

    if (!inIconText) {
      const shortcutsTypes = [
        "duplicate",
        "copy",
        "paste",
        "pasteStyles",
        "delete"
      ];
      return (
        <ContextMenuExtend
          key={itemKey}
          {...this.makeContextMenuProps(contextMenuExtendConfig)}
        >
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            <HotKeys
              shortcutsTypes={shortcutsTypes}
              id={itemKey}
              onKeyDown={this.handleKeyDown}
            >
              {content}
            </HotKeys>
          </ContextMenu>
        </ContextMenuExtend>
      );
    }

    return content;
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData, items) {
    return this.props.blockType === "div"
      ? this.renderItemWrapperDiv(item, itemKey, itemIndex, itemData, items)
      : this.renderItemWrapperList(item, itemKey, itemIndex, itemData, items);
  }
}

export default Items;
