import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { ToolbarItemType } from "../ToolbarItemType";
import { Value } from "./index";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: closeColorHex } = getOptionColorHexByPalette(
    dvv("closeColorHex"),
    dvv("closeColorPalette")
  );

  return [
    {
      id: "toolbarCloseButtonIcon",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "toolbarCloseButtonIconTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "closeHorizontalPosition",
                  label: t("Lateral"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "closeVerticalPosition",
                  label: t("Vertical"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "groupCloseSize",
                  type: "group-dev",
                  options: [
                    {
                      id: "closeSize",
                      label: t("Size"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "closeCustomSize",
                      type: "slider-dev",
                      disabled: dvv("closeSize") !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "closeBgSize",
                  label: t("Size"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 30,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "groupCloseBorderRadiusShape",
                  type: "group-dev",
                  options: [
                    {
                      id: "closeBorderRadiusShape",
                      label: t("Corner"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "closeBorderRadius",
                      type: "slider-dev",
                      disabled: dvv("closeBorderRadiusShape") !== "custom",
                      config: {
                        min: 0,
                        max: 50,
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
      id: "toolbarColor",
      type: "popover-dev",
      devices: "desktop",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(closeColorHex, dvv("closeColorOpacity"))
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "closeColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "closeBgColor",
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
    }
  ];
}
