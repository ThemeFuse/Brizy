import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { ToolbarItemType } from "../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  const IS_STORY = isStory(Config.getAll());

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
                  options: [
                    {
                      id: "padding",
                      type: "padding",
                      devices: "desktop",
                      disabled: true
                    },
                    {
                      id: "alertPadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      devices: "desktop",
                      position: 65
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
                      disabled: IS_STORY,
                      devices: "desktop",
                      position: 100,
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
                      id: "alertPadding",
                      type: "padding",
                      label: t("Padding"),
                      devices: "responsive",
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
