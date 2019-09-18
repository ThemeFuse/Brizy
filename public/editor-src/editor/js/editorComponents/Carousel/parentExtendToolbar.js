import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getTaxonomies
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import { toolbarColor2, toolbarColorHexField2 } from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: sliderArrowsColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "sliderArrowsColorHex", device }),
    defaultValueValue({ v, key: "sliderArrowsColorPalette", device })
  );

  const state = "normal";

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
                toolbarColor2({
                  v,
                  device,
                  state: "normal",
                  prefix: "sliderArrowsColor",
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
                          state: "normal",
                          prefix: "sliderArrowsColor",
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
              id: "dots",
              label: t("Dots"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  disabled: v.slider === "off",
                  state: "normal",
                  prefix: "sliderDotsColor",
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
                  disabled: v.slider === "off",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
                      options: [
                        toolbarColorHexField2({
                          v,
                          device,
                          state: "normal",
                          prefix: "sliderDotsColor",
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

export function getItemsForTablet(v) {
  return [
    {
      id: "tabletToolbarCarousel",
      type: "popover",
      icon: "nc-carousel",
      title: t("Carousel"),
      roles: ["admin"],
      disabled: v.sliderArrows === "none",
      position: 70,
      options: [
        {
          id: "tabletSlidesToShow",
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
            value: v.tabletSlidesToShow
          },
          onChange: ({ value: tabletSlidesToShow }) => ({ tabletSlidesToShow })
        },
        {
          id: "tabletSliderArrowsSpacing",
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
            value: tabletSyncOnChange(v, "sliderArrowsSpacing")
          },
          onChange: ({ value: tabletSliderArrowsSpacing }) => ({
            tabletSliderArrowsSpacing
          })
        }
      ]
    },
    {
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      options: [
        {
          id: "padding",
          type: "multiPicker",
          disabled: true
        },
        {
          id: "tabletSliderPaddingType",
          type: "multiPicker",
          value: v.tabletSliderPaddingType,
          position: 50,
          picker: {
            id: "tabletSliderPaddingType",
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
            value: v.tabletSliderPaddingType
          },
          choices: {
            grouped: [
              {
                id: "tabletSliderPadding",
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
                  value: v.tabletSliderPadding,
                  suffix: v.tabletSliderPaddingSuffix
                },
                onChange: ({
                  value: tabletSliderPadding,
                  suffix: tabletSliderPaddingSuffix
                }) => {
                  return {
                    tabletSliderPadding,
                    tabletSliderPaddingSuffix,
                    tabletSliderPaddingTop: tabletSliderPadding,
                    tabletSliderPaddingRight: tabletSliderPadding,
                    tabletSliderPaddingBottom: tabletSliderPadding,
                    tabletSliderPaddingLeft: tabletSliderPadding
                  };
                }
              }
            ],
            ungrouped: [
              {
                id: "tabletSliderPaddingTop",
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
                  value: v.tabletSliderPaddingTop,
                  suffix: v.tabletSliderPaddingTopSuffix
                },
                onChange: ({
                  value: tabletSliderPaddingTop,
                  suffix: tabletSliderPaddingTopSuffix
                }) => {
                  return {
                    tabletSliderPaddingTop,
                    tabletSliderPaddingTopSuffix,
                    tabletSliderPadding:
                      tabletSliderPaddingTop === v.tabletSliderPaddingRight &&
                      tabletSliderPaddingTop === v.tabletSliderPaddingLeft &&
                      tabletSliderPaddingTop === v.tabletSliderPaddingBottom
                        ? tabletSliderPaddingTop
                        : v.tabletSliderPadding
                  };
                }
              },
              {
                id: "tabletSliderPaddingRight",
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
                  value: v.tabletSliderPaddingRight,
                  suffix: v.tabletSliderPaddingRightSuffix
                },
                onChange: ({
                  value: tabletSliderPaddingRight,
                  suffix: tabletSliderPaddingRightSuffix
                }) => {
                  return {
                    tabletSliderPaddingRight,
                    tabletSliderPaddingRightSuffix,
                    tabletSliderPadding:
                      tabletSliderPaddingRight === v.tabletSliderPaddingTop &&
                      tabletSliderPaddingRight === v.tabletSliderPaddingLeft &&
                      tabletSliderPaddingRight === v.tabletSliderPaddingBottom
                        ? tabletSliderPaddingRight
                        : v.tabletSliderPadding
                  };
                }
              },
              {
                id: "tabletSliderPaddingBottom",
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
                  value: v.tabletSliderPaddingBottom,
                  suffix: v.tabletSliderPaddingBottomSuffix
                },
                onChange: ({
                  value: tabletSliderPaddingBottom,
                  suffix: tabletSliderPaddingBottomSuffix
                }) => {
                  return {
                    tabletSliderPaddingBottom,
                    tabletSliderPaddingBottomSuffix,
                    tabletSliderPadding:
                      tabletSliderPaddingBottom ===
                        v.tabletSliderPaddingRight &&
                      tabletSliderPaddingBottom === v.tabletSliderPaddingLeft &&
                      tabletSliderPaddingBottom === v.tabletSliderPaddingTop
                        ? tabletSliderPaddingBottom
                        : v.tabletSliderPadding
                  };
                }
              },
              {
                id: "tabletSliderPaddingLeft",
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
                  value: v.tabletSliderPaddingLeft,
                  suffix: v.tabletSliderPaddingLeftSuffix
                },
                onChange: ({
                  value: tabletSliderPaddingLeft,
                  suffix: tabletSliderPaddingLeftSuffix
                }) => {
                  return {
                    tabletSliderPaddingLeft,
                    tabletSliderPaddingLeftSuffix,
                    tabletSliderPadding:
                      tabletSliderPaddingLeft === v.tabletSliderPaddingRight &&
                      tabletSliderPaddingLeft === v.tabletSliderPaddingTop &&
                      tabletSliderPaddingLeft === v.tabletSliderPaddingBottom
                        ? tabletSliderPaddingLeft
                        : v.tabletSliderPadding
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
            value: mobileSyncOnChange(v, "sliderArrowsSpacing")
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
