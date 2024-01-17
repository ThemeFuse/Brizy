import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
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
              devices: "desktop",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  options: [
                    {
                      id: "padding",
                      type: "padding",
                      devices: "desktop",
                      disabled: true
                    },
                    {
                      id: "calendlyPadding",
                      type: "padding",
                      devices: "desktop",
                      label: t("Padding"),
                      position: 50
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      devices: "desktop",
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "padding",
              type: "padding",
              devices: "responsive",
              disabled: true
            },
            {
              id: "calendlyPadding",
              type: "padding",
              devices: "responsive",
              label: t("Padding"),
              position: 50
            }
          ]
        }
      ]
    }
  ];
}
