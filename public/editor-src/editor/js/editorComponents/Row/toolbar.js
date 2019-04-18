import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getAnimations
} from "visual/utils/options";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarElementContainerTypeAll,
  toolbarBgImage,
  toolbarBgVideoUrl,
  toolbarBgVideoQuality,
  toolbarBgVideoLoop,
  toolbarBgMapAddress,
  toolbarBgMapZoom,
  toolbarBorderStyle,
  toolbarBorderWidth,
  toolbarBorderWidthBorderColorPicker,
  toolbarBorderRadius,
  toolbarGradientRange,
  toolbarGradientType,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadow,
  toolbarHoverTransition,
  toolbarShowOnDesktop,
  toolbarShowOnTablet,
  toolbarShowOnMobile,
  toolbarZIndex,
  toolbarCustomCSSClass,
  toolbarEntranceAnimation,
  toolbarBgType,
  toolbarElementContainerTypeImageMap,
  toolbarCustomCSS,
  toolbarImageLinkExternal,
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarLinkAnchor
} from "visual/utils/toolbar";

export function getItemsForDesktop(v, component) {
  const device = "desktop";

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
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
                      label: t("Background"),
                      options: [
                        toolbarElementContainerTypeAll({ v }),
                        toolbarBgImage({
                          v,
                          device,
                          state: "normal",
                          disabled: v.media !== "image",
                          onChange: [
                            "onChangeBgImage",
                            "onChangeBgImageBgOpacity",
                            "onChangeBgImageDependencies",
                            "onChangeBgImageColumnAndRowSyncTablet",
                            "onChangeBgImageColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgVideoUrl({ v, disabled: v.media !== "video" }),
                        toolbarBgVideoQuality({
                          v,
                          disabled: v.media !== "video"
                        }),
                        toolbarBgVideoLoop({
                          v,
                          disabled: v.media !== "video"
                        }),
                        toolbarBgMapAddress({ v, disabled: v.media !== "map" }),
                        toolbarBgMapZoom({ v, disabled: v.media !== "map" })
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
              disabled:
                v.tabsCurrentElement === "tabCurrentElement" &&
                (v.media === "video" || v.media === "map"),
              options: [
                {
                  id: "tabsCurrentElement",
                  type: "tabs",
                  value: v.tabsCurrentElement,
                  tabs: [
                    {
                      id: "tabCurrentElement",
                      label: t("Background"),
                      options: [
                        toolbarBgImage({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBgImage",
                            "onChangeBgImageBgOpacity",
                            "onChangeBgImageDependencies",
                            "onChangeBgImageColumnAndRowSyncTablet",
                            "onChangeBgImageColumnAndRowSyncMobile"
                          ]
                        })
                      ]
                    },
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
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
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
                      options: [
                        {
                          type: "grid",
                          className: "brz-ed-grid__gradient",
                          columns: [
                            {
                              width: 43,
                              options: [
                                toolbarBgType({ v, device, state: "normal" })
                              ]
                            },
                            {
                              width: 57,
                              options: [
                                toolbarGradientRange({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled: v.bgColorType === "solid"
                                })
                              ]
                            }
                          ]
                        },
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          prefix: "bg",
                          disabled:
                            v.bgColorType === "gradient" &&
                            v.gradientActivePointer === "finishPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "normal",
                          prefix: "bg",
                          disabled:
                            v.bgColorType === "gradient" &&
                            v.gradientActivePointer === "finishPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          prefix: "gradient",
                          disabled:
                            v.bgColorType === "solid" ||
                            v.gradientActivePointer === "startPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "normal",
                          prefix: "gradient",
                          disabled:
                            v.bgColorType === "solid" ||
                            v.gradientActivePointer === "startPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "bg",
                                  disabled:
                                    v.bgColorType === "gradient" &&
                                    v.gradientActivePointer === "finishPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityDependencies",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                                  ]
                                }),
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "gradient",
                                  disabled:
                                    v.bgColorType === "solid" ||
                                    v.gradientActivePointer === "startPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityDependencies",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
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
                                  disabled: v.bgColorType === "solid"
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
                                    v.bgColorType === "solid" ||
                                    v.gradientType === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled:
                                    v.bgColorType === "solid" ||
                                    v.gradientType === "linear"
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
                            "onChangeBorderColorHexAndOpacityDependencies",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBorderColorPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBorderColorPalette",
                            "onChangeBorderColorPaletteOpacity",
                            "onChangeBorderColorHexAndOpacityDependencies",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
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
                                    "onChangeBorderColorHexAndOpacityDependencies",
                                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
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
                        {
                          type: "grid",
                          className: "brz-ed-grid__gradient",
                          columns: [
                            {
                              width: 43,
                              options: [
                                toolbarBgType({ v, device, state: "hover" })
                              ]
                            },
                            {
                              width: 57,
                              options: [
                                toolbarGradientRange({
                                  v,
                                  device,
                                  state: "hover",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid"
                                })
                              ]
                            }
                          ]
                        },
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          prefix: "bg",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "gradient" &&
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "finishPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "hover",
                          prefix: "bg",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "gradient" &&
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "finishPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          prefix: "gradient",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "startPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgColorPalette({
                          v,
                          device,
                          state: "hover",
                          prefix: "gradient",
                          disabled:
                            defaultValueValue({
                              v,
                              key: "bgColorType",
                              device,
                              state: "hover"
                            }) === "solid" ||
                            defaultValueValue({
                              v,
                              key: "gradientActivePointer",
                              device,
                              state: "hover"
                            }) === "startPointer",
                          onChange: [
                            "onChangeBgColorPalette",
                            "onChangeBgColorPaletteOpacity",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  prefix: "bg",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "gradient" &&
                                    defaultValueValue({
                                      v,
                                      key: "gradientActivePointer",
                                      device,
                                      state: "hover"
                                    }) === "finishPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                                  ]
                                }),
                                toolbarBgColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  prefix: "gradient",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientActivePointer",
                                      device,
                                      state: "hover"
                                    }) === "startPointer",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity",
                                    "onChangeBgColorHexAndOpacityPalette",
                                    "onChangeBgColorHexAndOpacityDependencies",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet",
                                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
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
                                  className:
                                    "brz-ed__select--transparent brz-ed__select--align-right",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid"
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
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "hover"
                                    }) === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "hover",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "hover"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "hover"
                                    }) === "linear"
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
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBorderColorPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBorderColorPalette",
                            "onChangeBorderColorPaletteOpacity",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
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
                                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet",
                                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
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
                                  onChange: ["onChangeBorderWidthGrouped"]
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
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      size: "medium",
      position: 90,
      disabled: v.linkLightBox === "on",
      options: [
        {
          id: "linkType",
          type: "tabs",
          value: v.linkType,
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                toolbarImageLinkExternal({ v }),
                toolbarLinkExternalBlank({ v }),
                toolbarLinkExternalRel({ v })
              ]
            },
            {
              id: "anchor",
              label: t("Anchor"),
              options: [toolbarLinkAnchor({ v })]
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
          id: "size",
          label: t("Width"),
          type: "slider",
          disabled: inPopup,
          slider: {
            min: 40,
            max: 100
          },
          input: {
            show: true,
            min: 40,
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
            value: v.size
          },
          onChange: ({ value: size }) => ({
            size
          })
        },
        {
          type: "multiPicker",
          picker: {
            id: "columnsHeightStyle",
            label: t("Height"),
            type: "select",
            choices: [
              {
                title: t("Auto"),
                value: "auto"
              },
              {
                title: t("Custom"),
                value: "custom"
              }
            ],
            value: v.columnsHeightStyle
          },
          choices: {
            custom: [
              {
                id: "columnsHeight",
                type: "slider",
                slider: {
                  min: 20,
                  max: 500
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
                  value: v.columnsHeight
                },
                onChange: ({ value: columnsHeight }) => ({
                  columnsHeight
                })
              },
              {
                id: "verticalAlign",
                label: t("Content"),
                type: "radioGroup",
                choices: [
                  {
                    value: "top",
                    icon: "nc-align-top"
                  },
                  {
                    value: "center",
                    icon: "nc-align-middle"
                  },
                  {
                    value: "bottom",
                    icon: "nc-align-bottom"
                  }
                ],
                value: v.verticalAlign
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
                      type: "multiPicker",
                      disabled: inPopup,
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
                                marginBottom: margin
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
                                  marginTop === v.marginBottom
                                    ? marginTop
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
                                  marginBottom === v.marginTop
                                    ? marginBottom
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
                    toolbarShowOnDesktop({ v }),
                    toolbarZIndex({ v }),
                    toolbarCustomCSSClass({ v }),
                    toolbarEntranceAnimation({ v }),
                    toolbarHoverTransition({ v, position: 60 })
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

export function getItemsForTablet(v, component) {
  const device = "tablet";
  const state = "normal";

  const { hex: tabletBgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    toolbarShowOnTablet({ v }),
    {
      id: "tabletToolbarCurrentElement",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: "tabletTabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabletTabCurrentElement",
              label: t("Background"),
              options: [
                toolbarElementContainerTypeImageMap({ v, device, state }),
                toolbarBgImage({
                  v,
                  device,
                  state,
                  disabled:
                    tabletSyncOnChange(v, "media") !== "image" &&
                    tabletSyncOnChange(v, "media") !== "video",
                  onChange: [
                    "onChangeBgImage",
                    "onChangeBgImageBgOpacity",
                    "onChangeBgImageDependencies",
                    "onChangeBgImageColumnAndRowSyncTablet"
                  ]
                }),
                toolbarBgMapZoom({ v, disabled: v.media !== "map" })
              ]
            },
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
            tabletBgColorHex,
            tabletSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        {
          id: "tabletTabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabletTabOverlay",
              label: t("Overlay"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__gradient",
                  columns: [
                    {
                      width: 43,
                      options: [toolbarBgType({ v, device, state })]
                    },
                    {
                      width: 57,
                      options: [
                        toolbarGradientRange({
                          v,
                          device,
                          state,
                          disabled:
                            tabletSyncOnChange(v, "bgColorType") === "solid"
                        })
                      ]
                    }
                  ]
                },
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state,
                  prefix: "bg",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "gradient" &&
                    tabletSyncOnChange(v, "gradientActivePointer") ===
                      "finishPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state,
                  prefix: "bg",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "gradient" &&
                    tabletSyncOnChange(v, "gradientActivePointer") ===
                      "finishPointer",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
                  ]
                }),
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state,
                  prefix: "gradient",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientActivePointer") ===
                      "startPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state,
                  prefix: "gradient",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientActivePointer") ===
                      "startPointer",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 30,
                      options: [
                        toolbarBgColorFields({
                          v,
                          device,
                          state,
                          prefix: "bg",
                          disabled:
                            tabletSyncOnChange(v, "bgColorType") ===
                              "gradient" &&
                            tabletSyncOnChange(v, "gradientActivePointer") ===
                              "finishPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
                          ]
                        }),
                        toolbarBgColorFields({
                          v,
                          device,
                          state,
                          prefix: "gradient",
                          disabled:
                            tabletSyncOnChange(v, "bgColorType") === "solid" ||
                            tabletSyncOnChange(v, "gradientActivePointer") ===
                              "startPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncTablet"
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
                          state,
                          className:
                            "brz-ed__select--transparent brz-ed__select--align-right",
                          disabled:
                            tabletSyncOnChange(v, "bgColorType") === "solid"
                        })
                      ]
                    },
                    {
                      width: 18,
                      options: [
                        toolbarGradientLinearDegree({
                          v,
                          device,
                          state,
                          disabled:
                            tabletSyncOnChange(v, "bgColorType") === "solid" ||
                            tabletSyncOnChange(v, "gradientType") === "radial"
                        }),
                        toolbarGradientRadialDegree({
                          v,
                          device,
                          state,
                          disabled:
                            tabletSyncOnChange(v, "bgColorType") === "solid" ||
                            tabletSyncOnChange(v, "gradientType") === "linear"
                        })
                      ]
                    }
                  ]
                }
              ]
            },
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
                    "onChangeBorderColorHexAndOpacityDependencies",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet"
                  ]
                }),
                toolbarBorderColorPalette({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorPalette",
                    "onChangeBorderColorPaletteOpacity",
                    "onChangeBorderColorHexAndOpacityDependencies",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet"
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
                            "onChangeBorderColorHexAndOpacityDependencies",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet"
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
              id: "tabletTabBoxShadow",
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
      id: "tabletToolbarLink",
      type: "popover",
      icon: "nc-link",
      disabled: v.linkPopup === "",
      position: 100,
      options: []
    },
    {
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      position: 110,
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
          type: "multiPicker",
          disabled: inPopup,
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
                    tabletMarginBottom: tabletMargin
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
                      tabletMarginTop === v.tabletMarginBottom
                        ? tabletMarginTop
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
                      tabletMarginBottom === v.tabletMarginTop
                        ? tabletMarginBottom
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

export function getItemsForMobile(v, component) {
  const device = "mobile";
  const state = "normal";

  const { hex: mobileBgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    toolbarShowOnMobile({ v }),
    {
      id: "mobileToolbarCurrentElement",
      type: "popover",
      position: 80,
      icon: "nc-background",
      title: t("Background"),
      options: [
        {
          id: "mobileTabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "mobileTabCurrentElement",
              label: t("Background"),
              options: [
                toolbarElementContainerTypeImageMap({ v, device, state }),
                toolbarBgImage({
                  v,
                  device,
                  state,
                  disabled:
                    mobileSyncOnChange(v, "media") !== "image" &&
                    mobileSyncOnChange(v, "media") !== "video",
                  onChange: [
                    "onChangeBgImage",
                    "onChangeBgImageBgOpacity",
                    "onChangeBgImageDependencies",
                    "onChangeBgImageColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBgMapZoom({ v, disabled: v.media !== "map" })
              ]
            },
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
            mobileBgColorHex,
            mobileSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        {
          id: "mobileTabsColor",
          type: "tabs",
          tabs: [
            {
              id: "mobileTabOverlay",
              label: t("Overlay"),
              options: [
                {
                  type: "grid",
                  className: "brz-ed-grid__gradient",
                  columns: [
                    {
                      width: 43,
                      options: [toolbarBgType({ v, device, state })]
                    },
                    {
                      width: 57,
                      options: [
                        toolbarGradientRange({
                          v,
                          device,
                          state,
                          disabled:
                            mobileSyncOnChange(v, "bgColorType") === "solid"
                        })
                      ]
                    }
                  ]
                },
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state,
                  prefix: "bg",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "gradient" &&
                    mobileSyncOnChange(v, "gradientActivePointer") ===
                      "finishPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state,
                  prefix: "bg",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "gradient" &&
                    mobileSyncOnChange(v, "gradientActivePointer") ===
                      "finishPointer",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state,
                  prefix: "gradient",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientActivePointer") ===
                      "startPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state,
                  prefix: "gradient",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientActivePointer") ===
                      "startPointer",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity",
                    "onChangeBgColorHexAndOpacityDependencies",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 30,
                      options: [
                        toolbarBgColorFields({
                          v,
                          device,
                          state,
                          prefix: "bg",
                          disabled:
                            mobileSyncOnChange(v, "bgColorType") ===
                              "gradient" &&
                            mobileSyncOnChange(v, "gradientActivePointer") ===
                              "finishPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
                          ]
                        }),
                        toolbarBgColorFields({
                          v,
                          device,
                          state,
                          prefix: "gradient",
                          disabled:
                            mobileSyncOnChange(v, "bgColorType") === "solid" ||
                            mobileSyncOnChange(v, "gradientActivePointer") ===
                              "startPointer",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette",
                            "onChangeBgColorHexAndOpacityDependencies",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile"
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
                          state,
                          className:
                            "brz-ed__select--transparent brz-ed__select--align-right",
                          disabled:
                            mobileSyncOnChange(v, "bgColorType") === "solid"
                        })
                      ]
                    },
                    {
                      width: 18,
                      options: [
                        toolbarGradientLinearDegree({
                          v,
                          device,
                          state,
                          disabled:
                            mobileSyncOnChange(v, "bgColorType") === "solid" ||
                            mobileSyncOnChange(v, "gradientType") === "radial"
                        }),
                        toolbarGradientRadialDegree({
                          v,
                          device,
                          state,
                          disabled:
                            mobileSyncOnChange(v, "bgColorType") === "solid" ||
                            mobileSyncOnChange(v, "gradientType") === "linear"
                        })
                      ]
                    }
                  ]
                }
              ]
            },
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
                    "onChangeBorderColorHexAndOpacityDependencies",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
                  ]
                }),
                toolbarBorderColorPalette({
                  v,
                  device,
                  state,
                  onChange: [
                    "onChangeBorderColorPalette",
                    "onChangeBorderColorPaletteOpacity",
                    "onChangeBorderColorHexAndOpacityDependencies",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
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
                            "onChangeBorderColorHexAndOpacityDependencies",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile"
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
              id: "mobileTabBoxShadow",
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
      id: "mobileToolbarLink",
      type: "popover",
      icon: "nc-link",
      disabled: v.linkPopup === "",
      position: 100,
      options: []
    },
    {
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      position: 110,
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
          type: "multiPicker",
          disabled: inPopup,
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
                    mobileMarginBottom: mobileMargin
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
                      mobileMarginTop === v.mobileMarginBottom
                        ? mobileMarginTop
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
                      mobileMarginBottom === v.mobileMarginTop
                        ? mobileMarginBottom
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
