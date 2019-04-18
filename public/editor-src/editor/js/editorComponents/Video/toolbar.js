import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarElementVideoLink,
  toolbarElementVideoRatio,
  toolbarElementVideoControls,
  toolbarElementVideoCover,
  toolbarElementVideoCoverZoom,
  toolbarElementVideoPlaySize,
  toolbarBorderStyle,
  toolbarBorderWidth,
  toolbarBorderRadius,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields,
  toolbarBorderWidthBorderColorPicker,
  toolbarSizeSizeSizePercent,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadow,
  toolbarHoverTransition
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  const videoDynamicContentChoices = getDynamicContentChoices("richText");

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-play",
      title: t("Video"),
      position: 80,
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
                      label: t("Video"),
                      options: [
                        toolbarElementVideoLink({
                          v,
                          population: videoDynamicContentChoices
                        }),
                        toolbarElementVideoRatio({ v }),
                        toolbarElementVideoControls({ v })
                      ]
                    },
                    {
                      id: "tabCurrentElementCover",
                      label: t("Cover"),
                      options: [
                        toolbarElementVideoCover({ v }),
                        toolbarElementVideoCoverZoom({ v }),
                        toolbarElementVideoPlaySize({ v })
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
      icon: {
        style: {
          backgroundColor:
            v.coverImageSrc === ""
              ? hexToRgba(borderColorHex, v.borderColorOpacity)
              : hexToRgba(bgColorHex, v.bgColorOpacity)
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
                      id: "tabOverlay",
                      label: t("Overlay"),
                      disabled: v.coverImageSrc === "",
                      options: [
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
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
                    },
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadowHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBoxShadowPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowPalette",
                            "onChangeBoxShadowPaletteOpacity",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowFields({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity",
                                    "onChangeBoxShadowHexAndOpacityPalette",
                                    "onChangeBoxShadowHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadow({
                                  v,
                                  device,
                                  state: "normal"
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
                      id: "tabOverlay",
                      label: t("Overlay"),
                      options: [
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
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
                    },
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadowHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBoxShadowPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBoxShadowPalette",
                            "onChangeBoxShadowPaletteOpacity",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowFields({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity",
                                    "onChangeBoxShadowHexAndOpacityPalette",
                                    "onChangeBoxShadowHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadow({
                                  v,
                                  device,
                                  state: "hover"
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
        tabsColor: !isOpen ? "tabOverlay" : v.tabsColor
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
        toolbarSizeSizeSizePercent({ v, device }),
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
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [toolbarHoverTransition({ v, position: 100 })]
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
      icon: "nc-play",
      title: t("Video"),
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
            },
            {
              id: "tabletBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadowHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowHexAndOpacity",
                    "onChangeBoxShadowHexAndOpacityPalette",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                toolbarBoxShadowPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowPalette",
                    "onChangeBoxShadowPaletteOpacity",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 41,
                      options: [
                        toolbarBoxShadowFields({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 59,
                      options: [
                        toolbarBoxShadow({
                          v,
                          device,
                          state: "normal"
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
      options: [toolbarSizeSizeSizePercent({ v, device })]
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
      icon: "nc-play",
      title: t("Video"),
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
            },
            {
              id: "mobileBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadowHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowHexAndOpacity",
                    "onChangeBoxShadowHexAndOpacityPalette",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                toolbarBoxShadowPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowPalette",
                    "onChangeBoxShadowPaletteOpacity",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 41,
                      options: [
                        toolbarBoxShadowFields({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 59,
                      options: [
                        toolbarBoxShadow({
                          v,
                          device,
                          state: "normal"
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
      options: [toolbarSizeSizeSizePercent({ v, device })]
    }
  ];
}
