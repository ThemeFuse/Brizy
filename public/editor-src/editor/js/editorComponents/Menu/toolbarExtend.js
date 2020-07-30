import { hexToRgba } from "visual/utils/color";
import {
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarBorder2,
  toolbarBorderColorHexField2
} from "visual/utils/toolbar";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL, HOVER, ACTIVE } from "visual/utils/stateMode";
import { t } from "visual/utils/i18n";

export function getItems({ v, device, state }) {
  return defaultValueValue({ v, device, state, key: "mMenu" }) === "on"
    ? getItemsMMenu({ v, device, state })
    : getItemsSimple({ v, device, state });
}

export function getItemsSimple({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );
  const { hex: subMenuColorHex } = getOptionColorHexByPalette(
    dvv("subMenuColorHex"),
    dvv("subMenuColorPalette")
  );

  return [
    {
      id: "toolbarMenuSettings",
      type: "popover-dev",
      config: {
        icon: "nc-menu-3",
        title: t("Menu")
      },
      position: 10,
      options: [
        {
          id: "menuSize",
          type: "slider-dev",
          label: t("Size"),
          position: 20,
          disabled: dvv("verticalMode") === "horizontal",
          config: {
            min: 10,
            max: 100,
            units: [
              {
                title: "%",
                value: "%"
              }
            ]
          }
        }
      ]
    },
    {
      id: "toolbarMenuItem",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "iconSize",
          type: "slider-dev",
          label: t("Size"),
          position: 20,
          config: {
            min: 0,
            max: 100,
            units: [
              {
                title: "px",
                value: "px"
              }
            ]
          }
        },
        {
          id: "iconSpacing",
          type: "slider-dev",
          devices: "desktop",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
          config: {
            min: 0,
            max: 100,
            units: [
              {
                title: "px",
                value: "px"
              }
            ]
          }
        }
      ]
    },
    {
      id: "subMenuToolbarMenuItem",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "subMenuIconSize",
          type: "slider-dev",
          label: t("Size"),
          position: 20,
          config: {
            min: 0,
            max: 100,
            units: [
              {
                title: "px",
                value: "px"
              }
            ]
          }
        },
        {
          id: "subMenuIconSpacing",
          type: "slider",
          devices: "desktop",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
          slider: {
            min: 0,
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
              }
            ]
          },
          value: {
            value: v.subMenuIconSpacing
          },
          onChange: ({ value: subMenuIconSpacing }) => ({
            subMenuIconSpacing,

            mMenuIconSpacing:
              v.subMenuIconSpacing === v.mMenuIconSpacing
                ? subMenuIconSpacing
                : v.mMenuIconSpacing
          })
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === DESKTOP ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },
    {
      id: "subMenuToolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === DESKTOP ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "subMenu",
          type: "typography-dev",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },

    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "bg",
              label: t("Bg"),
              options: [
                {
                  id: "menuBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "border",
              label: t("Border"),
              options: [
                {
                  id: "menuBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "subMenuToolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(subMenuColorHex, v.subMenuColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "subMenuColor",
          type: "tabs-dev",
          config: {
            position: "left"
          },
          tabs: [
            {
              id: "tabNormal",
              icon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "subMenuColorTabs",
                  type: "tabs-dev",
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "subMenuColor",
                          onChangeHex: ["onChangeColorHexSubMenu2"],
                          onChangePalette: ["onChangeColorPaletteSubMenu2"]
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
                                  prefix: "subMenuColor",
                                  onChange: ["onChangeColorFieldsSubMenu2"]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBackground",
                      label: t("Bg"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "subMenuBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgColorHexSubMenu2"],
                          onChangePalette: ["onChangeBgColorPaletteSubMenu2"]
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
                                  prefix: "subMenuBg",
                                  onChange: ["onChangeBgColorFieldsSubMenu2"]
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
                        toolbarBorder2({
                          v,
                          device,
                          state: "normal",
                          prefix: "subMenu",
                          showSelect: false,
                          onChangeHex: ["onChangeBorderColorHexSubMenu2"],
                          onChangePalette: [
                            "onChangeBorderColorPaletteSubMenu2"
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
                                  prefix: "subMenu",
                                  state: "normal",
                                  onChange: [
                                    "onChangeBorderColorFieldsSubMenu2"
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
                          choices: "outset",
                          state: "normal",
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
                              width: 41,
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
                              width: 59,
                              options: [
                                toolbarBoxShadowFields2({
                                  v,
                                  device,
                                  state: "normal",
                                  choices: "outset",
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
              id: "tabHover",
              icon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "subMenuHoverColorTabs",
                  className: "",
                  type: "tabs-dev",
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "subMenuHoverColor",
                          onChangeHex: ["onChangeHoverColorHexSubMenu2"],
                          onChangePalette: ["onChangeHoverColorPaletteSubMenu2"]
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
                                  prefix: "subMenuHoverColor",
                                  onChange: ["onChangeHoverColorFieldsSubMenu2"]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBackground",
                      label: t("Background"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "subMenuHoverBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgHoverColorHexSubMenu2"],
                          onChangePalette: [
                            "onChangeBgHoverColorPaletteSubMenu2"
                          ]
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
                                  prefix: "subMenuHoverBg",
                                  onChange: [
                                    "onChangeBgHoverColorFieldsSubMenu2"
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
                          choices: "outset",
                          state: "hover",
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
                              width: 41,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadowFields2({
                                  v,
                                  device,
                                  state: "hover",
                                  choices: "outset",
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
              id: "tabActive",
              icon: "nc-target",
              title: t("Active"),
              options: [
                {
                  id: "activeSubMenuColorTabs",
                  className: "",
                  type: "tabs-dev",
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "activeSubMenuColor",
                          onChangeHex: ["onChangeActiveColorHexSubMenu2"],
                          onChangePalette: [
                            "onChangeActiveColorPaletteSubMenu2"
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
                                  prefix: "activeSubMenuColor",
                                  onChange: [
                                    "onChangeActiveColorFieldsSubMenu2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBackground",
                      label: t("Background"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "activeSubMenuBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgActiveColorHexSubMenu2"],
                          onChangePalette: [
                            "onChangeBgActiveColorPaletteSubMenu2"
                          ]
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
                                  prefix: "activeSubMenuBg",
                                  onChange: [
                                    "onChangeBgActiveColorFieldsSubMenu2"
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
                          choices: "outset",
                          state: "active",
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
                              width: 41,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "active",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadowFields2({
                                  v,
                                  device,
                                  state: "active",
                                  choices: "outset",
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
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}

export function getItemsMMenu({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const { hex: mMenuColorHex } = getOptionColorHexByPalette(
    dvv("mMenuColorHex"),
    dvv("mMenuColorPalette")
  );

  return [
    {
      id: "mMenuToolbarMenuItem",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "mMenuIconSize",
          type: "slider-dev",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
          config: {
            min: 0,
            max: 100,
            units: [
              {
                title: "%",
                value: "%"
              }
            ]
          }
        },
        {
          id: "mMenuIconSpacing",
          type: "slider-dev",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
          config: {
            min: 0,
            max: 100,
            units: [
              {
                title: "%",
                value: "%"
              }
            ]
          }
        }
      ]
    },
    {
      id: "mMenuToolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        title: t("Typography"),
        size: device === DESKTOP ? "large" : "auto"
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "mMenu",
          type: "typography-dev",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },
    {
      id: "mMenuToolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(mMenuColorHex, v.mMenuColorOpacity)
          }
        }
      },
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "mMenuColor",
          type: "tabs-dev",
          config: {
            position: "left"
          },
          tabs: [
            {
              id: "tabNormal",
              icon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "mMenuColorTabs",
                  className: "",
                  type: "tabs-dev",
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "mMenuColor",
                          state: "normal",
                          onChangeHex: ["onChangeColorHexMMenu2"],
                          onChangePalette: ["onChangeColorPaletteMMenu2"]
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
                                  prefix: "mMenuColor",
                                  state: "normal",
                                  onChange: ["onChangeColorFieldsMMenu2"]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBackground",
                      label: t("Background"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "mMenuBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgColorHexMMenu2"],
                          onChangePalette: ["onChangeBgColorPaletteMMenu2"]
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
                                  prefix: "mMenuBg",
                                  onChange: ["onChangeBgColorFieldsMMenu2"]
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
                        toolbarBorder2({
                          v,
                          device,
                          state: "normal",
                          prefix: "mMenu",
                          showSelect: false,
                          onChangeHex: ["onChangeBorderColorHexMMenu2"],
                          onChangePalette: ["onChangeBorderColorPaletteMMenu2"]
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
                                  prefix: "mMenu",
                                  state: "normal",
                                  onChange: ["onChangeBorderColorFieldsMMenu2"]
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
              icon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "mMenuColorTabs",
                  className: "",
                  config: {
                    showSingle: true
                  },
                  type: "tabs-dev",
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "mMenuHoverColor",
                          onChangeHex: ["onChangeHoverColorHexMMenu2"],
                          onChangePalette: ["onChangeHoverColorPaletteMMenu2"]
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
                                  prefix: "mMenuHoverColor",
                                  onChange: ["onChangeHoverColorFieldsMMenu2"]
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
              id: "tabActive",
              icon: "nc-target",
              title: t("Active"),
              options: [
                {
                  id: "mMenuColorTabs",
                  className: "",
                  config: {
                    showSingle: true
                  },
                  type: "tabs-dev",
                  tabs: [
                    {
                      id: "tabText",
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "activeMMenuColor",
                          onChangeHex: ["onChangeActiveColorHexMMenu2"],
                          onChangePalette: ["onChangeActiveColorPaletteMMenu2"]
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
                                  prefix: "activeMMenuColor",
                                  onChange: ["onChangeActiveColorFieldsMMenu2"]
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
      id: "mMenuItemHorizontalAlign",
      type: "toggle-dev",
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
      ]
    },
    {
      id: "mMenuAdvancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
