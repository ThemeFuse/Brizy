import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { Props, Value } from "./types";

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
              id: "buttonBorder",
              type: "corners-dev",
              label: t("Corner")
            }
          ]
        }
      ]
    }
  ];
};
