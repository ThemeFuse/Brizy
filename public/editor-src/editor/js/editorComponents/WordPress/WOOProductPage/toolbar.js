import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover",
      config: {
        icon: "nc-woo-2"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "productID",
          label: t("Product ID"),
          type: "inputText",
          devices: "desktop",
          placeholder: t("Product ID or SKU")
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "legacy-grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
