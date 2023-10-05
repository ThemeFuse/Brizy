import { t } from "visual/utils/i18n";
import type { GetItems } from "../EditorComponent/types";
import type { Props, Value } from "./index";

export const getItems: GetItems<Value, Props> = () => {
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
                      id: "border",
                      type: "corners-dev",
                      disabled: true
                    },
                    {
                      id: "thumbnailBorder",
                      type: "corners-dev",
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
                      type: "slider-dev",
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
                      type: "transform-dev",
                      disabled: true
                    }
                  ]
                }
              ]
            },
            {
              id: "settingsTabsResponsive",
              type: "tabs-dev",
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
              type: "tabs-dev",
              disabled: true,
              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation-dev"
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
