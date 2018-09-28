import { hexToRgba } from "visual/utils/color";
import { getOptionColor, getTaxonomies } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  const { hex: sliderArrowsColorHex } = getOptionColor(v, "sliderArrowsColor");
  const { hex: sliderDotsColorHex } = getOptionColor(v, "sliderDotsColor");

  return [
    {
      id: "toolbarCarousel",
      type: "popover",
      icon: "nc-carousel",
      title: t("Carousel"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "toolbarCarouselTabs",
          type: "tabs",
          tabs: [
            {
              id: "carousel",
              label: t("Carousel"),
              options: [
                {
                  type: "multiPicker",
                  picker: {
                    id: "sliderAutoPlay",
                    label: t("Auto Play"),
                    type: "switch",
                    value: v.sliderAutoPlay
                  },
                  choices: {
                    on: [
                      {
                        id: "sliderAutoPlaySpeed",
                        label: t("Speed"),
                        type: "slider",
                        slider: {
                          min: 1,
                          max: 6
                        },
                        input: {
                          show: true
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
                          value: v.sliderAutoPlaySpeed
                        },
                        onChange: ({ value: sliderAutoPlaySpeed }) => ({
                          sliderAutoPlaySpeed
                        })
                      }
                    ]
                  }
                },
                {
                  id: "slidesToShow",
                  type: "slider",
                  label: t("Columns"),
                  input: {
                    show: true,
                    min: 1,
                    max: 6
                  },
                  slider: {
                    min: 1,
                    max: 6
                  },
                  value: {
                    value: v.slidesToShow
                  },
                  onChange: ({ value: slidesToShow }) => ({ slidesToShow })
                },
                {
                  id: "spacing",
                  label: t("Spacing"),
                  type: "slider",
                  slider: {
                    min: 1,
                    max: 6
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
                    value: v.spacing
                  },
                  onChange: ({ value: spacing }) => ({ spacing })
                }
              ]
            },
            {
              id: "navigation",
              label: t("Navigation"),
              options: [
                {
                  type: "multiPicker",
                  picker: {
                    id: "sliderArrows",
                    label: t("Arrows"),
                    type: "select",
                    choices: [
                      {
                        title: t("None"),
                        icon: "nc-none",
                        value: "none"
                      },
                      {
                        title: t("Thin"),
                        icon: "nc-right-arrow-thin",
                        value: "thin"
                      },
                      {
                        title: t("Heavy"),
                        icon: "nc-right-arrow-heavy",
                        value: "heavy"
                      },
                      {
                        title: t("Tail"),
                        icon: "nc-right-arrow-tail",
                        value: "tail"
                      },
                      {
                        title: t("Round"),
                        icon: "nc-right-arrow-filled",
                        value: "filled"
                      },
                      {
                        title: t("Outline"),
                        icon: "nc-right-arrow-outline",
                        value: "outline"
                      }
                    ],
                    value: v.sliderArrows
                  },
                  choices: {
                    [`${v.sliderArrows}`]: [
                      {
                        id: "sliderArrowsSpacing",
                        label: t("Spacing"),
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
                          value: v.sliderArrowsSpacing
                        },
                        onChange: ({ value: sliderArrowsSpacing }) => ({
                          sliderArrowsSpacing
                        })
                      }
                    ],
                    none: []
                  }
                },
                {
                  id: "sliderDots",
                  label: t("Dots"),
                  type: "select",
                  choices: [
                    {
                      title: t("None"),
                      icon: "nc-none",
                      value: "none"
                    },
                    {
                      title: t("Circle"),
                      icon: "nc-circle-outline",
                      value: "circle"
                    },
                    {
                      title: t("Diamond"),
                      icon: "nc-diamond-outline",
                      value: "diamond"
                    },
                    {
                      title: t("Square"),
                      icon: "nc-square-outline",
                      value: "square"
                    }
                  ],
                  value: v.sliderDots
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "dynamicToolbarCarousel",
      type: "popover",
      icon: "nc-dynamic",
      title: t("Dynamic Content"),
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "dynamic",
          label: t("Dynamic Content"),
          type: "switch",
          value: v.dynamic
        },
        {
          id: "taxonomy",
          label: t("Categories"),
          disabled: v.dynamic === "off",
          type: "select",
          choices: getTaxonomies(),
          value: `${v.taxonomy}|${v.taxonomyId}`,
          onChange: _taxonomy => {
            const [taxonomy, taxonomyId] = _taxonomy.split("|");

            return {
              taxonomy,
              taxonomyId
            };
          }
        },
        {
          id: "orderBy",
          label: t("Filter By"),
          disabled: v.dynamic === "off",
          type: "select",
          choices: [
            { title: t("ID"), value: "ID" },
            { title: t("Title"), value: "title" },
            { title: t("Date"), value: "date" },
            { title: t("Random"), value: "rand" },
            { title: t("Comment Count"), value: "comment_count" }
          ],
          value: v.orderBy
        },
        {
          type: "multiPicker",
          disabled: v.dynamic === "off",
          picker: {
            id: "order",
            label: t("Order"),
            type: "radioGroup",
            choices: [
              {
                value: "ASC",
                icon: "nc-up"
              },
              {
                value: "DESC",
                icon: "nc-down"
              }
            ],
            value: v.order
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      position: 90,
      title: t("Colors"),
      roles: ["admin"],
      icon: {
        style: {
          backgroundColor: hexToRgba(
            sliderArrowsColorHex,
            v.sliderArrowsColorOpacity
          )
        }
      },
      options: [
        {
          id: "colorTabs",
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: "arrows",
              label: t("Arrows"),
              options: [
                {
                  id: "sliderArrowsColor",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: sliderArrowsColorHex,
                    opacity: v.sliderArrowsColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    const sliderArrowsColorOpacity =
                      hex !== v.sliderArrowsColorHex &&
                      v.sliderArrowsColorOpacity === 0
                        ? v.tempSliderArrowsColorOpacity
                        : opacity;

                    return {
                      sliderArrowsColorHex: hex,
                      sliderArrowsColorOpacity: sliderArrowsColorOpacity,
                      sliderArrowsColorPalette:
                        isChanged === "hex" ? "" : v.sliderArrowsColorPalette
                    };
                  }
                },
                {
                  id: "sliderArrowsColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.sliderArrowsColorPalette,
                  onChange: sliderArrowsColorPalette => ({
                    sliderArrowsColorPalette,

                    sliderArrowsColorOpacity:
                      v.sliderArrowsColorOpacity === 0
                        ? v.tempSliderArrowsColorOpacity
                        : v.sliderArrowsColorOpacity
                  })
                },
                {
                  id: "sliderArrowsColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: sliderArrowsColorHex,
                    opacity: v.sliderArrowsColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    sliderArrowsColorPalette:
                      isChanged === "hex" ? "" : v.sliderArrowsColorPalette,
                    sliderArrowsColorHex: hex,
                    sliderArrowsColorOpacity: opacity
                  })
                }
              ]
            },
            {
              id: "dots",
              label: t("Dots"),
              disabled: v.slider === "off",
              options: [
                {
                  id: "sliderDotsColor",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: sliderDotsColorHex,
                    opacity: v.sliderDotsColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    const sliderDotsColorOpacity =
                      hex !== v.sliderDotsColorHex &&
                      v.sliderDotsColorOpacity === 0
                        ? v.tempSliderDotsColorOpacity
                        : opacity;

                    return {
                      sliderDotsColorHex: hex,
                      sliderDotsColorOpacity: sliderDotsColorOpacity,
                      sliderDotsColorPalette:
                        isChanged === "hex" ? "" : v.sliderDotsColorPalette
                    };
                  }
                },
                {
                  id: "sliderDotsColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.sliderDotsColorPalette,
                  onChange: sliderDotsColorPalette => ({
                    sliderDotsColorPalette,

                    sliderDotsColorOpacity:
                      v.sliderDotsColorOpacity === 0
                        ? v.tempSliderDotsColorOpacity
                        : v.sliderDotsColorOpacity
                  })
                },
                {
                  id: "sliderDotsColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: sliderDotsColorHex,
                    opacity: v.sliderDotsColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    sliderDotsColorPalette:
                      isChanged === "hex" ? "" : v.sliderDotsColorPalette,
                    sliderDotsColorHex: hex,
                    sliderDotsColorOpacity: opacity
                  })
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
      roles: ["admin"],
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: "settingsStyling",
              tabIcon: "nc-styling",
              options: [
                {
                  id: "padding",
                  type: "multiPicker",
                  disabled: true
                },
                {
                  id: "sliderPaddingType",
                  type: "multiPicker",
                  value: v.sliderPaddingType,
                  position: 50,
                  picker: {
                    id: "sliderPaddingType",
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
                    value: v.sliderPaddingType
                  },
                  choices: {
                    grouped: [
                      {
                        id: "sliderPadding",
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
                          value: v.sliderPadding,
                          suffix: v.sliderPaddingSuffix
                        },
                        onChange: ({
                          value: sliderPadding,
                          suffix: sliderPaddingSuffix
                        }) => {
                          return {
                            sliderPadding,
                            sliderPaddingSuffix,
                            sliderPaddingTop: sliderPadding,
                            sliderPaddingRight: sliderPadding,
                            sliderPaddingBottom: sliderPadding,
                            sliderPaddingLeft: sliderPadding
                          };
                        }
                      }
                    ],
                    ungrouped: [
                      {
                        id: "sliderPaddingTop",
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
                          value: v.sliderPaddingTop,
                          suffix: v.sliderPaddingTopSuffix
                        },
                        onChange: ({
                          value: sliderPaddingTop,
                          suffix: sliderPaddingTopSuffix
                        }) => {
                          return {
                            sliderPaddingTop,
                            sliderPaddingTopSuffix,
                            sliderPadding:
                              sliderPaddingTop === v.sliderPaddingRight &&
                              sliderPaddingTop === v.sliderPaddingLeft &&
                              sliderPaddingTop === v.sliderPaddingBottom
                                ? sliderPaddingTop
                                : v.sliderPadding
                          };
                        }
                      },
                      {
                        id: "sliderPaddingRight",
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
                          value: v.sliderPaddingRight,
                          suffix: v.sliderPaddingRightSuffix
                        },
                        onChange: ({
                          value: sliderPaddingRight,
                          suffix: sliderPaddingRightSuffix
                        }) => {
                          return {
                            sliderPaddingRight,
                            sliderPaddingRightSuffix,
                            sliderPadding:
                              sliderPaddingRight === v.sliderPaddingTop &&
                              sliderPaddingRight === v.sliderPaddingLeft &&
                              sliderPaddingRight === v.sliderPaddingBottom
                                ? sliderPaddingRight
                                : v.sliderPadding
                          };
                        }
                      },
                      {
                        id: "sliderPaddingBottom",
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
                          value: v.sliderPaddingBottom,
                          suffix: v.sliderPaddingBottomSuffix
                        },
                        onChange: ({
                          value: sliderPaddingBottom,
                          suffix: sliderPaddingBottomSuffix
                        }) => {
                          return {
                            sliderPaddingBottom,
                            sliderPaddingBottomSuffix,
                            sliderPadding:
                              sliderPaddingBottom === v.sliderPaddingRight &&
                              sliderPaddingBottom === v.sliderPaddingLeft &&
                              sliderPaddingBottom === v.sliderPaddingTop
                                ? sliderPaddingBottom
                                : v.sliderPadding
                          };
                        }
                      },
                      {
                        id: "sliderPaddingLeft",
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
                          value: v.sliderPaddingLeft,
                          suffix: v.sliderPaddingLeftSuffix
                        },
                        onChange: ({
                          value: sliderPaddingLeft,
                          suffix: sliderPaddingLeftSuffix
                        }) => {
                          return {
                            sliderPaddingLeft,
                            sliderPaddingLeftSuffix,
                            sliderPadding:
                              sliderPaddingLeft === v.sliderPaddingRight &&
                              sliderPaddingLeft === v.sliderPaddingTop &&
                              sliderPaddingLeft === v.sliderPaddingBottom
                                ? sliderPaddingLeft
                                : v.sliderPadding
                          };
                        }
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

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarCarousel",
      type: "popover",
      icon: "nc-carousel",
      title: t("Carousel"),
      roles: ["admin"],
      disabled: v.sliderArrows === "none",
      position: 70,
      options: [
        {
          id: "mobileSliderArrowsSpacing",
          label: t("Arrows Spacing"),
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
            value:
              v.mobileSliderArrowsSpacing === null
                ? v.sliderArrowsSpacing
                : v.mobileSliderArrowsSpacing
          },
          onChange: ({ value: mobileSliderArrowsSpacing }) => ({
            mobileSliderArrowsSpacing
          })
        }
      ]
    },
    {
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      options: [
        {
          id: "padding",
          type: "multiPicker",
          disabled: true
        },
        {
          id: "mobileSliderPaddingType",
          type: "multiPicker",
          value: v.mobileSliderPaddingType,
          position: 50,
          picker: {
            id: "mobileSliderPaddingType",
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
            value: v.mobileSliderPaddingType
          },
          choices: {
            grouped: [
              {
                id: "mobileSliderPadding",
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
                  value: v.mobileSliderPadding,
                  suffix: v.mobileSliderPaddingSuffix
                },
                onChange: ({
                  value: mobileSliderPadding,
                  suffix: mobileSliderPaddingSuffix
                }) => {
                  return {
                    mobileSliderPadding,
                    mobileSliderPaddingSuffix,
                    mobileSliderPaddingTop: mobileSliderPadding,
                    mobileSliderPaddingRight: mobileSliderPadding,
                    mobileSliderPaddingBottom: mobileSliderPadding,
                    mobileSliderPaddingLeft: mobileSliderPadding
                  };
                }
              }
            ],
            ungrouped: [
              {
                id: "mobileSliderPaddingTop",
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
                  value: v.mobileSliderPaddingTop,
                  suffix: v.mobileSliderPaddingTopSuffix
                },
                onChange: ({
                  value: mobileSliderPaddingTop,
                  suffix: mobileSliderPaddingTopSuffix
                }) => {
                  return {
                    mobileSliderPaddingTop,
                    mobileSliderPaddingTopSuffix,
                    mobileSliderPadding:
                      mobileSliderPaddingTop === v.mobileSliderPaddingRight &&
                      mobileSliderPaddingTop === v.mobileSliderPaddingLeft &&
                      mobileSliderPaddingTop === v.mobileSliderPaddingBottom
                        ? mobileSliderPaddingTop
                        : v.mobileSliderPadding
                  };
                }
              },
              {
                id: "mobileSliderPaddingRight",
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
                  value: v.mobileSliderPaddingRight,
                  suffix: v.mobileSliderPaddingRightSuffix
                },
                onChange: ({
                  value: mobileSliderPaddingRight,
                  suffix: mobileSliderPaddingRightSuffix
                }) => {
                  return {
                    mobileSliderPaddingRight,
                    mobileSliderPaddingRightSuffix,
                    mobileSliderPadding:
                      mobileSliderPaddingRight === v.mobileSliderPaddingTop &&
                      mobileSliderPaddingRight === v.mobileSliderPaddingLeft &&
                      mobileSliderPaddingRight === v.mobileSliderPaddingBottom
                        ? mobileSliderPaddingRight
                        : v.mobileSliderPadding
                  };
                }
              },
              {
                id: "mobileSliderPaddingBottom",
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
                  value: v.mobileSliderPaddingBottom,
                  suffix: v.mobileSliderPaddingBottomSuffix
                },
                onChange: ({
                  value: mobileSliderPaddingBottom,
                  suffix: mobileSliderPaddingBottomSuffix
                }) => {
                  return {
                    mobileSliderPaddingBottom,
                    mobileSliderPaddingBottomSuffix,
                    mobileSliderPadding:
                      mobileSliderPaddingBottom ===
                        v.mobileSliderPaddingRight &&
                      mobileSliderPaddingBottom === v.mobileSliderPaddingLeft &&
                      mobileSliderPaddingBottom === v.mobileSliderPaddingTop
                        ? mobileSliderPaddingBottom
                        : v.mobileSliderPadding
                  };
                }
              },
              {
                id: "mobileSliderPaddingLeft",
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
                  value: v.mobileSliderPaddingLeft,
                  suffix: v.mobileSliderPaddingLeftSuffix
                },
                onChange: ({
                  value: mobileSliderPaddingLeft,
                  suffix: mobileSliderPaddingLeftSuffix
                }) => {
                  return {
                    mobileSliderPaddingLeft,
                    mobileSliderPaddingLeftSuffix,
                    mobileSliderPadding:
                      mobileSliderPaddingLeft === v.mobileSliderPaddingRight &&
                      mobileSliderPaddingLeft === v.mobileSliderPaddingTop &&
                      mobileSliderPaddingLeft === v.mobileSliderPaddingBottom
                        ? mobileSliderPaddingLeft
                        : v.mobileSliderPadding
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
