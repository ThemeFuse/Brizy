import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import type { Value } from "./types";

export const getItems: GetItems<Value> = () => {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "advanced",
              options: [
                {
                  id: "label",
                  label: t("Label"),
                  type: "switch",
                  position: 15,
                  devices: "desktop"
                },
                {
                  id: "placeholder",
                  label: t("Placeholder"),
                  type: "switch",
                  position: 16,
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "padding",
          type: "slider",
          label: t("Spacing"),
          position: 20,
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        }
      ]
    }
  ];
};
