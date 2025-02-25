import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { textAlignCSS } from "./css";
import { checkoutAdressFieldSubTitleSelector } from "./css/selectors";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkoutFieldsSubtitleColor = getColorToolbar(
    dvv("checkoutFieldsSubtitleColorPalette"),
    dvv("checkoutFieldsSubtitleColorHex"),
    dvv("checkoutFieldsSubtitleColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyCheckoutFieldsSubtitle",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "checkoutFieldsSubtitleTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: checkoutAdressFieldSubTitleSelector
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
            backgroundColor: checkoutFieldsSubtitleColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "checkoutFieldsSubtitleColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: checkoutAdressFieldSubTitleSelector
        }
      ]
    },
    {
      id: "checkoutFieldsSubtitleHorizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: textAlignCSS([checkoutAdressFieldSubTitleSelector])
    }
  ];
};
