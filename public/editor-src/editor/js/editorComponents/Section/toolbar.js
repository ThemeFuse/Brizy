import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v, component) {
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: borderColorHex } = getOptionColor(v, "borderColor");
  const { meta } = component.props;

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

                    // Mobile
                    mobileBgImageWidth:
                      v.bgImageWidth === v.mobileBgImageWidth
                        ? width
                        : v.mobileBgImageWidth,

                    mobileBgImageHeight:
                      v.bgImageHeight === v.mobileBgImageHeight
                        ? height
                        : v.mobileBgImageHeight,

                    mobileBgImageSrc:
                      v.bgImageSrc === v.mobileBgImageSrc
                        ? src
                        : v.mobileBgImageSrc,

                    mobileBgPositionX:
                      v.bgPositionX === v.mobileBgPositionX
                        ? x
                        : v.mobileBgPositionX,

                    mobileBgPositionY:
                      v.bgPositionX === v.mobileBgPositionX
                        ? y
                        : v.mobileBgPositionY,

                    mobileBgColorOpacity:
                      src !== "" &&
                      v.bgImageSrc === v.mobileBgImageSrc &&
                      v.mobileBgColorOpacity === 1
                        ? 0.9
                        : v.mobileBgColorOpacity,

                    tempMobileBgColorOpacity:
                      src !== "" &&
                      v.bgImageSrc === v.mobileBgImageSrc &&
                      v.mobileBgColorOpacity === 1
                        ? 0.9
                        : v.tempMobileBgColorOpacity
                  })
                },
                {
                  id: "bgAttachment",
                  label: t("Parallax"),
                  type: "select",
                  choices: [
                    {
                      title: t("None"),
                      value: "none"
                    },
                    {
                      title: t("Fixed"),
                      value: "fixed"
                    },
                    {
                      title: t("Animated"),
                      value: "animated"
                    }
                  ],
                  disabled: meta.showSlider,
                  value: v.bgAttachment
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
                  value: v.bgVideo,
                  onChange: bgVideo => ({
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
                  value: v.bgMapAddress
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
                    show: true
                  },
                  value: { value: v.bgMapZoom },
                  onChange: ({ value: bgMapZoom }) => {
                    return {
                      bgMapZoom,
                      mobileBgMapZoom: bgMapZoom
                    };
                  }
                }
              ]
            }
          ],
          value: v.media,
          onChange: media => {
            return {
              media,
              mobileMedia: v.media === v.mobileMedia ? media : v.mobileMedia
            };
          }
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

                      mobileBgColorHex:
                        v.bgColorHex === v.mobileBgColorHex
                          ? hex
                          : v.mobileBgColorHex,

                      mobileBgColorOpacity:
                        v.bgColorOpacity === v.mobileBgColorOpacity
                          ? bgColorOpacity
                          : v.mobileBgColorOpacity,

                      mobileBgColorPalette:
                        v.bgColorPalette === v.mobileBgColorPalette &&
                        isChanged === "hex"
                          ? ""
                          : v.mobileBgColorPalette,

                      tempBgColorOpacity:
                        bgColorOpacity > 0 && opacityDragEnd
                          ? bgColorOpacity
                          : v.tempBgColorOpacity
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

                    mobileBgColorPalette:
                      v.bgColorPalette === v.mobileBgColorPalette
                        ? value
                        : v.mobileBgColorPalette,

                    mobileBgColorHex:
                      v.bgColorPalette === v.mobileBgColorPalette
                        ? ""
                        : v.mobileBgColorHex,

                    mobileBgColorOpacity:
                      v.bgColorPalette === v.mobileBgColorPalette
                        ? v.tempBgColorOpacity
                        : v.mobileBgColorOpacity
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

                      mobileBgColorHex:
                        v.bgColorHex === v.mobileBgColorHex
                          ? hex
                          : v.mobileBgColorHex,

                      mobileBgColorOpacity:
                        v.bgColorOpacity === v.mobileBgColorOpacity
                          ? bgColorOpacity
                          : v.mobileBgColorOpacity,

                      mobileBgColorPalette:
                        v.bgColorPalette === v.mobileBgColorPalette &&
                        isChanged === "hex"
                          ? ""
                          : v.mobileBgColorPalette
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
                            : v.borderLeftWidth
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
                        : v.borderWidth
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
                          : v.borderWidth
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
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const { hex: mobileBgColorHex } = getOptionColor(v, "mobileBgColor");

  return [
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
                    width: v.mobileBgImageWidth,
                    height: v.mobileBgImageHeight,
                    src: v.mobileBgImageSrc,
                    x: v.mobileBgPositionX,
                    y: v.mobileBgPositionY
                  },
                  onChange: ({ width, height, src, x, y }) => ({
                    mobileBgImageWidth: width,
                    mobileBgImageHeight: height,
                    mobileBgImageSrc: src,
                    mobileBgPositionX: x,
                    mobileBgPositionY: y,

                    mobileBgColorOpacity:
                      src !== "" && v.mobileBgColorOpacity === 1
                        ? 0.9
                        : v.mobileBgColorOpacity,

                    tempMobileBgColorOpacity:
                      src !== "" && v.mobileBgColorOpacity === 1
                        ? 0.9
                        : v.tempMobileBgColorOpacity
                  })
                },
                {
                  id: "mobileBgAttachment",
                  label: t("Parallax"),
                  type: "select",
                  choices: [
                    {
                      title: t("None"),
                      value: "none"
                    },
                    {
                      title: t("Fixed"),
                      value: "fixed"
                    }
                  ],
                  value: v.mobileBgAttachment
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
                    value: v.mobileBgMapZoom
                  },
                  onChange: ({ value: mobileBgMapZoom }) => ({
                    mobileBgMapZoom
                  })
                }
              ]
            }
          ],
          value: v.mobileMedia
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
          backgroundColor: hexToRgba(mobileBgColorHex, v.mobileBgColorOpacity)
        }
      },
      options: [
        {
          id: "mobileBgColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: mobileBgColorHex,
            opacity: v.mobileBgColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => {
            const bgColorOpacity =
              hex !== v.mobileBgColorHex && v.mobileBgColorOpacity === 0
                ? v.tempBgColorOpacity
                : opacity;

            return {
              mobileBgColorHex: hex,
              mobileBgColorOpacity: bgColorOpacity,
              mobileBgColorPalette:
                isChanged === "hex" ? "" : v.mobileBgColorPalette
            };
          }
        },
        {
          id: "mobileBgColorPalette",
          type: "colorPalette",
          position: 20,
          value: v.mobileBgColorPalette,
          onChange: value => ({
            mobileBgColorPalette: value,
            mobileBgColorHex: "",
            mobileBgColorOpacity:
              v.mobileBgColorOpacity === 0
                ? v.tempBgColorOpacity
                : v.mobileBgColorOpacity
          })
        },
        {
          id: "mobileBgColorFields",
          type: "colorFields",
          position: 30,
          value: {
            hex: mobileBgColorHex,
            opacity: v.mobileBgColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => ({
            mobileBgColorPalette:
              isChanged === "hex" ? "" : v.mobileBgColorPalette,
            mobileBgColorHex: hex,
            mobileBgColorOpacity: opacity
          })
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
