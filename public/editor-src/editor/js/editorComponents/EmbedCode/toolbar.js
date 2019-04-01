import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarElementEmbedCode,
  toolbarSizeWidthWidthPercent,
  toolbarBorderStyle,
  toolbarBorderWidth,
  toolbarBorderRadius,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields,
  toolbarBorderWidthBorderColorPicker
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: "toolbarCode",
      type: "popover",
      icon: "nc-iframe",
      size: "large",
      title: t("Embed"),
      roles: ["admin"],
      position: 90,
      options: [toolbarElementEmbedCode({ v })]
    },
    {
      id: "toolbarCurrentElement",
      type: "popover",
      size: "auto",
      title: t("Border"),
      position: 90,
      icon: "nc-background",
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
                  id: "tabsColor",
                  type: "tabs",
                  value: v.tabsColor,
                  tabs: [
                    {
                      id: "tabCurrentElementStyling",
                      label: t("Styling"),
                      options: [
                        toolbarBorderStyle({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBorderStyle",
                            "onChangeBorderStyleDependencies"
                          ]
                        }),
                        toolbarBorderWidth({
                          v,
                          device,
                          state: "hover",
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
                          state: "hover",
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
      position: 90,
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
                            "onChangeBorderColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarBorderColorPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderColorPalette",
                            "onChangeBorderColorPaletteOpacity"
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
                            "onChangeBorderColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarBorderColorPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBorderColorPalette",
                            "onChangeBorderColorPaletteOpacity"
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
      options: [toolbarSizeWidthWidthPercent({ v, device, state: "normal" })]
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
      size: "auto",
      title: t("Border"),
      position: 90,
      icon: "nc-background",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementStyling",
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
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletBorderColorHex,
            v.tabletBorderColorOpacity
          )
        }
      },
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                toolbarBorderColorHexAndOpacity({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorHexAndOpacity",
                    "onChangeBorderColorHexAndOpacityPalette"
                  ]
                }),
                toolbarBorderColorPalette({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorPalette",
                    "onChangeBorderColorPaletteOpacity"
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
      options: [toolbarSizeWidthWidthPercent({ v, device, state })]
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
      size: "auto",
      title: t("Border"),
      position: 90,
      icon: "nc-background",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementStyling",
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
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileBorderColorHex,
            v.mobileBorderColorOpacity
          )
        }
      },
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                toolbarBorderColorHexAndOpacity({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorHexAndOpacity",
                    "onChangeBorderColorHexAndOpacityPalette"
                  ]
                }),
                toolbarBorderColorPalette({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorPalette",
                    "onChangeBorderColorPaletteOpacity"
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
      options: [toolbarSizeWidthWidthPercent({ v, device, state })]
    }
  ];
}
