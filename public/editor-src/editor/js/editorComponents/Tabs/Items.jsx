import { removeAt } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

export default class TabsItems extends EditorArrayComponent {
  static get componentId() {
    return "Tabs.Items";
  }

  static defaultProps = {
    className: "",
    renderType: "",
    style: {},
    meta: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const {
      renderType,
      meta,
      activeTab,
      onChangeNav,
      action,
      animationClassName
    } = this.props;
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

    return {
      meta,
      renderType,
      action,
      animationClassName,
      active: itemIndex === activeTab,
      onChangeNav() {
        onChangeNav(itemIndex);
      },
      toolbarExtend: this.makeToolbarPropsFromConfig2(cloneRemoveConfig)
    };
  }

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.props.onChangeNav(0);

    setTimeout(() => {
      this.handleValueChange(updatedValue, { arrayOperation: "remove" });
    }, 0);
  }
}
