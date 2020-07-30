import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  toolbarFilterHue,
  toolbarFilterSaturation,
  toolbarFilterBrightness,
  toolbarFilterContrast,
  toolbarElementVideoPlaySize
} from "visual/utils/toolbar";
import { NORMAL, HOVER, ACTIVE } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-play",
        title: t("Video")
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElementCover",
              label: t("Cover"),
              options: [
                {
                  id: "coverZoom",
                  label: t("Zoom"),
                  devices: "desktop",
                  type: "slider-dev",
                  config: {
                    min: 100,
                    max: 300,
                    units: [{ value: "%", title: "%" }]
                  }
                },
                toolbarElementVideoPlaySize({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            },
            {
              id: "tabCurrentElementFilter",
              label: t("Filters"),
              options: [
                toolbarFilterHue({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarFilterSaturation({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarFilterBrightness({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarFilterContrast({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            },
            {
              id: "tabSubTitle",
              label: t("Sub Title"),
              options: [
                {
                  id: "subTitle",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            }
          ]
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
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      devices: "desktop",
      roles: ["admin"],
      position: 90,

      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabPlay",
              label: t("Play"),
              position: 20,
              options: [
                {
                  id: "iconBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Icon"),
              position: 30,
              options: [
                {
                  id: "iconColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabVideoTitle",
              label: t("Title"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabVideoSubTitle",
              label: t("Sub Title"),
              options: [
                {
                  id: "subTitleColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBgItem",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "itemBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "widthImage",
          label: t("Size"),
          type: "slider-dev",
          position: 10,
          config: {
            min: 0,
            max: 500,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "verticalAlign",
          label: t("Content"),
          type: "radioGroup-dev",
          devices: "desktop",
          disabled: v.positionItem === "vertical",
          position: 10,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" }
          ]
        }
      ]
    }
  ];
}
