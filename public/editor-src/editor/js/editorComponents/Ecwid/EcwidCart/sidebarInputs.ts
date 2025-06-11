import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { inputsSelector } from "./css/selectors";
import type { Value } from "./types/Value";

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
            id: "inputsBorder",
            type: "corners",
            label: t("Corner"),
            selector: inputsSelector
          }
        ]
      }
    ]
  }
];
