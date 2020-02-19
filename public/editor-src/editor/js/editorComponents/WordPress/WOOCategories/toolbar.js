import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarElementWOOCategoriesOrder } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });
  return [
    {
      id: dvk("toolbarWOOCategories"),
      type: "popover",
      devices: "desktop",
      icon: "nc-woo-2",
      position: 10,
      options: [
        {
          id: dvk("WOOCategoriesTabs"),
          type: "tabs",
          tabs: [
            {
              id: dvk("layoutTab"),
              label: t("Layout"),
              options: [
                {
                  id: "columns",
                  label: t("Columns"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: "1", value: 1 },
                    { title: "2", value: 2 },
                    { title: "3", value: 3 },
                    { title: "4", value: 4 },
                    { title: "5", value: 5 },
                    { title: "6", value: 6 }
                  ]
                },
                {
                  id: "number",
                  label: t("Categories Count"),
                  type: "inputText-dev",
                  devices: "desktop",
                  config: {
                    size: "short"
                  }
                }
              ]
            },
            {
              id: dvk("orderTab"),
              label: t("Filter"),
              options: [
                {
                  id: "orderBy",
                  label: t("Filter By"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("Name"), value: "name" },
                    { title: t("Slug"), value: "slug" },
                    { title: t("Description"), value: "description" },
                    { title: t("Count"), value: "count" }
                  ]
                },
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
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
