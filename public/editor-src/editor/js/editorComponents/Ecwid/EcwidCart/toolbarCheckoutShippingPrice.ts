import { checkoutShippingPriceSelector } from "visual/editorComponents/Ecwid/EcwidCart/css/selectors";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkoutShippingPriceColor = getColorToolbar(
    dvv("checkoutShippingPriceColorPalette"),
    dvv("checkoutShippingPriceColorHex"),
    dvv("checkoutShippingPriceColorOpacity")
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
          id: "checkoutShippingPriceTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: checkoutShippingPriceSelector
        }
      ]
    },
    {
      id: "toolbarColorCheckoutEmail",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: checkoutShippingPriceColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "checkoutShippingPriceColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: checkoutShippingPriceSelector
        }
      ]
    }
  ];
};
