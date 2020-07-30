import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarElementForm2SpacingPx } from "visual/utils/toolbar";
import { t } from "visual/utils/i18n";

export function getItems({ v, device }) {
  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device }),
    defaultValueValue({ v, key: "colorPalette", device })
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-form-left",
      title: t("Field"),
      position: 60,
      options: [
        toolbarElementForm2SpacingPx({
          v,
          device,
          state: "normal"
        })
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      icon: "nc-font",
      title: t("Typography"),
      size: device === "desktop" ? "large" : "auto",
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor:
            v.bgColorOpacity > 0
              ? hexToRgba(bgColorHex, v.bgColorOpacity)
              : hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              label: t("Label"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
