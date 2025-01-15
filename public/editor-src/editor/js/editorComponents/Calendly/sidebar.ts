import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";
import { calendlySelector, hoverTransitionCSS } from "./css";

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
                      label: t("Padding"),
                      position: 50,
                      selector: calendlySelector
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
                      },
                      style: hoverTransitionCSS
                    }
                  ]
                }
              ]
            },
            {
              id: "settingsTabsResponsive",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "responsive",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  position: 10,
                  options: [
                    {
                      id: "padding",
                      type: "padding",
                      disabled: true
                    },
                    {
                      id: "calendlyPadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50
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
