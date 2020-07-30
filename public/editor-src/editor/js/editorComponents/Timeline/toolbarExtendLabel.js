import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export function getItems({ v, device }) {
  const { hex: labelBgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "labelBgColorHex", device }),
    defaultValueValue({ v, key: "labelBgColorPalette", device })
  );
  const { hex: labelColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "labelColorHex", device }),
    defaultValueValue({ v, key: "labelColorPalette", device })
  );

  return [
    {
      id: "toolbarTypographyLabel",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              v.bgColorOpacity > 0
                ? hexToRgba(labelBgColorHex, v.labelBgColorOpacity)
                : hexToRgba(labelColorHex, v.labelColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabLabelColor",
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
