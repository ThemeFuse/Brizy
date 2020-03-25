import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

export default class FormItemItems extends EditorArrayComponent {
  static get componentId() {
    return "FormItem.Items";
  }

  static defaultProps = {
    className: ""
  };

  getItemProps(itemData, itemIndex, items) {
    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 200,
          onChange: () => {
            this.cloneItem(itemIndex);
          }
        },
        ...(items.length > 1
          ? [
              {
                id: "remove",
                type: "button",
                devices: "desktop",
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
          : [])
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return { toolbarExtend };
  }
}
