import { t } from "visual/utils/i18n";
import type { GetItems } from "../../EditorComponent/types";
import { emptyMessageContainerSelector, emptyMessageSelector } from "../css";
import type { Value } from "../types";

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
            id: "emptyMessagePadding",
            label: t("Padding"),
            type: "padding",
            devices: "desktop",
            selector: emptyMessageSelector
          },
          {
            id: "emptyMessageMargin",
            label: t("Margin"),
            type: "margin",
            devices: "desktop",
            selector: emptyMessageContainerSelector
          },
          {
            id: "emptyMessageBorder",
            type: "corners",
            label: t("Corner"),
            devices: "desktop",
            selector: emptyMessageSelector
          }
        ]
      }
    ]
  }
];
