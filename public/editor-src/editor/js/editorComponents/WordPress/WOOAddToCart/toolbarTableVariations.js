import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: labelColorHex } = getOptionColorHexByPalette(
    dvv("labelColorHex"),
    dvv("labelColorPalette")
  );

  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover-dev",
      config: {
        icon: "nc-woo-2",
        title: t("Add To Cart")
      },
      position: 10,
      options: [
        {
          id: "tableSpacing",
          label: t("Spacing"),
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
          id: "tabsToolbarTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabLabel",
              label: t("Label"),
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
              id: "tabValue",
              label: t("Value"),
              options: [
                {
                  id: "value",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabClear",
              label: t("Clear"),
              options: [
                {
                  id: "clear",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverColor",
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
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "inputColorTab",
              label: t("Input"),
              options: [
                {
                  id: "inputColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "labelColorTab",
              label: t("Label"),
              options: [
                {
                  id: "labelColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "valueColorTab",
              label: t("Value"),
              options: [
                {
                  id: "valueColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "clearColorTab",
              label: t("Clear"),
              options: [
                {
                  id: "clearColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "bgTab",
              label: t("Bg"),
              options: [
                {
                  id: "tableBgColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "borderColorTab",
              label: t("Border"),
              options: [
                {
                  id: "tableBorder",
                  type: "border-dev",
                  config: {
                    width: ["grouped"]
                  }
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "tableBoxShadow",
                  type: "boxShadow-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
