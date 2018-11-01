import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component-new/Toolbar";
import { t } from "visual/utils/i18n";

class FormItemItems extends EditorArrayComponent {
  static get componentId() {
    return "FormItem.Items";
  }

  static defaultProps = {
    className: ""
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
          onChange: () => {
            this.cloneItem(itemIndex);
          }
        },
        ...[
          items.length === 1
            ? ""
            : {
                id: "remove",
                type: "button",
                icon: "nc-trash",
                title: t("Delete"),
                position: 250,
                disable: items.length === 1,
                onChange: () => {
                  hideToolbar();
                  this.removeItem(itemIndex);
                }
              }
        ]
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };

    const toolbarExtend = this.makeToolbarPropsFromConfig(cloneRemoveConfig);

    return { toolbarExtend };
  }
}

export default FormItemItems;
