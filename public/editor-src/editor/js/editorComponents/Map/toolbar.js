import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import {
  toolbarBorderStyle,
  toolbarBorderWidth,
  toolbarBorderRadius,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields,
  toolbarBorderWidthBorderColorPicker,
  toolbarHoverTransition,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadowBlur,
  toolbarBoxShadowSpread,
  toolbarBoxShadowVertical,
  toolbarBoxShadowHorizontal,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
  );
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-pin",
      title: t("Map"),
      position: 90,
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
                      label: t("Map"),
                      options: [
                        {
                          id: "address",
                          label: t("Address"),
                          type: "input",
                          placeholder: t("Enter address"),
                          value: {
                            value: v.address
                          },
                          onChange: ({ value: address }) => ({
                            address
                          })
                        },
                        {
                          id: "zoom",
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
                            value: v.zoom
                          },
                          onChange: ({ value: zoom }) => ({ zoom })
                        }
                      ]
                    },
                    {
                      id: "tabCurrentElementStyling",
                      label: t("Styling"),
                      options: [
                        toolbarBorderStyle({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderStyle",
                            "onChangeBorderStyleDependencies"
                          ]
                        }),
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
              id: "tabHover",
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "tabsCurrentElement",
                  type: "tabs",
                  value: v.tabsCurrentElement,
                  tabs: [
                    {
                      id: "tabCurrentElementStyling",
                      label: t("Styling"),
                      options: [
                        toolbarBorderStyle({
                          v,
                          device,
                          state: "hover",
                          onChange: ["onChangeBorderStyle"]
                        }),
                        toolbarBorderWidth({
                          v,
                          device,
                          state: "hover",
                          onChangeGrouped: ["onChangeBorderWidthGrouped"],
                          onChangeUngrouped: ["onChangeBorderWidthUngrouped"]
                        }),
                        toolbarBorderRadius({
                          v,
                          device,
                          state: "hover",
                          onChangeGrouped: ["onChangeBorderRadiusGrouped"],
                          onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
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
        tabsCurrentElement: !isOpen ? "tabCurrentElement" : v.tabsCurrentElement
      })
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
          backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
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
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 51,
                              options: [
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
                            },
                            {
                              width: 49,
                              options: [
                                toolbarBorderWidthBorderColorPicker({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBorderWidthGrouped",
                                    "onChangeBorderWidthGroupedDependencies"
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
                      id: "tabBorder",
                      label: t("Border"),
                      options: [
                        toolbarBorderColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBorderColorHexAndOpacity",
                            "onChangeBorderColorHexAndOpacityPalette",
                            "onChangeBorderColorHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBorderColorPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBorderColorPalette",
                            "onChangeBorderColorPaletteOpacity",
                            "onChangeBorderColorHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 51,
                              options: [
                                toolbarBorderColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBorderColorHexAndOpacity",
                                    "onChangeBorderColorHexAndOpacityPalette",
                                    "onChangeBorderColorHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 49,
                              options: [
                                toolbarBorderWidthBorderColorPicker({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBorderWidthGrouped",
                                    "onChangeBorderWidthGroupedDependencies"
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
        tabsColor: !isOpen ? "tabBorder" : v.tabsColor
      })
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
          label: t("Width"),
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
          onChange: ({ value: size }) => ({ size })
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          slider: {
            min: 5,
            max: 500
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
            value: v.height
          },
          onChange: ({ value: height }) => ({ height })
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
                              toolbarBoxShadowHexAndOpacity({
                                v,
                                device,
                                state: "normal",
                                onChange: [
                                  "onChangeBoxShadowHexAndOpacity",
                                  "onChangeBoxShadowHexAndOpacityPalette"
                                ]
                              }),
                              toolbarBoxShadowPalette({
                                v,
                                device,
                                state: "normal",
                                onChange: [
                                  "onChangeBoxShadowPalette",
                                  "onChangeBoxShadowPaletteOpacity"
                                ]
                              }),
                              {
                                type: "grid",
                                className: "brz-ed-grid__color-fileds",
                                columns: [
                                  {
                                    width: 100,
                                    options: [
                                      toolbarBoxShadowFields({
                                        v,
                                        device,
                                        state: "normal",
                                        onChange: [
                                          "onChangeBoxShadowHexAndOpacity",
                                          "onChangeBoxShadowHexAndOpacityPalette"
                                        ]
                                      })
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          toolbarBoxShadowBlur({ v, device, state: "normal" }),
                          toolbarBoxShadowSpread({
                            v,
                            device,
                            state: "normal"
                          }),
                          toolbarBoxShadowVertical({
                            v,
                            device,
                            state: "normal"
                          }),
                          toolbarBoxShadowHorizontal({
                            v,
                            device,
                            state: "normal"
                          })
                        ]
                      }
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [toolbarHoverTransition({ v, position: 60 })]
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

  const { hex: tabletBorderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: "tabletToolbarCurrentElement",
      type: "popover",
      icon: "nc-pin",
      title: t("Map"),
      position: 80,
      options: [
        {
          id: "tabletTabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabletTabCurrentElementStyling",
              label: t("Styling"),
              options: [
                toolbarBorderStyle({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderStyle",
                    "onChangeBorderStyleDependencies"
                  ]
                }),
                toolbarBorderWidth({
                  v,
                  device,
                  state,
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
                  state,
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
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletBorderColorHex,
            tabletSyncOnChange(v, "borderColorOpacity")
          )
        }
      },
      options: [
        {
          id: "tabletTabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabletTabBorder",
              label: t("Border"),
              options: [
                toolbarBorderColorHexAndOpacity({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorHexAndOpacity",
                    "onChangeBorderColorHexAndOpacityPalette",
                    "onChangeBorderColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBorderColorPalette({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorPalette",
                    "onChangeBorderColorPaletteOpacity",
                    "onChangeBorderColorHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 51,
                      options: [
                        toolbarBorderColorFields({
                          v,
                          device,
                          state,
                          onChange: [
                            "onChangeBorderColorHexAndOpacity",
                            "onChangeBorderColorHexAndOpacityPalette",
                            "onChangeBorderColorHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 49,
                      options: [
                        toolbarBorderWidthBorderColorPicker({
                          v,
                          device,
                          state,
                          onChange: [
                            "onChangeBorderWidthGrouped",
                            "onChangeBorderWidthGroupedDependencies"
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
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "tabletSize",
          label: t("Width"),
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
            value: tabletSyncOnChange(v, "size")
          },
          onChange: ({ value: tabletSize }) => ({ tabletSize })
        },
        {
          id: "tabletHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            min: 5,
            max: 500
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
            value: tabletSyncOnChange(v, "height")
          },
          onChange: ({ value: tabletHeight }) => ({ tabletHeight })
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";

  const { hex: mobileBorderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: "mobileToolbarCurrentElement",
      type: "popover",
      icon: "nc-pin",
      title: t("Map"),
      position: 80,
      options: [
        {
          id: "mobileTabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "mobileTabCurrentElementStyling",
              label: t("Styling"),
              options: [
                toolbarBorderStyle({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderStyle",
                    "onChangeBorderStyleDependencies"
                  ]
                }),
                toolbarBorderWidth({
                  v,
                  device,
                  state,
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
                  state,
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
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileBorderColorHex,
            mobileSyncOnChange(v, "borderColorOpacity")
          )
        }
      },
      options: [
        {
          id: "mobileTabsColor",
          type: "tabs",
          tabs: [
            {
              id: "mobileTabBorder",
              label: t("Border"),
              options: [
                toolbarBorderColorHexAndOpacity({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorHexAndOpacity",
                    "onChangeBorderColorHexAndOpacityPalette",
                    "onChangeBorderColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBorderColorPalette({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorPalette",
                    "onChangeBorderColorPaletteOpacity",
                    "onChangeBorderColorHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 51,
                      options: [
                        toolbarBorderColorFields({
                          v,
                          device,
                          state,
                          onChange: [
                            "onChangeBorderColorHexAndOpacity",
                            "onChangeBorderColorHexAndOpacityPalette",
                            "onChangeBorderColorHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 49,
                      options: [
                        toolbarBorderWidthBorderColorPicker({
                          v,
                          device,
                          state,
                          onChange: [
                            "onChangeBorderWidthGrouped",
                            "onChangeBorderWidthGroupedDependencies"
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
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "mobileSize",
          label: t("Width"),
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
            value: mobileSyncOnChange(v, "size")
          },
          onChange: ({ value: mobileSize }) => ({ mobileSize })
        },
        {
          id: "mobileHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            min: 5,
            max: 500
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
            value: mobileSyncOnChange(v, "height")
          },
          onChange: ({ value: mobileHeight }) => ({ mobileHeight })
        }
      ]
    }
  ];
}
