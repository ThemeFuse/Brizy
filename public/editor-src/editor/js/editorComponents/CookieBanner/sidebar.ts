import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { barPaddingCSS, dialogPaddingCSS } from "./css";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = () => [
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
            id: "barPadding",
            label: t("Bar Padding"),
            type: "padding",
            style: barPaddingCSS
          },
          {
            id: "dialogPadding",
            label: t("Dialog Padding"),
            type: "padding",
            style: dialogPaddingCSS
          }
        ]
      }
    ]
  }
];
