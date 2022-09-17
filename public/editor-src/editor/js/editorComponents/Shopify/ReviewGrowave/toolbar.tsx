import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarGrowaveReview",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Reviews")
      },
      options: [
        {
          id: "reviewType",
          type: "select-dev",
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
          type: "select-dev",
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
      // @ts-expect-error: Old option
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
