import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette, getShapes } from "visual/utils/options";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarElementContainerTypeAll,
  toolbarBgImage,
  toolbarBgImageAttachment,
  toolbarBgVideoUrl,
  toolbarBgVideoQuality,
  toolbarBgVideoLoop,
  toolbarBgMapAddress,
  toolbarBgMapZoom,
  toolbarGradientType,
  toolbarBgColorHexField2,
  toolbarBgColor2,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarBorderRadius,
  toolbarBorder2,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthFourFields2,
  toolbarHoverTransition,
  toolbarElementContainerTypeImageMap
} from "visual/utils/toolbar";

export function getItemsForDesktop(v, component) {
  const device = "desktop";

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  const { hex: shapeTopColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "shapeTopColorHex", device }),
    defaultValueValue({ v, key: "shapeTopColorPalette", device })
  );

  const { hex: shapeBottomColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "shapeBottomColorHex", device }),
    defaultValueValue({ v, key: "shapeBottomColorPalette", device })
  );

  const { isSlider: inSlider } = component.props.meta.section;

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
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
                      label: t("Background"),
                      options: [
                        toolbarElementContainerTypeAll({ v }),
                        toolbarBgImage({
                          v,
                          device,
                          state: "normal",
                          disabled: v.media !== "image",
                          onChange: [
                            "onChangeBgImage",
                            "onChangeBgImageBgOpacity",
                            "onChangeBgImageDependencies"
                          ]
                        }),
                        toolbarBgImageAttachment({
                          v,
                          disabled: v.media !== "image" || inSlider
                        }),
                        toolbarBgVideoUrl({ v, disabled: v.media !== "video" }),
                        toolbarBgVideoQuality({
                          v,
                          disabled: v.media !== "video"
                        }),
                        toolbarBgVideoLoop({
                          v,
                          disabled: v.media !== "video"
                        }),
                        toolbarBgMapAddress({ v, disabled: v.media !== "map" }),
                        toolbarBgMapZoom({ v, disabled: v.media !== "map" })
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
                  disabled:
                    v.tabsCurrentElement === "tabCurrentElement" &&
                    (v.media === "video" || v.media === "map"),
                  value: v.tabsCurrentElement,
                  tabs: [
                    {
                      id: "tabCurrentElement",
                      label: t("Background"),
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
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      onChange: (_, { isOpen }) => ({
        tabsCurrentElement: !isOpen ? "" : v.tabsCurrentElement
      })
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
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
                          onChangeStyle: [
                            "onChangeBorderStyle2",
                            "onChangeContainerBorderStyleDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBorderColorPalette2",
                            "onChangeBorderColorPaletteOpacity2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
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
                                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 54,
                              options: [
                                toolbarBorderWidthFourFields2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChangeType: ["onChangeBorderWidthType2"],
                                  onChangeGrouped: [
                                    "onChangeBorderWidthGrouped2",
                                    "onChangeBorderWidthGroupedDependencies2"
                                  ],
                                  onChangeUngrouped: [
                                    "onChangeBorderWidthUngrouped2",
                                    "onChangeBorderWidthUngroupedDependencies2"
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
                          onChangeStyle: [
                            "onChangeBorderStyle2",
                            "onChangeContainerBorderStyleDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBorderColorPalette2",
                            "onChangeBorderColorPaletteOpacity2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
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
                                    "onChangeBorderColorHexAndOpacity2",
                                    "onChangeBorderColorHexAndOpacityPalette2",
                                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 54,
                              options: [
                                toolbarBorderWidthFourFields2({
                                  v,
                                  device,
                                  state: "hover",
                                  onChangeType: ["onChangeBorderWidthType2"],
                                  onChangeGrouped: [
                                    "onChangeBorderWidthGrouped2",
                                    "onChangeBorderWidthGroupedDependencies2"
                                  ],
                                  onChangeUngrouped: [
                                    "onChangeBorderWidthUngrouped2",
                                    "onChangeBorderWidthUngroupedDependencies2"
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
        tabsColor: !isOpen ? "" : v.tabsColor
      })
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
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
                title: t("Boxed"),
                value: "boxed"
              },
              {
                title: t("Full"),
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
                onChange: ({ value: containerSize }) => ({
                  containerSize
                })
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
                    }),
                    {
                      type: "multiPicker",
                      picker: {
                        id: "shape",
                        label: t("Dividers"),
                        type: "radioGroup",
                        choices: [
                          {
                            value: "top",
                            icon: "nc-dividers-top"
                          },
                          {
                            value: "bottom",
                            icon: "nc-dividers-bottom"
                          }
                        ],
                        value: v.shape
                      },
                      choices: {
                        top: [
                          {
                            id: "shapeTopType",
                            label: t("Type"),
                            type: "select",
                            className: "brz-control__select-option--icon",
                            choices: getShapes(),
                            value: v.shapeTopType
                          },
                          {
                            id: "shapeTopColors",
                            type: "popover",
                            size: "auto",
                            label: t("Color"),
                            title: t("Color"),
                            disabled: v.shapeTopType === "none",
                            icon: {
                              style: {
                                backgroundColor: hexToRgba(
                                  shapeTopColorHex,
                                  v.shapeTopColorOpacity
                                )
                              }
                            },
                            options: [
                              toolbarColor2({
                                v,
                                device,
                                prefix: "shapeTopColor",
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
                                        prefix: "shapeTopColor",
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
                            id: "shapeTopHeight",
                            type: "slider",
                            icon: "nc-height",
                            disabled: v.shapeTopType === "none",
                            slider: {
                              min: 0,
                              max: v.shapeTopHeightSuffix === "px" ? 500 : 100
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.shapeTopHeight,
                              suffix: v.shapeTopHeightSuffix
                            },
                            onChange: ({
                              value: shapeTopHeight,
                              suffix: shapeTopHeightSuffix
                            }) => ({
                              shapeTopHeight,
                              shapeTopHeightSuffix
                            })
                          },
                          {
                            id: "shapeTopFlip",
                            label: t("Flip"),
                            type: "checkGroup",
                            disabled: v.shapeTopType === "none",
                            choices: [
                              {
                                value: "shapeTopHorizontal",
                                icon: "nc-flip-horizontal"
                              }
                            ],
                            value: {
                              shapeTopHorizontal: v.shapeTopHorizontal === "on"
                            },
                            onChange: ({ shapeTopHorizontal }) => {
                              return {
                                shapeTopHorizontal: shapeTopHorizontal
                                  ? "on"
                                  : "off"
                              };
                            }
                          },
                          {
                            id: "shapeTopIndex",
                            type: "radioGroup",
                            label: t("Arrangement"),
                            disabled: v.shapeTopType === "none",
                            choices: [
                              {
                                value: "auto",
                                icon: "nc-send-to-back"
                              },
                              {
                                value: "10",
                                icon: "nc-bring-to-top"
                              }
                            ],
                            value: v.shapeTopIndex
                          }
                        ],
                        bottom: [
                          {
                            id: "shapeBottomType",
                            label: t("Type"),
                            type: "select",
                            className:
                              "brz-control__select-option--icon brz-control__select-option--icon--bottom",
                            choices: getShapes(),
                            value: v.shapeBottomType
                          },
                          {
                            id: "shapeBottomColors",
                            type: "popover",
                            size: "auto",
                            label: t("Color"),
                            title: t("Color"),
                            disabled: v.shapeBottomType === "none",
                            icon: {
                              style: {
                                backgroundColor: hexToRgba(
                                  shapeBottomColorHex,
                                  v.shapeBottomColorOpacity
                                )
                              }
                            },
                            options: [
                              toolbarColor2({
                                v,
                                device,
                                prefix: "shapeBottomColor",
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
                                        prefix: "shapeBottomColor",
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
                            id: "shapeBottomHeight",
                            type: "slider",
                            icon: "nc-height",
                            disabled: v.shapeBottomType === "none",
                            slider: {
                              min: 0,
                              max:
                                v.shapeBottomHeightSuffix === "px" ? 500 : 100
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.shapeBottomHeight,
                              suffix: v.shapeBottomHeightSuffix
                            },
                            onChange: ({
                              value: shapeBottomHeight,
                              suffix: shapeBottomHeightSuffix
                            }) => ({
                              shapeBottomHeight,
                              shapeBottomHeightSuffix
                            })
                          },
                          {
                            id: "shapeBottomFlip",
                            label: t("Flip"),
                            type: "checkGroup",
                            disabled: v.shapeBottomType === "none",
                            choices: [
                              {
                                value: "shapeBottomHorizontal",
                                icon: "nc-flip-horizontal"
                              }
                            ],
                            value: {
                              shapeBottomHorizontal:
                                v.shapeBottomHorizontal === "on"
                            },
                            onChange: ({ shapeBottomHorizontal }) => {
                              return {
                                shapeBottomHorizontal: shapeBottomHorizontal
                                  ? "on"
                                  : "off"
                              };
                            }
                          },
                          {
                            id: "shapeBottomIndex",
                            type: "radioGroup",
                            label: t("Arrangement"),
                            disabled: v.shapeBottomType === "none",
                            choices: [
                              {
                                value: "auto",
                                icon: "nc-send-to-back"
                              },
                              {
                                value: "10",
                                icon: "nc-bring-to-top"
                              }
                            ],
                            value: v.shapeBottomIndex
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [toolbarHoverTransition({ v })]
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

  const { hex: tabletBgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  return [
    {
      id: "tabletToolbarCurrentElement",
      type: "popover",
      position: 80,
      icon: "nc-background",
      title: t("Background"),
      options: [
        {
          id: "tabletTabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabletTabCurrentElement",
              label: t("Background"),
              options: [
                toolbarElementContainerTypeImageMap({ v, device, state }),
                toolbarBgImage({
                  v,
                  device,
                  state,
                  disabled:
                    tabletSyncOnChange(v, "media") !== "image" &&
                    tabletSyncOnChange(v, "media") !== "video",
                  onChange: [
                    "onChangeBgImage",
                    "onChangeBgImageBgOpacity",
                    "onChangeBgImageDependencies"
                  ]
                }),
                toolbarBgMapZoom({ v, disabled: v.media !== "map" })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 100,
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
          id: "tabletTabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabletTabOverlay",
              label: t("Overlay"),
              options: [
                toolbarBgColor2({
                  v,
                  device,
                  state,
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
                          state,
                          prefix:
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state
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
                          state,
                          className:
                            "brz-ed__select--transparent brz-ed__select--align-right",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state
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
                          state,
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientType",
                              device,
                              state
                            }) === "radial"
                        }),
                        toolbarGradientRadialDegree({
                          v,
                          device,
                          state,
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientType",
                              device,
                              state
                            }) === "linear"
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabletTabBorder",
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  state,
                  onChangeStyle: [
                    "onChangeBorderStyle2",
                    "onChangeContainerBorderStyleDependencies2"
                  ],
                  onChangeHex: [
                    "onChangeBorderColorHexAndOpacity2",
                    "onChangeBorderColorHexAndOpacityPalette2",
                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBorderColorPalette2",
                    "onChangeBorderColorPaletteOpacity2",
                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
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
                          state,
                          onChange: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 54,
                      options: [
                        toolbarBorderWidthFourFields2({
                          v,
                          device,
                          state,
                          onChangeType: ["onChangeBorderWidthType2"],
                          onChangeGrouped: [
                            "onChangeBorderWidthGrouped2",
                            "onChangeBorderWidthGroupedDependencies2"
                          ],
                          onChangeUngrouped: [
                            "onChangeBorderWidthUngrouped2",
                            "onChangeBorderWidthUngroupedDependencies2"
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
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      position: 110,
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
        },
        toolbarBorderRadius({
          v,
          device,
          state,
          onChangeGrouped: [
            "onChangeBorderRadiusGrouped",
            "onChangeBorderRadiusGroupedDependencies"
          ],
          onChangeUngrouped: [
            "onChangeBorderRadiusUngrouped",
            "onChangeBorderRadiusUngroupedDependencies"
          ]
        }),
        {
          type: "multiPicker",
          disabled: v.shapeTopType === "none" && v.shapeBottomType === "none",
          picker: {
            id: "tabletShape",
            label: t("Dividers"),
            type: "radioGroup",
            choices: [
              {
                value: "top",
                icon: "nc-align-top"
              },
              {
                value: "bottom",
                icon: "nc-align-bottom"
              }
            ],
            value: tabletSyncOnChange(v, "shape")
          },
          choices: {
            top: [
              {
                id: "tabletShapeTopHeight",
                type: "slider",
                icon: "nc-height",
                disabled: v.shapeTopType === "none",
                slider: {
                  min: 0,
                  max:
                    tabletSyncOnChange(v, "shapeTopHeightSuffix") === "px"
                      ? 500
                      : 100
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: tabletSyncOnChange(v, "shapeTopHeight"),
                  suffix: tabletSyncOnChange(v, "shapeTopHeightSuffix")
                },
                onChange: ({
                  value: tabletShapeTopHeight,
                  suffix: tabletShapeTopHeightSuffix
                }) => ({
                  tabletShapeTopHeight,
                  tabletShapeTopHeightSuffix
                })
              }
            ],
            bottom: [
              {
                id: "tabletShapeBottomHeight",
                type: "slider",
                icon: "nc-height",
                disabled: v.shapeBottomType === "none",
                slider: {
                  min: 0,
                  max:
                    tabletSyncOnChange(v, "shapeBottomHeightSuffix") === "px"
                      ? 500
                      : 100
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: tabletSyncOnChange(v, "shapeBottomHeight"),
                  suffix: tabletSyncOnChange(v, "shapeBottomHeightSuffix")
                },
                onChange: ({
                  value: tabletShapeBottomHeight,
                  suffix: tabletShapeBottomHeightSuffix
                }) => ({
                  tabletShapeBottomHeight,
                  tabletShapeBottomHeightSuffix
                })
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

  const { hex: mobileBgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  return [
    {
      id: "mobileToolbarCurrentElement",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: "mobileTabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "mobileTabCurrentElement",
              label: t("Background"),
              options: [
                toolbarElementContainerTypeImageMap({ v, device, state }),
                toolbarBgImage({
                  v,
                  device,
                  state,
                  disabled:
                    mobileSyncOnChange(v, "media") !== "image" &&
                    mobileSyncOnChange(v, "media") !== "video",
                  onChange: [
                    "onChangeBgImage",
                    "onChangeBgImageBgOpacity",
                    "onChangeBgImageDependencies"
                  ]
                }),
                toolbarBgMapZoom({ v, disabled: v.media !== "map" })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 100,
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
          id: "mobileTabsColor",
          type: "tabs",
          tabs: [
            {
              id: "mobileTabOverlay",
              label: t("Overlay"),
              options: [
                toolbarBgColor2({
                  v,
                  device,
                  state,
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
                          state,
                          prefix:
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state
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
                          state,
                          className:
                            "brz-ed__select--transparent brz-ed__select--align-right",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state
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
                          state,
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientType",
                              device,
                              state
                            }) === "radial"
                        }),
                        toolbarGradientRadialDegree({
                          v,
                          device,
                          state,
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientType",
                              device,
                              state
                            }) === "linear"
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "mobileTabBorder",
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  state,
                  onChangeStyle: [
                    "onChangeBorderStyle2",
                    "onChangeContainerBorderStyleDependencies2"
                  ],
                  onChangeHex: [
                    "onChangeBorderColorHexAndOpacity2",
                    "onChangeBorderColorHexAndOpacityPalette2",
                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBorderColorPalette2",
                    "onChangeBorderColorPaletteOpacity2",
                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
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
                          state,
                          onChange: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 54,
                      options: [
                        toolbarBorderWidthFourFields2({
                          v,
                          device,
                          state,
                          onChangeType: ["onChangeBorderWidthType2"],
                          onChangeGrouped: [
                            "onChangeBorderWidthGrouped2",
                            "onChangeBorderWidthGroupedDependencies2"
                          ],
                          onChangeUngrouped: [
                            "onChangeBorderWidthUngrouped2",
                            "onChangeBorderWidthUngroupedDependencies2"
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
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      position: 110,
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
        },
        toolbarBorderRadius({
          v,
          device,
          state,
          onChangeGrouped: [
            "onChangeBorderRadiusGrouped",
            "onChangeBorderRadiusGroupedDependencies"
          ],
          onChangeUngrouped: [
            "onChangeBorderRadiusUngrouped",
            "onChangeBorderRadiusUngroupedDependencies"
          ]
        }),
        {
          type: "multiPicker",
          disabled: v.shapeTopType === "none" && v.shapeBottomType === "none",
          picker: {
            id: "mobileShape",
            label: t("Dividers"),
            type: "radioGroup",
            choices: [
              {
                value: "top",
                icon: "nc-align-top"
              },
              {
                value: "bottom",
                icon: "nc-align-bottom"
              }
            ],
            value: mobileSyncOnChange(v, "shape")
          },
          choices: {
            top: [
              {
                id: "mobileShapeTopHeight",
                type: "slider",
                icon: "nc-height",
                disabled: v.shapeTopType === "none",
                slider: {
                  min: 0,
                  max:
                    mobileSyncOnChange(v, "shapeTopHeightSuffix") === "px"
                      ? 500
                      : 100
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: mobileSyncOnChange(v, "shapeTopHeight"),
                  suffix: mobileSyncOnChange(v, "shapeTopHeightSuffix")
                },
                onChange: ({
                  value: mobileShapeTopHeight,
                  suffix: mobileShapeTopHeightSuffix
                }) => ({
                  mobileShapeTopHeight,
                  mobileShapeTopHeightSuffix
                })
              }
            ],
            bottom: [
              {
                id: "mobileShapeBottomHeight",
                type: "slider",
                icon: "nc-height",
                disabled: v.shapeBottomType === "none",
                slider: {
                  min: 0,
                  max:
                    mobileSyncOnChange(v, "shapeBottomHeightSuffix") === "px"
                      ? 500
                      : 100
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: mobileSyncOnChange(v, "shapeBottomHeight"),
                  suffix: mobileSyncOnChange(v, "shapeBottomHeightSuffix")
                },
                onChange: ({
                  value: mobileShapeBottomHeight,
                  suffix: mobileShapeBottomHeightSuffix
                }) => ({
                  mobileShapeBottomHeight,
                  mobileShapeBottomHeightSuffix
                })
              }
            ]
          }
        }
      ]
    }
  ];
}
