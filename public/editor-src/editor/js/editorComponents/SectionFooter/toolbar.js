import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementSectionGlobal,
  toolbarBgImage,
  toolbarGradientType,
  toolbarBgColorHexField2,
  toolbarBgColor2,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarBorderRadius,
  toolbarElementContainerType,
  toolbarPaddingFourFieldsPxSuffix,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthFourFields2,
  toolbarHoverTransition,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarElementSectionBoxShadow,
  toolbarElementSectionSaved,
  toolbarShowOnDesktop,
  toolbarShowOnResponsive,
  toolbarAnchorName,
  toolbarCustomCSSClass,
  toolbarAttributes,
  toolbarShape,
  toolbarShapeTopType,
  toolbarShapeTopColor,
  toolbarShapeTopHeight,
  toolbarShapeTopFlip,
  toolbarShapeTopIndex,
  toolbarShapeBottomType,
  toolbarShapeBottomColor,
  toolbarShapeBottomHeight,
  toolbarShapeBottomFlip,
  toolbarShapeBottomIndex,
  toolbarTags
} from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const dvvh = key => defaultValueValue({ v, key, device, state: "hover" });
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    {
      id: dvk("toolbarFooter"),
      type: "popover",
      icon: "nc-footer",
      title: t("Footer"),
      position: 70,
      devices: "desktop",
      options: [
        toolbarElementSectionGlobal({
          device,
          component,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: dvk("toolbarCurrentElement"),
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: dvk("tabsState"),
          tabsPosition: "left",
          type: "tabs",
          value: dvv("tabsState"),
          tabs: [
            {
              id: dvk("tabNormal"),
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: dvk("tabsCurrentElement"),
                  type: "tabs",
                  value: dvv("tabsCurrentElement"),
                  tabs: [
                    {
                      id: dvk("tabCurrentElement"),
                      label: t("Image"),
                      options: [
                        toolbarBgImage({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBgImage",
                            "onChangeBgImageBgOpacity",
                            "onChangeBgImageDependencies"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: dvk("tabHover"),
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: dvk("tabsCurrentElement"),
                  type: "tabs",
                  value: dvv("tabsCurrentElement"),
                  devices: "desktop",
                  tabs: [
                    {
                      id: dvk("tabCurrentElement"),
                      label: t("Image"),
                      options: [
                        toolbarBgImage({
                          v,
                          device,
                          state: "hover",
                          devices: "desktop",
                          onChange: [
                            "onChangeBgImage",
                            "onChangeBgImageBgOpacity",
                            "onChangeBgImageDependencies"
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
        tabsCurrentElement: !isOpen ? "" : dvv("tabsCurrentElement")
      })
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsState"),
          tabsPosition: "left",
          type: "tabs",
          value: dvv("tabsState"),
          tabs: [
            {
              id: dvk("tabNormal"),
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: dvk("tabsColor"),
                  type: "tabs",
                  value: dvv("tabsColor"),
                  tabs: [
                    {
                      id: dvk("tabOverlay"),
                      label: t("Overlay"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          onChangeType: ["onChangeBgColorType2"],
                          onChangeHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientPalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradient: ["onChangeGradientRange2"]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarBgColorHexField2({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix:
                                    dvv("gradientActivePointer") ===
                                    "startPointer"
                                      ? "bg"
                                      : "gradient",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity2",
                                    "onChangeBgColorHexAndOpacityPalette2",
                                    "onChangeBgColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 52,
                              options: [
                                toolbarGradientType({
                                  v,
                                  device,
                                  state: "normal",
                                  className:
                                    "brz-ed__select--transparent brz-ed__select--align-right",
                                  disabled: dvv("bgColorType") === "solid"
                                })
                              ]
                            },
                            {
                              width: 18,
                              options: [
                                toolbarGradientLinearDegree({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled:
                                    dvv("bgColorType") === "solid" ||
                                    dvv("gradientType") === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled:
                                    dvv("bgColorType") === "solid" ||
                                    dvv("gradientType") === "linear"
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: dvk("tabBorder"),
                      label: t("Border"),
                      options: [
                        toolbarBorder2({
                          v,
                          device,
                          state: "normal",
                          onChangeStyle: [
                            "onChangeBorderStyle2",
                            "onChangeContainerBorderStyleDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBorderColorPalette2",
                            "onChangeBorderColorPaletteOpacity2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 38,
                              options: [
                                toolbarBorderColorHexField2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBorderColorHexAndOpacity2",
                                    "onChangeBorderColorHexAndOpacityPalette2",
                                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 54,
                              options: [
                                toolbarBorderWidthFourFields2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChangeType: ["onChangeBorderWidthType2"],
                                  onChangeGrouped: [
                                    "onChangeBorderWidthGrouped2",
                                    "onChangeBorderWidthGroupedDependencies2"
                                  ],
                                  onChangeUngrouped: [
                                    "onChangeBorderWidthUngrouped2",
                                    "onChangeBorderWidthUngroupedDependencies2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: dvk("tabBoxShadow"),
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "normal",
                          choices: "inset",
                          onChangeType: [
                            "onChangeBoxShadowType2",
                            "onChangeBoxShadowTypeDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBoxShadowPalette2",
                            "onChangeBoxShadowPaletteOpacity2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 65,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 35,
                              options: [
                                toolbarElementSectionBoxShadow({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowFields2",
                                    "onChangeBoxShadowFieldsDependencies2"
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
              id: dvk("tabHover"),
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: dvk("tabsColor"),
                  type: "tabs",
                  value: dvv("tabsColor"),
                  devices: "desktop",
                  tabs: [
                    {
                      id: dvk("tabOverlay"),
                      label: t("Overlay"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "hover",
                          devices: "desktop",
                          onChangeType: ["onChangeBgColorType2"],
                          onChangeHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradientPalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ],
                          onChangeGradient: ["onChangeGradientRange2"]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarBgColorHexField2({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  prefix:
                                    dvvh("gradientActivePointer") ===
                                    "startPointer"
                                      ? "bg"
                                      : "gradient",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity2",
                                    "onChangeBgColorHexAndOpacityPalette2",
                                    "onChangeBgColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 52,
                              options: [
                                toolbarGradientType({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  className:
                                    "brz-ed__select--transparent brz-ed__select--align-right",
                                  disabled: dvvh("bgColorType") === "solid"
                                })
                              ]
                            },
                            {
                              width: 18,
                              options: [
                                toolbarGradientLinearDegree({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  disabled:
                                    dvvh("bgColorType") === "solid" ||
                                    dvvh("gradientType") === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  disabled:
                                    dvvh("bgColorType") === "solid" ||
                                    dvvh("gradientType") === "linear"
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: dvk("tabBorder"),
                      label: t("Border"),
                      options: [
                        toolbarBorder2({
                          v,
                          device,
                          state: "hover",
                          devices: "desktop",
                          onChangeStyle: [
                            "onChangeBorderStyle2",
                            "onChangeContainerBorderStyleDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBorderColorPalette2",
                            "onChangeBorderColorPaletteOpacity2",
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 38,
                              options: [
                                toolbarBorderColorHexField2({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  onChange: [
                                    "onChangeBorderColorHexAndOpacity2",
                                    "onChangeBorderColorHexAndOpacityPalette2",
                                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 54,
                              options: [
                                toolbarBorderWidthFourFields2({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  onChangeType: ["onChangeBorderWidthType2"],
                                  onChangeGrouped: [
                                    "onChangeBorderWidthGrouped2",
                                    "onChangeBorderWidthGroupedDependencies2"
                                  ],
                                  onChangeUngrouped: [
                                    "onChangeBorderWidthUngrouped2",
                                    "onChangeBorderWidthUngroupedDependencies2"
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
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "hover",
                          choices: "inset",
                          devices: "desktop",
                          onChangeType: [
                            "onChangeBoxShadowType2",
                            "onChangeBoxShadowTypeDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBoxShadowPalette2",
                            "onChangeBoxShadowPaletteOpacity2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 65,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 35,
                              options: [
                                toolbarElementSectionBoxShadow({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  onChange: [
                                    "onChangeBoxShadowFields2",
                                    "onChangeBoxShadowFieldsDependencies2"
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
        tabsColor: !isOpen ? "" : dvv("tabsColor")
      })
    },
    toolbarElementSectionSaved({
      device,
      state: "normal",
      component,
      devices: "desktop"
    }),
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      title: t("Settings"),
      position: 110,
      devices: "desktop",
      options: [
        toolbarElementContainerType({ v, device, state: "normal" }),
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          devices: "desktop",
          position: 30,
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
                  options: [
                    toolbarPaddingFourFieldsPxSuffix({
                      v,
                      device,
                      state: "normal",
                      devices: "desktop"
                    }),
                    toolbarBorderRadius({
                      v,
                      device,
                      state: "normal",
                      devices: "desktop",
                      onChangeGrouped: [
                        "onChangeBorderRadiusGrouped",
                        "onChangeBorderRadiusGroupedDependencies"
                      ],
                      onChangeUngrouped: [
                        "onChangeBorderRadiusUngrouped",
                        "onChangeBorderRadiusUngroupedDependencies"
                      ]
                    }),
                    {
                      type: "multiPicker",
                      picker: toolbarShape({
                        v,
                        device,
                        devices: "desktop",
                        state: "normal"
                      }),
                      choices: {
                        top: [
                          toolbarShapeTopType({
                            v,
                            device,
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeTopColor({
                            v,
                            device,
                            disabled: dvv("shapeTopType") === "none",
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeTopHeight({
                            v,
                            device,
                            disabled: dvv("shapeTopType") === "none",
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeTopFlip({
                            v,
                            device,
                            disabled: dvv("shapeTopType") === "none",
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeTopIndex({
                            v,
                            device,
                            disabled: dvv("shapeTopType") === "none",
                            devices: "desktop",
                            state: "normal"
                          })
                        ],
                        bottom: [
                          toolbarShapeBottomType({
                            v,
                            device,
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeBottomColor({
                            v,
                            device,
                            disabled: dvv("shapeBottomType") === "none",
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeBottomHeight({
                            v,
                            device,
                            disabled: dvv("shapeBottomType") === "none",
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeBottomFlip({
                            v,
                            device,
                            disabled: dvv("shapeBottomType") === "none",
                            devices: "desktop",
                            state: "normal"
                          }),
                          toolbarShapeBottomIndex({
                            v,
                            device,
                            disabled: dvv("shapeBottomType") === "none",
                            devices: "desktop",
                            state: "normal"
                          })
                        ]
                      }
                    }
                  ]
                },
                {
                  id: dvk("moreSettingsAdvanced"),
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  devices: "desktop",
                  options: [
                    toolbarShowOnDesktop({ v, device, closeTooltip: true }),
                    toolbarAnchorName({
                      v,
                      device,
                      devices: "desktop",
                      state: "normal",
                      population: cssIDDynamicContentChoices
                    }),
                    toolbarCustomCSSClass({
                      v,
                      device,
                      devices: "desktop",
                      state: "normal",
                      population: cssIDDynamicContentChoices
                    }),

                    toolbarAttributes({
                      v,
                      device,
                      devices: "desktop",
                      state: "normal"
                    }),
                    toolbarHoverTransition({
                      v,
                      position: 60,
                      devices: "desktop"
                    }),
                    toolbarTags({
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
    },
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      position: 110,
      title: t("Settings"),
      devices: "responsive",
      options: [
        toolbarPaddingFourFieldsPxSuffix({
          v,
          device,
          state: "normal",
          devices: "responsive"
        }),
        toolbarBorderRadius({
          v,
          device,
          state: "normal",
          devices: "responsive",
          onChangeGrouped: [
            "onChangeBorderRadiusGrouped",
            "onChangeBorderRadiusGroupedDependencies"
          ],
          onChangeUngrouped: [
            "onChangeBorderRadiusUngrouped",
            "onChangeBorderRadiusUngroupedDependencies"
          ]
        }),
        {
          type: "multiPicker",
          disabled:
            dvv("shapeTopType") === "none" && dvv("shapeBottomType") === "none",
          picker: toolbarShape({
            v,
            device,
            devices: "responsive",
            state: "normal"
          }),
          choices: {
            top: [
              toolbarShapeTopHeight({
                v,
                device,
                disabled: dvv("shapeTopType") === "none",
                devices: "responsive",
                state: "normal"
              })
            ],
            bottom: [
              toolbarShapeBottomHeight({
                v,
                device,
                disabled: dvv("shapeBottomType") === "none",
                devices: "responsive",
                state: "normal"
              })
            ]
          }
        }
      ]
    }
  ];
}
