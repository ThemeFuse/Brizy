import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { NORMAL, HOVER, State } from "visual/utils/stateMode";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ToolbarItemType } from "../../ToolbarItemType";
import { EditorComponentContextValue } from "../../EditorComponent/EditorComponentContext";

import { Value } from "./index";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  // Colors
  const { hex: buttonBgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "buttonBgColorHex", device }),
    defaultValueValue({ v, key: "buttonBgColorPalette", device })
  );
  const { hex: buttonColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "buttonColorHex", device }),
    defaultValueValue({ v, key: "buttonColorPalette", device })
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      position: 10,
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Button"),
              options: [
                {
                  id: "borderRadiusTypeGroup",
                  type: "group-dev",
                  devices: "desktop",
                  disabled: v.buttonFillType === "default",
                  position: 30,
                  options: [
                    {
                      id: "borderRadiusType",
                      label: t("Corner"),
                      devices: "desktop",
                      type: "radioGroup-dev",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "borderRadius",
                      type: "slider-dev",
                      devices: "desktop",
                      disabled: v.borderRadiusType !== "custom",
                      config: {
                        min: 0,
                        max: 500,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "buttonHeight",
                  label: t("Height"),
                  type: "slider-dev",
                  disabled: dvv("buttonFillType") === "default",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      position: 20,
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsTypographyButton",
              label: t("Button"),
              options: [
                {
                  id: "button",
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
      position: 30,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              dvv("bgColorOpacity") > 0
                ? hexToRgba(buttonBgColorHex, v.buttonBgColorOpacity)
                : hexToRgba(buttonColorHex, v.buttonColorOpacity)
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "buttonColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabButtonBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev",
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
    }
  ];
}
