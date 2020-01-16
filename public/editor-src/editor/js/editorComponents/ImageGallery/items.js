import React from "react";
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
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      ...super.getItemProps(itemData, itemIndex, items),
      toolbarExtend
    };
  }

  renderItemWrapper(item, itemKey) {
    return (
      <ContextMenu
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuConfig, { id: itemKey })}
      >
        <div className="brz-image__gallery-item">{item}</div>
      </ContextMenu>
    );
  }
}

export default Items;
