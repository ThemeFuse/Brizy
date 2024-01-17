import { t } from "visual/utils/i18n";
import type { GetItems } from "../EditorComponent/types";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = () => {
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
                      id: "border",
                      type: "corners",
                      disabled: true
                    },
                    {
                      id: "thumbnailBorder",
                      type: "corners",
                      label: t("Corner"),
                      position: 70
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  options: [
                    {
                      id: "hoverTransition",
                      type: "slider",
                      disabled: true
                    },
                    {
                      id: "customCSS",
                      type: "codeMirror-dev",
                      disabled: true
                    }
                  ]
                },
                {
                  id: "moreSettingsTransform",
                  options: [
                    {
                      id: "transform",
                      type: "transform",
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
