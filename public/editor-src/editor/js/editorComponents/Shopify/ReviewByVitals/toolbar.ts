import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarVitalsReview",
      type: "popover",
      config: {
        size: "auto",
        title: t("Reviews"),
        icon: "nc-shopify-logo"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "widgetType",
          label: "Select Widget",
          type: "select",
          choices: [
            { title: "Review Widget", value: "default" },
            { title: "Trust Seals & Badges", value: "sealsBadges" },
            { title: "Product Bundles", value: "bundles" },
            { title: "Volume Discounts", value: "discounts" },
            { title: "Stock Scarcity", value: "scarcity" }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Old option
      type: "legacy-advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
