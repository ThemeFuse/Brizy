import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import {
  addressTabSelector,
  checkoutPaymentsSelector,
  deliveryTabsSelector
} from "./css/selectors";
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
            id: "checkoutPaymentsBorder",
            type: "corners",
            label: t("Corner"),
            selector: `${checkoutPaymentsSelector}, ${addressTabSelector}, ${deliveryTabsSelector}`
          }
        ]
      }
    ]
  }
];
