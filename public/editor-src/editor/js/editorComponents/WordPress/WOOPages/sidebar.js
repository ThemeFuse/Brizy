import { t } from "visual/utils/i18n";

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
                  label: t("Basic"),
                  options: [
                    {
                      id: "padding",
                      type: "padding-dev",
                      label: t("Padding"),
                      disabled: true
                    },
                    {
                      id: "bgPadding",
                      type: "padding-dev",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "border",
                      type: "corners-dev",
                      label: t("Corner"),
                      position: 65
                    }
                  ]
                }
              ]
            },
            {
              id: "padding",
              type: "padding-dev",
              label: t("Padding"),
              devices: "responsive",
              disabled: true
            },
            {
              id: "bgPadding",
              type: "padding-dev",
              label: t("Padding"),
              devices: "responsive",
              position: 50
            },
            {
              id: "border",
              type: "corners-dev",
              label: t("Corner"),
              devices: "responsive",
              disabled: true
            },
            {
              id: "border",
              type: "corners-dev",
              label: t("Corner"),
              devices: "responsive",
              position: 65
            }
          ]
        }
      ]
    }
  ];
}
