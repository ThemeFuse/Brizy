import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import {
  toolbarColor2,
  toolbarColorHexField2,
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing,
  toolbarHorizontalAlign,
  toolbarDisabledHorizontalAlign,
  toolbarDisabledToolbarSettings,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: dvk("toolbarTypography"),
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: dvk("tabsTypography"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabTypographyParagraph"),
              label: t("P"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 54,
                      options: [
                        toolbarTypography2FontFamily({
                          v,
                          device,
                          devices: "desktop",
                          prefix: "paragraph",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: 46,
                      className: "brz-ed-popover__typography",
                      options: [
                        toolbarTypography2FontStyle({
                          v,
                          device,
                          prefix: "paragraph",
                          state: "normal"
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__typography",
                          columns: [
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontSize({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "paragraph",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LineHeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "paragraph",
                                  onChange: ["onChangeTypography2"]
                                })
                              ]
                            },
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontWeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "paragraph",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LetterSpacing({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "paragraph",
                                  onChange: ["onChangeTypography2"]
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
              id: dvk("tabTypographyH1"),
              label: t("H1"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 54,
                      options: [
                        toolbarTypography2FontFamily({
                          v,
                          device,
                          devices: "desktop",
                          prefix: "h1",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: 46,
                      className: "brz-ed-popover__typography",
                      options: [
                        toolbarTypography2FontStyle({
                          v,
                          device,
                          prefix: "h1",
                          state: "normal"
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__typography",
                          columns: [
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontSize({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h1",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LineHeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h1",
                                  onChange: ["onChangeTypography2"]
                                })
                              ]
                            },
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontWeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h1",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LetterSpacing({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h1",
                                  onChange: ["onChangeTypography2"]
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
              id: dvk("tabTypographyH2"),
              label: t("H2"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 54,
                      options: [
                        toolbarTypography2FontFamily({
                          v,
                          device,
                          devices: "desktop",
                          prefix: "h2",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: 46,
                      className: "brz-ed-popover__typography",
                      options: [
                        toolbarTypography2FontStyle({
                          v,
                          device,
                          prefix: "h2",
                          state: "normal"
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__typography",
                          columns: [
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontSize({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h2",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LineHeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h2",
                                  onChange: ["onChangeTypography2"]
                                })
                              ]
                            },
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontWeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h2",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LetterSpacing({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h2",
                                  onChange: ["onChangeTypography2"]
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
              id: dvk("tabTypographyH3"),
              label: t("H3"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 54,
                      options: [
                        toolbarTypography2FontFamily({
                          v,
                          device,
                          devices: "desktop",
                          prefix: "h3",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: 46,
                      className: "brz-ed-popover__typography",
                      options: [
                        toolbarTypography2FontStyle({
                          v,
                          device,
                          prefix: "h3",
                          state: "normal"
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__typography",
                          columns: [
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontSize({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h3",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LineHeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h3",
                                  onChange: ["onChangeTypography2"]
                                })
                              ]
                            },
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontWeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h3",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LetterSpacing({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h3",
                                  onChange: ["onChangeTypography2"]
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
              id: dvk("tabTypographyH4"),
              label: t("H4"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 54,
                      options: [
                        toolbarTypography2FontFamily({
                          v,
                          device,
                          devices: "desktop",
                          prefix: "h4",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: 46,
                      className: "brz-ed-popover__typography",
                      options: [
                        toolbarTypography2FontStyle({
                          v,
                          device,
                          prefix: "h4",
                          state: "normal"
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__typography",
                          columns: [
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontSize({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h4",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LineHeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h4",
                                  onChange: ["onChangeTypography2"]
                                })
                              ]
                            },
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontWeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h4",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LetterSpacing({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h4",
                                  onChange: ["onChangeTypography2"]
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
              id: dvk("tabTypographyH5"),
              label: t("H5"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 54,
                      options: [
                        toolbarTypography2FontFamily({
                          v,
                          device,
                          devices: "desktop",
                          prefix: "h5",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: 46,
                      className: "brz-ed-popover__typography",
                      options: [
                        toolbarTypography2FontStyle({
                          v,
                          device,
                          prefix: "h5",
                          state: "normal"
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__typography",
                          columns: [
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontSize({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h5",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LineHeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h5",
                                  onChange: ["onChangeTypography2"]
                                })
                              ]
                            },
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontWeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h5",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LetterSpacing({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h5",
                                  onChange: ["onChangeTypography2"]
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
              id: dvk("tabTypographyH6"),
              label: t("H6"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: 54,
                      options: [
                        toolbarTypography2FontFamily({
                          v,
                          device,
                          devices: "desktop",
                          prefix: "h6",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: 46,
                      className: "brz-ed-popover__typography",
                      options: [
                        toolbarTypography2FontStyle({
                          v,
                          device,
                          prefix: "h6",
                          state: "normal"
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__typography",
                          columns: [
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontSize({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h6",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LineHeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h6",
                                  onChange: ["onChangeTypography2"]
                                })
                              ]
                            },
                            {
                              width: "50",
                              options: [
                                toolbarTypography2FontWeight({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h6",
                                  onChange: ["onChangeTypography2"]
                                }),
                                toolbarTypography2LetterSpacing({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "h6",
                                  onChange: ["onChangeTypography2"]
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
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          value: v.tabsColor,
          tabs: [
            {
              id: "tabParagraph",
              label: t("P"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  prefix: "paragraphColor",
                  state: "normal",
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
                          prefix: "paragraphColor",
                          state: "normal",
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
              id: "tabH1",
              label: t("H1"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  prefix: "h1Color",
                  state: "normal",
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
                          prefix: "h1Color",
                          state: "normal",
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
              id: "tabH2",
              label: t("H2"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  prefix: "h2Color",
                  state: "normal",
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
                          prefix: "h2Color",
                          state: "normal",
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
              id: "tabH3",
              label: t("H3"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  prefix: "h3Color",
                  state: "normal",
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
                          prefix: "h3Color",
                          state: "normal",
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
              id: "tabH4",
              label: t("H4"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  prefix: "h4Color",
                  state: "normal",
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
                          prefix: "h4Color",
                          state: "normal",
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
              id: "tabH5",
              label: t("H5"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  prefix: "h5Color",
                  state: "normal",
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
                          prefix: "h5Color",
                          state: "normal",
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
              id: "tabH6",
              label: t("H6"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  prefix: "h6Color",
                  state: "normal",
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
                          prefix: "h6Color",
                          state: "normal",
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
      ],
      onChange: (_, { isOpen }) => ({
        tabsState: !isOpen ? "" : v.tabsState,
        tabsColor: !isOpen ? "" : v.tabsColor
      })
    },
    toolbarHorizontalAlign({
      v,
      device,
      state: "normal",
      prefix: "content",
      devices: "all"
    }),
    toolbarDisabledHorizontalAlign({ v, device }),
    toolbarDisabledToolbarSettings({ device }),
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: dvk("settingsTabs"),
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: dvk("settingsStyling"),
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: []
            },
            {
              id: dvk("moreSettingsAdvanced"),
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: [
                toolbarCustomCSS({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}
