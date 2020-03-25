import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  return [
    {
      id: "toolbarProgressBar",
      type: "popover",
      devices: "desktop",
      icon: "nc-progress-bar",
      title: t("Progress"),
      position: 70,
      options: [
        {
          id: "progressBarStyle",
          label: t("Style"),
          type: "radioGroup",
          devices: "desktop",
          choices: [
            {
              value: "style1",
              icon: "nc-progress-bar-style-1"
            },
            {
              value: "style2",
              icon: "nc-progress-bar-style-2"
            }
          ],
          value: dvv("progressBarStyle"),
          onChange: value => ({
            [dvk("progressBarStyle")]: value
          })
        },
        {
          id: "percentage",
          label: t("Fill"),
          type: "slider-dev",
          devices: "desktop",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "showText",
          type: "switch-dev",
          label: t("Title"),
          devices: "desktop",
          disabled: v.progressBarStyle === "style2"
        },
        {
          id: "showPercentage",
          type: "switch-dev",
          label: t("Percentage"),
          devices: "desktop"
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Title"),
              options: [
                {
                  id: "typography",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  },
                  disabled:
                    v.showText === "off" || v.progressBarStyle === "style2"
                }
              ]
            },
            {
              id: "tabPercent",
              label: t("Percent"),
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  },
                  disabled: v.showPercentage === "off"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Title"),
              options: [
                {
                  id: "labelColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled:
                    v.showText === "off" || v.progressBarStyle === "style2"
                }
              ]
            },
            {
              id: "tabPercent",
              label: t("Percent"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: v.showPercentage === "off"
                }
              ]
            },
            {
              id: "tabBar",
              label: t("Bar"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bg2Color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
