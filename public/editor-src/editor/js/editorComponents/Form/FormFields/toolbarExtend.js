import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });
  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-form-left",
        title: t("Field"),
        size: "large"
      },
      position: 60,
      options: [
        {
          id: "padding",
          type: "slider",
          label: t("Spacing"),
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        title: t("Typography"),
        size: device === "desktop" ? "large" : "auto"
      },
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              dvv("bgColorOpacity") > 0
                ? hexToRgba(bgColorHex, dvv("bgColorOpacity"))
                : hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      position: 80,
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "bgColor",
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "labelColor",
              label: t("Label"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "borderColor",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
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
