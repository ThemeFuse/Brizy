import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { formControlSelector } from "./css/selectors";
import { Value } from "./types";

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
            selector: `${formControlSelector}:not(.form-control--checkbox):not(.form-control--radio)`
          }
        ]
      }
    ]
  }
];
