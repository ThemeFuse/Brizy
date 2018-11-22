import _ from "underscore";
import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import SortableElement from "visual/component/Sortable/SortableElement";
import { hideToolbar } from "visual/component/Toolbar/index";
import ContextMenu, {
  ContextMenuExtend
} from "visual/component/ContextMenu";
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
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
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
          position: 250,
          roles: ["admin"],
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
    const { itemClassName } = this.props;
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <SortableElement type="shortcode">
            <div className={itemClassName}>{item}</div>
          </SortableElement>
        </ContextMenu>
      </ContextMenuExtend>
    );
  }

  renderItemWrapperList(item, itemKey, itemIndex) {
    const className = classnames(
      "brz-li brz-list__item",
      this.props.itemClassName
    );
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <SortableElement type="shortcode">
            <li key={itemKey} className={className}>
              {item}
            </li>
          </SortableElement>
        </ContextMenu>
      </ContextMenuExtend>
    );
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData, items) {
    return this.props.blockType === "div"
      ? this.renderItemWrapperDiv(item, itemKey, itemIndex, itemData, items)
      : this.renderItemWrapperList(item, itemKey, itemIndex, itemData, items);
  }
}

export default Items;
