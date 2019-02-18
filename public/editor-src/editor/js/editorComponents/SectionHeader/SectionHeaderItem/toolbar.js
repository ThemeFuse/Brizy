import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarBgImage,
  toolbarBorderStyle,
  toolbarBorderWidth,
  toolbarBorderRadius,
  toolbarBgType,
  toolbarGradientRange,
  toolbarGradientType,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields,
  toolbarBorderWidthBorderColorPicker,
  toolbarHoverTransition,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadowBlur,
  toolbarBoxShadowVertical,
  toolbarCustomCSSClass
} from "visual/utils/toolbar";

export function getItemsForDesktop(v, meta) {
  const device = "desktop";
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: boxShadowColorHex } = getOptionColor(v, "boxShadowColor");

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 20,
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
                  id: "tabsCurrentElement",
                  type: "tabs",
                  value: v.tabsCurrentElement,
                  tabs: [
                    {
                      id: "tabCurrentElement",
                      label: t("Image"),
                      options: [
                        toolbarBgImage({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBgImage",
                            "onChangeBgImageBgOpacity",
                            "onChangeBgImageDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      id: "tabCurrentElementStyling",
                      label: t("Styling"),
                      options: [
                        toolbarBorderStyle({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderStyle",
                            "onChangeBorderStyleDependencies"
                          ]
                        }),
                        toolbarBorderWidth({
                          v,
                          device,
                          state: "normal",
                          onChangeGrouped: [
                            "onChangeBorderWidthGrouped",
                            "onChangeBorderWidthGroupedDependencies"
                          ],
                          onChangeUngrouped: [
                            "onChangeBorderWidthUngrouped",
                            "onChangeBorderWidthUngroupedDependencies"
                          ]
                        }),
                        toolbarBorderRadius({
                          v,
                          device,
                          state: "normal",
                          onChangeGrouped: [
                            "onChangeBorderRadiusGrouped",
                            "onChangeBorderRadiusGroupedDependencies"
                          ],
                          onChangeUngrouped: [
                            "onChangeBorderRadiusUngrouped",
                            "onChangeBorderRadiusUngroupedDependencies"
                          ]
                        })
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
                  id: "tabsCurrentElement",
                  type: "tabs",
                  value: v.tabsCurrentElement,
                  tabs: [
                    {
                      id: "tabCurrentElement",
                      label: t("Image"),
                      options: [
                        toolbarBgImage({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBgImage",
                            "onChangeBgImageBgOpacity",
                            "onChangeBgImageDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      id: "tabCurrentElementStyling",
                      label: t("Styling"),
                      options: [
                        toolbarBorderStyle({
                          v,
                          device,
                          state: "hover",
                          onChange: ["onChangeBorderStyle"]
                        }),
                        toolbarBorderWidth({
                          v,
                          device,
                          state: "hover",
                          onChangeGrouped: ["onChangeBorderWidthGrouped"],
                          onChangeUngrouped: ["onChangeBorderWidthUngrouped"]
                        }),
                        toolbarBorderRadius({
                          v,
                          device,
                          state: "hover",
                          onChangeGrouped: ["onChangeBorderRadiusGrouped"],
                          onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
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
        tabsCurrentElement: !isOpen ? "tabCurrentElement" : v.tabsCurrentElement
      })
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 30,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
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
                  type: "tabs",
                  value: v.tabsColor,
                  tabs: [
                    {
                      id: "tabOverlay",
                      label: t("Overlay"),
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
                      id: "tabBorder",
                      label: t("Border"),
                      options: [
                        toolbarBorderColorHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderColorHexAndOpacity",
                            "onChangeBorderColorHexAndOpacityPalette",
                            "onChangeBorderColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBorderColorPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderColorPalette",
                            "onChangeBorderColorPaletteOpacity",
                            "onChangeBorderColorHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 51,
                              options: [
                                toolbarBorderColorFields({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBorderColorHexAndOpacity",
                                    "onChangeBorderColorHexAndOpacityPalette",
                                    "onChangeBorderColorHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 49,
                              options: [
                                toolbarBorderWidthBorderColorPicker({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBorderWidthGrouped",
                                    "onChangeBorderWidthGroupedDependencies"
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
                  type: "tabs",
                  value: v.tabsColor,
                  tabs: [
                    {
                      id: "tabOverlay",
                      label: t("Overlay"),
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
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid"
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
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "gradient" &&
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "finishPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "hover",
                          prefix: "bg",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "gradient" &&
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "finishPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity"
                          ]
                        }),
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          prefix: "gradient",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "startPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "hover",
                          prefix: "gradient",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "startPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity"
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
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "gradient" &&
                                    defaultValueValue({
                                      v,
                                      key: "gradientActivePointer",
                                      device,
                                      state: "hover"
                                    }) === "finishPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette"
                                  ]
                                }),
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  prefix: "gradient",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientActivePointer",
                                      device,
                                      state: "hover"
                                    }) === "startPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette"
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
                        toolbarBorderColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBorderColorHexAndOpacity",
                            "onChangeBorderColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarBorderColorPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBorderColorPalette",
                            "onChangeBorderColorPaletteOpacity"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 51,
                              options: [
                                toolbarBorderColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBorderColorHexAndOpacity",
                                    "onChangeBorderColorHexAndOpacityPalette"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 49,
                              options: [
                                toolbarBorderWidthBorderColorPicker({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: ["onChangeBorderWidthGrouped"]
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
        tabsColor: !isOpen ? "tabOverlay" : v.tabsColor
      })
    },
    {
      id: "toolbarSettings",
      type: "popover",
      title: t("Settings"),
      position: 110,
      options: [
        {
          type: "multiPicker",
          position: 10,
          picker: {
            id: "containerType",
            label: t("Width"),
            type: "select",
            choices: [
              {
                title: "Boxed",
                value: "boxed"
              },
              {
                title: "Full",
                value: "fullWidth"
              }
            ],
            value: v.containerType
          },
          choices: {
            boxed: [
              {
                id: "containerSize",
                type: "slider",
                slider: {
                  min: 35,
                  max: 100
                },
                input: {
                  show: true,
                  min: 35,
                  max: 100
                },
                suffix: {
                  show: true,
                  choices: [
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.containerSize
                },
                onChange: ({ value: containerSize }) => {
                  return {
                    containerSize
                  };
                }
              }
            ]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          position: 30,
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
                      picker: {
                        id: "paddingType",
                        label: t("Padding"),
                        type: "radioGroup",
                        choices: [
                          {
                            value: "grouped",
                            icon: "nc-styling-all"
                          },
                          {
                            value: "ungrouped",
                            icon: "nc-styling-individual"
                          }
                        ],
                        value: v.paddingType
                      },
                      choices: {
                        grouped: [
                          {
                            id: "padding",
                            type: "slider",
                            slider: {
                              min: 0,
                              max: 250
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
                              value: v.padding
                            },
                            onChange: ({ value: padding }) => {
                              return {
                                padding,
                                paddingTop: padding,
                                paddingBottom: padding
                              };
                            }
                          }
                        ],
                        ungrouped: [
                          {
                            id: "paddingTop",
                            icon: "nc-styling-top",
                            type: "slider",
                            slider: {
                              min: 0,
                              max: 250
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
                              value: v.paddingTop
                            },
                            onChange: ({ value: paddingTop }) => {
                              return {
                                paddingTop,
                                padding:
                                  paddingTop === v.paddingBottom
                                    ? paddingTop
                                    : v.padding
                              };
                            }
                          },
                          {
                            id: "paddingBottom",
                            icon: "nc-styling-bottom",
                            type: "slider",
                            slider: {
                              min: 0,
                              max: 250
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
                              value: v.paddingBottom
                            },
                            onChange: ({ value: paddingBottom }) => {
                              return {
                                paddingBottom,
                                padding:
                                  paddingBottom === v.paddingTop
                                    ? paddingBottom
                                    : v.padding
                              };
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: "multiPicker",
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
                          toolbarBoxShadowVertical({
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
                  options: [
                    toolbarCustomCSSClass({ v }),
                    toolbarHoverTransition({ v })
                  ]
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
  const device = "tablet";
  const state = "normal";
  const { hex: tabletBgColorHex } =
    v.tabletBgColorHex !== null
      ? getOptionColor(v, "tabletBgColor")
      : getOptionColor(v, "bgColor");

  return [
    {
      id: "tabletToolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 20,
      options: [
        toolbarBgImage({
          v,
          device,
          state,
          onChange: [
            "onChangeBgImage",
            "onChangeBgImageBgOpacity",
            "onChangeBgImageDependencies"
          ]
        })
      ]
    },
    {
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 30,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletBgColorHex,
            tabletSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__gradient",
          columns: [
            {
              width: 43,
              options: [toolbarBgType({ v, device, state: "normal" })]
            },
            {
              width: 57,
              options: [
                toolbarGradientRange({
                  v,
                  device,
                  state: "normal",
                  disabled: tabletSyncOnChange(v, "bgColorType") === "solid"
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
            tabletSyncOnChange(v, "bgColorType") === "gradient" &&
            tabletSyncOnChange(v, "gradientActivePointer") === "finishPointer",
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
            tabletSyncOnChange(v, "bgColorType") === "gradient" &&
            tabletSyncOnChange(v, "gradientActivePointer") === "finishPointer",
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
            tabletSyncOnChange(v, "bgColorType") === "solid" ||
            tabletSyncOnChange(v, "gradientActivePointer") === "startPointer",
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
            tabletSyncOnChange(v, "bgColorType") === "solid" ||
            tabletSyncOnChange(v, "gradientActivePointer") === "startPointer",
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
                    tabletSyncOnChange(v, "bgColorType") === "gradient" &&
                    tabletSyncOnChange(v, "gradientActivePointer") ===
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
                  state: "normal",
                  prefix: "gradient",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientActivePointer") ===
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
                  state: "normal",
                  className:
                    "brz-ed__select--transparent brz-ed__select--align-right",
                  disabled: tabletSyncOnChange(v, "bgColorType") === "solid"
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
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientType") === "radial"
                }),
                toolbarGradientRadialDegree({
                  v,
                  device,
                  state: "normal",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientType") === "linear"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      options: [
        {
          type: "multiPicker",
          picker: {
            id: "tabletPaddingType",
            label: t("Padding"),
            type: "radioGroup",
            choices: [
              {
                value: "grouped",
                icon: "nc-styling-all"
              },
              {
                value: "ungrouped",
                icon: "nc-styling-individual"
              }
            ],
            value: v.tabletPaddingType
          },
          choices: {
            grouped: [
              {
                id: "tabletPadding",
                type: "slider",
                slider: {
                  min: 0,
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
                  value: v.tabletPadding
                },
                onChange: ({ value: tabletPadding }) => {
                  return {
                    tabletPadding,
                    tabletPaddingTop: tabletPadding,
                    tabletPaddingBottom: tabletPadding
                  };
                }
              }
            ],
            ungrouped: [
              {
                id: "tabletPaddingTop",
                icon: "nc-styling-top",
                type: "slider",
                slider: {
                  min: 0,
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
                  value: v.tabletPaddingTop
                },
                onChange: ({ value: tabletPaddingTop }) => {
                  return {
                    tabletPaddingTop,
                    tabletPadding:
                      tabletPaddingTop === v.tabletPaddingBottom
                        ? tabletPaddingTop
                        : v.tabletPadding
                  };
                }
              },
              {
                id: "tabletPaddingBottom",
                icon: "nc-styling-bottom",
                type: "slider",
                slider: {
                  min: 0,
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
                  value: v.tabletPaddingBottom
                },
                onChange: ({ value: tabletPaddingBottom }) => {
                  return {
                    tabletPaddingBottom,
                    tabletPadding:
                      tabletPaddingBottom === v.tabletPaddingTop
                        ? tabletPaddingBottom
                        : v.tabletPadding
                  };
                }
              }
            ]
          }
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";
  const { hex: mobileBgColorHex } =
    v.mobileBgColorHex !== null
      ? getOptionColor(v, "mobileBgColor")
      : getOptionColor(v, "bgColor");

  return [
    {
      id: "mobileToolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 20,
      options: [
        toolbarBgImage({
          v,
          device,
          state,
          onChange: [
            "onChangeBgImage",
            "onChangeBgImageBgOpacity",
            "onChangeBgImageDependencies"
          ]
        })
      ]
    },
    {
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      position: 30,
      title: t("Colors"),
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileBgColorHex,
            mobileSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__gradient",
          columns: [
            {
              width: 43,
              options: [toolbarBgType({ v, device, state: "normal" })]
            },
            {
              width: 57,
              options: [
                toolbarGradientRange({
                  v,
                  device,
                  state: "normal",
                  disabled: mobileSyncOnChange(v, "bgColorType") === "solid"
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
            mobileSyncOnChange(v, "bgColorType") === "gradient" &&
            mobileSyncOnChange(v, "gradientActivePointer") === "finishPointer",
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
            mobileSyncOnChange(v, "bgColorType") === "gradient" &&
            mobileSyncOnChange(v, "gradientActivePointer") === "finishPointer",
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
            mobileSyncOnChange(v, "bgColorType") === "solid" ||
            mobileSyncOnChange(v, "gradientActivePointer") === "startPointer",
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
            mobileSyncOnChange(v, "bgColorType") === "solid" ||
            mobileSyncOnChange(v, "gradientActivePointer") === "startPointer",
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
                    mobileSyncOnChange(v, "bgColorType") === "gradient" &&
                    mobileSyncOnChange(v, "gradientActivePointer") ===
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
                  state: "normal",
                  prefix: "gradient",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientActivePointer") ===
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
                  state: "normal",
                  className:
                    "brz-ed__select--transparent brz-ed__select--align-right",
                  disabled: mobileSyncOnChange(v, "bgColorType") === "solid"
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
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientType") === "radial"
                }),
                toolbarGradientRadialDegree({
                  v,
                  device,
                  state: "normal",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientType") === "linear"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      options: [
        {
          type: "multiPicker",
          picker: {
            id: "mobilePaddingType",
            label: t("Padding"),
            type: "radioGroup",
            choices: [
              {
                value: "grouped",
                icon: "nc-styling-all"
              },
              {
                value: "ungrouped",
                icon: "nc-styling-individual"
              }
            ],
            value: v.mobilePaddingType
          },
          choices: {
            grouped: [
              {
                id: "mobilePadding",
                type: "slider",
                slider: {
                  min: 0,
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
                  value: v.mobilePadding
                },
                onChange: ({ value: mobilePadding }) => {
                  return {
                    mobilePadding,
                    mobilePaddingTop: mobilePadding,
                    mobilePaddingBottom: mobilePadding
                  };
                }
              }
            ],
            ungrouped: [
              {
                id: "mobilePaddingTop",
                icon: "nc-styling-top",
                type: "slider",
                slider: {
                  min: 0,
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
                  value: v.mobilePaddingTop
                },
                onChange: ({ value: mobilePaddingTop }) => {
                  return {
                    mobilePaddingTop,
                    mobilePadding:
                      mobilePaddingTop === v.mobilePaddingBottom
                        ? mobilePaddingTop
                        : v.mobilePadding
                  };
                }
              },
              {
                id: "mobilePaddingBottom",
                icon: "nc-styling-bottom",
                type: "slider",
                slider: {
                  min: 0,
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
                  value: v.mobilePaddingBottom
                },
                onChange: ({ value: mobilePaddingBottom }) => {
                  return {
                    mobilePaddingBottom,
                    mobilePadding:
                      mobilePaddingBottom === v.mobilePaddingTop
                        ? mobilePaddingBottom
                        : v.mobilePadding
                  };
                }
              }
            ]
          }
        }
      ]
    }
  ];
}
