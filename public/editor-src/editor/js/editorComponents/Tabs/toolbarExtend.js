import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarIconSize } from "visual/utils/toolbar";
import {
  toolbarElementTabsIconPosition,
  toolbarElementTabsOrientation,
  toolbarElementTabsStyle
} from "visual/utils/toolbar/toolbarElementTabs";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = key => defaultValueValue({ key, v, device });

  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const isVerticalMode = dvv("verticalMode") === "on";
  const navStyle = dvv("navStyle");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-tabs",
      title: t("Tabs"),
      position: 60,
      devices: "desktop",
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Tab"),
              position: 10,
              options: [
                toolbarElementTabsOrientation({ v, device, state }),
                toolbarElementTabsStyle({ v, device, state }),
                {
                  id: "action",
                  label: t("Activate Tab"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("On Click"),
                      value: "click"
                    },
                    {
                      title: t("On Hover"),
                      value: "hover"
                    }
                  ]
                },
                {
                  id: "spacingAfter",
                  type: "slider-dev",
                  label: t("Content Gap"),
                  disabled: navStyle === "style-1",
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: 100
                  }
                },
                {
                  id: "spacing",
                  type: "slider-dev",
                  label: t("Spacing"),
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: 100
                  }
                }
              ]
            },
            {
              id: "currentShortcodeIcon",
              label: t("Icon"),
              options: [
                toolbarElementTabsIconPosition({ v, device, state }),
                toolbarIconSize({ v, device, state }),
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 100
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
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
      devices: "desktop",
      position: 90,
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
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
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
      id: "horizontalAlign",
      type: "toggle-dev",
      devices: "desktop",
      disabled: isVerticalMode,
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
    },
    {
      id: "verticalAlign",
      type: "toggle-dev",
      devices: "desktop",
      position: 90,
      disabled: !isVerticalMode,
      choices: [
        {
          icon: "nc-hrz-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-hrz-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      title: t("Settings"),
      icon: "nc-cog"
    }
  ];
}
