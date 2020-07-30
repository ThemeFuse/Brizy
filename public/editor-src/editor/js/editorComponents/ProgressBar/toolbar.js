import { t } from "visual/utils/i18n";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const richTextDC = getDynamicContentChoices("richText", true);
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  return [
    {
      id: "toolbarProgressBar",
      type: "popover-dev",
      config: {
        devices: "desktop",
        icon: "nc-progress-bar"
      },
      title: t("Progress"),
      position: 70,
      options: [
        {
          id: "progressBarStyle",
          label: t("Style"),
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "style1", icon: "nc-progress-bar-style-1" },
            { value: "style2", icon: "nc-progress-bar-style-2" }
          ]
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
          },
          population: richTextDC
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
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Title"),
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  columns: [
                    {
                      width: 95,
                      vAlign: "center",
                      options: [
                        {
                          id: "typography",
                          type: "typography-dev",
                          config: {
                            fontFamily: "desktop" === device
                          },
                          disabled:
                            v.showText === "off" ||
                            v.progressBarStyle === "style2"
                        }
                      ]
                    },
                    {
                      width: 5,
                      vAlign: "center",
                      options: [
                        {
                          id: "text",
                          type: "population-dev",
                          config: {
                            iconOnly: true,
                            choices: richTextDC
                          },
                          disabled:
                            v.showText === "off" ||
                            v.progressBarStyle === "style2",
                          devices: "desktop"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabPercent",
              label: t("Percent"),
              options: [
                {
                  type: "grid",
                  columns: [
                    {
                      width: 95,
                      vAlign: "center",
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
                    },
                    {
                      width: 5,
                      vAlign: "center",
                      options: [
                        {
                          id: "percentage",
                          type: "population-dev",
                          config: {
                            iconOnly: true,
                            choices: richTextDC
                          },
                          devices: "desktop",
                          disabled: v.showPercentage === "off"
                        }
                      ]
                    }
                  ]
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
            backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
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
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          position: 100,
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          position: 110,
          icon: "nc-cog"
        }
      ]
    }
  ];
}
