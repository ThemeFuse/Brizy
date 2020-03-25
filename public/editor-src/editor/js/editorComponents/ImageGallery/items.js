import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import { t } from "visual/utils/i18n";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "ImageGallery.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const cloneRemoveConfig = {
      getItems: () => {
        return [
          {
            id: "duplicate",
            type: "button",
            icon: "nc-duplicate",
            title: t("Duplicate"),
            position: 200,
            roles: ["admin"],
            devices: "desktop",
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
            devices: "desktop",
            disabled: items.length <= 1,
            onChange: () => {
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

    return (
      <ContextMenu
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuConfig, { id: itemKey })}
      >
        <div className={classnames("brz-image__gallery-item", tags)}>
          {item}
        </div>
      </ContextMenu>
    );
  }
}

export default Items;
