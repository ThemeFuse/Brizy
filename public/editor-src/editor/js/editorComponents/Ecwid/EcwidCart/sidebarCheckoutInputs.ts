import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { addressInputsSelector, checkoutInputsSelector } from "./css/selectors";
import { Value } from "./types/Value";

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
            id: "checkboxInputsBorder",
            type: "corners",
            label: t("Corner"),
            selector: `${checkoutInputsSelector}, ${addressInputsSelector}`
          }
        ]
      }
    ]
  }
];
