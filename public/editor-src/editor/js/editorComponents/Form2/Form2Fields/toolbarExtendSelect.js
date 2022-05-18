import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const { hex: selectBgColorHex } = getOptionColorHexByPalette(
    dvv("selectColorHex"),
    dvv("selectColorPalette")
  );

  return [
    {
      id: "toolbarColorSelect",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              selectBgColorHex,
              dvv("selectBgColorOpacity")
            )
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsSelectColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabSelectText",
              label: t("Text"),
              options: [
                {
                  id: "selectColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabSelectBg",
              label: t("Bg"),
              options: [
                {
                  id: "selectBgColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabSelectBorder",
              label: t("Border"),
              options: [
                {
                  id: "selectBorder",
                  type: "border-dev",
                  config: {
                    width: ["grouped"]
                  }
                }
              ]
            },
            {
              id: "tabSelectBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "selectBoxShadow",
                  type: "boxShadow-dev"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
