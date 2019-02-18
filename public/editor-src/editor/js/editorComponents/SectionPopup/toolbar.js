import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarBgImage,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarColorHexAndOpacity,
  toolbarColorPalette,
  toolbarColorFields,
  toolbarBgType,
  toolbarGradientRange,
  toolbarGradientType,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree
} from "visual/utils/toolbar";

export function getItemsForDesktop(v, component) {
  const device = "desktop";
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");

  return [
    {
      id: "toolbarPopup",
      type: "popover",
      icon: "nc-popup",
      title: "Popup",
      position: 70,
      options: [
        {
          id: "makeItGlobal",
          label: t("Make it Global"),
          type: "switch",
          value: component.props.meta.globalBlockId ? "on" : "off",
          onChange: value => {
            value === "on"
              ? component.becomeGlobal()
              : component.becomeNormal();
          }
        }
      ]
    },
    {
      id: "toolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        toolbarBgImage({
          v,
          device,
          state: "normal",
          onChange: ["onChangeBgImage", "onChangeBgImageBgOpacity"]
        })
      ]
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
                            "onChangeBgColorHexAndOpacityDependencies"
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
                            "onChangeBgColorHexAndOpacityDependencies"
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
                            "onChangeBgColorHexAndOpacityDependencies"
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
                            "onChangeBgColorHexAndOpacityDependencies"
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
                                    "onChangeBgColorHexAndOpacityDependencies"
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
                                    "onChangeBgColorHexAndOpacityDependencies"
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
                      id: "tabClose",
                      label: t("Close"),
                      options: [
                        toolbarColorHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarColorPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeColorPalette",
                            "onChangeColorPaletteOpacity"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarColorFields({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeColorHexAndOpacity",
                                    "onChangeColorHexAndOpacityPalette"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 52,
                              options: []
                            },
                            {
                              width: 18,
                              options: []
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
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: "tabClose",
                      label: t("Close"),
                      options: [
                        toolbarColorHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ]
                        }),
                        toolbarColorPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeColorPalette",
                            "onChangeColorPaletteOpacity"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 30,
                              options: [
                                toolbarColorFields({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeColorHexAndOpacity",
                                    "onChangeColorHexAndOpacityPalette"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 52,
                              options: []
                            },
                            {
                              width: 18,
                              options: []
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
      id: "makeItSaved",
      type: "buttonTooltip",
      icon: "nc-save-section",
      position: 100,
      title: t("Save"),
      tooltipContent: t("Saved"),
      onChange: () => {
        component.becomeSaved();
      }
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";
  const state = "normal";
  const { hex: tabletBgColorHex } =
    v.tabletBgColorHex !== null
      ? getOptionColor(v, "tabletBgColor")
      : getOptionColor(v, "bgColor");

  return [
    {
      id: "tabletToolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 90,
      options: [
        toolbarBgImage({
          v,
          device,
          state: "normal",
          onChange: ["onChangeBgImage", "onChangeBgImageBgOpacity"]
        })
      ]
    },
    {
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 100,
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
          type: "grid",
          className: "brz-ed-grid__gradient",
          columns: [
            {
              width: 43,
              options: [toolbarBgType({ v, device, state: "normal" })]
            },
            {
              width: 57,
              options: [
                toolbarGradientRange({
                  v,
                  device,
                  state: "normal",
                  disabled: tabletSyncOnChange(v, "bgColorType") === "solid"
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
            tabletSyncOnChange(v, "bgColorType") === "gradient" &&
            tabletSyncOnChange(v, "gradientActivePointer") === "finishPointer",
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state: "normal",
          prefix: "bg",
          disabled:
            tabletSyncOnChange(v, "bgColorType") === "gradient" &&
            tabletSyncOnChange(v, "gradientActivePointer") === "finishPointer",
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state: "normal",
          prefix: "gradient",
          disabled:
            tabletSyncOnChange(v, "bgColorType") === "solid" ||
            tabletSyncOnChange(v, "gradientActivePointer") === "startPointer",
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state: "normal",
          prefix: "gradient",
          disabled:
            tabletSyncOnChange(v, "bgColorType") === "solid" ||
            tabletSyncOnChange(v, "gradientActivePointer") === "startPointer",
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
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
                    tabletSyncOnChange(v, "bgColorType") === "gradient" &&
                    tabletSyncOnChange(v, "gradientActivePointer") ===
                      "finishPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBgColorFields({
                  v,
                  device,
                  state: "normal",
                  prefix: "gradient",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientActivePointer") ===
                      "startPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies"
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
                  disabled: tabletSyncOnChange(v, "bgColorType") === "solid"
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
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientType") === "radial"
                }),
                toolbarGradientRadialDegree({
                  v,
                  device,
                  state: "normal",
                  disabled:
                    tabletSyncOnChange(v, "bgColorType") === "solid" ||
                    tabletSyncOnChange(v, "gradientType") === "linear"
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";
  const { hex: mobileBgColorHex } =
    v.mobileBgColorHex !== null
      ? getOptionColor(v, "mobileBgColor")
      : getOptionColor(v, "bgColor");

  return [
    {
      id: "mobileToolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 90,
      options: [
        toolbarBgImage({
          v,
          device,
          state: "normal",
          onChange: ["onChangeBgImage", "onChangeBgImageBgOpacity"]
        })
      ]
    },
    {
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 100,
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
          type: "grid",
          className: "brz-ed-grid__gradient",
          columns: [
            {
              width: 43,
              options: [toolbarBgType({ v, device, state: "normal" })]
            },
            {
              width: 57,
              options: [
                toolbarGradientRange({
                  v,
                  device,
                  state: "normal",
                  disabled: mobileSyncOnChange(v, "bgColorType") === "solid"
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
            mobileSyncOnChange(v, "bgColorType") === "gradient" &&
            mobileSyncOnChange(v, "gradientActivePointer") === "finishPointer",
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state: "normal",
          prefix: "bg",
          disabled:
            mobileSyncOnChange(v, "bgColorType") === "gradient" &&
            mobileSyncOnChange(v, "gradientActivePointer") === "finishPointer",
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state: "normal",
          prefix: "gradient",
          disabled:
            mobileSyncOnChange(v, "bgColorType") === "solid" ||
            mobileSyncOnChange(v, "gradientActivePointer") === "startPointer",
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state: "normal",
          prefix: "gradient",
          disabled:
            mobileSyncOnChange(v, "bgColorType") === "solid" ||
            mobileSyncOnChange(v, "gradientActivePointer") === "startPointer",
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
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
                    mobileSyncOnChange(v, "bgColorType") === "gradient" &&
                    mobileSyncOnChange(v, "gradientActivePointer") ===
                      "finishPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBgColorFields({
                  v,
                  device,
                  state: "normal",
                  prefix: "gradient",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientActivePointer") ===
                      "startPointer",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies"
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
                  disabled: mobileSyncOnChange(v, "bgColorType") === "solid"
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
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientType") === "radial"
                }),
                toolbarGradientRadialDegree({
                  v,
                  device,
                  state: "normal",
                  disabled:
                    mobileSyncOnChange(v, "bgColorType") === "solid" ||
                    mobileSyncOnChange(v, "gradientType") === "linear"
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}
