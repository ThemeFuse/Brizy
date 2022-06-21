import { t } from "visual/utils/i18n";
export const title = t("Gallery Tags");

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
                      id: "filterPadding",
                      type: "padding-dev",
                      label: t("Padding"),
                      position: 50,
                      config: {
                        units: ["px"]
                      }
                    },
                    {
                      id: "filterBorder",
                      type: "corners-dev",
                      label: t("Corner"),
                      position: 65
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
