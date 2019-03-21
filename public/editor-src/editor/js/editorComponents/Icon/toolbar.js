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
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadowBlur,
  toolbarBoxShadowSpread,
  toolbarBoxShadowVertical,
  toolbarBoxShadowHorizontal,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarBgType,
  toolbarGradientRange,
  toolbarGradientType,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarCustomCSS
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
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );
  const { hex: hoverColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "hoverColorHex", device }),
    defaultValueValue({ v, key: "hoverColorPalette", device })
  );
  const { hex: hoverBorderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "hoverBorderColorHex", device }),
    defaultValueValue({ v, key: "hoverBorderColorPalette", device })
  );
  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
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
                      label: t("Icon"),
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
                              hex !== v.colorHex && v.colorOpacity === 0
                                ? v.tempColorOpacity
                                : opacity;

                            return {
                              colorHex: hex,

                              colorOpacity: opacity,

                              colorPalette:
                                isChanged === "hex" ? "" : v.colorPalette,

                              // Temporary Value changes
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
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
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
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Background"),
                      options: [
                        {
                          type: "grid",
                          className: "brz-ed-grid__gradient",
                          columns: [
                            {
                              width: 43,
                              options: [
                                toolbarBgType({ v, device, state: "normal" })
                              ]
                            },
                            {
                              width: 57,
                              options: [
                                toolbarGradientRange({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled: v.bgColorType === "solid"
                                })
                              ]
                            }
                          ]
                        },
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          prefix: "bg",
                          disabled:
                            v.bgColorType === "gradient" &&
                            v.gradientActivePointer === "finishPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "normal",
                          prefix: "bg",
                          disabled:
                            v.bgColorType === "gradient" &&
                            v.gradientActivePointer === "finishPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          prefix: "gradient",
                          disabled:
                            v.bgColorType === "solid" ||
                            v.gradientActivePointer === "startPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "normal",
                          prefix: "gradient",
                          disabled:
                            v.bgColorType === "solid" ||
                            v.gradientActivePointer === "startPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "bg",
                                  disabled:
                                    v.bgColorType === "gradient" &&
                                    v.gradientActivePointer === "finishPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityDependencies"
                                  ]
                                }),
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "gradient",
                                  disabled:
                                    v.bgColorType === "solid" ||
                                    v.gradientActivePointer === "startPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityDependencies"
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
                                  disabled: v.bgColorType === "solid"
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
                                    v.bgColorType === "solid" ||
                                    v.gradientType === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled:
                                    v.bgColorType === "solid" ||
                                    v.gradientType === "linear"
                                })
                              ]
                            }
                          ]
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

                              borderColorPalette:
                                isChanged === "hex" ? "" : v.borderColorPalette,

                              tempBorderColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.tempBorderColorOpacity,

                              padding:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? 0
                                  : opacity > 0
                                  ? v.tempPadding
                                  : v.padding,

                              borderRadiusType:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? ""
                                  : opacity > 0
                                  ? v.tempBorderRadiusType
                                  : v.borderRadiusType,

                              fillType:
                                opacity === 0 && v.bgColorOpacity === 0
                                  ? "default"
                                  : opacity > 0 && v.bgColorOpacity === 0
                                  ? "outline"
                                  : v.fillType,

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

                            padding: v.tempPadding,

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
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
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
                                      isChanged === "hex"
                                        ? ""
                                        : v.borderColorPalette,

                                    borderColorHex: hex,

                                    borderColorOpacity: opacity
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
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "colorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Icon"),
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
                              v.hoverColorOpacity === 0
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
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
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
                                      isChanged === "hex"
                                        ? ""
                                        : v.hoverColorPalette,
                                    hoverColorHex: hex,
                                    hoverColorOpacity: opacity
                                  })
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Background"),
                      options: [
                        {
                          type: "grid",
                          className: "brz-ed-grid__gradient",
                          columns: [
                            {
                              width: 43,
                              options: [
                                toolbarBgType({ v, device, state: "hover" })
                              ]
                            },
                            {
                              width: 57,
                              options: [
                                toolbarGradientRange({
                                  v,
                                  device,
                                  state: "hover",
                                  disabled: v.hoverBgColorType === "solid"
                                })
                              ]
                            }
                          ]
                        },
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          prefix: "bg",
                          disabled:
                            v.hoverBgColorType === "gradient" &&
                            v.hoverGradientActivePointer === "finishPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "hover",
                          prefix: "bg",
                          disabled:
                            v.hoverBgColorType === "gradient" &&
                            v.hoverGradientActivePointer === "finishPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          prefix: "gradient",
                          disabled:
                            v.hoverBgColorType === "solid" ||
                            v.hoverGradientActivePointer === "startPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "hover",
                          prefix: "gradient",
                          disabled:
                            v.hoverBgColorType === "solid" ||
                            v.hoverGradientActivePointer === "startPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  prefix: "bg",
                                  disabled:
                                    v.hoverBgColorType === "gradient" &&
                                    v.hoverGradientActivePointer ===
                                      "finishPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityDependencies"
                                  ]
                                }),
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  prefix: "gradient",
                                  disabled:
                                    v.hoverBgColorType === "solid" ||
                                    v.hoverGradientActivePointer ===
                                      "startPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityDependencies"
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
                                  disabled: v.hoverBgColorType === "solid"
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
                                    v.hoverBgColorType === "solid" ||
                                    v.hoverGradientType === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "hover",
                                  disabled:
                                    v.hoverBgColorType === "solid" ||
                                    v.hoverGradientType === "linear"
                                })
                              ]
                            }
                          ]
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
                              v.hoverBorderColorOpacity === 0
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
                          onChange: hoverBorderColorPalette => ({
                            hoverBorderColorPalette,

                            hoverBorderColorOpacity:
                              v.hoverBorderColorOpacity === 0
                                ? v.tempHoverBorderColorOpacity
                                : v.hoverBorderColorOpacity
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
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
            }
          ]
        }
      ]
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
                toolbarLinkExternalBlank({ v }),
                toolbarLinkExternalRel({ v })
              ]
            },
            {
              id: "anchor",
              label: t("Anchor"),
              options: [toolbarLinkAnchor({ v })]
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
                          toolbarBoxShadowHexAndOpacity({
                            v,
                            device,
                            state: "normal",
                            onChange: [
                              "onChangeBoxShadowHexAndOpacity",
                              "onChangeBoxShadowHexAndOpacityPalette"
                            ]
                          }),
                          toolbarBoxShadowPalette({
                            v,
                            device,
                            state: "normal",
                            onChange: [
                              "onChangeBoxShadowPalette",
                              "onChangeBoxShadowPaletteOpacity"
                            ]
                          }),
                          toolbarBoxShadowFields({
                            v,
                            device,
                            state: "normal",
                            onChange: [
                              "onChangeBoxShadowHexAndOpacity",
                              "onChangeBoxShadowHexAndOpacityPalette"
                            ]
                          })
                        ]
                      },
                      toolbarBoxShadowBlur({ v, device, state: "normal" }),
                      toolbarBoxShadowSpread({
                        v,
                        device,
                        state: "normal"
                      }),
                      toolbarBoxShadowVertical({
                        v,
                        device,
                        state: "normal"
                      }),
                      toolbarBoxShadowHorizontal({
                        v,
                        device,
                        state: "normal"
                      })
                    ]
                  }
                }
              ]
            },
            {
              id: "moreSettingsAdvanced",
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: []
            }
          ]
        }
      ]
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
      id: "mobileToolbarSettings",
      type: "popover",
      disabled: true
    }
  ];
}
