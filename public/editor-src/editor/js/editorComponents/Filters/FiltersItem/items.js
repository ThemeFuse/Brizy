import { setIn } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

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

    const toolbarExtend = this.makeToolbarPropsFromConfig2(toolbarConfig, null);

    return {
      ...props,
      toolbarExtend
    };
  }

  cloneItem(itemIndex, toIndex = itemIndex + 1) {
    const dbValue = this.getDBValue() || [];

    if (!dbValue[itemIndex]) {
      throw new Error(`Can't clone invalid item at index ${itemIndex}`);
    }

    const itemData = dbValue[itemIndex];
    const formatValue = itemData.value.value.replace(/-[0-9]+/g, "");
    let nextNumberItemLabel = dbValue.reduce((acc, cur) => {
      const value = cur.value.value;

      if (value.includes(formatValue)) {
        const number = value.match(/-([0-9]+)$/) || [];

        if (number.length && acc < Number(number[1])) {
          return Number(number[1]);
        }
      }

      return acc;
    }, 0);

    const newValue = `${formatValue}-${++nextNumberItemLabel}`;
    const newItemData = setIn(itemData, ["value", "value"], newValue);

    this.insertItem(toIndex, newItemData); // the object will be cloned there
  }
}
