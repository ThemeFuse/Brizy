import { t } from "visual/utils/i18n";

export const title = () => t("Product Thumbnail");

export function getItems() {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  options: [
                    {
                      id: "thumbnailBorder",
                      type: "corners",
                      label: t("Corner"),
                      position: 70
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
