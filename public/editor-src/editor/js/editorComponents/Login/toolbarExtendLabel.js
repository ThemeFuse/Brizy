import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const { hex: labelColorHex } = getOptionColorHexByPalette(
    dvv("labelColorHex"),
    dvv("labelColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-form-left",
        title: t("Field")
      },
      position: 60,
      options: [
        {
          id: "labelPaddingBottom",
          label: t("Spacing"),
          position: 60,
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "label",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(labelColorHex, dvv("labelColorOpacity"))
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              label: t("Label"),
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
    },
    {
      id: "labelHorizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    }
  ];
}
