import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";
import { hideToolbar } from "visual/component/Toolbar";

export default class TimelineItems extends EditorArrayComponent {
  static get componentId() {
    return "Timeline.Items";
  }

  static defaultProps = {
    className: "",
    style: {},
    meta: {},
    name: "",
    type: ""
  };

  getItemProps(itemData, itemIndex, items) {
    const props = super.getItemProps(itemData, itemIndex, items);
    const toolbarExtendConfig = {
      getItems: () => {
        return [
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
        ];
      }
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(toolbarExtendConfig);

    return {
      ...props,
      toolbarExtend
    };
  }
}
