import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getFontStyle } from "visual/utils/fonts";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarGradientType,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarBorder2,
  toolbarBorderColorHexField2
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";
  // Typography
  const fontStyle = v.fontStyle;
  const { fontSize, lineHeight } =
    fontStyle === "" ? v : getFontStyle(fontStyle);

  // Border Radius
  let contentHeight =
    fontSize * lineHeight >= v.iconCustomSize
      ? fontSize * lineHeight
      : v.iconCustomSize;

  let maxBorderRadius = Math.round(
    (contentHeight + v.paddingTop * 2 + v.tempBorderWidth * 2) / 2
  );

  // Colors

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device }),
    defaultValueValue({ v, key: "colorPalette", device })
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-button",
      title: t("Button"),
      position: 60,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Button"),
              roles: ["admin"],
              options: [
                {
                  type: "multiPicker",
                  position: 10,
                  picker: {
                    id: "size",
                    label: t("Size"),
                    type: "radioGroup",
                    choices: [
                      {
                        value: "small",
                        icon: "nc-small"
                      },
                      {
                        value: "medium",
                        icon: "nc-medium"
                      },
                      {
                        value: "large",
                        icon: "nc-large"
                      },
                      {
                        value: "custom",
                        icon: "nc-more"
                      }
                    ],
                    value: v.size,
                    onChange: size => {
                      return {
                        size,

                        fontSize:
                          size !== "custom" ? v[`${size}FontSize`] : fontSize,

                        paddingTB:
                          size !== "custom"
                            ? v[`${size}PaddingY`]
                            : v.paddingTB,

                        paddingTop:
                          size !== "custom"
                            ? v[`${size}PaddingY`]
                            : v.paddingTop,

                        paddingBottom:
                          size !== "custom"
                            ? v[`${size}PaddingY`]
                            : v.paddingBottom,

                        tempPaddingTB:
                          size !== "custom"
                            ? v[`${size}PaddingY`]
                            : v.paddingTB,

                        tempPaddingTop:
                          size !== "custom"
                            ? v[`${size}PaddingY`]
                            : v.paddingTop,

                        tempPaddingBottom:
                          size !== "custom"
                            ? v[`${size}PaddingY`]
                            : v.paddingBottom,

                        paddingRL:
                          size !== "custom" && v.fillType === "default"
                            ? 0
                            : size !== "custom" && v.fillType !== "default"
                            ? v[`${size}PaddingX`]
                            : v.paddingRL,

                        paddingRight:
                          size !== "custom" && v.fillType === "default"
                            ? 0
                            : size !== "custom" && v.fillType !== "default"
                            ? v[`${size}PaddingX`]
                            : v.paddingRight,

                        paddingLeft:
                          size !== "custom" && v.fillType === "default"
                            ? 0
                            : size !== "custom" && v.fillType !== "default"
                            ? v[`${size}PaddingX`]
                            : v.paddingLeft,

                        tempPaddingRL:
                          size !== "custom" && v.fillType !== "default"
                            ? v[`${size}PaddingX`]
                            : v.tempPaddingRL,

                        tempPaddingRight:
                          size !== "custom" && v.fillType !== "default"
                            ? v[`${size}PaddingX`]
                            : v.tempPaddingRight,

                        tempPaddingLeft:
                          size !== "custom" && v.fillType !== "default"
                            ? v[`${size}PaddingX`]
                            : v.tempPaddingLeft,

                        borderRadius:
                          v.borderRadiusType === "rounded" &&
                          size !== "custom" &&
                          v[`${size}FontSize`] * lineHeight >= v.iconCustomSize
                            ? Math.round(
                                (v[`${size}FontSize`] * lineHeight +
                                  v[`${size}PaddingY`] * 2 +
                                  v.borderWidth * 2) /
                                  2
                              )
                            : v.borderRadiusType === "rounded" &&
                              size !== "custom" &&
                              v[`${size}FontSize`] * lineHeight <
                                v.iconCustomSize
                            ? Math.round(
                                (v.iconCustomSize +
                                  v[`${size}PaddingY`] * 2 +
                                  v.borderWidth * 2) /
                                  2
                              )
                            : v.borderRadius,

                        borderWidth:
                          size !== "custom" && v.fillType === "default"
                            ? 0
                            : size !== "custom" && v.fillType !== "default"
                            ? v.tempBorderWidth
                            : v.borderWidth
                      };
                    }
                  },
                  choices: {
                    custom: [
                      {
                        id: "paddingRL",
                        label: t("Width"),
                        type: "slider",
                        disabled: v.type === "submit",
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
                          value: v.paddingRL
                        },
                        onChange: ({ value: paddingRL }) => {
                          return {
                            paddingRL,
                            paddingRight: paddingRL,
                            paddingLeft: paddingRL,
                            tempPaddingRL: paddingRL,
                            tempPaddingRight: paddingRL,
                            tempPaddingLeft: paddingRL
                          };
                        }
                      },
                      {
                        id: "paddingTB",
                        label: t("Height"),
                        type: "slider",
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
                          value: v.paddingTB
                        },
                        onChange: ({ value: paddingTB }) => {
                          return {
                            paddingTB,
                            paddingTop: paddingTB,
                            paddingBottom: paddingTB,
                            tempPaddingTB: paddingTB,
                            tempPaddingTop: paddingTB,
                            tempPaddingBottom: paddingTB,

                            borderRadius:
                              v.borderRadiusType === "rounded" &&
                              fontSize * lineHeight >= v.iconCustomSize
                                ? Math.round(
                                    (fontSize * lineHeight +
                                      paddingTB * 2 +
                                      v.borderWidth * 2) /
                                      2
                                  )
                                : v.borderRadiusType === "rounded" &&
                                  fontSize * lineHeight < v.iconCustomSize
                                ? Math.round(
                                    (v.iconCustomSize +
                                      paddingTB * 2 +
                                      v.borderWidth * 2) /
                                      2
                                  )
                                : v.borderRadius
                          };
                        }
                      }
                    ]
                  }
                },
                {
                  id: "fillType",
                  label: t("Fill"),
                  type: "radioGroup",
                  position: 20,
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

                      paddingRL:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempPaddingRL
                          : v.paddingRL,

                      paddingRight:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempPaddingRight
                          : v.paddingRight,

                      paddingLeft:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempPaddingLeft
                          : v.paddingRight,

                      paddingTB:
                        fillType !== "default" ? v.tempPaddingTB : v.paddingTB,

                      paddingTop:
                        fillType !== "default"
                          ? v.tempPaddingTop
                          : v.paddingTop,

                      paddingBottom:
                        fillType !== "default"
                          ? v.tempPaddingBottom
                          : v.paddingBottom,

                      borderRadiusType:
                        fillType === "default"
                          ? ""
                          : fillType !== "default"
                          ? v.tempBorderRadiusType
                          : v.borderRadiusType,

                      borderRadius:
                        fillType !== "default" &&
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
                          : fillType === "filled" &&
                            v.bgColorHex === v.borderColorHex
                          ? 0
                          : fillType === "outline"
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
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempHoverBgColorOpacity
                          : v.hoverBgColorOpacity,

                      hoverBorderColorOpacity:
                        fillType === "default"
                          ? 0
                          : fillType !== "default" &&
                            v.hoverBgColorHex === v.hoverBorderColorHex
                          ? 0
                          : //: fillType !== "default" && v.hoverBgColorPalette === v.hoverBorderColorPalette
                            //  ? 0
                            v.hoverBorderColorOpacity
                    };
                  }
                },
                {
                  type: "multiPicker",
                  position: 30,
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

                        paddingRight:
                          borderRadiusType !== ""
                            ? v.tempPaddingRight
                            : v.paddingRight,

                        paddingLeft:
                          borderRadiusType !== ""
                            ? v.tempPaddingLeft
                            : v.paddingRight,

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
                          borderRadiusType !== "" && v.fillType === "filled"
                            ? v.tempBgColorOpacity
                            : v.bgColorOpacity,

                        bgColorPalette:
                          borderRadiusType !== ""
                            ? v.tempBgColorPalette
                            : v.bgColorPalette,

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
                  position: 40,
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

                      paddingRight:
                        borderWidth > 0 ? v.tempPaddingRight : v.paddingRight,

                      paddingLeft:
                        borderWidth > 0 ? v.tempPaddingLeft : v.paddingRight,

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
                          ? v.tempHoverBgColorOpacity
                          : v.hoverBgColorOpacity
                    };
                  }
                }
              ]
            },
            {
              label: t("Icon"),
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  canDelete: true,
                  value: {
                    name: v.iconName,
                    type: v.iconType
                  },
                  onChange: ({ name, type }) => ({
                    iconName: name,
                    iconType: type
                  })
                },
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
      id: "toolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "large",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev"
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
          backgroundColor:
            v.bgColorOpacity > 0
              ? hexToRgba(bgColorHex, v.bgColorOpacity)
              : hexToRgba(colorHex, v.colorOpacity)
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
                      id: "tabBg",
                      label: t("Bg"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          onChangeType: ["onChangeBgColorType2"],
                          onChangeHex: ["onChangeBgColorHexButton2"],
                          onChangePalette: ["onChangeBgColorPaletteButton2"],
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
                                  onChange: ["onChangeBgColorFieldsButton2"]
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
                      id: "tabText",
                      label: t("Text"),
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
                      id: "tabBorder",
                      label: t("Border"),
                      options: [
                        toolbarBorder2({
                          v,
                          device,
                          state: "normal",
                          showSelect: false,
                          onChangeHex: ["onChangeElementButtonBorderColorHex2"],
                          onChangePalette: [
                            "onChangeElementButtonBorderColorPalette2"
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
                                    "onChangeElementButtonBorderColorFields2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBoxShadow",
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
                      id: "tabBg",
                      label: t("Bg"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "hover",
                          onChangeType: ["onChangeBgColorType2"],
                          onChangeHex: ["onChangeHoverBgColorHexButton2"],
                          onChangePalette: [
                            "onChangeHoverBgColorPaletteButton2"
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
                                    "onChangeHoverBgColorFieldsButton2"
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
                      id: "tabText",
                      label: t("Text"),
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
                      id: "tabBorder",
                      label: t("Border"),
                      options: [
                        toolbarBorder2({
                          v,
                          device,
                          state: "hover",
                          showSelect: false,
                          onChangeHex: [
                            "onChangeElementButtonBorderHoverColorHex2"
                          ],
                          onChangePalette: [
                            "onChangeElementButtonBorderHoverColorPalette2"
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
                                    "onChangeElementButtonBorderHoverColorFields2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBoxShadow",
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
      disabled: v.type === "submit",
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
      disabled: v.type === "submit",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}

export function getItemsForTablet(v) {
  // Typography

  const tabletFontStyle = v.tabletFontStyle;
  const { tabletFontSize, tabletLineHeight } =
    tabletFontStyle === "" ? v : getFontStyle(tabletFontStyle);

  return [
    {
      id: "tabletToolbarCurrentShortcode",
      type: "popover",
      icon: "nc-button",
      title: t("Button"),
      roles: ["admin"],
      position: 60,
      options: [
        {
          type: "multiPicker",
          picker: {
            id: "size",
            label: t("Size"),
            type: "radioGroup",
            choices: [
              {
                value: "small",
                icon: "nc-small"
              },
              {
                value: "medium",
                icon: "nc-medium"
              },
              {
                value: "large",
                icon: "nc-large"
              },
              {
                value: "custom",
                icon: "nc-more"
              }
            ],
            value: v.tabletSize,
            onChange: tabletSize => {
              return {
                tabletSize,

                tabletFontSize:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}FontSize`]
                    : v.tabletFontSize,

                tabletPaddingTB:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}PaddingY`]
                    : v.tabletPaddingTB,

                tabletPaddingTop:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}PaddingY`]
                    : v.tabletPaddingTop,

                tabletPaddingBottom:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}PaddingY`]
                    : v.tabletPaddingBottom,

                tempTabletPaddingTB:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}PaddingY`]
                    : v.tempTabletPaddingTB,

                tempTabletPaddingTop:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}PaddingY`]
                    : v.tempTabletPaddingTop,

                tempTabletPaddingBottom:
                  tabletSize !== "custom"
                    ? v[`${tabletSize}PaddingY`]
                    : v.tempTabletPaddingBottom,

                tabletPaddingRL:
                  tabletSize !== "custom" && v.fillType === "default"
                    ? 0
                    : tabletSize !== "custom" && v.fillType !== "default"
                    ? v[`${tabletSize}PaddingX`]
                    : v.tabletPaddingRL,

                tabletPaddingRight:
                  tabletSize !== "custom" && v.fillType === "default"
                    ? 0
                    : tabletSize !== "custom" && v.fillType !== "default"
                    ? v[`${tabletSize}PaddingX`]
                    : v.tabletPaddingRight,

                tabletPaddingLeft:
                  tabletSize !== "custom" && v.fillType === "default"
                    ? 0
                    : tabletSize !== "custom" && v.fillType !== "default"
                    ? v[`${tabletSize}PaddingX`]
                    : v.tabletPaddingLeft,

                tempTabletPaddingRL:
                  tabletSize !== "custom" && v.fillType !== "default"
                    ? v[`${tabletSize}PaddingX`]
                    : v.tempTabletPaddingRL,

                tempTabletPaddingRight:
                  tabletSize !== "custom" && v.fillType !== "default"
                    ? v[`${tabletSize}PaddingX`]
                    : v.tempTabletPaddingRight,

                tempTabletPaddingLeft:
                  tabletSize !== "custom" && v.fillType !== "default"
                    ? v[`${tabletSize}PaddingX`]
                    : v.tempTabletPaddingLeft,

                tabletBorderRadius:
                  v.borderRadiusType === "rounded" &&
                  tabletSize !== "custom" &&
                  v[`${tabletSize}FontSize`] * v.tabletLineHeight >=
                    v.iconCustomSize
                    ? Math.round(
                        (v[`${tabletSize}FontSize`] * v.tabletLineHeight +
                          v[`${tabletSize}PaddingY`] * 2 +
                          v.borderWidth * 2) /
                          2
                      )
                    : v.borderRadiusType === "rounded" &&
                      tabletSize !== "custom" &&
                      v[`${tabletSize}FontSize`] * v.tabletLineHeight <
                        v.iconCustomSize
                    ? Math.round(
                        (v.iconCustomSize +
                          v[`${tabletSize}PaddingY`] * 2 +
                          v.borderWidth * 2) /
                          2
                      )
                    : tabletSyncOnChange(v, "borderRadius")
              };
            }
          },
          choices: {
            custom: [
              {
                id: "tabletPaddingRL",
                label: t("Width"),
                type: "slider",
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
                  value: v.tabletPaddingRL
                },
                onChange: ({ value: tabletPaddingRL }) => {
                  return {
                    tabletPaddingRL,
                    tabletPaddingRight: tabletPaddingRL,
                    tabletPaddingLeft: tabletPaddingRL,
                    tempTabletPaddingRight: tabletPaddingRL,
                    tempTabletPaddingLeft: tabletPaddingRL
                  };
                }
              },
              {
                id: "tabletPaddingTB",
                label: t("Height"),
                type: "slider",
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
                  value: v.tabletPaddingTB
                },
                onChange: ({ value: tabletPaddingTB }) => {
                  return {
                    tabletPaddingTB,
                    tabletPaddingTop: tabletPaddingTB,
                    tabletPaddingBottom: tabletPaddingTB,
                    tempTabletPaddingTop: tabletPaddingTB,
                    tempTabletPaddingBottom: tabletPaddingTB,

                    tabletBorderRadius:
                      v.borderRadiusType === "rounded" &&
                      tabletFontSize * tabletLineHeight >= v.iconCustomSize
                        ? Math.round(
                            (tabletFontSize * tabletLineHeight +
                              tabletPaddingTB * 2 +
                              v.borderWidth * 2) /
                              2
                          )
                        : v.borderRadiusType === "rounded" &&
                          tabletFontSize * tabletLineHeight < v.iconCustomSize
                        ? Math.round(
                            (v.iconCustomSize +
                              tabletPaddingTB * 2 +
                              v.borderWidth * 2) /
                              2
                          )
                        : tabletSyncOnChange(v, "borderRadius")
                  };
                }
              }
            ]
          }
        }
      ]
    },
    {
      id: "tabletToolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: false
          }
        }
      ]
    },
    {
      id: "tabletToolbarLink",
      type: "popover",
      icon: "nc-link",
      position: 90,
      options: []
    }
  ];
}

