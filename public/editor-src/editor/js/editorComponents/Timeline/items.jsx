import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";

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
            id: "order",
            type: "order",
            devices: "desktop",
            position: 105,
            roles: ["admin"],
            disabled: items.length < 2,
            config: {
              align:
                this.props.itemProps.verticalMode == "off"
                  ? "horizontal"
                  : "vertical",
              disable:
                itemIndex === 0
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
            devices: "desktop",
            position: 210,
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
            devices: "desktop",
            position: 220,
            disabled: items.length === 1,
            onClick: () => {
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
