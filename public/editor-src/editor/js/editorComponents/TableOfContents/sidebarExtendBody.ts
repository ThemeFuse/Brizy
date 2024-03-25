import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import type { Props, State, Value } from "./types";

export const getItems: GetItems<Value, Props, State> = () => {
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
              tabs: [
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "bodyPadding",
                      label: t("Body Padding"),
                      position: 50,
                      type: "padding"
                    },
                    {
                      id: "customCSS",
                      type: "codeMirror",
                      disabled: true
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
              disabled: true,
              tabs: []
            }
          ]
        },
        {
          id: "effects",
          title: t("Effects"),
          label: t("Effects"),
          options: [
            {
              id: "tabs",
              type: "tabs",
              disabled: true,
              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation"
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
