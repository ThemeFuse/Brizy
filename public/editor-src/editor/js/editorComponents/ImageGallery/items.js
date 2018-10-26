import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component-new/Toolbar";
import ContextMenu, {
  ContextMenuExtend
} from "visual/component-new/ContextMenu";
import contextMenuConfig from "./contextMenu";
import contextMenuExtendConfigFn from "./contextMenuExtend";
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
      ...super.getItemProps(itemData, itemIndex, items),
      toolbarExtend
    };
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <ContextMenu
          {...this.makeContextMenuProps(contextMenuConfig, { id: itemKey })}
        >
          <div key={itemKey} className="brz-image__gallery-item">
            {item}
          </div>
        </ContextMenu>
      </ContextMenuExtend>
    );
  }
}

export default Items;
