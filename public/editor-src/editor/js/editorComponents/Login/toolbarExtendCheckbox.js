import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const { hex: checkboxColorHex } = getOptionColorHexByPalette(
    dvv("checkboxColorHex"),
    dvv("checkboxColorPalette")
  );

  return [
    {
      id: "toolbarTypographyCheckbox",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "checkbox",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorCheckbox",
      type: "popover-dev",
      config: {
        size: "auto",
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
          type: "colorPicker-dev"
        }
      ]
    }
  ];
}
