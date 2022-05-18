import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { Value } from "./index";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: iconColorHex } = getOptionColorHexByPalette(
    dvv("iconColorHex"),
    dvv("iconColorPalette")
  );
  return [
    {
      id: "toolbarCurrentElementIcon",
      type: "popover-dev",
      config: {
        title: t("Icon Styles"),
        icon: "nc-star"
      },
      position: 10,
      options: [
        {
          id: "tabsCurrentElementIcon",
          type: "tabs-dev",
          tabs: [
            {
              id: "iconType",
              label: t("Icon"),
              options: [
                {
                  id: "iconPositionLeft",
                  label: t("Lateral"),
                  type: "slider-dev",
                  config: {
                    min: -50,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "iconPositionTop",
                  label: t("Vertical"),
                  type: "slider-dev",
                  config: {
                    min: -50,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                }
              ]
            },
            {
              id: "iconBackground",
              label: t("Background"),
              options: [
                {
                  id: "iconPadding",
                  label: t("Size"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "groupIconBorderRadius",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "iconBorderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "iconBorderRadius",
                      type: "slider-dev",
                      disabled: dvv("iconBorderRadiusType") !== "custom",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
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
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsTypography",
              label: t("Text"),
              options: [
                {
                  id: "",
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
      id: "toolbarIconColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(iconColorHex, v.iconColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "tabsColorIcon",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabColorIcon",
              label: t("Text"),
              options: [
                {
                  id: "iconColor",
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
                  id: "icon",
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
                  id: "iconBorder",
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
                  id: "iconBoxShadow",
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
      disabled: true,
      choices: []
    },
    {
      id: "duplicate",
      // @ts-expect-error: old type
      type: "button",
      disabled: true
    },
    {
      id: "remove",
      // @ts-expect-error: old type
      type: "button",
      disabled: true
    }
  ];
}
