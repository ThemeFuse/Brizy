import { t } from "visual/utils/i18n";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { Value, Props } from "./types";

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
              id: "padding",
              type: "padding-dev",
              disabled: true
            },
            {
              id: "dayBorder",
              type: "corners-dev",
              label: t("Corner")
            }
          ]
        }
      ]
    }
  ];
};
