import React, { ReactElement, RefObject } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isView } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";
import { GetItems } from "../EditorComponent/types";
import { ItemsProps, SortableAcceptElements } from "./types";

class ThirdPartyItems extends EditorArrayComponent {
  static get componentId() {
    return ElementTypes.ThirdPartyItems;
  }

  static defaultProps: ItemsProps = {
    meta: {},
    itemProps: {},
    sliceStartIndex: 0,
    sliceEndIndex: Infinity
  };

  getItemProps(_: ElementModel, itemIndex: number) {
    const cloneRemoveConfig: { getItems: GetItems } = {
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
      meta: this.props.meta,
      toolbarExtend
    };
  }

  handleSortableAcceptElements: SortableAcceptElements = (from, to) => {
    const { elementType, elementNode } = from;
    const { acceptedElements = ["column", "shortcode", "addable"] } =
      this.props;

    if (Array.isArray(acceptedElements)) {
      const byCategory = acceptedElements.indexOf(elementType) !== -1;
      const addableSubtype = elementNode.getAttribute(
        makeAttr("sortable-subtype")
      );
      const byType = acceptedElements.indexOf(addableSubtype) !== -1;

      return byCategory || byType;
    }

    return from.sortableNode === to.sortableNode;
  };

  renderItemsContainer(items: Array<ReactElement>) {
    const { className } = this.props;

    if (isView(this.props.renderContext)) {
      return <div className={className}>{items}</div>;
    }

    if (items.length === 0) {
      return (
        <div className={className}>
          <SortableEmpty
            path={this.getId()}
            type="thirdPartyContainer"
            acceptElements={this.handleSortableAcceptElements}
          />
        </div>
      );
    }

    return (
      <Sortable
        path={this.getId()}
        type="thirdPartyContainer"
        acceptElements={this.handleSortableAcceptElements}
      >
        {(
          sortableRef: RefObject<HTMLDivElement>,
          sortableAttr: Record<string, string>
        ) => (
          <div {...sortableAttr} ref={sortableRef} className={className}>
            {items}
          </div>
        )}
      </Sortable>
    );
  }
}

export default ThirdPartyItems;
