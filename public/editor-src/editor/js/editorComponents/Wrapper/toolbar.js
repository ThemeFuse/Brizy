import { getAnimations } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
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

  return [
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
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
                  id: "padding",
                  type: "multiPicker",
                  value: v.padding,
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
                  id: "margin",
                  type: "multiPicker",
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
                        onChange: ({ value: margin, suffix: marginSuffix }) => {
                          return {
                            margin,
                            marginSuffix,
                            marginTop: margin,
                            marginRight: margin,
                            marginBottom: margin,
                            marginLeft: margin
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
                              marginTop === v.marginBottom &&
                              marginTop === v.marginRight &&
                              marginTop === v.marginLeft
                                ? marginTop
                                : v.margin
                          };
                        }
                      },
                      {
                        id: "marginRight",
                        icon: "nc-styling-right",
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
                          value: v.marginRight,
                          suffix: v.marginRightSuffix
                        },
                        onChange: ({
                          value: marginRight,
                          suffix: marginRightSuffix
                        }) => {
                          return {
                            marginRight,
                            marginRightSuffix,
                            margin:
                              marginRight === v.marginBottom &&
                              marginRight === v.marginTop &&
                              marginRight === v.marginLeft
                                ? marginRight
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
                              marginBottom === v.marginRight &&
                              marginBottom === v.marginTop &&
                              marginBottom === v.marginLeft
                                ? marginBottom
                                : v.margin
                          };
                        }
                      },
                      {
                        id: "marginLeft",
                        icon: "nc-styling-left",
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
                          value: v.marginLeft,
                          suffix: v.marginLeftSuffix
                        },
                        onChange: ({
                          value: marginLeft,
                          suffix: marginLeftSuffix
                        }) => {
                          return {
                            marginLeft,
                            marginLeftSuffix,
                            margin:
                              marginLeft === v.marginRight &&
                              marginLeft === v.marginTop &&
                              marginLeft === v.marginBottom
                                ? marginLeft
                                : v.margin
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
              options: [
                {
                  id: "showOnDesktop",
                  label: t("Show on Desktop"),
                  type: "switch",
                  value: v.showOnDesktop
                },
                {
                  type: "slider",
                  id: "zIndex",
                  label: t("Z-index"),
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
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "showOnTablet",
      type: "toggle",
      roles: ["admin"],
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
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      title: t("Settings"),
      options: [
        {
          id: "padding",
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
          id: "margin",
          type: "multiPicker",
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
                    tabletMarginRight: tabletMargin,
                    tabletMarginBottom: tabletMargin,
                    tabletMarginLeft: tabletMargin
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
                      tabletMarginTop === v.tabletMarginBottom &&
                      tabletMarginTop === v.tabletMarginRight &&
                      tabletMarginTop === v.tabletMarginLeft
                        ? tabletMarginTop
                        : v.tabletMargin
                  };
                }
              },
              {
                id: "tabletMarginRight",
                icon: "nc-styling-right",
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
                  value: v.tabletMarginRight,
                  suffix: v.tabletMarginRightSuffix
                },
                onChange: ({
                             value: tabletMarginRight,
                             suffix: tabletMarginRightSuffix
                           }) => {
                  return {
                    tabletMarginRight,
                    tabletMarginRightSuffix,
                    tabletMargin:
                      tabletMarginRight === v.tabletMarginBottom &&
                      tabletMarginRight === v.tabletMarginTop &&
                      tabletMarginRight === v.tabletMarginLeft
                        ? tabletMarginRight
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
                      tabletMarginBottom === v.tabletMarginRight &&
                      tabletMarginBottom === v.tabletMarginTop &&
                      tabletMarginBottom === v.tabletMarginLeft
                        ? tabletMarginBottom
                        : v.tabletMargin
                  };
                }
              },
              {
                id: "tabletMarginLeft",
                icon: "nc-styling-left",
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
                  value: v.tabletMarginLeft,
                  suffix: v.tabletMarginLeftSuffix
                },
                onChange: ({
                             value: tabletMarginLeft,
                             suffix: tabletMarginLeftSuffix
                           }) => {
                  return {
                    tabletMarginLeft,
                    tabletMarginLeftSuffix,
                    tabletMargin:
                      tabletMarginLeft === v.tabletMarginRight &&
                      tabletMarginLeft === v.tabletMarginTop &&
                      tabletMarginLeft === v.tabletMarginBottom
                        ? tabletMarginLeft
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

export function getItemsForMobile(v) {
  return [
    {
      id: "showOnMobile",
      type: "toggle",
      roles: ["admin"],
      position: 10,
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
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "padding",
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
          id: "margin",
          type: "multiPicker",
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
                    mobileMarginRight: mobileMargin,
                    mobileMarginBottom: mobileMargin,
                    mobileMarginLeft: mobileMargin
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
                      mobileMarginTop === v.mobileMarginBottom &&
                      mobileMarginTop === v.mobileMarginRight &&
                      mobileMarginTop === v.mobileMarginLeft
                        ? mobileMarginTop
                        : v.mobileMargin
                  };
                }
              },
              {
                id: "mobileMarginRight",
                icon: "nc-styling-right",
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
                  value: v.mobileMarginRight,
                  suffix: v.mobileMarginRightSuffix
                },
                onChange: ({
                  value: mobileMarginRight,
                  suffix: mobileMarginRightSuffix
                }) => {
                  return {
                    mobileMarginRight,
                    mobileMarginRightSuffix,
                    mobileMargin:
                      mobileMarginRight === v.mobileMarginBottom &&
                      mobileMarginRight === v.mobileMarginTop &&
                      mobileMarginRight === v.mobileMarginLeft
                        ? mobileMarginRight
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
                      mobileMarginBottom === v.mobileMarginRight &&
                      mobileMarginBottom === v.mobileMarginTop &&
                      mobileMarginBottom === v.mobileMarginLeft
                        ? mobileMarginBottom
                        : v.mobileMargin
                  };
                }
              },
              {
                id: "mobileMarginLeft",
                icon: "nc-styling-left",
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
                  value: v.mobileMarginLeft,
                  suffix: v.mobileMarginLeftSuffix
                },
                onChange: ({
                  value: mobileMarginLeft,
                  suffix: mobileMarginLeftSuffix
                }) => {
                  return {
                    mobileMarginLeft,
                    mobileMarginLeftSuffix,
                    mobileMargin:
                      mobileMarginLeft === v.mobileMarginRight &&
                      mobileMarginLeft === v.mobileMarginTop &&
                      mobileMarginLeft === v.mobileMarginBottom
                        ? mobileMarginLeft
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
