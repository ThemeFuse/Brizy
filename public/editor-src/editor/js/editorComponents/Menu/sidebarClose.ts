import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { isStory } from "visual/global/EditorModeContext";
import { t } from "visual/utils/i18n";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ editorMode }) => {
  const _isStory = isStory(editorMode);
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
                      disabled: _isStory,
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
