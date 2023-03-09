import { t } from "visual/utils/i18n";

export const title = t("Add to cart Input");

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
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  icon: "nc-styling",
                  options: [
                    {
                      id: "inputBorder",
                      type: "corners-dev",
                      label: t("Corner"),
                      devices: "desktop",
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
