import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarGradientType,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBorder2,
  toolbarBorderColorHexField2
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";
  const maxBorderRadius = Math.round(
    (v.customSize + v.tempPadding * 2 + v.tempBorderWidth * 2) / 2
  );

  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device }),
    defaultValueValue({ v, key: "colorPalette", device })
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  position: 40,
                  value: {
                    name: v.name,
                    type: v.type
                  },
                  onChange: ({ name, type }) => ({
                    name: name,
                    type: type
                  })
                },
                {
                  type: "multiPicker",
                  roles: ["admin"],
                  position: 60,
                  picker: {
                    id: "size",
                    label: t("Size"),
                    type: "radioGroup",
                    choices: [
                      {
                        value: "small",
                        icon: "nc-32"
                      },
                      {
                        value: "medium",
                        icon: "nc-48"
                      },
                      {
                        value: "large",
                        icon: "nc-64"
                      },
                      {
                        value: "custom",
                        icon: "nc-more"
                      }
                    ],
                    value: v.size,
                    onChange: size => {
                      const borderRadius = Math.round(
                        (v.borderRadius /
                          Math.round(
                            v[`${v.size}Size`] +
                              v.padding * 2 +
                              v.borderWidth * 2
                          )) *
                          Math.round(
                            v[`${size}Size`] + v.padding * 2 + v.borderWidth * 2
                          )
                      );

                      return {
                        size,

                        customSize:
                          size !== "custom" ? v[`${size}Size`] : v.customSize,

                        borderRadius:
                          size !== "custom" ? borderRadius : v.borderRadius
                      };
                    }
                  },
                  choices: {
                    custom: [
                      {
                        id: "customSize",
                        type: "slider",
                        slider: {
                          min: 14,
                          max: 180
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
                          value: v.customSize
                        },
                        onChange: ({ value: customSize }) => {
                          const borderRadius = Math.round(
                            (v.borderRadius /
                              Math.round(
                                v.customSize + v.padding * 2 + v.borderWidth * 2
                              )) *
                              Math.round(
                                customSize + v.padding * 2 + v.borderWidth * 2
                              )
                          );

                          return {
                            customSize,
                            borderRadius
                          };
                        }
                      }
                    ]
                  }
                }
              ]
            },
            {
              id: "iconBackground",
              label: t("Background"),
              roles: ["admin"],
              options: [
                {
                  id: "fillType",
                  label: t("Fill"),
                  type: "radioGroup",
                  choices: [
                    {
                      value: "filled",
                      icon: "nc-circle"
                    },
                    {
                      value: "outline",
                      icon: "nc-outline"
                    },
                    {
                      value: "default",
                      icon: "nc-close"
                    }
                  ],
                  value: v.fillType,
                  onChange: fillType => {
                    return {
                      fillType,

                      tempFillType:
                        fillType !== "default" ? fillType : v.tempFillType,

                      padding:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempPadding
                          : v.padding,

                      borderRadiusType:
                        fillType === "default"
                          ? ""
                          : fillType !== "default"
                          ? v.tempBorderRadiusType
                          : v.borderRadiusType,

                      borderRadius:
                        fillType === "default"
                          ? 0
                          : fillType !== "default" &&
                            v.tempBorderRadiusType === "square"
                          ? v.tempBorderRadius
                          : fillType !== "default" &&
                            v.tempBorderRadiusType === "rounded"
                          ? maxBorderRadius
                          : v.borderRadius,

                      borderWidth:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempBorderWidth
                          : v.borderWidth,

                      borderColorOpacity:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempBorderColorOpacity
                          : v.borderColorOpacity,

                      borderColorPalette:
                        fillType === "default"
                          ? ""
                          : fillType !== "default"
                          ? v.tempBorderColorPalette
                          : v.borderColorPalette,

                      bgColorOpacity:
                        fillType === "default" || fillType === "outline"
                          ? 0
                          : fillType === "filled"
                          ? v.tempBgColorOpacity
                          : v.bgColorOpacity,

                      bgColorPalette:
                        fillType === "default" || fillType === "outline"
                          ? ""
                          : fillType === "filled"
                          ? v.tempBgColorPalette
                          : v.bgColorPalette,

                      gradientColorOpacity:
                        fillType === "default" || fillType === "outline"
                          ? 0
                          : fillType === "filled"
                          ? v.tempGradientColorOpacity
                          : v.gradientColorOpacity,

                      gradientColorPalette:
                        fillType === "default" || fillType === "outline"
                          ? ""
                          : fillType === "filled"
                          ? v.tempGradientColorPalette
                          : v.gradientColorPalette,

                      // Hover
                      hoverBgColorOpacity:
                        fillType === "default" ? 0 : v.tempHoverBgColorOpacity,

                      hoverBgColorPalette:
                        fillType === "default" || fillType === "outline"
                          ? ""
                          : fillType === "filled"
                          ? v.tempHoverBgColorPalette
                          : v.hoverBgColorPalette,

                      hoverBorderColorOpacity:
                        fillType === "default"
                          ? 0
                          : v.tempHoverBorderColorOpacity,

                      hoverBorderColorPalette:
                        fillType === "default"
                          ? ""
                          : fillType !== "default"
                          ? v.tempHoverBorderColorPalette
                          : v.hoverBorderColorPalette
                    };
                  }
                },
                {
                  type: "multiPicker",
                  picker: {
                    id: "borderRadiusType",
                    label: t("Corner"),
                    type: "radioGroup",
                    choices: [
                      {
                        value: "square",
                        icon: "nc-corners-square"
                      },
                      {
                        value: "rounded",
                        icon: "nc-corners-round"
                      },
                      {
                        value: "custom",
                        icon: "nc-more"
                      }
                    ],
                    value: v.borderRadiusType,
                    onChange: borderRadiusType => {
                      return {
                        borderRadiusType,

                        tempBorderRadiusType:
                          borderRadiusType !== ""
                            ? borderRadiusType
                            : v.tempBorderRadiusType,

                        fillType:
                          borderRadiusType !== "" ? v.tempFillType : v.fillType,

                        borderRadius:
                          borderRadiusType === "square"
                            ? v.tempBorderRadius
                            : borderRadiusType === "rounded"
                            ? maxBorderRadius
                            : v.borderRadius,

                        borderWidth:
                          borderRadiusType !== ""
                            ? v.tempBorderWidth
                            : v.borderWidth,

                        borderColorOpacity:
                          borderRadiusType !== ""
                            ? v.tempBorderColorOpacity
                            : v.borderColorOpacity,

                        borderColorPalette:
                          borderRadiusType !== ""
                            ? v.tempBorderColorPalette
                            : v.borderColorPalette,

                        bgColorOpacity:
                          borderRadiusType !== "" && v.tempFillType === "filled"
                            ? v.tempBgColorOpacity
                            : v.bgColorOpacity,

                        bgColorPalette:
                          borderRadiusType !== "" && v.tempFillType === "filled"
                            ? v.tempBgColorPalette
                            : v.bgColorPalette,

                        padding:
                          borderRadiusType !== "" ? v.tempPadding : v.padding,

                        // Hover
                        hoverBgColorOpacity:
                          borderRadiusType !== ""
                            ? v.tempHoverBgColorOpacity
                            : v.hoverBgColorOpacity,

                        hoverBorderColorOpacity:
                          borderRadiusType !== ""
                            ? v.tempHoverBorderColorOpacity
                            : v.hoverBorderColorOpacity
                      };
                    }
                  },
                  choices: {
                    custom: [
                      {
                        id: "borderRadius",
                        type: "slider",
                        slider: {
                          min: 0,
                          max: maxBorderRadius
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
                          value: v.borderRadius
                        },
                        onChange: ({ value: borderRadius }) => ({
                          borderRadius,
                          tempBorderRadius: borderRadius
                        })
                      }
                    ]
                  }
                },
                {
                  id: "padding",
                  label: t("Size"),
                  type: "slider",
                  slider: {
                    min: 0,
                    max: 180
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
                    value: v.padding
                  },
                  onChange: ({ value: padding }) => {
                    return {
                      padding,
                      tempPadding: padding,
                      borderRadius:
                        v.borderRadiusType === "rounded"
                          ? Math.round(
                              (v.customSize + padding * 2 + v.borderWidth * 2) /
                                2
                            )
                          : v.borderRadius,

                      borderWidth:
                        padding > 0 ? v.tempBorderWidth : v.borderWidth,

                      borderRadiusType:
                        padding > 0
                          ? v.tempBorderRadiusType
                          : v.borderRadiusType,

                      fillType: padding > 0 ? v.tempFillType : v.fillType,

                      borderColorOpacity:
                        padding > 0
                          ? v.tempBorderColorOpacity
                          : v.borderColorOpacity,

                      borderColorPalette:
                        padding > 0
                          ? v.tempBorderColorPalette
                          : v.borderColorPalette,

                      bgColorOpacity:
                        padding > 0 && v.tempFillType === "filled"
                          ? v.tempBgColorOpacity
                          : v.bgColorOpacity,

                      bgColorPalette:
                        padding > 0 && v.tempFillType === "filled"
                          ? v.tempBgColorPalette
                          : v.bgColorPalette
                    };
                  }
                },
                {
                  id: "borderWidth",
                  label: t("Border"),
                  type: "slider",
                  slider: {
                    min: 0,
                    max: 10
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
                    value: v.borderWidth
                  },
                  onChange: ({ value: borderWidth }, { sliderDragEnd }) => {
                    return {
                      borderWidth,
                      tempBorderWidth:
                        borderWidth > 0 && sliderDragEnd
                          ? borderWidth
                          : v.tempBorderWidth,

                      padding:
                        borderWidth === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderWidth > 0
                          ? v.tempPadding
                          : v.padding,

                      borderRadiusType:
                        borderWidth === 0 && v.bgColorOpacity === 0
                          ? ""
                          : borderWidth > 0
                          ? v.tempBorderRadiusType
                          : v.borderRadiusType,

                      fillType:
                        borderWidth === 0 && v.bgColorOpacity === 0
                          ? "default"
                          : borderWidth > 0
                          ? v.tempFillType
                          : v.fillType,

                      borderRadius:
                        borderWidth === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderWidth > 0 &&
                            v.tempBorderRadiusType === "square"
                          ? v.tempBorderRadius
                          : borderWidth > 0 &&
                            v.tempBorderRadiusType === "rounded"
                          ? maxBorderRadius
                          : v.borderRadius,

                      borderColorOpacity:
                        borderWidth === 0
                          ? 0
                          : borderWidth > 0
                          ? v.tempBorderColorOpacity
                          : v.borderColorOpacity,

                      borderColorPalette:
                        borderWidth === 0
                          ? 0
                          : borderWidth > 0
                          ? v.tempBorderColorPalette
                          : v.borderColorPalette,

                      bgColorOpacity:
                        borderWidth > 0 && v.tempFillType === "filled"
                          ? v.tempBgColorOpacity
                          : v.bgColorOpacity,

                      bgColorPalette:
                        borderWidth > 0 && v.tempFillType === "filled"
                          ? v.tempBgColorPalette
                          : v.bgColorPalette,

                      hoverBgColorOpacity:
                        borderWidth === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderWidth > 0 && v.tempFillType === "filled"
                          ? v.tempBgColorOpacity
                          : v.bgColorOpacity
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
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "tabsState",
          tabsPosition: "left",
          type: "tabs",
          value: v.tabsState,
          tabs: [
            {
              id: "tabNormal",
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "tabsColor",
                  className: "",
                  type: "tabs",
                  value: v.tabsColor,
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Icon"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "normal",
                          onChangeHex: ["onChangeColorHexButtonIcon2"],
                          onChangePalette: ["onChangeColorPaletteButtonIcon2"]
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
                                  onChange: ["onChangeColorFieldsButtonIcon2"]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBg",
                      label: t("Bg"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          onChangeType: ["onChangeBgColorType2"],
                          onChangeHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientPalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradient: ["onChangeGradientRange2"]
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
                                  prefix:
                                    defaultValueValue({
                                      v,
                                      key: "gradientActivePointer",
                                      device,
                                      state: "normal"
                                    }) === "startPointer"
                                      ? "bg"
                                      : "gradient",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity2",
                                    "onChangeBgColorHexAndOpacityPalette2",
                                    "onChangeBgColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 52,
                              options: [
                                toolbarGradientType({
                                  v,
                                  device,
                                  state: "normal",
                                  className:
                                    "brz-ed__select--transparent brz-ed__select--align-right",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "normal"
                                    }) === "solid"
                                })
                              ]
                            },
                            {
                              width: 18,
                              options: [
                                toolbarGradientLinearDegree({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "normal"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "normal"
                                    }) === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "normal"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "normal"
                                    }) === "linear"
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
                          onChangeHex: ["onChangeElementIconBorderColorHex2"],
                          onChangePalette: [
                            "onChangeElementIconBorderColorPalette2"
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
                                    "onChangeElementIconBorderColorFields2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "normal",
                          onChangeType: [
                            "onChangeBoxShadowType2",
                            "onChangeBoxShadowTypeDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBoxShadowPalette2",
                            "onChangeBoxShadowPaletteOpacity2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadowFields2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowFields2",
                                    "onChangeBoxShadowFieldsDependencies2"
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
              ]
            },
            {
              id: "tabHover",
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "tabsColor",
                  className: "",
                  type: "tabs",
                  value: v.tabsColor,
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Icon"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "hover",
                          onChangeHex: ["onChangeHoverColorHexButtonIcon2"],
                          onChangePalette: [
                            "onChangeHoverColorPaletteButtonIcon2"
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
                                  state: "hover",
                                  onChange: [
                                    "onChangeHoverColorFieldsButtonIcon2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBg",
                      label: t("Bg"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "hover",
                          onChangeType: ["onChangeBgColorType2"],
                          onChangeHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientPalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradient: ["onChangeGradientRange2"]
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
                                  state: "hover",
                                  prefix:
                                    defaultValueValue({
                                      v,
                                      key: "gradientActivePointer",
                                      device,
                                      state: "hover"
                                    }) === "startPointer"
                                      ? "bg"
                                      : "gradient",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity2",
                                    "onChangeBgColorHexAndOpacityPalette2",
                                    "onChangeBgColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 52,
                              options: [
                                toolbarGradientType({
                                  v,
                                  device,
                                  state: "hover",
                                  className:
                                    "brz-ed__select--transparent brz-ed__select--align-right",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid"
                                })
                              ]
                            },
                            {
                              width: 18,
                              options: [
                                toolbarGradientLinearDegree({
                                  v,
                                  device,
                                  state: "hover",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "hover"
                                    }) === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "hover",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "hover"
                                    }) === "linear"
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
                          state: "hover",
                          showSelect: false,
                          onChangeHex: [
                            "onChangeElementIconBorderHoverColorHex2"
                          ],
                          onChangePalette: [
                            "onChangeElementIconBorderHoverColorPalette2"
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
                                  state: "hover",
                                  onChange: [
                                    "onChangeElementIconBorderHoverColorFields2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "hover",
                          onChangeType: [
                            "onChangeBoxShadowType2",
                            "onChangeBoxShadowTypeDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBoxShadowPalette2",
                            "onChangeBoxShadowPaletteOpacity2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadowFields2({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBoxShadowFields2",
                                    "onChangeBoxShadowFieldsDependencies2"
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
              ]
            }
          ]
        }
      ],
      onChange: (_, { isOpen }) => ({
        tabsState: !isOpen ? "" : v.tabsState,
        tabsColor: !isOpen ? "" : v.tabsColor
      })
    },
    {
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      size: "medium",
      title: t("Link"),
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs",
          value: v.linkType,
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                toolbarLinkExternal({ v }),
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch-dev"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch-dev"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [toolbarLinkAnchor({ v })]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "tabletToolbarCurrentShortcode",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          type: "multiPicker",
          picker: {
            id: "tabletSize",
            label: t("Size"),
            type: "radioGroup",
            choices: [
              {
                value: "small",
                icon: "nc-32"
              },
              {
                value: "medium",
                icon: "nc-48"
              },
              {
                value: "large",
                icon: "nc-64"
              },
              {
                value: "custom",
                icon: "nc-more"
              }
            ],
            value: tabletSyncOnChange(v, "size"),
            onChange: tabletSize => {
              return {
                tabletSize,

                tabletCustomSize:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}Size`]
                    : v.tabletCustomSize
              };
            }
          },
          choices: {
            custom: [
              {
                id: "tabletCustomSize",
                type: "slider",
                slider: {
                  min: 14,
                  max: 180
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
                  value: tabletSyncOnChange(v, "customSize")
                },
                onChange: ({ value: tabletCustomSize }) => ({
                  tabletCustomSize
                })
              }
            ]
          }
        },
        {
          id: "tabletPadding",
          label: t("Bg Size"),
          type: "slider",
          slider: {
            min: 0,
            max: 180
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
          disabled: v.fillType === "default",
          value: {
            value: tabletSyncOnChange(v, "padding")
          },
          onChange: ({ value: tabletPadding }) => ({ tabletPadding })
        }
      ]
    },
    {
      id: "tabletToolbarLink",
      type: "popover",
      icon: "nc-link",
      disabled: v.linkPopup === "",
      position: 80,
      options: []
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      disabled: true
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarCurrentShortcode",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          type: "multiPicker",
          picker: {
            id: "mobileSize",
            label: t("Size"),
            type: "radioGroup",
            choices: [
              {
                value: "small",
                icon: "nc-32"
              },
              {
                value: "medium",
                icon: "nc-48"
              },
              {
                value: "large",
                icon: "nc-64"
              },
              {
                value: "custom",
                icon: "nc-more"
              }
            ],
            value: mobileSyncOnChange(v, "size"),
            onChange: mobileSize => {
              return {
                mobileSize,

                mobileCustomSize:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}Size`]
                    : v.mobileCustomSize
              };
            }
          },
          choices: {
            custom: [
              {
                id: "mobileCustomSize",
                type: "slider",
                slider: {
                  min: 14,
                  max: 180
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
                  value: mobileSyncOnChange(v, "customSize")
                },
                onChange: ({ value: mobileCustomSize }) => ({
                  mobileCustomSize
                })
              }
            ]
          }
        },
        {
          id: "mobilePadding",
          label: t("Bg Size"),
          type: "slider",
          slider: {
            min: 0,
            max: 180
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
          disabled: v.fillType === "default",
          value: {
            value: mobileSyncOnChange(v, "padding")
          },
          onChange: ({ value: mobilePadding }) => ({ mobilePadding })
        }
      ]
    },
    {
      id: "mobileToolbarLink",
      type: "popover",
      icon: "nc-link",
      disabled: v.linkPopup === "",
      position: 80,
      options: []
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      disabled: true
    }
  ];
}
