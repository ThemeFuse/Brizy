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
                },
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
                },
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
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ],
      value: v.horizontalAlign,
      onChange: horizontalAlign => ({
        horizontalAlign,
        mobileHorizontalAlign:
          v.horizontalAlign === v.mobileHorizontalAlign
            ? horizontalAlign
            : v.mobileHorizontalAlign
      })
    },
    {
      id: "toolbarSettings",
      type: "popover",
      title: t("Settings"),
      position: 110,
      options: [
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
                      id: "padding",
                      type: "multiPicker",
                      value: v.padding,
                      position: 50,
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
                      position: 60,
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
                      value: v.customClassName
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

export function getItemsForMobile(v) {
  return [
    {
      id: "showOnMobile",
      type: "toggle",
      position: 10,
      roles: ["admin"],
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
      id: "mobileHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ],
      value: v.mobileHorizontalAlign
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "mobileAdvancedSettings",
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "mobileSettingsTabs",
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: "mobileSettingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
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
                },
                {
                  id: "mobileMoreSettingsAdvanced",
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
