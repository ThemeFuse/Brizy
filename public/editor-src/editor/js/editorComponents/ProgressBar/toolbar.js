import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const progressBarStyle = dvv("progressBarStyle");
  const showText = dvv("showText");
  const showPercentage = dvv("showPercentage");

  const style2 = progressBarStyle === "style2";
  const percentageOff = showPercentage === "off";
  const textOff = showText === "off";

  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

  const IS_STORY = isStory(Config.getAll());

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
          disabled: style2
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
          config: {
            showSingle: true
          },
          tabs: [
            {
              id: "tabText",
              label: t("Title"),
              options: [
                {
                  id: "gridTypography",
                  type: "grid-dev",
                  columns: [
                    {
                      id: "col-1",
                      options: [
                        {
                          id: "typography",
                          type: "typography-dev",
                          config: {
                            fontFamily: "desktop" === device
                          },
                          disabled: textOff || style2
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          type: "population-dev",
                          config: {
                            iconOnly: true,
                            choices: richTextDC
                          },
                          devices: "desktop",
                          disabled: textOff || style2
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
                  type: "grid-dev",
                  columns: [
                    {
                      id: "col-1",
                      options: [
                        {
                          id: "",
                          type: "typography-dev",
                          config: {
                            fontFamily: "desktop" === device
                          },
                          disabled: percentageOff
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      align: "center",
                      options: [
                        {
                          id: "percentage",
                          type: "population-dev",
                          config: {
                            iconOnly: true,
                            choices: richTextDC
                          },
                          devices: "desktop",
                          disabled: percentageOff
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
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
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
                  disabled: textOff || style2
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
                  disabled: percentageOff
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
      disabled: IS_STORY,
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
          id: "grid",
          type: "grid-dev",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: !IS_STORY,
      position: 110,
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
}
