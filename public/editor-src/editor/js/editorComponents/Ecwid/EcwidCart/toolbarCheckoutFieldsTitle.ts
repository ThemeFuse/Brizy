import { textAlignCSS } from "visual/editorComponents/Ecwid/EcwidCart/css";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  checkoutFieldsSubTitleSelector,
  checkoutFieldsTitleSelector
} from "./css/selectors";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkoutFieldsColor = getColorToolbar(
    dvv("checkoutFieldsColorPalette"),
    dvv("checkoutFieldsColorHex"),
    dvv("checkoutFieldsColorOpacity")
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
          id: "checkoutFieldsTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: `${checkoutFieldsTitleSelector}, ${checkoutFieldsSubTitleSelector}`
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
            backgroundColor: checkoutFieldsColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "checkoutFieldsColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: `${checkoutFieldsTitleSelector}, ${checkoutFieldsSubTitleSelector}`
        }
      ]
    },
    {
      id: "checkoutFieldsHorizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: textAlignCSS([
        checkoutFieldsTitleSelector,
        checkoutFieldsSubTitleSelector
      ])
    }
  ];
};
