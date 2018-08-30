import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: hoverBgColorHex } = getOptionColor(v, "hoverBgColor");
  const { hex: boxShadowColorHex } = getOptionColor(v, "boxShadowColor");

  return [
    {
      id: "toolbarVideo",
      type: "popover",
      icon: "nc-play",
      title: t("Video"),
      position: 80,
      options: [
        {
          id: "videoTabs",
          type: "tabs",
          tabs: [
            {
              id: "videoTab",
              label: t("Video"),
              options: [
                {
                  id: "video",
                  label: t("Video Link"),
                  type: "input",
                  placeholder: t("YouTube or Vimeo"),
                  value: {
                    value: v.video
                  },
                  onChange: ({ value: video }) => ({
                    video
                  })
                },
                {
                  id: "ratio",
                  label: t("Ratio"),
                  type: "select",
                  roles: ["admin"],
                  choices: [
                    {
                      title: "16:9",
                      value: "16:9"
                    },
                    {
                      title: "4:3",
                      value: "4:3"
                    }
                  ],
                  value: v.ratio
                },
                {
                  id: "controls",
                  label: t("Controls"),
                  type: "switch",
                  roles: ["admin"],
                  value: v.controls
                }
              ]
            },
            {
              id: "coverTab",
              label: t("Cover"),
              options: [
                {
                  id: "cover",
                  label: t("Cover"),
                  type: "imageSetter",
                  value: {
                    width: v.coverImageWidth,
                    height: v.coverImageHeight,
                    src: v.coverImageSrc,
                    x: v.coverPositionX,
                    y: v.coverPositionY
                  },
                  onChange: ({ width, height, src, x, y }) => {
                    return {
                      coverImageWidth: width,
                      coverImageHeight: height,
                      coverImageSrc: src,
                      coverPositionX: x,
                      coverPositionY: y
                    };
                  }
                },
                {
                  id: "coverZoom",
                  label: t("Zoom"),
                  type: "slider",
                  slider: {
                    min: 100,
                    max: 200
                  },
                  value: {
                    value: v.coverZoom
                  },
                  onChange: ({ value: coverZoom }) => ({ coverZoom })
                },
                {
                  id: "iconSize",
                  label: t("Play"),
                  type: "slider",
                  roles: ["admin"],
                  slider: {
                    min: 50,
                    max: 200
                  },
                  value: {
                    value: v.iconSize
                  },
                  onChange: ({ value: iconSize }) => {
                    return {
                      iconSize,
                      iconSizeWidth: iconSize,
                      iconSizeHeight: iconSize
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
      position: 90,
      disabled: v.coverImageSrc === "",
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
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
                  id: "bgColorHex",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: bgColorHex,
                    opacity: v.bgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    const bgColorOpacity =
                      hex !== v.bgColorHex && v.bgColorOpacity === 0
                        ? v.bgColorOpacity
                        : opacity;

                    return {
                      bgColorHex: hex,
                      bgColorOpacity: bgColorOpacity,
                      bgColorPalette:
                        isChanged === "hex" ? "" : v.bgColorPalette
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
                        : v.bgColorOpacity
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
                      bgColorOpacity: bgColorOpacity
                    };
                  }
                }
              ]
            },
            {
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "hoverBgColorHex",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: hoverBgColorHex,
                    opacity: v.hoverBgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    const hoverBgColorOpacity =
                      hex !== v.hoverBgColorHex && v.hoverBgColorOpacity === 0
                        ? v.hoverBgColorOpacity
                        : opacity;

                    return {
                      hoverBgColorHex: hex,
                      hoverBgColorOpacity: hoverBgColorOpacity,
                      hoverBgColorPalette:
                        isChanged === "hex" ? "" : v.hoverBgColorPalette
                    };
                  }
                },
                {
                  id: "hoverBgColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.hoverBgColorPalette,
                  onChange: value => ({
                    hoverBgColorPalette: value,
                    hoverBgColorHex: "",
                    hoverBgColorOpacity:
                      v.hoverBgColorOpacity === 0
                        ? v.tempHoverBgColorOpacity
                        : v.hoverBgColorOpacity
                  })
                },
                {
                  id: "bgColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: hoverBgColorHex,
                    opacity: v.hoverBgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    const hoverBgColorOpacity =
                      hex !== v.hoverBgColorHex && v.hoverBgColorOpacity === 0
                        ? v.tempHoverBgColorOpacity
                        : opacity;

                    return {
                      hoverBgColorPalette:
                        isChanged === "hex" ? "" : v.hoverBgColorPalette,
                      hoverBgColorHex: hex,
                      hoverBgColorOpacity: hoverBgColorOpacity
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
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "size",
          label: t("Size"),
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
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.size
          },
          onChange: ({ value: size }) => {
            return {
              size,
              mobileSize: v.size === v.mobileSize ? size : v.mobileSize
            };
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
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
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "mobileSize",
          label: t("Size"),
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
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.mobileSize
          },
          onChange: ({ value: mobileSize }) => {
            return {
              mobileSize
            };
          }
        }
      ]
    }
  ];
}
