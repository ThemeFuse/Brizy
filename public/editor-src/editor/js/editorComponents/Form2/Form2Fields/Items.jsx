import { setIn } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

class Form2FieldsItems extends EditorArrayComponent {
  static get componentId() {
    return "Form2Fields.Items";
  }

  static defaultProps = {
    className: "",
    style: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const props = super.getItemProps(itemData, itemIndex, items);
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
      ...props,
      toolbarExtend: this.makeToolbarPropsFromConfig2(cloneRemoveConfig)
    };
  }

  cloneItem(itemIndex, toIndex = itemIndex + 1) {
    const dbValue = this.getDBValue() || [];

    if (!dbValue[itemIndex]) {
      throw new Error(`Can't clone invalid item at index ${itemIndex}`);
    }

    const itemData = dbValue[itemIndex];
    const formatLabel = itemData.value.label.replace(/-[0-9]+/g, "");
    let nextNumberItemLabel = dbValue.reduce((acc, cur) => {
      const label = cur.value.label;

      if (label.includes(formatLabel)) {
        const number = label.match(/-([0-9]+)$/) || [];

        if (number.length && acc < Number(number[1])) {
          return Number(number[1]);
        }
      }

      return acc;
    }, 0);

    const newLabel = `${formatLabel}-${++nextNumberItemLabel}`;
    const newItemData = setIn(itemData, ["value", "label"], newLabel);

    this.insertItem(toIndex, newItemData); // the object will be cloned there
  }
}

export default Form2FieldsItems;
