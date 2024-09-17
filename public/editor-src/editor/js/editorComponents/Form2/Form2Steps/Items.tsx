import { ElementModel } from "visual/component/Elements/Types";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import type { Props } from "./types";

export default class Form2Steps extends EditorArrayComponent {
  static get componentId(): ElementTypes.Form2StepsItems {
    return ElementTypes.Form2StepsItems;
  }

  getItemProps(
    itemData: ElementModel,
    itemIndex: number,
    items: ElementModel[]
  ) {
    const props = super.getItemProps(itemData, itemIndex, items);
    const itemProps = this.props.itemProps as Props;

    const {
      viewType,
      activeStep,
      labelType,
      placeholder,
      multistep,
      toolbarExtendFields,
      onActiveChange
    } = itemProps;

    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          position: 225,
          onClick: () => {
            this.cloneItem(itemIndex);
          }
        },
        ...(items.length > 1
          ? [
              {
                id: "remove",
                type: "button",
                devices: "desktop",
                config: {
                  icon: "nc-trash",
                  title: t("Delete"),
                  reverseTheme: true
                },
                position: 250,
                disabled: items.length <= 2,
                onClick: () => {
                  hideToolbar();
                  this.removeItem(itemIndex);
                  onActiveChange(1);
                }
              }
            ]
          : [])
      ]
    };

    return {
      ...props,
      activeStep,
      viewType,
      labelType,
      placeholder,
      multistep,
      toolbarExtendFields,
      totalCount: items.length,
      count: itemIndex + 1,
      active: itemIndex + 1 === activeStep,
      onActiveChange: () => onActiveChange(itemIndex + 1),

      // @ts-expect-error: Need transform cloneRemoveConfig to ts
      toolbarExtend: this.makeToolbarPropsFromConfig2(cloneRemoveConfig)
    };
  }

  cloneItem(itemIndex: number, toIndex: number = itemIndex + 1): void {
    const dbValue = this.getDBValue() || [];

    if (!dbValue[itemIndex]) {
      throw new Error(`Can't clone invalid item at index ${itemIndex}`);
    }

    const itemData = dbValue[itemIndex];

    this.insertItem(toIndex, itemData);
  }
}
