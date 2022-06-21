import { t } from "visual/utils/i18n";

export const title = ({ v }) => {
  switch (v.type) {
    case "posts":
      return t("Posts Pagination");
    case "relatedProducts":
      return t("Related Products Pagination");
    case "upsell":
      return t("Upsell Pagination");
    case "products":
      return t("Products Pagination");
    case "categories":
      return t("Categories Pagination");
    default:
      return t("Posts Pagination");
  }
};

export function getItems() {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs-dev",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  options: [
                    {
                      id: "paginationBorder",
                      type: "corners-dev",
                      label: t("Corner"),
                      devices: "desktop",
                      position: 65
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
