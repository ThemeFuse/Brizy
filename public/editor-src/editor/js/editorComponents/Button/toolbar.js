import { hexToRgba } from "visual/utils/color";
import { getWeightChoices, getWeight, getFontStyle } from "visual/utils/fonts";
import { getOptionColor, getDynamicContentChoices } from "visual/utils/options";
import {
  onChangeTypography,
  onChangeTypographyTablet,
  onChangeTypographyMobile,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

const linkDynamicContentChoices = getDynamicContentChoices("link");

export function getItemsForDesktop(v) {
  // Typography
  const fontStyle = v.fontStyle;
  const { fontSize, fontFamily, fontWeight, lineHeight, letterSpacing } =
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
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: colorHex } = getOptionColor(v, "color");
  const { hex: borderColorHex } = getOptionColor(v, "borderColor");
  const { hex: hoverBgColorHex } = getOptionColor(v, "hoverBgColor");
  const { hex: hoverColorHex } = getOptionColor(v, "hoverColor");
  const { hex: hoverBorderColorHex } = getOptionColor(v, "hoverBorderColor");
  const { hex: boxShadowColorHex } = getOptionColor(v, "boxShadowColor");

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
          type: "grid",
          columns: [
            {
              width: 54,
              options: [
                {
                  id: "fontFamily",
                  label: t("Font Family"),
                  type: "fontFamily",
                  value: fontFamily,
                  onChange: ({ id }) => {
                    return {
                      ...onChangeTypography(
                        {
                          fontFamily: id,
                          fontWeight: getWeight(fontWeight, id)
                        },
                        v
                      )
                    };
                  }
                }
              ]
            },
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                {
                  id: "fontStyle",
                  type: "fontStyle",
                  label: t("Typography"),
                  className: "brz-ed-popover__font-style",
                  display: "block",
                  value: fontStyle,
                  onChange: newFontStyle => {
                    return {
                      fontStyle: newFontStyle
                    };
                  }
                },
                {
                  type: "grid",
                  columns: [
                    {
                      width: "50",
                      options: [
                        {
                          id: "fontSize",
                          label: t("Size"),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 100,
                          step: 1,
                          value: fontSize,
                          onChange: newFontSize => {
                            return {
                              ...onChangeTypography(
                                { fontSize: newFontSize },
                                v
                              ),

                              borderRadius:
                                v.borderRadiusType === "rounded"
                                  ? maxBorderRadius
                                  : v.borderRadius
                            };
                          }
                        },
                        {
                          id: "lineHeight",
                          label: t("Line Hgt."),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 10,
                          step: 0.1,
                          value: lineHeight,
                          onChange: newLineHeight => {
                            return {
                              ...onChangeTypography(
                                { lineHeight: newLineHeight },
                                v
                              ),

                              borderRadius:
                                v.borderRadiusType === "rounded"
                                  ? maxBorderRadius
                                  : v.borderRadius
                            };
                          }
                        }
                      ]
                    },
                    {
                      width: "50",
                      options: [
                        {
                          id: "fontWeight",
                          label: t("Weight"),
                          type: "select",
                          display: "block",
                          choices: getWeightChoices(fontFamily),
                          value: fontWeight,
                          onChange: newFontWeight => {
                            return {
                              ...onChangeTypography(
                                { fontWeight: newFontWeight },
                                v
                              )
                            };
                          }
                        },
                        {
                          id: "letterSpacing",
                          label: t("Letter Sp."),
                          type: "stepper",
                          display: "block",
                          min: -20,
                          max: 20,
                          step: 0.5,
                          value: letterSpacing,
                          onChange: newLetterSpacing => {
                            return {
                              ...onChangeTypography(
                                { letterSpacing: newLetterSpacing },
                                v
                              )
                            };
                          }
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
          id: "color",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "colorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Background"),
                      options: [
                        {
                          id: "backgroundColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: bgColorHex,
                            opacity: v.bgColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.bgColorHex && v.bgColorOpacity === 0
                                ? v.tempBgColorOpacity
                                : opacity;

                            return {
                              bgColorHex: hex,
                              bgColorOpacity: opacity,
                              bgColorPalette:
                                isChanged === "hex" ? "" : v.bgColorPalette,

                              tempBgColorPalette:
                                isChanged === "hex" ? "" : v.tempBgColorPalette,

                              tempBgColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.tempBgColorOpacity,

                              borderRadiusType:
                                opacity === 0 && v.borderColorOpacity === 0
                                  ? ""
                                  : opacity > 0
                                    ? v.tempBorderRadiusType
                                    : v.borderRadiusType,

                              fillType:
                                opacity === 0 && v.borderColorOpacity === 0
                                  ? "default"
                                  : opacity === 0 && v.borderColorOpacity > 0
                                    ? "outline"
                                    : opacity > 0
                                      ? "filled"
                                      : v.fillType,

                              borderWidth:
                                opacity === 0 && v.borderColorOpacity === 0
                                  ? 0
                                  : v.borderWidth,

                              borderColorHex:
                                v.bgColorPalette !== "" &&
                                v.bgColorPalette === v.borderColorPalette &&
                                v.fillType === "filled"
                                  ? hex
                                  : v.bgColorPalette === "" &&
                                    v.bgColorHex === v.borderColorHex &&
                                    v.fillType === "filled"
                                    ? hex
                                    : v.borderColorHex,

                              borderColorPalette:
                                v.bgColorPalette !== "" &&
                                v.bgColorPalette === v.borderColorPalette &&
                                v.fillType === "filled"
                                  ? ""
                                  : v.borderColorPalette,

                              tempBorderColorPalette:
                                v.bgColorPalette !== "" &&
                                v.bgColorPalette === v.borderColorPalette &&
                                v.fillType === "filled"
                                  ? ""
                                  : v.tempBorderColorPalette,

                              borderColorOpacity:
                                v.bgColorPalette === "" &&
                                v.bgColorHex === v.borderColorHex &&
                                v.bgColorOpacity === v.tempBorderColorOpacity &&
                                v.fillType === "filled"
                                  ? 0
                                  : opacity === 0 && v.borderColorOpacity === 0
                                    ? 0
                                    : v.borderColorOpacity,

                              // Normal + Hover Sync
                              hoverBgColorOpacity:
                                opacity === 0 && v.borderColorOpacity === 0
                                  ? 0
                                  : opacity > 0
                                    ? v.tempHoverBgColorOpacity
                                    : v.hoverBgColorOpacity,

                              hoverBorderColorHex:
                                v.borderColorHex === v.hoverBorderColorHex
                                  ? hex
                                  : v.hoverBorderColorHex,

                              hoverBorderColorOpacity:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? 0
                                  : v.hoverBorderColorOpacity
                            };
                          }
                        },
                        {
                          id: "bgColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.bgColorPalette,
                          onChange: bgColorPalette => ({
                            bgColorPalette,

                            tempBgColorPalette: bgColorPalette,

                            bgColorOpacity:
                              v.bgColorOpacity === 0
                                ? v.tempBgColorOpacity
                                : v.bgColorOpacity,

                            borderRadiusType: v.tempBorderRadiusType,

                            fillType: "filled",

                            borderColorPalette:
                              v.bgColorPalette !== "" &&
                              v.bgColorPalette === v.borderColorPalette &&
                              v.fillType === "filled"
                                ? bgColorPalette
                                : v.bgColorPalette === "" &&
                                  v.bgColorHex === v.borderColorHex &&
                                  v.fillType === "filled"
                                  ? bgColorPalette
                                  : v.borderColorPalette,

                            tempBorderColorPalette:
                              v.bgColorPalette !== "" &&
                              v.bgColorPalette === v.borderColorPalette &&
                              v.fillType === "filled"
                                ? bgColorPalette
                                : v.bgColorPalette === "" &&
                                  v.bgColorHex === v.borderColorHex &&
                                  v.fillType === "filled"
                                  ? bgColorPalette
                                  : v.borderColorPalette,

                            // Normal + Hover Sync
                            hoverBgColorOpacity: v.tempHoverBgColorOpacity
                          })
                        },
                        {
                          id: "bgColorFields",
                          type: "colorFields",
                          position: 30,
                          value: {
                            hex: bgColorHex,
                            opacity: v.bgColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            bgColorPalette:
                              isChanged === "hex" ? "" : v.bgColorPalette,

                            bgColorHex: hex,

                            bgColorOpacity: opacity
                          })
                        }
                      ]
                    },
                    {
                      label: t("Text"),
                      options: [
                        {
                          id: "color",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: colorHex,
                            opacity: v.colorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.colorHex && v.colorOpacity == 0
                                ? v.tempColorOpacity
                                : opacity;

                            return {
                              colorHex: hex,
                              colorOpacity: opacity,
                              colorPalette:
                                isChanged === "hex" ? "" : v.colorPalette,

                              // Temporary Value chnges
                              tempColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.tempColorOpacity,

                              // Normal + Hover Sync
                              hoverColorHex:
                                v.colorHex === v.hoverColorHex
                                  ? hex
                                  : v.hoverColorHex,

                              hoverColorOpacity:
                                v.colorOpacity === v.hoverColorOpacity
                                  ? opacity
                                  : v.hoverColorOpacity
                            };
                          }
                        },
                        {
                          id: "colorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.colorPalette,
                          onChange: colorPalette => ({
                            colorPalette,

                            colorOpacity:
                              v.colorOpacity === 0
                                ? v.tempColorOpacity
                                : v.colorOpacity
                          })
                        },
                        {
                          id: "colorFields",
                          type: "colorFields",
                          position: 30,
                          value: {
                            hex: colorHex,

                            opacity: v.colorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            colorPalette:
                              isChanged === "hex" ? "" : v.colorPalette,
                            colorHex: hex,
                            colorOpacity: opacity
                          })
                        }
                      ]
                    },
                    {
                      label: t("Border"),
                      options: [
                        {
                          id: "borderColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: borderColorHex,
                            opacity: v.borderColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.borderColorHex &&
                              v.borderColorOpacity === 0
                                ? v.tempBorderColorOpacity
                                : opacity;

                            return {
                              borderColorHex: hex,
                              borderColorOpacity: opacity,
                              tempBorderColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.tempBorderColorOpacity,

                              borderColorPalette:
                                isChanged === "hex" ? "" : v.borderColorPalette,

                              tempBorderColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.tempBorderColorPalette,

                              paddingRL:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? 0
                                  : opacity > 0
                                    ? v.tempPaddingRL
                                    : v.paddingRL,

                              paddingRight:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? 0
                                  : opacity > 0
                                    ? v.tempPaddingRight
                                    : v.paddingRight,

                              paddingLeft:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? 0
                                  : opacity > 0
                                    ? v.tempPaddingLeft
                                    : v.paddingRight,

                              paddingTB:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? v.tempPaddingTB
                                  : v.paddingTB,

                              paddingTop:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? v.tempPaddingTop
                                  : v.paddingTop,

                              paddingBottom:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? v.tempPaddingBottom
                                  : v.paddingBottom,

                              fillType:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? "default"
                                  : opacity > 0 && v.bgColorOpacity === 0
                                    ? "outline"
                                    : v.fillType,

                              borderRadiusType:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? ""
                                  : opacity > 0
                                    ? v.tempBorderRadiusType
                                    : v.borderRadiusType,

                              borderWidth:
                                opacity === 0
                                  ? 0
                                  : opacity > 0
                                    ? v.tempBorderWidth
                                    : v.borderWidth,

                              bgColorOpacity:
                                opacity > 0 && v.bgColorOpacity > 0
                                  ? v.tempBgColorOpacity
                                  : v.bgColorOpacity,

                              // Normal + Hover Sync
                              hoverBgColorHex:
                                v.bgColorHex === v.hoverBgColorHex
                                  ? hex
                                  : v.hoverBgColorHex,

                              hoverBgColorOpacity:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? 0
                                  : v.bgColorOpacity === v.hoverBgColorOpacity
                                    ? opacity
                                    : v.hoverBgColorOpacity
                            };
                          }
                        },
                        {
                          id: "borderColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.borderColorPalette,
                          onChange: borderColorPalette => ({
                            borderColorPalette,

                            tempBorderColorPalette: borderColorPalette,

                            borderColorOpacity:
                              v.borderColorOpacity === 0
                                ? v.tempBorderColorOpacity
                                : v.borderColorOpacity,

                            borderRadiusType: v.tempBorderRadiusType,

                            fillType:
                              v.bgColorOpacity === 0
                                ? "outline"
                                : v.bgColorOpacity > 0
                                  ? "filled"
                                  : v.fillType,

                            borderWidth: v.tempBorderWidth

                            // Normal + Hover Sync
                          })
                        },
                        {
                          id: "borderColorFields",
                          type: "colorFields",
                          position: 30,
                          value: {
                            hex: borderColorHex,
                            opacity: v.borderColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            borderColorPalette:
                              isChanged === "hex" ? "" : v.borderColorPalette,

                            borderColorHex: hex,

                            borderColorOpacity: opacity
                          })
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "colorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Background"),
                      options: [
                        {
                          id: "hoverBackgroundColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: hoverBgColorHex,
                            opacity: v.hoverBgColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.hoverBgColorHex &&
                              v.hoverBgColorOpacity === 0
                                ? v.tempHoverBgColorOpacity
                                : opacity;

                            return {
                              hoverBgColorHex: hex,

                              hoverBgColorOpacity: opacity,

                              tempHoverBgColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.tempHoverBgColorOpacity,

                              hoverBgColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.hoverBgColorPalette,

                              tempHoverBgColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.tempHoverBgColorPalette,

                              hoverBorderColorHex:
                                v.hoverBgColorPalette !== "" &&
                                v.hoverBgColorPalette ===
                                  v.hoverBorderColorPalette &&
                                v.fillType === "filled"
                                  ? hex
                                  : v.hoverBgColorPalette === "" &&
                                    v.hoverBgColorHex ===
                                      v.hoverBorderColorHex &&
                                    v.fillType === "filled"
                                    ? hex
                                    : v.hoverBorderColorHex,

                              hoverBorderColorPalette:
                                v.hoverBgColorPalette !== "" &&
                                v.hoverBgColorPalette ===
                                  v.hoverBorderColorPalette &&
                                v.fillType === "filled"
                                  ? ""
                                  : v.hoverBorderColorPalette,

                              tempHoverBorderColorPalette:
                                v.hoverBgColorPalette !== "" &&
                                v.hoverBgColorPalette ===
                                  v.hoverBorderColorPalette &&
                                v.fillType === "filled"
                                  ? ""
                                  : v.tempHoverBorderColorPalette,

                              hoverBorderColorOpacity:
                                v.hoverBgColorPalette === "" &&
                                v.hoverBgColorHex === v.hoverBorderColorHex &&
                                v.hoverBgColorOpacity ===
                                  v.tempHoverBorderColorOpacity &&
                                v.fillType === "filled"
                                  ? 0
                                  : v.hoverBorderColorOpacity
                            };
                          }
                        },
                        {
                          id: "hoverBgColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.hoverBgColorPalette,
                          onChange: hoverBgColorPalette => ({
                            hoverBgColorPalette,

                            hoverBgColorOpacity:
                              v.hoverBgColorOpacity === 0
                                ? v.tempHoverBgColorOpacity
                                : v.hoverBgColorOpacity,

                            hoverBorderColorPalette:
                              v.hoverBgColorPalette !== "" &&
                              v.hoverBgColorPalette ===
                                v.hoverBorderColorPalette &&
                              v.fillType === "filled"
                                ? hoverBgColorPalette
                                : v.hoverBgColorPalette === "" &&
                                  v.hoverBgColorHex === v.hoverBorderColorHex &&
                                  v.fillType === "filled"
                                  ? hoverBgColorPalette
                                  : v.hoverBorderColorPalette,

                            tempHoverBorderColorPalette:
                              v.hoverBgColorPalette !== "" &&
                              v.hoverBgColorPalette ===
                                v.hoverBorderColorPalette &&
                              v.fillType === "filled"
                                ? hoverBgColorPalette
                                : v.hoverBgColorPalette === "" &&
                                  v.hoverBgColorHex === v.hoverBorderColorHex &&
                                  v.fillType === "filled"
                                  ? hoverBgColorPalette
                                  : v.hoverBorderColorPalette
                          })
                        },
                        {
                          id: "hoverBgColorFields",
                          type: "colorFields",
                          position: 30,
                          value: {
                            hex: hoverBgColorHex,
                            opacity: v.hoverBgColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            hoverBgColorPalette:
                              isChanged === "hex" ? "" : v.hoverBgColorPalette,
                            hoverBgColorHex: hex,
                            hoverBgColorOpacity: opacity
                          })
                        }
                      ]
                    },
                    {
                      label: t("Text"),
                      options: [
                        {
                          id: "hoverColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: hoverColorHex,
                            opacity: v.hoverColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            hoverColorHex: hex,
                            hoverColorOpacity:
                              hex !== v.hoverColorHex &&
                              v.hoverColorOpacity == 0
                                ? v.tempHoverColorOpacity
                                : opacity,
                            hoverColorPalette:
                              isChanged === "hex" ? "" : v.hoverColorPalette
                          })
                        },
                        {
                          id: "hoverColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.hoverColorPalette,
                          onChange: value => ({
                            hoverColorPalette: value,

                            hoverColorOpacity:
                              v.hoverColorOpacity === 0
                                ? v.tempHoverColorOpacity
                                : v.hoverColorOpacity
                          })
                        },
                        {
                          id: "hoverColorFields",
                          type: "colorFields",
                          position: 30,
                          value: {
                            hex: hoverColorHex,
                            opacity: v.hoverColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            hoverColorPalette:
                              isChanged === "hex" ? "" : v.hoverColorPalette,
                            hoverColorHex: hex,
                            hoverColorOpacity: opacity
                          })
                        }
                      ]
                    },
                    {
                      label: t("Border"),
                      options: [
                        {
                          id: "hoverBorderColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: hoverBorderColorHex,
                            opacity: v.hoverBorderColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            hoverBorderColorHex: hex,

                            hoverBorderColorOpacity:
                              hex !== v.hoverBorderColorHex &&
                              v.hoverBorderColorOpacity == 0
                                ? v.tempHoverBorderColorOpacity
                                : opacity,

                            hoverBorderColorPalette:
                              isChanged === "hex"
                                ? ""
                                : v.hoverBorderColorPalette
                          })
                        },
                        {
                          id: "hoverBorderColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.hoverBorderColorPalette,
                          onChange: value => ({
                            hoverBorderColorPalette: value,

                            hoverBorderColorOpacity:
                              v.hoverBorderColorOpacity === 0
                                ? v.tempHoverBorderColorOpacity
                                : v.hoverBorderColorOpacity
                          })
                        },
                        {
                          id: "hoverBorderColorFields",
                          type: "colorFields",
                          position: 30,
                          value: {
                            hex: hoverBorderColorHex,
                            opacity: v.hoverBorderColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            hoverBorderColorPalette:
                              isChanged === "hex"
                                ? ""
                                : v.hoverBorderColorPalette,
                            hoverBorderColorHex: hex,
                            hoverBorderColorOpacity: opacity
                          })
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
              id: "anchor",
              label: t("Anchor"),
              options: [
                {
                  id: "linkAnchor",
                  label: t("Anchor"),
                  type: "blockThumbnail",
                  value: v.linkAnchor
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              options: [
                {
                  id: "linkExternal",
                  type: "input",
                  label: t("Link to"),
                  placeholder: "http://",
                  population: {
                    show: linkDynamicContentChoices.length > 0,
                    choices: linkDynamicContentChoices
                  },
                  value: {
                    value: v.linkExternal,
                    population: v.linkPopulation
                  },
                  onChange: ({
                    value: linkExternal,
                    population: linkPopulation,
                    changed
                  }) => {
                    return {
                      linkExternal,
                      linkPopulation,
                      linkExternalType:
                        changed === "value" || linkPopulation === ""
                          ? "linkExternal"
                          : "linkPopulation"
                    };
                  }
                },
                {
                  id: "linkExternalBlank",
                  type: "switch",
                  label: t("Open In New Tab"),
                  value: v.linkExternalBlank
                },
                {
                  id: "linkExternalRel",
                  type: "switch",
                  label: t("Make it Nofollow"),
                  value: v.linkExternalRel
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
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings"),
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
                {
                  type: "multiPicker",
                  position: 80,
                  picker: {
                    id: "boxShadow",
                    label: t("Shadow"),
                    type: "switch",
                    value: v.boxShadow
                  },
                  choices: {
                    on: [
                      {
                        id: "boxShadowColors",
                        type: "popover",
                        size: "auto",
                        label: t("Color"),
                        title: t("Color"),
                        icon: {
                          style: {
                            backgroundColor: hexToRgba(
                              boxShadowColorHex,
                              v.boxShadowColorOpacity
                            )
                          }
                        },
                        options: [
                          {
                            id: "boxShadowColor",
                            type: "colorPicker",
                            value: {
                              hex: boxShadowColorHex,
                              opacity: v.boxShadowColorOpacity
                            },
                            onChange: ({
                              hex,
                              opacity,
                              isChanged,
                              opacityDragEnd
                            }) => {
                              const boxShadowColorOpacity =
                                hex !== v.boxShadowColorHex &&
                                v.boxShadowColorOpacity === 0
                                  ? v.tempBoxShadowColorOpacity
                                  : opacity;

                              return {
                                boxShadowColorHex: hex,
                                boxShadowColorOpacity: boxShadowColorOpacity,
                                boxShadowColorPalette:
                                  isChanged === "hex"
                                    ? ""
                                    : v.boxShadowColorPalette
                              };
                            }
                          },
                          {
                            id: "boxShadowColorPalette",
                            type: "colorPalette",
                            position: 20,
                            value: v.boxShadowColorPalette,
                            onChange: boxShadowColorPalette => ({
                              boxShadowColorPalette,
                              boxShadowColorHex: "",
                              boxShadowColorOpacity:
                                v.boxShadowColorOpacity === 0
                                  ? v.tempBoxShadowColorOpacity
                                  : v.boxShadowColorOpacity
                            })
                          },
                          {
                            id: "boxShadowColorFields",
                            type: "colorFields",
                            position: 30,
                            value: {
                              hex: boxShadowColorHex,
                              opacity: v.boxShadowColorOpacity
                            },
                            onChange: ({ hex, opacity, isChanged }) => {
                              const boxShadowColorOpacity =
                                hex !== v.boxShadowColorHex &&
                                v.boxShadowColorOpacity === 0
                                  ? v.tempBoxShadowColorOpacity
                                  : opacity;

                              return {
                                boxShadowColorPalette:
                                  isChanged === "hex"
                                    ? ""
                                    : v.boxShadowColorPalette,
                                boxShadowColorHex: hex,
                                boxShadowColorOpacity: boxShadowColorOpacity
                              };
                            }
                          }
                        ]
                      },
                      {
                        id: "boxShadowBlur",
                        type: "slider",
                        icon: "nc-blur",
                        slider: {
                          min: 0
                        },
                        input: {
                          show: true,
                          min: 0
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
                          value: v.boxShadowBlur
                        },
                        onChange: ({ value: boxShadowBlur }) => ({
                          boxShadowBlur,
                          boxShadowColorOpacity:
                            v.boxShadowColorOpacity === 0
                              ? v.tempBoxShadowColorOpacity
                              : v.boxShadowColorOpacity
                        })
                      },
                      {
                        id: "boxShadowSpread",
                        type: "slider",
                        icon: "nc-size",
                        slider: {
                          min: -100,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: 0
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
                          value: v.boxShadowSpread
                        },
                        onChange: ({ value: boxShadowSpread }) => ({
                          boxShadowSpread,
                          boxShadowColorOpacity:
                            v.boxShadowColorOpacity === 0
                              ? v.tempBoxShadowColorOpacity
                              : v.boxShadowColorOpacity
                        })
                      },
                      {
                        id: "boxShadowVertical",
                        type: "slider",
                        icon: "nc-vertical",
                        slider: {
                          min: -100,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: -100,
                          max: 100
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
                          value: v.boxShadowVertical
                        },
                        onChange: ({ value: boxShadowVertical }) => ({
                          boxShadowVertical,
                          boxShadowColorOpacity:
                            v.boxShadowColorOpacity === 0
                              ? v.tempBoxShadowColorOpacity
                              : v.boxShadowColorOpacity
                        })
                      },
                      {
                        id: "boxShadowHorizontal",
                        type: "slider",
                        icon: "nc-horizontal",
                        slider: {
                          min: -100,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: -100,
                          max: 100
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
                          value: v.boxShadowHorizontal
                        },
                        onChange: ({ value: boxShadowHorizontal }) => ({
                          boxShadowHorizontal,
                          boxShadowColorOpacity:
                            v.boxShadowColorOpacity === 0
                              ? v.tempBoxShadowColorOpacity
                              : v.boxShadowColorOpacity
                        })
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  // Typography
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const tabletFontStyle = v.tabletFontStyle;
  const {
    tabletFontSize,
    tabletFontWeight,
    tabletLineHeight,
    tabletLetterSpacing
  } =
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
          type: "grid",
          columns: [
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "tabletFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: tabletFontSize,
                  onChange: newTabletFontSize =>
                    onChangeTypographyTablet(
                      { tabletFontSize: newTabletFontSize },
                      v
                    )
                },
                {
                  id: "tabletLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: tabletLineHeight,
                  onChange: newTabletLineHeight =>
                    onChangeTypographyTablet(
                      { tabletLineHeight: newTabletLineHeight },
                      v
                    )
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "tabletFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices(fontFamily),
                  value: tabletFontWeight,
                  onChange: newTabletFontWeight =>
                    onChangeTypographyTablet(
                      { tabletFontWeight: newTabletFontWeight },
                      v
                    )
                },
                {
                  id: "tabletLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: tabletLetterSpacing,
                  onChange: newTabletLetterSpacing =>
                    onChangeTypographyTablet(
                      { tabletLetterSpacing: newTabletLetterSpacing },
                      v
                    )
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  // Typography
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const mobileFontStyle = v.mobileFontStyle;
  const {
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing
  } = mobileFontStyle === "" ? v : getFontStyle(mobileFontStyle);

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
          type: "grid",
          columns: [
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "mobileFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: mobileFontSize,
                  onChange: newMobileFontSize =>
                    onChangeTypographyMobile(
                      { mobileFontSize: newMobileFontSize },
                      v
                    )
                },
                {
                  id: "mobileLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: mobileLineHeight,
                  onChange: newMobileLineHeight =>
                    onChangeTypographyMobile(
                      { mobileLineHeight: newMobileLineHeight },
                      v
                    )
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "mobileFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices(fontFamily),
                  value: mobileFontWeight,
                  onChange: newMobileFontWeight =>
                    onChangeTypographyMobile(
                      { mobileFontWeight: newMobileFontWeight },
                      v
                    )
                },
                {
                  id: "mobileLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: mobileLetterSpacing,
                  onChange: newMobileLetterSpacing =>
                    onChangeTypographyMobile(
                      { mobileLetterSpacing: newMobileLetterSpacing },
                      v
                    )
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
