import { hexToRgba } from "visual/utils/color";
import { getOptionColor, getAnimations } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function getItemsForDesktop(v, component) {
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: borderColorHex } = getOptionColor(v, "borderColor");
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
      id: "toolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs",
          tabs: [
            {
              id: "image",
              label: t("Image"),
              options: [
                {
                  id: "bgImage",
                  label: t("Image"),
                  type: "imageSetter",
                  value: {
                    width: v.bgImageWidth,
                    height: v.bgImageHeight,
                    src: v.bgImageSrc,
                    x: v.bgPositionX,
                    y: v.bgPositionY
                  },
                  onChange: ({ width, height, src, x, y }) => ({
                    bgImageWidth: width,
                    bgImageHeight: height,
                    bgImageSrc: src,
                    bgPositionX: x,
                    bgPositionY: y,

                    bgColorOpacity:
                      src !== "" && v.bgColorOpacity === 1
                        ? 0.9
                        : v.bgColorOpacity,

                    tempBgColorOpacity:
                      src !== "" && v.bgColorOpacity === 1
                        ? 0.9
                        : v.tempBgColorOpacity,

                    // Tablet
                    tabletPaddingRight: !src ? 0 : v.tempTabletPaddingRight,
                    tabletPaddingLeft: !src ? 0 : v.tempTabletPaddingLeft,

                    // Mobile
                    mobilePaddingRight: !src ? 0 : v.tempMobilePaddingRight,
                    mobilePaddingLeft: !src ? 0 : v.tempMobilePaddingLeft
                  })
                }
              ]
            },
            {
              id: "video",
              label: t("Video"),
              options: [
                {
                  id: "bgVideo",
                  label: t("URL"),
                  type: "input",
                  inputType: "video",
                  placeholder: t("YouTube or Vimeo"),
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
                  value: v.bgVideoLoop
                }
              ]
            },
            {
              id: "map",
              label: t("Map"),
              options: [
                {
                  id: "bgMapAddress",
                  label: t("Address"),
                  type: "input",
                  placeholder: t("Enter address"),
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
            }
          ],
          value: v.media,
          onChange: media => ({ media })
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
        }
      },
      title: t("Colors"),
      options: [
        {
          id: "colorTabs",
          type: "tabs",
          tabs: [
            {
              label: t("Overlay"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: bgColorHex,
                    opacity: v.bgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    const bgColorOpacity =
                      hex !== v.bgColorHex && v.bgColorOpacity === 0
                        ? v.tempBgColorOpacity
                        : opacity;

                    return {
                      bgColorHex: hex,
                      bgColorOpacity: bgColorOpacity,
                      bgColorPalette:
                        isChanged === "hex" ? "" : v.bgColorPalette,

                      tempBgColorOpacity:
                        bgColorOpacity > 0 && opacityDragEnd
                          ? bgColorOpacity
                          : v.tempBgColorOpacity,

                      borderRadius:
                        bgColorOpacity === 0 && v.borderColorOpacity === 0
                          ? 0
                          : bgColorOpacity > 0
                            ? v.tempBorderRadius
                            : v.borderRadius,

                      borderTopLeftRadius:
                        bgColorOpacity === 0 && v.borderColorOpacity === 0
                          ? 0
                          : bgColorOpacity > 0
                            ? v.tempBorderTopLeftRadius
                            : v.borderTopLeftRadius,

                      borderTopRightRadius:
                        bgColorOpacity === 0 && v.borderColorOpacity === 0
                          ? 0
                          : bgColorOpacity > 0
                            ? v.tempBorderTopRightRadius
                            : v.borderTopRightRadius,

                      borderBottomRightRadius:
                        bgColorOpacity === 0 && v.borderColorOpacity === 0
                          ? 0
                          : bgColorOpacity > 0
                            ? v.tempBorderBottomRightRadius
                            : v.borderBottomRightRadius,

                      borderBottomLeftRadius:
                        bgColorOpacity === 0 && v.borderColorOpacity === 0
                          ? 0
                          : bgColorOpacity > 0
                            ? v.tempBorderBottomLeftRadius
                            : v.borderBottomLeftRadius,

                      // Tablet
                      tabletPaddingRight:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempTabletPaddingRight
                            : v.tabletPaddingRight,

                      tabletPaddingLeft:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempTabletPaddingLeft
                            : v.tabletPaddingLeft,

                      // Mobile
                      mobilePaddingRight:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempMobilePaddingRight
                            : v.mobilePaddingRight,

                      mobilePaddingLeft:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempMobilePaddingLeft
                            : v.mobilePaddingLeft
                    };
                  }
                },
                {
                  id: "bgColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.bgColorPalette,
                  onChange: value => ({
                    bgColorPalette: value,
                    bgColorHex: "",
                    bgColorOpacity:
                      v.bgColorOpacity === 0
                        ? v.tempBgColorOpacity
                        : v.bgColorOpacity,

                    // Tablet
                    tabletPaddingRight:
                      value !== ""
                        ? v.tempTabletPaddingRight
                        : v.tabletPaddingRight,

                    tabletPaddingLeft:
                      value !== ""
                        ? v.tempTabletPaddingLeft
                        : v.tabletPaddingLeft,

                    // Mobile
                    mobilePaddingRight:
                      value !== ""
                        ? v.tempMobilePaddingRight
                        : v.mobilePaddingRight,

                    mobilePaddingLeft:
                      value !== ""
                        ? v.tempMobilePaddingLeft
                        : v.mobilePaddingLeft
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
                  onChange: ({ hex, opacity, isChanged }) => {
                    const bgColorOpacity =
                      hex !== v.bgColorHex && v.bgColorOpacity === 0
                        ? v.tempBgColorOpacity
                        : opacity;

                    return {
                      bgColorPalette:
                        isChanged === "hex" ? "" : v.bgColorPalette,
                      bgColorHex: hex,
                      bgColorOpacity: bgColorOpacity,

                      // Tablet
                      tabletPaddingRight:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempTabletPaddingRight
                            : v.tabletPaddingRight,

                      tabletPaddingLeft:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempTabletPaddingLeft
                            : v.tabletPaddingLeft,

                      // Mobile
                      mobilePaddingRight:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempMobilePaddingRight
                            : v.mobilePaddingRight,

                      mobilePaddingLeft:
                        bgColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || bgColorOpacity > 0
                            ? v.tempMobilePaddingLeft
                            : v.mobilePaddingLeft
                    };
                  }
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
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    const borderColorOpacity =
                      hex !== v.borderColorHex && v.borderColorOpacity === 0
                        ? v.tempBorderColorOpacity
                        : opacity;

                    return {
                      borderColorHex: hex,
                      borderColorOpacity: borderColorOpacity,
                      borderColorPalette:
                        isChanged === "hex" ? "" : v.borderColorPalette,

                      tempBorderColorOpacity:
                        borderColorOpacity > 0 && opacityDragEnd
                          ? borderColorOpacity
                          : v.tempBorderColorOpacity,

                      borderWidth:
                        borderColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderWidth
                            : v.borderWidth,

                      borderTopWidth:
                        borderColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderTopWidth
                            : v.borderTopWidth,

                      borderRightWidth:
                        borderColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderRightWidth
                            : v.borderRightWidth,

                      borderBottomWidth:
                        borderColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderBottomWidth
                            : v.borderBottomWidth,

                      borderLeftWidth:
                        borderColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderLeftWidth
                            : v.borderLeftWidth,

                      borderRadius:
                        borderColorOpacity === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderRadius
                            : v.borderRadius,

                      borderTopLeftRadius:
                        borderColorOpacity === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderTopLeftRadius
                            : v.borderTopLeftRadius,

                      borderTopRightRadius:
                        borderColorOpacity === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderTopRightRadius
                            : v.borderTopRightRadius,

                      borderBottomRightRadius:
                        borderColorOpacity === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderBottomRightRadius
                            : v.borderBottomRightRadius,

                      borderBottomLeftRadius:
                        borderColorOpacity === 0 && v.bgColorOpacity === 0
                          ? 0
                          : borderColorOpacity > 0
                            ? v.tempBorderBottomLeftRadius
                            : v.borderBottomLeftRadius,

                      // Tablet
                      tabletPaddingRight:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempTabletPaddingRight
                            : v.tabletPaddingRight,

                      tabletPaddingLeft:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempTabletPaddingLeft
                            : v.tabletPaddingLeft,

                      // Mobile
                      mobilePaddingRight:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempMobilePaddingRight
                            : v.mobilePaddingRight,

                      mobilePaddingLeft:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempMobilePaddingLeft
                            : v.mobilePaddingLeft
                    };
                  }
                },
                {
                  id: "borderColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.borderColorPalette,
                  onChange: value => ({
                    borderColorPalette: value,
                    borderColorHex: "",
                    borderColorOpacity:
                      v.borderColorOpacity === 0
                        ? v.tempBorderColorOpacity
                        : v.borderColorOpacity,

                    borderWidth:
                      v.borderColorOpacity === 0
                        ? v.tempBorderWidth
                        : v.borderWidth,

                    // Tablet
                    tabletPaddingRight:
                      value !== ""
                        ? v.tempTabletPaddingRight
                        : v.tabletPaddingRight,

                    tabletPaddingLeft:
                      value !== ""
                        ? v.tempTabletPaddingLeft
                        : v.tabletPaddingLeft,

                    // Mobile
                    mobilePaddingRight:
                      value !== ""
                        ? v.tempMobilePaddingRight
                        : v.mobilePaddingRight,

                    mobilePaddingLeft:
                      value !== ""
                        ? v.tempMobilePaddingLeft
                        : v.mobilePaddingLeft
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
                  onChange: ({ hex, opacity, isChanged }) => {
                    const borderColorOpacity =
                      hex !== v.borderColorHex && v.borderColorOpacity === 0
                        ? v.tempBorderColorOpacity
                        : opacity;

                    return {
                      borderColorPalette:
                        isChanged === "hex" ? "" : v.borderColorPalette,
                      borderColorHex: hex,
                      borderColorOpacity: borderColorOpacity,

                      borderWidth:
                        v.borderColorOpacity === 0
                          ? v.tempBorderWidth
                          : v.borderWidth,

                      // Tablet
                      tabletPaddingRight:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempTabletPaddingRight
                            : v.tabletPaddingRight,

                      tabletPaddingLeft:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempTabletPaddingLeft
                            : v.tabletPaddingLeft,

                      // Mobile
                      mobilePaddingRight:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempMobilePaddingRight
                            : v.mobilePaddingRight,

                      mobilePaddingLeft:
                        borderColorOpacity === 0
                          ? 0
                          : isChanged === "hex" || borderColorOpacity > 0
                            ? v.tempMobilePaddingLeft
                            : v.mobilePaddingLeft
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
      id: "toolbarSettings",
      type: "popover",
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
                              in: -100,
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
                        id: "borderRadiusType",
                        label: t("Corner"),
                        type: "radioGroup",
                        choices: [
                          {
                            value: "grouped",
                            icon: "nc-corners-all"
                          },
                          {
                            value: "ungrouped",
                            icon: "nc-corners-individual"
                          }
                        ],
                        value: v.borderRadiusType
                      },
                      choices: {
                        grouped: [
                          {
                            id: "borderRadius",
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
                              value: v.borderRadius
                            },
                            onChange: (
                              { value: borderRadius },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderRadius,
                                borderTopLeftRadius: borderRadius,
                                borderTopRightRadius: borderRadius,
                                borderBottomLeftRadius: borderRadius,
                                borderBottomRightRadius: borderRadius,

                                tempBorderRadius: sliderDragEnd
                                  ? borderRadius
                                  : v.tempBorderRadius,

                                tempBorderTopLeftRadius:
                                  borderRadius > 0 && sliderDragEnd
                                    ? borderRadius
                                    : v.tempBorderTopLeftRadius,

                                tempBorderTopRightRadius:
                                  borderRadius > 0 && sliderDragEnd
                                    ? borderRadius
                                    : v.tempBorderTopRightRadius,

                                tempBorderBottomRightRadius:
                                  borderRadius > 0 && sliderDragEnd
                                    ? borderRadius
                                    : v.tempBorderBottomRightRadius,

                                tempBorderBottomLeftRadius:
                                  borderRadius > 0 && sliderDragEnd
                                    ? borderRadius
                                    : v.tempBorderBottomLeftRadius,

                                bgColorOpacity:
                                  borderRadius > 0 && v.borderColorOpacity === 0
                                    ? v.tempBgColorOpacity
                                    : v.bgColorOpacity
                              };
                            }
                          }
                        ],
                        ungrouped: [
                          {
                            id: "borderTopLeftRadius",
                            icon: "nc-corners-top-left",
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
                              value: v.borderTopLeftRadius
                            },
                            onChange: (
                              { value: borderTopLeftRadius },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderTopLeftRadius,

                                borderTopRightRadius:
                                  borderTopLeftRadius > 0
                                    ? v.tempBorderTopRightRadius
                                    : v.borderTopRightRadius,

                                borderBottomLeftRadius:
                                  borderTopLeftRadius > 0
                                    ? v.tempBorderBottomLeftRadius
                                    : v.borderBottomLeftRadius,

                                borderBottomRightRadius:
                                  borderTopLeftRadius > 0
                                    ? v.tempBorderBottomRightRadius
                                    : v.borderBottomRightRadius,

                                borderRadius:
                                  borderTopLeftRadius ===
                                    v.borderTopRightRadius &&
                                  borderTopLeftRadius ===
                                    v.borderBottomRightRadius &&
                                  borderTopLeftRadius ===
                                    v.borderBottomLeftRadius
                                    ? borderTopLeftRadius
                                    : v.borderRadius,

                                tempBorderTopLeftRadius: borderTopLeftRadius,

                                tempBorderRadius:
                                  sliderDragEnd &&
                                  borderTopLeftRadius ===
                                    v.borderTopRightRadius &&
                                  borderTopLeftRadius ===
                                    v.borderBottomRightRadius &&
                                  borderTopLeftRadius ===
                                    v.borderBottomLeftRadius
                                    ? borderTopLeftRadius
                                    : v.tempBorderRadius,

                                bgColorOpacity:
                                  borderTopLeftRadius > 0 &&
                                  v.borderColorOpacity === 0
                                    ? v.tempBgColorOpacity
                                    : v.bgColorOpacity
                              };
                            }
                          },
                          {
                            id: "borderTopRightRadius",
                            icon: "nc-corners-top-right",
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
                              value: v.borderTopRightRadius
                            },
                            onChange: (
                              { value: borderTopRightRadius },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderTopRightRadius,

                                borderTopLeftRadius:
                                  borderTopRightRadius > 0
                                    ? v.tempBorderTopLeftRadius
                                    : v.borderTopLeftRadius,

                                borderBottomLeftRadius:
                                  borderTopRightRadius > 0
                                    ? v.tempBorderBottomLeftRadius
                                    : v.borderBottomLeftRadius,

                                borderBottomRightRadius:
                                  borderTopRightRadius > 0
                                    ? v.tempBorderBottomRightRadius
                                    : v.borderBottomRightRadius,

                                borderRadius:
                                  borderTopRightRadius ===
                                    v.borderTopLeftRadius &&
                                  borderTopRightRadius ===
                                    v.borderBottomRightRadius &&
                                  borderTopRightRadius ===
                                    v.borderBottomLeftRadius
                                    ? borderTopRightRadius
                                    : v.borderRadius,

                                tempBorderTopRightRadius: borderTopRightRadius,

                                tempBorderRadius:
                                  sliderDragEnd &&
                                  borderTopRightRadius ===
                                    v.borderTopLeftRadius &&
                                  borderTopRightRadius ===
                                    v.borderBottomRightRadius &&
                                  borderTopRightRadius ===
                                    v.borderBottomLeftRadius
                                    ? borderTopRightRadius
                                    : v.tempBorderRadius,

                                bgColorOpacity:
                                  borderTopRightRadius > 0 &&
                                  v.borderColorOpacity === 0
                                    ? v.tempBgColorOpacity
                                    : v.bgColorOpacity
                              };
                            }
                          },
                          {
                            id: "borderBottomRightRadius",
                            icon: "nc-corners-bottom-right",
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
                              value: v.borderBottomRightRadius
                            },
                            onChange: (
                              { value: borderBottomRightRadius },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderBottomRightRadius,

                                borderTopLeftRadius:
                                  borderBottomRightRadius > 0
                                    ? v.tempBorderTopLeftRadius
                                    : v.borderTopLeftRadius,

                                borderBottomLeftRadius:
                                  borderBottomRightRadius > 0
                                    ? v.tempBorderBottomLeftRadius
                                    : v.borderBottomLeftRadius,

                                borderTopRightRadius:
                                  borderBottomRightRadius > 0
                                    ? v.tempBorderTopRightRadius
                                    : v.borderTopRightRadius,

                                borderRadius:
                                  borderBottomRightRadius ===
                                    v.borderTopLeftRadius &&
                                  borderBottomRightRadius ===
                                    v.borderTopRightRadius &&
                                  borderBottomRightRadius ===
                                    v.borderBottomLeftRadius
                                    ? borderBottomRightRadius
                                    : v.borderRadius,

                                tempBorderBottomRightRadius: borderBottomRightRadius,

                                tempBorderRadius:
                                  sliderDragEnd &&
                                  borderBottomRightRadius ===
                                    v.borderTopLeftRadius &&
                                  borderBottomRightRadius ===
                                    v.borderTopRightRadius &&
                                  borderBottomRightRadius ===
                                    v.borderBottomLeftRadius
                                    ? borderBottomRightRadius
                                    : v.tempBorderRadius,

                                bgColorOpacity:
                                  borderBottomRightRadius > 0 &&
                                  v.borderColorOpacity === 0
                                    ? v.tempBgColorOpacity
                                    : v.bgColorOpacity
                              };
                            }
                          },
                          {
                            id: "borderBottomLeftRadius",
                            icon: "nc-corners-bottom-left",
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
                              value: v.borderBottomLeftRadius
                            },
                            onChange: (
                              { value: borderBottomLeftRadius },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderBottomLeftRadius,

                                borderTopLeftRadius:
                                  borderBottomLeftRadius > 0
                                    ? v.tempBorderTopLeftRadius
                                    : v.borderTopLeftRadius,

                                borderBottomRightRadius:
                                  borderBottomLeftRadius > 0
                                    ? v.tempBorderBottomRightRadius
                                    : v.borderBottomRightRadius,

                                borderTopRightRadius:
                                  borderBottomLeftRadius > 0
                                    ? v.tempBorderTopRightRadius
                                    : v.borderTopRightRadius,

                                borderRadius:
                                  borderBottomLeftRadius ===
                                    v.borderTopLeftRadius &&
                                  borderBottomLeftRadius ===
                                    v.borderTopRightRadius &&
                                  borderBottomLeftRadius ===
                                    v.borderBottomRightRadius
                                    ? borderBottomLeftRadius
                                    : v.borderRadius,

                                tempBorderBottomLeftRadius: borderBottomLeftRadius,

                                tempBorderRadius:
                                  sliderDragEnd &&
                                  borderBottomLeftRadius ===
                                    v.borderTopLeftRadius &&
                                  borderBottomLeftRadius ===
                                    v.borderTopRightRadius &&
                                  borderBottomLeftRadius ===
                                    v.borderBottomRightRadius
                                    ? borderBottomLeftRadius
                                    : v.tempBorderRadius,

                                bgColorOpacity:
                                  borderBottomLeftRadius > 0 &&
                                  v.borderColorOpacity === 0
                                    ? v.tempBgColorOpacity
                                    : v.bgColorOpacity
                              };
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: "multiPicker",
                      picker: {
                        id: "borderWidthType",
                        label: t("Border"),
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
                        value: v.borderWidthType
                      },
                      choices: {
                        grouped: [
                          {
                            id: "borderWidth",
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
                              value: v.borderWidth
                            },
                            onChange: (
                              { value: borderWidth },
                              { sliderDragEnd }
                            ) => {
                              const tempBorderWidth =
                                borderWidth > 0 && sliderDragEnd
                                  ? borderWidth
                                  : v.tempBorderWidth;

                              return {
                                borderWidth,
                                borderTopWidth: borderWidth,
                                borderRightWidth: borderWidth,
                                borderBottomWidth: borderWidth,
                                borderLeftWidth: borderWidth,

                                tempBorderWidth: tempBorderWidth,
                                tempBorderTopWidth: tempBorderWidth,
                                tempBorderRightWidth: tempBorderWidth,
                                tempBorderBottomWidth: tempBorderWidth,
                                tempBorderLeftWidth: tempBorderWidth,

                                borderColorOpacity:
                                  borderWidth === 0
                                    ? 0
                                    : borderWidth > 0
                                      ? v.tempBorderColorOpacity
                                      : v.borderColorOpacity,

                                borderRadius:
                                  borderWidth === 0 && v.bgColorOpacity === 0
                                    ? 0
                                    : borderWidth > 0
                                      ? v.tempBorderRadius
                                      : v.borderRadius,

                                borderTopLeftRadius:
                                  borderWidth === 0 && v.bgColorOpacity === 0
                                    ? 0
                                    : borderWidth > 0 &&
                                      v.borderTopRightRadius === 0 &&
                                      v.borderBottomRightRadius === 0 &&
                                      v.borderBottomLeftRadius === 0
                                      ? v.tempBorderTopLeftRadius
                                      : v.borderTopLeftRadius,

                                borderTopRightRadius:
                                  borderWidth === 0 && v.bgColorOpacity === 0
                                    ? 0
                                    : borderWidth > 0 &&
                                      v.borderTopLeftRadius === 0 &&
                                      v.borderBottomRightRadius === 0 &&
                                      v.borderBottomLeftRadius === 0
                                      ? v.tempBorderTopRightRadius
                                      : v.borderTopRightRadius,

                                borderBottomLeftRadius:
                                  borderWidth === 0 && v.bgColorOpacity === 0
                                    ? 0
                                    : borderWidth > 0 &&
                                      v.borderTopLeftRadius === 0 &&
                                      v.borderTopRightRadius === 0 &&
                                      v.borderBottomRightRadius === 0
                                      ? v.tempBorderBottomLeftRadius
                                      : v.borderBottomLeftRadius,

                                borderBottomRightRadius:
                                  borderWidth === 0 && v.bgColorOpacity === 0
                                    ? 0
                                    : borderWidth > 0 &&
                                      v.borderTopLeftRadius === 0 &&
                                      v.borderTopRightRadius === 0 &&
                                      v.borderBottomLeftRadius === 0
                                      ? v.tempBorderBottomRightRadius
                                      : v.borderBottomRightRadius
                              };
                            }
                          }
                        ],
                        ungrouped: [
                          {
                            id: "borderTopWidth",
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
                              value: v.borderTopWidth
                            },
                            onChange: (
                              { value: borderTopWidth },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderTopWidth,

                                borderWidth:
                                  borderTopWidth === v.borderRightWidth &&
                                  borderTopWidth === v.borderBottomWidth &&
                                  borderTopWidth === v.borderLeftWidth
                                    ? borderTopWidth
                                    : v.borderWidth,

                                tempBorderTopWidth: borderTopWidth,

                                tempBorderRightWidth:
                                  v.borderRightWidth === 0
                                    ? 0
                                    : v.tempBorderRightWidth,

                                tempBorderBottomWidth:
                                  v.borderBottomWidth === 0
                                    ? 0
                                    : v.tempBorderBottomWidth,

                                tempBorderLeftWidth:
                                  v.borderLeftWidth === 0
                                    ? 0
                                    : v.tempBorderLeftWidth,

                                tempBorderWidth:
                                  sliderDragEnd &&
                                  borderTopWidth === v.borderRightWidth &&
                                  borderTopWidth === v.borderBottomWidth &&
                                  borderTopWidth === v.borderLeftWidth
                                    ? borderTopWidth
                                    : v.tempBorderWidth,

                                borderColorOpacity:
                                  borderTopWidth === 0 &&
                                  v.borderRightWidth === 0 &&
                                  v.borderBottomWidth === 0 &&
                                  v.borderLeftWidth === 0
                                    ? 0
                                    : borderTopWidth > 0
                                      ? v.tempBorderColorOpacity
                                      : v.borderColorOpacity
                              };
                            }
                          },
                          {
                            id: "borderRightWidth",
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
                                }
                              ]
                            },
                            value: {
                              value: v.borderRightWidth
                            },
                            onChange: (
                              { value: borderRightWidth },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderRightWidth,

                                borderWidth:
                                  borderRightWidth === v.borderTopWidth &&
                                  borderRightWidth === v.borderBottomWidth &&
                                  borderRightWidth === v.borderLeftWidth
                                    ? borderRightWidth
                                    : v.borderWidth,

                                tempBorderRightWidth: borderRightWidth,

                                tempBorderLeftWidth:
                                  v.borderLeftWidth === 0
                                    ? 0
                                    : v.tempBorderLeftWidth,

                                tempBorderBottomWidth:
                                  v.borderBottomWidth === 0
                                    ? 0
                                    : v.tempBorderBottomWidth,

                                tempBorderTopWidth:
                                  v.borderTopWidth === 0
                                    ? 0
                                    : v.tempBorderTopWidth,

                                tempBorderWidth:
                                  sliderDragEnd &&
                                  borderRightWidth === v.borderTopWidth &&
                                  borderRightWidth === v.borderBottomWidth &&
                                  borderRightWidth === v.borderLeftWidth
                                    ? borderRightWidth
                                    : v.tempBorderWidth,

                                borderColorOpacity:
                                  borderRightWidth === 0 &&
                                  v.borderTopWidth === 0 &&
                                  v.borderBottomWidth === 0 &&
                                  v.borderLeftWidth === 0
                                    ? 0
                                    : borderRightWidth > 0
                                      ? v.tempBorderColorOpacity
                                      : v.borderColorOpacity
                              };
                            }
                          },
                          {
                            id: "borderBottomWidth",
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
                              value: v.borderBottomWidth
                            },
                            onChange: (
                              { value: borderBottomWidth },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderBottomWidth,

                                borderWidth:
                                  borderBottomWidth === v.borderRightWidth &&
                                  borderBottomWidth === v.borderTopWidth &&
                                  borderBottomWidth === v.borderLeftWidth
                                    ? borderBottomWidth
                                    : v.borderWidth,

                                tempBorderRightWidth:
                                  v.borderRightWidth === 0
                                    ? 0
                                    : v.tempBorderRightWidth,

                                tempBorderTopWidth:
                                  v.borderTopWidth === 0
                                    ? 0
                                    : v.tempBorderTopWidth,

                                tempBorderLeftWidth:
                                  v.borderLeftWidth === 0
                                    ? 0
                                    : v.tempBorderLeftWidth,

                                tempBorderBottomWidth: borderBottomWidth,

                                tempBorderWidth:
                                  sliderDragEnd &&
                                  borderBottomWidth === v.borderRightWidth &&
                                  borderBottomWidth === v.borderTopWidth &&
                                  borderBottomWidth === v.borderLeftWidth
                                    ? borderBottomWidth
                                    : v.tempBorderWidth,

                                borderColorOpacity:
                                  borderBottomWidth === 0 &&
                                  v.borderTopWidth === 0 &&
                                  v.borderRightWidth === 0 &&
                                  v.borderLeftWidth === 0
                                    ? 0
                                    : borderBottomWidth > 0
                                      ? v.tempBorderColorOpacity
                                      : v.borderColorOpacity
                              };
                            }
                          },
                          {
                            id: "borderLeftWidth",
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
                                }
                              ]
                            },
                            value: {
                              value: v.borderLeftWidth
                            },
                            onChange: (
                              { value: borderLeftWidth },
                              { sliderDragEnd }
                            ) => {
                              return {
                                borderLeftWidth,

                                borderWidth:
                                  borderLeftWidth === v.borderRightWidth &&
                                  borderLeftWidth === v.borderBottomWidth &&
                                  borderLeftWidth === v.borderTopWidth
                                    ? borderLeftWidth
                                    : v.borderWidth,

                                tempBorderRightWidth:
                                  v.borderRightWidth === 0
                                    ? 0
                                    : v.tempBorderRightWidth,

                                tempBorderTopWidth:
                                  v.borderTopWidth === 0
                                    ? 0
                                    : v.tempBorderTopWidth,

                                tempBorderBottomWidth:
                                  v.borderBottomWidth === 0
                                    ? 0
                                    : v.tempBorderBottomWidth,

                                tempBorderLeftWidth: borderLeftWidth,

                                tempBorderWidth:
                                  sliderDragEnd &&
                                  borderLeftWidth === v.borderRightWidth &&
                                  borderLeftWidth === v.borderBottomWidth &&
                                  borderLeftWidth === v.borderTopWidth
                                    ? borderLeftWidth
                                    : v.tempBorderWidth,

                                borderColorOpacity:
                                  borderLeftWidth === 0 &&
                                  v.borderTopWidth === 0 &&
                                  v.borderRightWidth === 0 &&
                                  v.borderBottomWidth === 0
                                    ? 0
                                    : borderLeftWidth > 0
                                      ? v.tempBorderColorOpacity
                                      : v.borderColorOpacity
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
  const { hex: tabletBgColorHex } =
    v.tabletBgColorHex !== null
      ? getOptionColor(v, "tabletBgColor")
      : getOptionColor(v, "bgColor");

  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    {
      id: "showOnTablet",
      type: "toggle",
      position: 70,
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
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: "tabletMedia",
          type: "tabs",
          tabs: [
            {
              id: "image",
              label: t("Image"),
              options: [
                {
                  id: "tabletImage",
                  label: t("Image"),
                  type: "imageSetter",
                  value: {
                    width: tabletSyncOnChange(v, "bgImageWidth"),
                    height: tabletSyncOnChange(v, "bgImageHeight"),
                    src: tabletSyncOnChange(v, "bgImageSrc"),
                    x: tabletSyncOnChange(v, "bgPositionX"),
                    y: tabletSyncOnChange(v, "bgPositionY")
                  },
                  onChange: ({ width, height, src, x, y }) => ({
                    tabletBgImageWidth: width,
                    tabletBgImageHeight: height,
                    tabletBgImageSrc: src,
                    tabletBgPositionX: x,
                    tabletBgPositionY: y,

                    tabletMedia: src !== "" ? "image" : tabletSyncOnChange(v, "media"),

                    tabletBgColorOpacity:
                      src !== "" && tabletSyncOnChange(v, "bgColorOpacity") === 1
                        ? 0.9
                        : tabletSyncOnChange(v, "bgColorOpacity"),

                    tabletPaddingRight: !src ? 0 : v.tempTabletPaddingRight,
                    tabletPaddingLeft: !src ? 0 : v.tempTabletPaddingLeft
                  })
                }
              ]
            },
            {
              id: "map",
              label: t("Map"),
              options: [
                {
                  id: "tabletBgMapZoom",
                  label: t("Zoom"),
                  type: "slider",
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
            }
          ],
          value: tabletSyncOnChange(v, "media") === "video" ? "image" : tabletSyncOnChange(v, "media")
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
          backgroundColor: hexToRgba(tabletBgColorHex, tabletSyncOnChange(v, "bgColorOpacity"))
        }
      },
      options: [
        {
          id: "tabletBgColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: tabletBgColorHex,
            opacity: tabletSyncOnChange(v, "bgColorOpacity")
          },
          onChange: ({ hex, opacity, isChanged }) => {
            const bgColorOpacity =
              hex !== tabletBgColorHex && tabletSyncOnChange(v, "bgColorOpacity") === 0
                ? v.tempBgColorOpacity
                : opacity;

            return {
              tabletBgColorHex: hex,
              tabletBgColorOpacity: bgColorOpacity,
              tabletBgColorPalette:
                isChanged === "hex" ? "" : tabletSyncOnChange(v, "bgColorPalette"),

              tabletPaddingRight:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempTabletPaddingRight
                    : v.tabletPaddingRight,

              tabletPaddingLeft:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempTabletPaddingLeft
                    : v.tabletPaddingLeft
            };
          }
        },
        {
          id: "tabletBgColorPalette",
          type: "colorPalette",
          position: 20,
          value: tabletSyncOnChange(v, "bgColorPalette"),
          onChange: value => ({
            tabletBgColorPalette: value,
            tabletBgColorHex: "",
            tabletBgColorOpacity:
              tabletSyncOnChange(v, "bgColorOpacity") === 0
                ? v.tempBgColorOpacity
                : tabletSyncOnChange(v, "bgColorOpacity"),

            tabletPaddingRight:
              value !== "" ? v.tempTabletPaddingRight : v.tabletPaddingRight,

            tabletPaddingLeft:
              value !== "" ? v.tempTabletPaddingLeft : v.tabletPaddingLeft
          })
        },
        {
          id: "tabletBgColorFields",
          type: "colorFields",
          position: 30,
          value: {
            hex: tabletBgColorHex,
            opacity: tabletSyncOnChange(v, "bgColorOpacity")
          },
          onChange: ({ hex, opacity, isChanged }) => {
            const bgColorOpacity =
              hex !== v.bgColorHex && v.bgColorOpacity === 0
                ? v.tempBgColorOpacity
                : opacity;

            return {
              tabletBgColorPalette:
                isChanged === "hex" ? "" : tabletSyncOnChange(v, "bgColorPalette"),
              tabletBgColorHex: hex,
              tabletBgColorOpacity: bgColorOpacity,

              tabletPaddingRight:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempTabletPaddingRight
                    : v.tabletPaddingRight,

              tabletPaddingLeft:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempTabletPaddingLeft
                    : v.tabletPaddingLeft
            };
          }
        }
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
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: "mobileMedia",
          type: "tabs",
          tabs: [
            {
              id: "image",
              label: t("Image"),
              options: [
                {
                  id: "mobileImage",
                  label: t("Image"),
                  type: "imageSetter",
                  value: {
                    width: mobileSyncOnChange(v, "bgImageWidth"),
                    height: mobileSyncOnChange(v, "bgImageHeight"),
                    src: mobileSyncOnChange(v, "bgImageSrc"),
                    x: mobileSyncOnChange(v, "bgPositionX"),
                    y: mobileSyncOnChange(v, "bgPositionY")
                  },
                  onChange: ({ width, height, src, x, y }) => ({
                    mobileBgImageWidth: width,
                    mobileBgImageHeight: height,
                    mobileBgImageSrc: src,
                    mobileBgPositionX: x,
                    mobileBgPositionY: y,

                    mobileMedia: src !== "" ? "image" : mobileSyncOnChange(v, "media"),

                    mobileBgColorOpacity:
                      src !== "" && mobileSyncOnChange(v, "bgColorOpacity") === 1
                        ? 0.9
                        : mobileSyncOnChange(v, "bgColorOpacity"),

                    mobilePaddingRight: !src ? 0 : v.tempMobilePaddingRight,
                    mobilePaddingLeft: !src ? 0 : v.tempMobilePaddingLeft
                  })
                }
              ]
            },
            {
              id: "map",
              label: t("Map"),
              options: [
                {
                  id: "mobileBgMapZoom",
                  label: t("Zoom"),
                  type: "slider",
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
            }
          ],
          value: mobileSyncOnChange(v, "media") === "video" ? "image" : mobileSyncOnChange(v, "media")
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
          backgroundColor: hexToRgba(mobileBgColorHex, mobileSyncOnChange(v, "bgColorOpacity"))
        }
      },
      options: [
        {
          id: "mobileBgColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: mobileBgColorHex,
            opacity: mobileSyncOnChange(v, "bgColorOpacity")
          },
          onChange: ({ hex, opacity, isChanged }) => {
            const bgColorOpacity =
              hex !== mobileBgColorHex && mobileSyncOnChange(v, "bgColorOpacity") === 0
                ? v.tempBgColorOpacity
                : opacity;

            return {
              mobileBgColorHex: hex,
              mobileBgColorOpacity: bgColorOpacity,
              mobileBgColorPalette:
                isChanged === "hex" ? "" : mobileSyncOnChange(v, "bgColorPalette"),

              mobilePaddingRight:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempMobilePaddingRight
                    : v.mobilePaddingRight,

              mobilePaddingLeft:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempMobilePaddingLeft
                    : v.mobilePaddingLeft
            };
          }
        },
        {
          id: "mobileBgColorPalette",
          type: "colorPalette",
          position: 20,
          value: mobileSyncOnChange(v, "bgColorPalette"),
          onChange: value => ({
            mobileBgColorPalette: value,
            mobileBgColorHex: "",
            mobileBgColorOpacity:
              mobileSyncOnChange(v, "bgColorOpacity") === 0
                ? v.tempBgColorOpacity
                : mobileSyncOnChange(v, "bgColorOpacity"),

            mobilePaddingRight:
              value !== "" ? v.tempMobilePaddingRight : v.mobilePaddingRight,

            mobilePaddingLeft:
              value !== "" ? v.tempMobilePaddingLeft : v.mobilePaddingLeft
          })
        },
        {
          id: "mobileBgColorFields",
          type: "colorFields",
          position: 30,
          value: {
            hex: mobileBgColorHex,
            opacity: mobileSyncOnChange(v, "bgColorOpacity")
          },
          onChange: ({ hex, opacity, isChanged }) => {
            const bgColorOpacity =
              hex !== v.bgColorHex && v.bgColorOpacity === 0
                ? v.tempBgColorOpacity
                : opacity;

            return {
              mobileBgColorPalette:
                isChanged === "hex" ? "" : mobileSyncOnChange(v, "bgColorPalette"),
              mobileBgColorHex: hex,
              mobileBgColorOpacity: bgColorOpacity,

              mobilePaddingRight:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempMobilePaddingRight
                    : v.mobilePaddingRight,

              mobilePaddingLeft:
                bgColorOpacity === 0
                  ? 0
                  : isChanged === "hex" || bgColorOpacity > 0
                    ? v.tempMobilePaddingLeft
                    : v.mobilePaddingLeft
            };
          }
        }
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
