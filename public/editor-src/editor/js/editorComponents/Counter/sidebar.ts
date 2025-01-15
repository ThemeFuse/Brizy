import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { isStory } from "visual/global/EditorModeContext";
import { t } from "visual/utils/i18n";
import type { Value } from "./types";

export const title = () => t("Counter");

export const getItems: GetItems<Value> = ({ editorMode }) => {
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
                      label: t("Padding"),
                      disabled: true
                    },
                    {
                      id: "bgPadding",
                      type: "padding",
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
                      disabled: isStory(editorMode),
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
                  icon: "nc-styling",
                  position: 10,
                  options: [
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      devices: "responsive",
                      disabled: true
                    },
                    {
                      id: "bgPadding",
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
};
