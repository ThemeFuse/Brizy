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
          id: "WOOAddToCartTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "queryTab",
              label: t("Query"),
              options: [
                {
                  id: "productID",
                  label: t("Product"),
                  type: "inputText-dev",
                  placeholder: t("Product ID or SKU")
                }
              ]
            },
            {
              id: "layoutTab",
              label: t("Layout"),
              options: [
                {
                  id: "style",
                  label: t("Style"),
                  type: "inputText-dev",
                  placeholder: t("Style Add to Cart")
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog"
      },
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
          id: "advancedSettings",
          type: "advancedSettings",
          devices: "desktop",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
