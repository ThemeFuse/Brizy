import { t } from "visual/utils/i18n";
import { GetItems } from "../../EditorComponent/types";
import {
  successMessageContainerSelector,
  successMessageSelector
} from "../css";
import { Value } from "../types";

export const getItems: GetItems<Value> = () => {
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
              id: "successMessagePadding",
              label: t("Padding"),
              type: "padding",
              devices: "desktop",
              selector: successMessageSelector
            },
            {
              id: "successMessageMargin",
              label: t("Margin"),
              type: "margin",
              devices: "desktop",
              selector: successMessageContainerSelector
            },
            {
              id: "successMessageBorder",
              type: "corners",
              label: t("Corner"),
              devices: "desktop",
              selector: successMessageSelector
            }
          ]
        }
      ]
    }
  ];
};
