import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });
  const { hex: checkboxColorHex } = getOptionColorHexByPalette(
    dvv("checkboxColorHex"),
    dvv("checkboxColorPalette")
  );

  return [
    {
      id: "toolbarTypographyCheckbox",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "checkbox",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorCheckbox",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              checkboxColorHex,
              dvv("checkboxColorOpacity")
            )
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "checkboxColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "rememberMeHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
}
