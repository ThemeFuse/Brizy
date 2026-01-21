import { t } from "visual/utils/i18n";
import type { GetItems } from "../../EditorComponent/types";
import {
  errorMessageContainerSelector,
  errorMessageSelector,
  invalidEmailMessageContainerSelector,
  invalidEmailMessageSelector,
  invalidMessageContainerSelector,
  invalidMessageSelector
} from "../css";
import type { Value } from "../types";

export const getItems: GetItems<Value> = () => {
  const errorsSelector = `${errorMessageSelector}, ${invalidMessageSelector}, ${invalidEmailMessageSelector}`;
  const errorContainersSelector = `${errorMessageContainerSelector}, ${invalidMessageContainerSelector}, ${invalidEmailMessageContainerSelector}`;

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
              id: "errorMessagePadding",
              label: t("Padding"),
              type: "padding",
              devices: "desktop",
              selector: errorsSelector
            },
            {
              id: "errorMessageMargin",
              label: t("Margin"),
              type: "margin",
              devices: "desktop",
              selector: errorContainersSelector
            },
            {
              id: "errorMessageBorder",
              type: "corners",
              label: t("Corner"),
              devices: "desktop",
              selector: errorsSelector
            }
          ]
        }
      ]
    }
  ];
};
