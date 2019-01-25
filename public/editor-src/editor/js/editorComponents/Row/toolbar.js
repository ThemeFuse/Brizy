import { hexToRgba } from "visual/utils/color";
import { getOptionColor, getAnimations } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  toolbarBgImage,
  toolbarBorderWidth,
  toolbarBorderRadius,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields
} from "visual/utils/toolbar";

export function getItemsForDesktop(v, component) {
  const device = "desktop";

  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: boxShadowColorHex } = getOptionColor(v, "boxShadowColor");
  const getAnimationChoices = () => {
    const { animationName } = v;
    if (animationName !== "none" || animationName === "initial") {
      const choices =
        animationName === "initial" ? v.tempAnimationName : animationName;
      return {
        [`${choices}`]: [
          {
            id: "animationDuration",
            label: t("Duration"),
            type: "slider",
            slider: {
              min: 0,
              max: 5,
              step: 0.1
            },
            input: {
              show: true,
              min: 0
            },
            suffix: {
              show: true,
              choices: [
                {
                  title: "s",
                  value: "s"
                }
              ]
            },
            value: {
              value: v.animationDuration / 1000
            },
            onChange: ({ value: animationDuration }, { sliderDragEnd }) => {
              return {
                animationName: sliderDragEnd ? v.tempAnimationName : "initial",
                animationDuration: animationDuration * 1000
              };
            }
          },
          {
            id: "animationDelay",
            label: t("Delay"),
            type: "slider",
            slider: {
              min: 0,
              max: 5,
              step: 0.1
            },
            input: {
              show: true,
              min: 0
            },
            suffix: {
              show: true,
              choices: [
                {
                  title: "s",
                  value: "s"
                }
              ]
            },
            value: {
              value: v.animationDelay / 1000
            },
            onChange: ({ value: animationDelay }, { sliderDragEnd }) => {
              return {
                animationName: sliderDragEnd ? v.tempAnimationName : "initial",
                animationDelay: animationDelay * 1000
              };
            }
          }
        ]
      };
    }

    return { none: [] };
  };
  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Background"),
              options: [
                {
                  id: "media",
                  label: t("Type"),
                  type: "radioGroup",
                  choices: [
                    {
                      value: "image",
                      icon: "nc-media-image"
                    },
                    {
                      value: "video",
                      icon: "nc-media-video"
                    },
                    {
                      value: "map",
                      icon: "nc-media-map"
                    }
                  ],
                  value: v.media
                },
                toolbarBgImage({
                  v,
                  device,
                  state: "normal",
                  disabled: v.media !== "image",
                  onChange: [
                    "onChangeBgImage",
                    "onChangeBgImageBgOpacity",
                    "onChangeBgImageDependencies",
                    "onChangeBgImageColumnAndRowSyncTablet",
                    "onChangeBgImageColumnAndRowSyncMobile"
                  ]
                }),
                {
                  id: "bgVideo",
                  label: t("URL"),
                  type: "input",
                  inputType: "video",
                  placeholder: t("YouTube or Vimeo"),
                  disabled: v.media !== "video",
                  value: {
                    value: v.bgVideo
                  },
                  onChange: ({ value: bgVideo }) => ({
                    bgVideo,

                    bgColorOpacity:
                      bgVideo !== "" && v.bgColorOpacity === 1
                        ? 0.8
                        : v.bgColorOpacity,

                    tempBgColorOpacity:
                      bgVideo !== "" && v.bgColorOpacity === 1
                        ? 0.8
                        : v.tempBgColorOpacity
                  })
                },
                {
                  id: "bgVideoQuality",
                  label: t("Quality"),
                  type: "select",
                  disabled: v.media !== "video",
                  choices: [
                    {
                      title: t("1080p"),
                      value: 1080
                    },
                    {
                      title: t("720p"),
                      value: 720
                    }
                  ],
                  value: v.bgVideoQuality
                },
                {
                  id: "bgVideoLoop",
                  label: t("Loop"),
                  type: "switch",
                  disabled: v.media !== "video",
                  value: v.bgVideoLoop
                },
                {
                  id: "bgMapAddress",
                  label: t("Address"),
                  type: "input",
                  placeholder: t("Enter address"),
                  disabled: v.media !== "map",
                  value: {
                    value: v.bgMapAddress
                  },
                  onChange: ({ value: bgMapAddress }) => ({
                    bgMapAddress
                  })
                },
                {
                  id: "bgMapZoom",
                  label: t("Zoom"),
                  type: "slider",
                  disabled: v.media !== "map",
                  slider: {
                    min: 1,
                    max: 21
                  },
                  input: {
                    show: true,
                    min: 1
                  },
                  value: {
                    value: v.bgMapZoom
                  },
                  onChange: ({ value: bgMapZoom }) => ({ bgMapZoom })
                }
              ]
            },
            {
              id: "tabCurrentElementStyling",
              label: t("Styling"),
              options: [
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
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBgColorFields({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                })
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
                    "onChangeBorderColorHexAndOpacityDependencies",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBorderColorPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBorderColorPalette",
                    "onChangeBorderColorPaletteOpacity",
                    "onChangeBorderColorHexAndOpacityDependencies",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBorderColorFields({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBorderColorHexAndOpacity",
                    "onChangeBorderColorHexAndOpacityPalette",
                    "onChangeBorderColorHexAndOpacityDependencies",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: "size",
          label: t("Width"),
          type: "slider",
          disabled: inPopup,
          slider: {
            min: 40,
            max: 100
          },
          input: {
            show: true,
            min: 40,
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
            value: v.size
          },
          onChange: ({ value: size }) => ({
            size
          })
        },
        {
          type: "multiPicker",
          picker: {
            id: "columnsHeightStyle",
            label: t("Height"),
            type: "select",
            choices: [
              {
                title: t("Auto"),
                value: "auto"
              },
              {
                title: t("Custom"),
                value: "custom"
              }
            ],
            value: v.columnsHeightStyle
          },
          choices: {
            custom: [
              {
                id: "columnsHeight",
                type: "slider",
                slider: {
                  min: 20,
                  max: 500
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
                  value: v.columnsHeight
                },
                onChange: ({ value: columnsHeight }) => ({
                  columnsHeight
                })
              },
              {
                id: "verticalAlign",
                label: t("Content"),
                type: "radioGroup",
                choices: [
                  {
                    value: "top",
                    icon: "nc-align-top"
                  },
                  {
                    value: "center",
                    icon: "nc-align-middle"
                  },
                  {
                    value: "bottom",
                    icon: "nc-align-bottom"
                  }
                ],
                value: v.verticalAlign
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.padding,
                              suffix: v.paddingSuffix
                            },
                            onChange: ({
                              value: padding,
                              suffix: paddingSuffix
                            }) => {
                              return {
                                padding,
                                paddingSuffix,
                                paddingTop: padding,
                                paddingRight: padding,
                                paddingBottom: padding,
                                paddingLeft: padding
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.paddingTop,
                              suffix: v.paddingTopSuffix
                            },
                            onChange: ({
                              value: paddingTop,
                              suffix: paddingTopSuffix
                            }) => {
                              return {
                                paddingTop,
                                paddingTopSuffix,
                                padding:
                                  paddingTop === v.paddingRight &&
                                  paddingTop === v.paddingLeft &&
                                  paddingTop === v.paddingBottom
                                    ? paddingTop
                                    : v.padding
                              };
                            }
                          },
                          {
                            id: "paddingRight",
                            icon: "nc-styling-right",
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.paddingRight,
                              suffix: v.paddingRightSuffix
                            },
                            onChange: ({
                              value: paddingRight,
                              suffix: paddingRightSuffix
                            }) => {
                              return {
                                paddingRight,
                                paddingRightSuffix,
                                padding:
                                  paddingRight === v.paddingTop &&
                                  paddingRight === v.paddingLeft &&
                                  paddingRight === v.paddingBottom
                                    ? paddingRight
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.paddingBottom,
                              suffix: v.paddingBottomSuffix
                            },
                            onChange: ({
                              value: paddingBottom,
                              suffix: paddingBottomSuffix
                            }) => {
                              return {
                                paddingBottom,
                                paddingBottomSuffix,
                                padding:
                                  paddingBottom === v.paddingRight &&
                                  paddingBottom === v.paddingLeft &&
                                  paddingBottom === v.paddingTop
                                    ? paddingBottom
                                    : v.padding
                              };
                            }
                          },
                          {
                            id: "paddingLeft",
                            icon: "nc-styling-left",
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.paddingLeft,
                              suffix: v.paddingLeftSuffix
                            },
                            onChange: ({
                              value: paddingLeft,
                              suffix: paddingLeftSuffix
                            }) => {
                              return {
                                paddingLeft,
                                paddingLeftSuffix,
                                padding:
                                  paddingLeft === v.paddingRight &&
                                  paddingLeft === v.paddingTop &&
                                  paddingLeft === v.paddingBottom
                                    ? paddingLeft
                                    : v.padding
                              };
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: "multiPicker",
                      disabled: inPopup,
                      picker: {
                        id: "marginType",
                        label: t("Margin"),
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
                        value: v.marginType
                      },
                      choices: {
                        grouped: [
                          {
                            id: "margin",
                            type: "slider",
                            slider: {
                              min: -100,
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.margin,
                              suffix: v.marginSuffix
                            },
                            onChange: ({
                              value: margin,
                              suffix: marginSuffix
                            }) => {
                              return {
                                margin,
                                marginSuffix,
                                marginTop: margin,
                                marginBottom: margin
                              };
                            }
                          }
                        ],
                        ungrouped: [
                          {
                            id: "marginTop",
                            icon: "nc-styling-top",
                            type: "slider",
                            slider: {
                              min: -100,
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.marginTop,
                              suffix: v.marginTopSuffix
                            },
                            onChange: ({
                              value: marginTop,
                              suffix: marginTopSuffix
                            }) => {
                              return {
                                marginTop,
                                marginTopSuffix,
                                margin:
                                  marginTop === v.marginBottom
                                    ? marginTop
                                    : v.margin
                              };
                            }
                          },
                          {
                            id: "marginBottom",
                            icon: "nc-styling-bottom",
                            type: "slider",
                            slider: {
                              min: -100,
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
                                },
                                {
                                  title: "%",
                                  value: "%"
                                }
                              ]
                            },
                            value: {
                              value: v.marginBottom,
                              suffix: v.marginBottomSuffix
                            },
                            onChange: ({
                              value: marginBottom,
                              suffix: marginBottomSuffix
                            }) => {
                              return {
                                marginBottom,
                                marginBottomSuffix,
                                margin:
                                  marginBottom === v.marginTop
                                    ? marginBottom
                                    : v.margin
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
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    {
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      type: "switch",
                      disabled: inPopup,
                      value: v.showOnDesktop
                    },
                    {
                      id: "zIndex",
                      label: t("Z-index"),
                      type: "slider",
                      disabled: inPopup,
                      slider: {
                        min: 0,
                        max: 100
                      },
                      input: {
                        show: true,
                        min: 0
                      },
                      value: {
                        value: v.zIndex
                      },
                      onChange: ({ value: zIndex }) => ({
                        zIndex
                      })
                    },
                    {
                      id: "customClassName",
                      label: t("CSS Class"),
                      type: "input",
                      inputSize: "auto",
                      value: {
                        value: v.customClassName
                      },
                      onChange: ({ value: customClassName }) => ({
                        customClassName
                      })
                    },
                    {
                      id: "animation",
                      type: "multiPicker",
                      picker: {
                        id: "animationName",
                        label: t("Animation"),
                        type: "select",
                        choices: getAnimations(),
                        value:
                          v.animationName === "initial"
                            ? v.tempAnimationName
                            : v.animationName,
                        onChange: animationName => ({
                          animationName,
                          tempAnimationName: animationName
                        })
                      },
                      choices: getAnimationChoices()
                    }
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

export function getItemsForTablet(v, component) {
  const device = "tablet";
  const state = "normal";
  const { hex: tabletBgColorHex } =
    v.tabletBgColorHex !== null
      ? getOptionColor(v, "tabletBgColor")
      : getOptionColor(v, "bgColor");

  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    {
      id: "showOnTablet",
      type: "toggle",
      position: 10,
      choices: [
        {
          icon: "nc-eye-17",
          title: t("Disable on Tablet"),
          value: "on"
        },
        {
          icon: "nc-eye-ban-18",
          title: t("Enable on Tablet"),
          value: "off"
        }
      ],
      value: v.showOnTablet
    },
    {
      id: "tabletToolbarMedia",
      type: "popover",
      position: 80,
      icon: "nc-background",
      title: t("Background"),
      options: [
        {
          id: "tabletMedia",
          label: t("Type"),
          type: "radioGroup",
          choices: [
            {
              value: "image",
              icon: "nc-media-image"
            },
            {
              value: "map",
              icon: "nc-media-map"
            }
          ],
          value:
            tabletSyncOnChange(v, "media") === "video"
              ? "image"
              : tabletSyncOnChange(v, "media")
        },
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
            "onChangeBgImageDependencies",
            "onChangeBgImageColumnAndRowSyncTablet"
          ]
        }),
        {
          id: "tabletBgMapZoom",
          label: t("Zoom"),
          type: "slider",
          disabled: tabletSyncOnChange(v, "media") !== "map",
          slider: {
            min: 1,
            max: 21
          },
          input: {
            show: true
          },
          value: {
            value: tabletSyncOnChange(v, "bgMapZoom")
          },
          onChange: ({ value: tabletBgMapZoom }) => ({
            tabletBgMapZoom
          })
        }
      ]
    },
    {
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletBgColorHex,
            tabletSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies",
            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies",
            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
          ]
        }),
        toolbarBgColorFields({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies",
            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
          ]
        })
      ]
    },
    {
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      position: 110,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletPadding,
                  suffix: v.tabletPaddingSuffix
                },
                onChange: ({
                  value: tabletPadding,
                  suffix: tabletPaddingSuffix
                }) => {
                  return {
                    tabletPadding,
                    tabletPaddingSuffix,
                    tabletPaddingTop: tabletPadding,
                    tabletPaddingRight: tabletPadding,
                    tabletPaddingBottom: tabletPadding,
                    tabletPaddingLeft: tabletPadding
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletPaddingTop,
                  suffix: v.tabletPaddingTopSuffix
                },
                onChange: ({
                  value: tabletPaddingTop,
                  suffix: tabletPaddingTopSuffix
                }) => {
                  return {
                    tabletPaddingTop,
                    tabletPaddingTopSuffix,
                    tabletPadding:
                      tabletPaddingTop === v.tabletPaddingRight &&
                      tabletPaddingTop === v.tabletPaddingLeft &&
                      tabletPaddingTop === v.tabletPaddingBottom
                        ? tabletPaddingTop
                        : v.tabletPadding
                  };
                }
              },
              {
                id: "tabletPaddingRight",
                icon: "nc-styling-right",
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletPaddingRight,
                  suffix: v.tabletPaddingRightSuffix
                },
                onChange: ({
                  value: tabletPaddingRight,
                  suffix: tabletPaddingRightSuffix
                }) => {
                  return {
                    tabletPaddingRight,
                    tabletPaddingRightSuffix,
                    tabletPadding:
                      tabletPaddingRight === v.tabletPaddingTop &&
                      tabletPaddingRight === v.tabletPaddingLeft &&
                      tabletPaddingRight === v.tabletPaddingBottom
                        ? tabletPaddingRight
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletPaddingBottom,
                  suffix: v.tabletPaddingBottomSuffix
                },
                onChange: ({
                  value: tabletPaddingBottom,
                  suffix: tabletPaddingBottomSuffix
                }) => {
                  return {
                    tabletPaddingBottom,
                    tabletPaddingBottomSuffix,
                    tabletPadding:
                      tabletPaddingBottom === v.tabletPaddingTop &&
                      tabletPaddingBottom === v.tabletPaddingLeft &&
                      tabletPaddingBottom === v.tabletPaddingRight
                        ? tabletPaddingBottom
                        : v.tabletPadding
                  };
                }
              },
              {
                id: "tabletPaddingLeft",
                icon: "nc-styling-left",
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletPaddingLeft,
                  suffix: v.tabletPaddingLeftSuffix
                },
                onChange: ({
                  value: tabletPaddingLeft,
                  suffix: tabletPaddingLeftSuffix
                }) => {
                  return {
                    tabletPaddingLeft,
                    tabletPaddingLeftSuffix,
                    tabletPadding:
                      tabletPaddingLeft === v.tabletPaddingTop &&
                      tabletPaddingLeft === v.tabletPaddingBottom &&
                      tabletPaddingLeft === v.tabletPaddingRight
                        ? tabletPaddingLeft
                        : v.tabletPadding
                  };
                }
              }
            ]
          }
        },
        {
          type: "multiPicker",
          disabled: inPopup,
          picker: {
            id: "tabletMarginType",
            label: t("Margin"),
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
            value: v.tabletMarginType
          },
          choices: {
            grouped: [
              {
                id: "tabletMargin",
                type: "slider",
                slider: {
                  min: -100,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletMargin,
                  suffix: v.tabletMarginSuffix
                },
                onChange: ({
                  value: tabletMargin,
                  suffix: tabletMarginSuffix
                }) => {
                  return {
                    tabletMargin,
                    tabletMarginSuffix,
                    tabletMarginTop: tabletMargin,
                    tabletMarginBottom: tabletMargin
                  };
                }
              }
            ],
            ungrouped: [
              {
                id: "tabletMarginTop",
                icon: "nc-styling-top",
                type: "slider",
                slider: {
                  min: -100,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletMarginTop,
                  suffix: v.tabletMarginTopSuffix
                },
                onChange: ({
                  value: tabletMarginTop,
                  suffix: tabletMarginTopSuffix
                }) => {
                  return {
                    tabletMarginTop,
                    tabletMarginTopSuffix,
                    tabletMargin:
                      tabletMarginTop === v.tabletMarginBottom
                        ? tabletMarginTop
                        : v.tabletMargin
                  };
                }
              },
              {
                id: "tabletMarginBottom",
                icon: "nc-styling-bottom",
                type: "slider",
                slider: {
                  min: -100,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.tabletMarginBottom,
                  suffix: v.tabletMarginBottomSuffix
                },
                onChange: ({
                  value: tabletMarginBottom,
                  suffix: tabletMarginBottomSuffix
                }) => {
                  return {
                    tabletMarginBottom,
                    tabletMarginBottomSuffix,
                    tabletMargin:
                      tabletMarginBottom === v.tabletMarginTop
                        ? tabletMarginBottom
                        : v.tabletMargin
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

export function getItemsForMobile(v, component) {
  const device = "mobile";
  const state = "normal";
  const { hex: mobileBgColorHex } =
    v.mobileBgColorHex !== null
      ? getOptionColor(v, "mobileBgColor")
      : getOptionColor(v, "bgColor");

  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    {
      id: "showOnMobile",
      type: "toggle",
      position: 70,
      choices: [
        {
          icon: "nc-eye-17",
          title: t("Disable on Mobile"),
          value: "on"
        },
        {
          icon: "nc-eye-ban-18",
          title: t("Enable on Mobile"),
          value: "off"
        }
      ],
      value: v.showOnMobile
    },
    {
      id: "mobileToolbarMedia",
      type: "popover",
      position: 80,
      icon: "nc-background",
      title: t("Background"),
      options: [
        {
          id: "mobileMedia",
          label: t("Type"),
          type: "radioGroup",
          choices: [
            {
              value: "image",
              icon: "nc-media-image"
            },
            {
              value: "map",
              icon: "nc-media-map"
            }
          ],
          value:
            mobileSyncOnChange(v, "media") === "video"
              ? "image"
              : mobileSyncOnChange(v, "media")
        },
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
            "onChangeBgImageDependencies",
            "onChangeBgImageColumnAndRowSyncMobile"
          ]
        }),
        {
          id: "mobileBgMapZoom",
          label: t("Zoom"),
          type: "slider",
          disabled: mobileSyncOnChange(v, "media") !== "map",
          slider: {
            min: 1,
            max: 21
          },
          input: {
            show: true
          },
          value: {
            value: mobileSyncOnChange(v, "bgMapZoom")
          },
          onChange: ({ value: mobileBgMapZoom }) => ({
            mobileBgMapZoom
          })
        }
      ]
    },
    {
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileBgColorHex,
            mobileSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies",
            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies",
            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
          ]
        }),
        toolbarBgColorFields({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies",
            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
          ]
        })
      ]
    },
    {
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      position: 110,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobilePadding,
                  suffix: v.mobilePaddingSuffix
                },
                onChange: ({
                  value: mobilePadding,
                  suffix: mobilePaddingSuffix
                }) => {
                  return {
                    mobilePadding,
                    mobilePaddingSuffix,
                    mobilePaddingTop: mobilePadding,
                    mobilePaddingRight: mobilePadding,
                    mobilePaddingBottom: mobilePadding,
                    mobilePaddingLeft: mobilePadding
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobilePaddingTop,
                  suffix: v.mobilePaddingTopSuffix
                },
                onChange: ({
                  value: mobilePaddingTop,
                  suffix: mobilePaddingTopSuffix
                }) => {
                  return {
                    mobilePaddingTop,
                    mobilePaddingTopSuffix,
                    mobilePadding:
                      mobilePaddingTop === v.mobilePaddingRight &&
                      mobilePaddingTop === v.mobilePaddingLeft &&
                      mobilePaddingTop === v.mobilePaddingBottom
                        ? mobilePaddingTop
                        : v.mobilePadding
                  };
                }
              },
              {
                id: "mobilePaddingRight",
                icon: "nc-styling-right",
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobilePaddingRight,
                  suffix: v.mobilePaddingRightSuffix
                },
                onChange: ({
                  value: mobilePaddingRight,
                  suffix: mobilePaddingRightSuffix
                }) => {
                  return {
                    mobilePaddingRight,
                    mobilePaddingRightSuffix,
                    mobilePadding:
                      mobilePaddingRight === v.mobilePaddingTop &&
                      mobilePaddingRight === v.mobilePaddingLeft &&
                      mobilePaddingRight === v.mobilePaddingBottom
                        ? mobilePaddingRight
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobilePaddingBottom,
                  suffix: v.mobilePaddingBottomSuffix
                },
                onChange: ({
                  value: mobilePaddingBottom,
                  suffix: mobilePaddingBottomSuffix
                }) => {
                  return {
                    mobilePaddingBottom,
                    mobilePaddingBottomSuffix,
                    mobilePadding:
                      mobilePaddingBottom === v.mobilePaddingTop &&
                      mobilePaddingBottom === v.mobilePaddingLeft &&
                      mobilePaddingBottom === v.mobilePaddingRight
                        ? mobilePaddingBottom
                        : v.mobilePadding
                  };
                }
              },
              {
                id: "mobilePaddingLeft",
                icon: "nc-styling-left",
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobilePaddingLeft,
                  suffix: v.mobilePaddingLeftSuffix
                },
                onChange: ({
                  value: mobilePaddingLeft,
                  suffix: mobilePaddingLeftSuffix
                }) => {
                  return {
                    mobilePaddingLeft,
                    mobilePaddingLeftSuffix,
                    mobilePadding:
                      mobilePaddingLeft === v.mobilePaddingTop &&
                      mobilePaddingLeft === v.mobilePaddingBottom &&
                      mobilePaddingLeft === v.mobilePaddingRight
                        ? mobilePaddingLeft
                        : v.mobilePadding
                  };
                }
              }
            ]
          }
        },
        {
          type: "multiPicker",
          disabled: inPopup,
          picker: {
            id: "mobileMarginType",
            label: t("Margin"),
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
            value: v.mobileMarginType
          },
          choices: {
            grouped: [
              {
                id: "mobileMargin",
                type: "slider",
                slider: {
                  min: -100,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobileMargin,
                  suffix: v.mobileMarginSuffix
                },
                onChange: ({
                  value: mobileMargin,
                  suffix: mobileMarginSuffix
                }) => {
                  return {
                    mobileMargin,
                    mobileMarginSuffix,
                    mobileMarginTop: mobileMargin,
                    mobileMarginBottom: mobileMargin
                  };
                }
              }
            ],
            ungrouped: [
              {
                id: "mobileMarginTop",
                icon: "nc-styling-top",
                type: "slider",
                slider: {
                  min: -100,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobileMarginTop,
                  suffix: v.mobileMarginTopSuffix
                },
                onChange: ({
                  value: mobileMarginTop,
                  suffix: mobileMarginTopSuffix
                }) => {
                  return {
                    mobileMarginTop,
                    mobileMarginTopSuffix,
                    mobileMargin:
                      mobileMarginTop === v.mobileMarginBottom
                        ? mobileMarginTop
                        : v.mobileMargin
                  };
                }
              },
              {
                id: "mobileMarginBottom",
                icon: "nc-styling-bottom",
                type: "slider",
                slider: {
                  min: -100,
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
                    },
                    {
                      title: "%",
                      value: "%"
                    }
                  ]
                },
                value: {
                  value: v.mobileMarginBottom,
                  suffix: v.mobileMarginBottomSuffix
                },
                onChange: ({
                  value: mobileMarginBottom,
                  suffix: mobileMarginBottomSuffix
                }) => {
                  return {
                    mobileMarginBottom,
                    mobileMarginBottomSuffix,
                    mobileMargin:
                      mobileMarginBottom === v.mobileMarginTop
                        ? mobileMarginBottom
                        : v.mobileMargin
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
