import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { Value } from "./types/Value";

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

  const { hex: shareButtonsBgColorHex } = getOptionColorHexByPalette(
    dvv("shareButtonsBgColorHex"),
    dvv("shareButtonsBgColorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      position: 10,
      config: {
        icon: "nc-share-2",
        title: t("Button")
      },
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElementButton",
              label: t("Button"),
              options: [
                {
                  id: "groupSize",
                  type: "group-dev",
                  options: [
                    {
                      id: "shareButtonsSize",
                      label: t("Size"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "small", icon: "nc-small" },
                        { value: "medium", icon: "nc-medium" },
                        { value: "large", icon: "nc-large" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "shareButtonsHeight",
                      label: t("Height"),
                      disabled: dvv("shareButtonsSize") !== "custom",
                      type: "slider-dev",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    },
                    {
                      id: "shareButtonsWidth",
                      label: t("Width"),
                      disabled: dvv("shareButtonsSize") !== "custom",
                      type: "slider-dev",
                      config: {
                        min: 0,
                        max: 100,
                        units: [
                          { value: "%", title: "%" },
                          { value: "px", title: "px" }
                        ]
                      }
                    }
                  ]
                },
                {
                  id: "shareButtonsRightSpacing",
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
              id: "tabCurrentElementIcon",
              label: t("Icon"),
              options: [
                {
                  id: "groupSize",
                  type: "group-dev",
                  options: [
                    {
                      id: "groupSizeShareButtonsIcon",
                      type: "group-dev",
                      options: [
                        {
                          id: "shareButtonsIconSize",
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
                          id: "shareButtonsIconCustomSize",
                          type: "slider-dev",
                          disabled: dvv("shareButtonsIconSize") !== "custom",
                          config: {
                            min: 8,
                            max: 50,
                            units: [{ title: "px", value: "px" }]
                          }
                        }
                      ]
                    },
                    {
                      id: "shareButtonsRightIconSpacing",
                      label: t("Spacing"),
                      type: "slider-dev",
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
          id: "shareButtonsTypography",
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
      position: 30,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              shareButtonsBgColorHex,
              dvv("shareButtonsBgColorOpacity")
            )
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
                  id: "shareButtonsColor",
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
                  id: "shareButtons",
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
                  id: "shareButtonsBorder",
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
                  id: "shareButtonsBoxShadow",
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
      id: "shareButtonsHorizontalAlign",
      type: "toggle-dev",
      position: 40,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 50,
      options: [
        {
          id: "shareButtonsSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton-dev",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    }
  ];
}
