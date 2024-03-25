import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { ItemValue } from "../types";

export const getItems: GetItems<ItemValue> = () => {
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
              id: "border",
              type: "corners",
              label: t("Corner")
            },
            {
              id: "hoverTransition",
              label: t("Hover Transition"),
              type: "slider",
              devices: "desktop",
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
  ];
};
