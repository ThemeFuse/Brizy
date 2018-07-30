import _ from "underscore";
import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component-new/Sortable";
import SortableElement from "visual/component-new/Sortable/SortableElement";
import { hideToolbar } from "visual/component-new/Toolbar/index";
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

  renderItemWrapperDiv(item, itemKey) {
    const { itemClassName } = this.props;

    return (
      <SortableElement type="shortcode" key={itemKey}>
        <div className={this.props.itemClassName}>{item}</div>
      </SortableElement>
    );
  }

  renderItemWrapperList(item, itemKey) {
    const className = classnames(
      "brz-li brz-list__item",
      this.props.itemClassName
    );
    return (
      <li key={itemKey} className={className}>
        {item}
      </li>
    );
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData, items) {
    return this.props.blockType === "div"
      ? this.renderItemWrapperDiv(item, itemIndex)
      : this.renderItemWrapperList(item, itemIndex);
  }
}

export default Items;
