import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { buttonSelector } from "./css/selectors";
import type { Value } from "./types";

export const getItems: GetItems<Value> = () => [
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
            id: "buttonBorder",
            type: "corners",
            label: t("Corner"),
            selector: buttonSelector
          }
        ]
      }
    ]
  }
];
