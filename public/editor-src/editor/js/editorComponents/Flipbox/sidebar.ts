import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v }) => {
  const { flipboxActive } = v;

  const isFrontSide = flipboxActive === "front";
  const isBackSide = flipboxActive === "back";

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
                      disabled: true
                    },
                    {
                      id: "frontPadding",
                      type: "padding",
                      label: t("Padding"),
                      disabled: isBackSide,
                      position: 50
                    },
                    {
                      id: "backPadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50,
                      disabled: isFrontSide
                    },
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      position: 65
                    }
                  ]
                }
              ]
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
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  position: 1
                },
                {
                  id: "tabHover",
                  label: t("Hover"),
                  position: 2
                },
                {
                  id: "scroll",
                  label: t("Scroll"),
                  position: 3
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
