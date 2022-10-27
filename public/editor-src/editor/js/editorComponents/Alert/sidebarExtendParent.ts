import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { ToolbarItemType } from "../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  const IS_STORY = isStory(Config.getAll());

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
                      devices: "desktop",
                      disabled: true
                    },
                    {
                      id: "alertPadding",
                      type: "padding-dev",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "border",
                      type: "corners-dev",
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
                      type: "slider-dev",
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
              type: "padding-dev",
              disabled: true
            },
            {
              id: "alertPadding",
              type: "padding-dev",
              label: t("Padding"),
              devices: "responsive",
              position: 50
            }
          ]
        }
      ]
    }
  ];
}
