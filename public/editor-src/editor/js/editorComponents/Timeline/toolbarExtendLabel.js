import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export function getItems({ v, device }) {
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "labelBgColorHex", device }),
    defaultValueValue({ v, key: "labelBgColorPalette", device })
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "labelColorHex", device }),
    defaultValueValue({ v, key: "labelColorPalette", device })
  );

  return [
    {
      id: "toolbarTypographyLabel",
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "typography",
          type: "typography-dev",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColorLabel",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor:
            v.labelBgColorOpacity > 0
              ? hexToRgba(bgColorHex, v.labelBgColorOpacity)
              : hexToRgba(colorHex, v.labelColorOpacity)
        }
      },
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              label: t("Color"),
              options: [
                {
                  id: "labelColor",
                  type: "colorPicker-dev"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
