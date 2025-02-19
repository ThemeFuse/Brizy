import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  addressTabSelector,
  checkoutPaymentsSelector,
  deliveryTabsSelector
} from "./css/selectors";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkoutPaymentsColor = getColorToolbar(
    dvv("checkoutPaymentsColorPalette"),
    dvv("checkoutPaymentsColorHex"),
    dvv("checkoutPaymentsColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyCheckoutFields",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "checkoutPaymentsTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: `${checkoutPaymentsSelector}, ${addressTabSelector}, ${deliveryTabsSelector}`
        }
      ]
    },
    {
      id: "toolbarColorCheckoutInputs",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: checkoutPaymentsColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "colorsTab",
          type: "tabs",
          tabs: [
            {
              id: "tabColor",
              label: t("Color"),
              options: [
                {
                  id: "checkoutPaymentsColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutPaymentsSelector}, ${addressTabSelector}, ${deliveryTabsSelector}`
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "checkoutPayments",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutPaymentsSelector}, ${addressTabSelector}, ${deliveryTabsSelector}`
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "checkoutPaymentsBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutPaymentsSelector}, ${addressTabSelector}, ${deliveryTabsSelector}`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "checkoutPaymentsBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutPaymentsSelector}, ${addressTabSelector}, ${deliveryTabsSelector}`
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      title: t("Settings"),
      devices: "desktop"
    }
  ];
};
