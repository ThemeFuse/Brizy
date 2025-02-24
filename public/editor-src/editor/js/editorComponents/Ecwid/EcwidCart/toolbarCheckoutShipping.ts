import { checkoutShippingSelector } from "visual/editorComponents/Ecwid/EcwidCart/css/selectors";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkoutShippingColor = getColorToolbar(
    dvv("checkoutShippingColorPalette"),
    dvv("checkoutShippingColorHex"),
    dvv("checkoutShippingColorOpacity")
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
          id: "checkoutShippingTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: checkoutShippingSelector
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
            backgroundColor: checkoutShippingColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "checkoutShippingColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: checkoutShippingSelector
        }
      ]
    }
  ];
};
