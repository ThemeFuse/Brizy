import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { Value } from "./types";

export const getItems: GetItems<Value> = () => {
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
              id: "tabs",
              type: "tabs",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  options: [
                    {
                      id: "closePadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "closeMargin",
                      label: t("Margin"),
                      type: "margin",
                      devices: "desktop",
                      position: 60
                    }
                  ]
                },
                {
                  id: "settingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "closeHoverTransition",
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
            }
          ]
        }
      ]
    }
  ];
};
