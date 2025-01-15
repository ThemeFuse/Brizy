import { t } from "visual/utils/i18n";

export const title = () => t("Table");

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
                      id: "padding",
                      type: "padding",
                      disabled: true
                    },
                    {
                      id: "tablePadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50,
                      config: {
                        units: ["px"]
                      }
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  options: []
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