export function getItemsForMobile(v) {
  // Typography

  const mobileFontStyle = v.mobileFontStyle;
  const { mobileFontSize, mobileLineHeight } =
    mobileFontStyle === "" ? v : getFontStyle(mobileFontStyle);

  return [
    {
      id: "mobileToolbarCurrentShortcode",
      type: "popover",
      icon: "nc-button",
      title: t("Button"),
      roles: ["admin"],
      position: 60,
      options: [
        {
          type: "multiPicker",
          picker: {
            id: "size",
            label: t("Size"),
            type: "radioGroup",
            choices: [
              {
                value: "small",
                icon: "nc-small"
              },
              {
                value: "medium",
                icon: "nc-medium"
              },
              {
                value: "large",
                icon: "nc-large"
              },
              {
                value: "custom",
                icon: "nc-more"
              }
            ],
            value: v.mobileSize,
            onChange: mobileSize => {
              return {
                mobileSize,

                mobileFontSize:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}FontSize`]
                    : v.mobileFontSize,

                mobilePaddingTB:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}PaddingY`]
                    : v.mobilePaddingTB,

                mobilePaddingTop:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}PaddingY`]
                    : v.mobilePaddingTop,

                mobilePaddingBottom:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}PaddingY`]
                    : v.mobilePaddingBottom,

                tempMobilePaddingTB:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}PaddingY`]
                    : v.tempMobilePaddingTB,

                tempMobilePaddingTop:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}PaddingY`]
                    : v.tempMobilePaddingTop,

                tempMobilePaddingBottom:
                  mobileSize !== "custom"
                    ? v[`${mobileSize}PaddingY`]
                    : v.tempMobilePaddingBottom,

                mobilePaddingRL:
                  mobileSize !== "custom" && v.fillType === "default"
                    ? 0
                    : mobileSize !== "custom" && v.fillType !== "default"
                    ? v[`${mobileSize}PaddingX`]
                    : v.mobilePaddingRL,

                mobilePaddingRight:
                  mobileSize !== "custom" && v.fillType === "default"
                    ? 0
                    : mobileSize !== "custom" && v.fillType !== "default"
                    ? v[`${mobileSize}PaddingX`]
                    : v.mobilePaddingRight,

                mobilePaddingLeft:
                  mobileSize !== "custom" && v.fillType === "default"
                    ? 0
                    : mobileSize !== "custom" && v.fillType !== "default"
                    ? v[`${mobileSize}PaddingX`]
                    : v.mobilePaddingLeft,

                tempMobilePaddingRL:
                  mobileSize !== "custom" && v.fillType !== "default"
                    ? v[`${mobileSize}PaddingX`]
                    : v.tempMobilePaddingRL,

                tempMobilePaddingRight:
                  mobileSize !== "custom" && v.fillType !== "default"
                    ? v[`${mobileSize}PaddingX`]
                    : v.tempMobilePaddingRight,

                tempMobilePaddingLeft:
                  mobileSize !== "custom" && v.fillType !== "default"
                    ? v[`${mobileSize}PaddingX`]
                    : v.tempMobilePaddingLeft,

                mobileBorderRadius:
                  v.borderRadiusType === "rounded" &&
                  mobileSize !== "custom" &&
                  v[`${mobileSize}FontSize`] * v.mobileLineHeight >=
                    v.iconCustomSize
                    ? Math.round(
                        (v[`${mobileSize}FontSize`] * v.mobileLineHeight +
                          v[`${mobileSize}PaddingY`] * 2 +
                          v.borderWidth * 2) /
                          2
                      )
                    : v.borderRadiusType === "rounded" &&
                      mobileSize !== "custom" &&
                      v[`${mobileSize}FontSize`] * v.mobileLineHeight <
                        v.iconCustomSize
                    ? Math.round(
                        (v.iconCustomSize +
                          v[`${mobileSize}PaddingY`] * 2 +
                          v.borderWidth * 2) /
                          2
                      )
                    : mobileSyncOnChange(v, "borderRadius")
              };
            }
          },
          choices: {
            custom: [
              {
                id: "mobilePaddingRL",
                label: t("Width"),
                type: "slider",
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
                  value: v.mobilePaddingRL
                },
                onChange: ({ value: mobilePaddingRL }) => {
                  return {
                    mobilePaddingRL,
                    mobilePaddingRight: mobilePaddingRL,
                    mobilePaddingLeft: mobilePaddingRL,
                    tempMobilePaddingRight: mobilePaddingRL,
                    tempMobilePaddingLeft: mobilePaddingRL
                  };
                }
              },
              {
                id: "mobilePaddingTB",
                label: t("Height"),
                type: "slider",
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
                  value: v.mobilePaddingTB
                },
                onChange: ({ value: mobilePaddingTB }) => {
                  return {
                    mobilePaddingTB,
                    mobilePaddingTop: mobilePaddingTB,
                    mobilePaddingBottom: mobilePaddingTB,
                    tempMobilePaddingTop: mobilePaddingTB,
                    tempMobilePaddingBottom: mobilePaddingTB,

                    mobileBorderRadius:
                      v.borderRadiusType === "rounded" &&
                      mobileFontSize * mobileLineHeight >= v.iconCustomSize
                        ? Math.round(
                            (mobileFontSize * mobileLineHeight +
                              mobilePaddingTB * 2 +
                              v.borderWidth * 2) /
                              2
                          )
                        : v.borderRadiusType === "rounded" &&
                          mobileFontSize * mobileLineHeight < v.iconCustomSize
                        ? Math.round(
                            (v.iconCustomSize +
                              mobilePaddingTB * 2 +
                              v.borderWidth * 2) /
                              2
                          )
                        : mobileSyncOnChange(v, "borderRadius")
                  };
                }
              }
            ]
          }
        }
      ]
    },
    {
      id: "mobileToolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: false
          }
        }
      ]
    },
    {
      id: "mobileToolbarLink",
      type: "popover",
      icon: "nc-link",
      position: 80,
      options: []
    }
  ];
}
