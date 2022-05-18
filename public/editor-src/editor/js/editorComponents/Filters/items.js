import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";
import { hideToolbar } from "visual/component/Toolbar";

export default class FiltersItems extends EditorArrayComponent {
  static get componentId() {
    return "Filters.Items";
  }

  static defaultProps = {
    className: "",
    style: {},
    meta: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const props = super.getItemProps(itemData, itemIndex, items);
    const toolbarConfig = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          devices: "desktop",
          position: 200,
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
          position: 210,
          disabled: items.length === 1,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(toolbarConfig, null);

    return {
      ...props,
      toolbarExtend
    };
  }
}
