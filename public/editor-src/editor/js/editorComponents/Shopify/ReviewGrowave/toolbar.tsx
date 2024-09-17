import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarGrowaveReview",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Reviews")
      },
      options: [
        {
          id: "reviewType",
          type: "select",
          label: t("Reviews Type"),
          config: {
            size: "large"
          },
          choices: [
            { title: "Product Review", value: "product" },
            { title: "Product Avg. Rating", value: "averageRating" },
            { title: "Coll. Avg. Rating", value: "caRating" }
          ]
        },
        {
          id: "productSource",
          type: "select",
          label: t("Product Source"),
          config: {
            size: "large"
          },
          choices: [{ title: "Auto", value: "auto" }]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
};
