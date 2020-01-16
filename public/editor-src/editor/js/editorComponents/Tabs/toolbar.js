import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getFontStyle } from "visual/utils/fonts";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import {
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing,
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarHorizontalAlign,
  toolbarDisabledShowOnResponsive,
  toolbarDisabledAdvancedSettings,
  toolbarBorderWidthOneField2,
  toolbarPaddingFourFields
} from "visual/utils/toolbar";

export function getItems({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ key, v, device });

  const fontStyle = v.fontStyle;
  const { fontSize, lineHeight } =
    fontStyle === "" ? v : getFontStyle(fontStyle);
  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: dvk("toolbarCurrentShortcode"),
      type: "popover",
      options: [
        {
          id: dvk("currentShortcodeTabs"),
          type: "tabs",
          tabs: [
            {
              id: dvk("currentShortcodeTab"),
              options: [
                {
                  id: "iconPosition",
                  label: t("Position"),
                  type: "radioGroup",
                  roles: ["admin"],
                  choices: [
                    {
                      value: "left",
                      icon: "nc-align-left"
                    },
                    {
                      value: "right",
                      icon: "nc-align-right"
                    }
                  ],
                  value: v.iconPosition
                },
                {
                  type: "multiPicker",
                  roles: ["admin"],
                  picker: {
                    id: "iconSize",
                    label: t("Size"),
                    type: "radioGroup",
                    choices: [
                      {
                        value: "small",
                        icon: "nc-16"
                      },
                      {
                        value: "medium",
                        icon: "nc-24"
                      },
                      {
                        value: "large",
                        icon: "nc-32"
                      },
                      {
                        value: "custom",
                        icon: "nc-more"
                      }
                    ],
                    value: v.iconSize,
                    onChange: iconSize => {
                      let contentHeight =
                        iconSize === "custom" &&
                        fontSize * lineHeight >= v.iconCustomSize
                          ? fontSize * lineHeight
                          : iconSize === "custom" &&
                            fontSize * lineHeight < v.iconCustomSize
                          ? v.iconCustomSize
                          : iconSize !== "custom" &&
                            fontSize * lineHeight >= v[`${iconSize}IconSize`]
                          ? fontSize * lineHeight
                          : v[`${iconSize}IconSize`];
                      let maxBorderRadius = Math.round(
                        (contentHeight +
                          v.paddingTop * 2 +
                          v.tempBorderWidth * 2) /
                          2
                      );

                      return {
                        iconSize,

                        iconCustomSize:
                          iconSize === "small"
                            ? v.smallIconSize
                            : iconSize === "medium"
                            ? v.mediumIconSize
                            : iconSize === "large"
                            ? v.largeIconSize
                            : v.iconCustomSize,

                        borderRadius:
                          v.borderRadiusType === "rounded"
                            ? maxBorderRadius
                            : v.borderRadius
                      };
                    }
                  },
                  choices: {
                    custom: [
                      {
                        id: "iconCustomSize",
                        type: "slider",
                        slider: {
                          min: 1,
                          max: 100
                        },
                        input: {
                          show: true
                        },
                        suffix: {
                          show: true,
                          choices: [
                            {
                              title: "px",
                              value: "px"
                            }
                          ]
                        },
                        value: {
                          value: v.iconCustomSize
                        },
                        onChange: ({ value: iconCustomSize }) => {
                          let contentHeight =
                            fontSize * lineHeight >= iconCustomSize
                              ? fontSize * lineHeight
                              : iconCustomSize;
                          let maxBorderRadius = Math.round(
                            (contentHeight +
                              v.paddingTop * 2 +
                              v.tempBorderWidth * 2) /
                              2
                          );

                          return {
                            iconCustomSize,
                            borderRadius:
                              v.borderRadiusType === "rounded"
                                ? maxBorderRadius
                                : v.borderRadius
                          };
                        }
                      }
                    ]
                  }
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider",
                  roles: ["admin"],
                  slider: {
                    min: 0,
                    max: 100
                  },
                  input: {
                    show: true
                  },
                  suffix: {
                    show: true,
                    choices: [
                      {
                        title: "px",
                        value: "px"
                      }
                    ]
                  },
                  value: {
                    value: v.iconSpacing
                  },
                  onChange: ({ value: iconSpacing }) => {
                    return {
                      iconSpacing
                    };
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarTypography"),
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__typography",
          columns: [
            {
              width: 54,
              options: [
                toolbarTypography2FontFamily({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal",
                  onChange: ["onChangeTypography2"]
                })
              ]
            },
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                toolbarTypography2FontStyle({ v, device, state: "normal" }),
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: "50",
                      options: [
                        toolbarTypography2FontSize({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LineHeight({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: "50",
                      options: [
                        toolbarTypography2FontWeight({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LetterSpacing({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
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
      id: defaultValueKey({ key: "toolbarColor", device, state: "normal" }),
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
          value: v.tabsColor,
          tabs: [
            {
              label: t("Background"),
              options: [
                toolbarBgColor2({
                  v,
                  device,
                  state: "normal",
                  showSelect: false,
                  onChangeHex: [
                    "onChangeBgColorHexAndOpacity2",
                    "onChangeBgColorHexAndOpacityPalette2"
                  ],
                  onChangePalette: [
                    "onChangeBgColorPalette2",
                    "onChangeBgColorPaletteOpacity2"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 30,
                      options: [
                        toolbarBgColorHexField2({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  state: "normal",
                  onChangeHex: [
                    "onChangeColorHexAndOpacity",
                    "onChangeColorHexAndOpacityPalette"
                  ],
                  onChangePalette: [
                    "onChangeColorPalette",
                    "onChangeColorPaletteOpacity"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
                      options: [
                        toolbarColorHexField2({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  state: "normal",
                  showSelect: false,
                  onChangeHex: [
                    "onChangeBorderColorHexAndOpacity2",
                    "onChangeBorderColorHexAndOpacityPalette2",
                    "onChangeElementBorderColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBorderColorPalette2",
                    "onChangeBorderColorPaletteOpacity2",
                    "onChangeElementBorderColorHexAndOpacityDependencies2"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 38,
                      options: [
                        toolbarBorderColorHexField2({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeElementBorderColorHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 62,
                      options: [
                        toolbarBorderWidthOneField2({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderWidthGrouped2",
                            "onChangeBorderWidthGroupedDependencies2"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      onChange: (_, { isOpen }) => ({
        tabsColor: !isOpen ? "" : v.tabsColor
      })
    },
    toolbarHorizontalAlign({
      v,
      device,
      devices: "desktop",
      state: "normal"
    }),
    {
      id: defaultValueKey({
        key: "advancedSettings",
        device,
        state: "normal"
      }),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: "settingsStyling",
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: [
                toolbarPaddingFourFields({
                  v,
                  device,
                  state: "normal",
                  onChangeGrouped: ["onChangePaddingGrouped"],
                  onChangeUngrouped: ["onChangePaddingUngrouped"]
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: defaultValueKey({ key: "toolbarSettings", device }),
      type: "popover",
      disabled: true,
      options: [
        toolbarDisabledAdvancedSettings({
          device,
          state: "normal"
        })
      ]
    },
    toolbarDisabledShowOnResponsive({
      device
    })
  ];
}
