import { hexToRgba } from "visual/utils/color";
import { getOptionColor, getDynamicContentChoices } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  toolbarBorderWidth,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields
} from "visual/utils/toolbar";

const imageDynamicContentChoices = getDynamicContentChoices("image");

export function getItemsForDesktop(v, component) {
  const device = "desktop";
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { meta } = component.props;

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
                {
                  id: "bgImage",
                  label: t("Image"),
                  type: "imageSetter",
                  disabled: v.media !== "image",
                  population: {
                    show: imageDynamicContentChoices.length > 0,
                    choices: imageDynamicContentChoices
                  },
                  value: {
                    width: v.bgImageWidth,
                    height: v.bgImageHeight,
                    src: v.bgImageSrc,
                    x: v.bgPositionX,
                    y: v.bgPositionY,
                    population: v.bgPopulation
                  },
                  onChange: ({ width, height, src, x, y, population }) => {
                    if (population) {
                      return {
                        bgPopulation: population
                      };
                    }

                    return {
                      bgImageWidth: width,
                      bgImageHeight: height,
                      bgImageSrc: src,
                      bgPositionX: x,
                      bgPositionY: y,
                      bgPopulation: "",

                      bgColorOpacity:
                        src !== "" && v.bgColorOpacity === 1
                          ? 0.9
                          : v.bgColorOpacity,

                      tempBgColorOpacity:
                        src !== "" && v.bgColorOpacity === 1
                          ? 0.9
                          : v.tempBgColorOpacity
                    };
                  }
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
                  disabled: v.media !== "image" || meta.showSlider,
                  value: v.bgAttachment
                },
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
          id: "colorTabs",
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
                    "onChangeBgColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity",
                    "onChangeBgColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBgColorFields({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies"
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
        {
          id: "tabletImage",
          label: t("Image"),
          type: "imageSetter",
          disabled:
            tabletSyncOnChange(v, "media") !== "image" &&
            tabletSyncOnChange(v, "media") !== "video",
          population: {
            show: imageDynamicContentChoices.length > 0,
            choices: imageDynamicContentChoices
          },
          value: {
            width: tabletSyncOnChange(v, "bgImageWidth"),
            height: tabletSyncOnChange(v, "bgImageHeight"),
            src: tabletSyncOnChange(v, "bgImageSrc"),
            x: tabletSyncOnChange(v, "bgPositionX"),
            y: tabletSyncOnChange(v, "bgPositionY"),
            population: v.bgPopulation
          },
          onChange: ({ width, height, src, x, y, population }) => {
            if (population) {
              return {
                bgPopulation: population
              };
            }

            return {
              tabletBgImageWidth: width,
              tabletBgImageHeight: height,
              tabletBgImageSrc: src,
              tabletBgPositionX: x,
              tabletBgPositionY: y,
              bgPopulation: "",

              tabletBgColorOpacity:
                src !== "" && tabletSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : tabletSyncOnChange(v, "bgColorOpacity"),

              tempTabletBgColorOpacity:
                src !== "" && tabletSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : v.tempTabletBgColorOpacity
            };
          }
        },
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
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorFields({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        })
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
      position: 80,
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
        {
          id: "mobileImage",
          label: t("Image"),
          type: "imageSetter",
          disabled:
            mobileSyncOnChange(v, "media") !== "image" &&
            mobileSyncOnChange(v, "media") !== "video",
          population: {
            show: imageDynamicContentChoices.length > 0,
            choices: imageDynamicContentChoices
          },
          value: {
            width: mobileSyncOnChange(v, "bgImageWidth"),
            height: mobileSyncOnChange(v, "bgImageHeight"),
            src: mobileSyncOnChange(v, "bgImageSrc"),
            x: mobileSyncOnChange(v, "bgPositionX"),
            y: mobileSyncOnChange(v, "bgPositionY"),
            population: v.bgPopulation
          },
          onChange: ({ width, height, src, x, y, population }) => {
            if (population) {
              return {
                bgPopulation: population
              };
            }

            return {
              mobileBgImageWidth: width,
              mobileBgImageHeight: height,
              mobileBgImageSrc: src,
              mobileBgPositionX: x,
              mobileBgPositionY: y,
              bgPopulation: "",

              mobileBgColorOpacity:
                src !== "" && mobileSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : mobileSyncOnChange(v, "bgColorOpacity"),

              tempMobileBgColorOpacity:
                src !== "" && mobileSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : v.tempMobileBgColorOpacity
            };
          }
        },

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
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorFields({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        })
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
        }
      ]
    }
  ];
}
