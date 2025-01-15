import classnames from "classnames";
import React from "react";
import ContextMenu from "visual/component/ContextMenu";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { isView } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import contextMenuConfig from "./contextMenu";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "ImageGallery.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const { layout, thumbStyle } = this.props.itemProps;

    const align =
      layout === "bigImage" && (thumbStyle === "left" || thumbStyle === "right")
        ? "vertical"
        : "horizontal";

    const cloneRemoveConfig = {
      getItems: () => {
        return [
          {
            id: "order",
            type: "order",
            devices: "desktop",
            position: 105,
            roles: ["admin"],
            disabled: items.length < 2,
            config: {
              align,
              disable:
                itemIndex === 0 || (itemIndex === 1 && layout === "bigImage")
                  ? "prev"
                  : itemIndex === items.length - 1
                    ? "next"
                    : undefined,
              onChange: (v) => {
                switch (v) {
                  case "prev":
                    this.reorderItem(itemIndex, itemIndex - 1);
                    break;
                  case "next":
                    this.reorderItem(itemIndex, itemIndex + 1);
                    break;
                }
              }
            }
          },
          {
            id: "duplicate",
            type: "button",
            config: {
              icon: "nc-duplicate",
              title: t("Duplicate"),
              reverseTheme: true
            },
            position: 200,
            roles: ["admin"],
            devices: "desktop",
            onClick: () => {
              this.cloneItem(itemIndex);
            }
          },
          {
            id: "remove",
            type: "button",
            config: {
              icon: "nc-trash",
              title: t("Delete"),
              reverseTheme: true
            },
            position: 250,
            roles: ["admin"],
            devices: "desktop",
            disabled: items.length <= 1,
            onClick: () => {
              hideToolbar();
              this.removeItem(itemIndex);
            }
          }
        ];
      }
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig, {
      allowExtend: false
    });

    return {
      ...super.getItemProps(itemData, itemIndex, items),
      toolbarExtend
    };
  }

  getTags(tags = "") {
    if (!tags) {
      return [];
    }

    return tags.split(",").reduce((acc, curr) => {
      const tag = curr.trim();
      return tag ? [...acc, tag.replace(/\s/g, "-")] : acc;
    }, []);
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData) {
    const tags = this.getTags(itemData.value.tags);
    const { renderer } = this.props.itemProps;
    const { imageSrc } = itemData.value;
    const { layout } = renderer.gallery;

    const isMasonry = layout === "masonry";
    const isJustified = layout === "justified";

    const className = classnames(
      "brz-image__gallery-item",
      {
        "brz-cursor-pointer":
          layout === "bigImage" && isView(this.renderContext)
      },
      {
        "brz-image__gallery-item-empty": (isMasonry || isJustified) && !imageSrc
      },
      tags
    );
    return (
      <ContextMenu
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuConfig, { id: itemKey })}
      >
        <div className={className}>{item}</div>
      </ContextMenu>
    );
  }
}

export default Items;
