import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementWOOCategoriesColumns,
  toolbarElementWOOCategoriesNumber,
  toolbarElementWOOCategoriesOrderBy,
  toolbarElementWOOCategoriesOrder,
  toolbarSizeWidthWidthPercent,
  toolbarDisabledAdvancedSettings,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({
        key: "toolbarWOOCategories",
        device,
        state: "normal"
      }),
      type: "popover",
      devices: "desktop",
      icon: "nc-woo-2",
      position: 10,
      options: [
        {
          id: defaultValueKey({
            key: "WOOCategoriesTabs",
            device,
            state: "normal"
          }),
          type: "tabs",
          tabs: [
            {
              id: defaultValueKey({
                key: "layoutTab",
                device,
                state: "normal"
              }),
              label: t("Layout"),
              options: [
                toolbarElementWOOCategoriesColumns({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWOOCategoriesNumber({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            },
            {
              id: defaultValueKey({
                key: "orderTab",
                device,
                state: "normal"
              }),
              label: t("Filter"),
              options: [
                toolbarElementWOOCategoriesOrderBy({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWOOCategoriesOrder({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    toolbarDisabledAdvancedSettings({ device }),
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({
          v,
          device,
          state: "normal"
        }),
        {
          id: defaultValueKey({
            key: "advancedSettings",
            device,
            state: "normal"
          }),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: []
        }
      ]
    }
  ];
}
