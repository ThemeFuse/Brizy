import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover-dev",
      config: {
        icon: "nc-woo-2"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "productID",
          label: t("Product ID"),
          type: "inputText-dev",
          devices: "desktop",
          placeholder: t("Product ID or SKU")
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
