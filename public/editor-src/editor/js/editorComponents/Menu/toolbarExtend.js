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
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { DESKTOP } from "visual/utils/responsiveMode";
import { t } from "visual/utils/i18n";

export function getItems({ v, device, state }) {
  return v.mMenu === "on"
    ? getItemsMMenu({ v, device, state })
    : getItemsSimple({ v, device, state });
}

export function getItemsSimple({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvk("colorHex"),
    dvv("colorPalette")
  );
  const { hex: subMenuColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "subMenuColorHex", device }),
    defaultValueValue({ v, key: "subMenuColorPalette", device })
  );

  return [
    {
      id: "toolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 20,
      options: [
        {
          id: dvk("iconSize"),
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: dvv("iconSize")
          },
          onChange: ({ value }) => ({
            [dvk("iconSize")]: value
          })
        },
        {
          id: "iconSpacing",
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
            value: dvv("iconSpacing")
          },
          onChange: ({ value }) => ({
            [dvk("iconSpacing")]: value
          })
        }
      ]
    },
    {
      id: "subMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 20,
      options: [
        {
          id: "subMenuIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.subMenuIconSize
          },
          onChange: ({ value: subMenuIconSize }) => ({ subMenuIconSize })
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
      type: "popover",
      icon: "nc-font",
      size: device === DESKTOP ? "large" : "auto",
      title: t("Typography"),
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
      type: "popover",
      icon: "nc-font",
      size: device === DESKTOP ? "large" : "auto",
      title: t("Typography"),
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
      type: "popover",
      devices: "desktop",
      size: "auto",
      title: t("Colors"),
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      roles: ["admin"],
      options: [
        {
          id: "color",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "colorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "normal",
                          onChangeHex: ["onChangeMenuColorHex2"],
                          onChangePalette: ["onChangeMenuColorPalette2"]
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
                                  state: "normal",
                                  onChange: ["onChangeMenuColorFields2"]
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
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "colorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "hover",
                          onChangeHex: ["onChangeMenuHoverColorHex2"],
                          onChangePalette: ["onChangeMenuHoverColorPalette2"]
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
                                  state: "hover",
                                  onChange: ["onChangeMenuHoverColorFields2"]
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
      id: "subMenuToolbarColor",
      type: "popover",
      devices: "desktop",
      size: "auto",
      title: t("Colors"),
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(subMenuColorHex, v.subMenuColorOpacity)
        }
      },
      roles: ["admin"],
      options: [
        {
          id: "subMenuColor",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "subMenuColorTabs",
                  type: "tabs",
                  tabs: [
                    {
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
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "subMenuHoverColorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
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
                      label: t("Background"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "subMenuHoverBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgHoverColorHexSubMenu2"],
                          onChangePalette: ["onChangeBorderColorPaletteMMenu2"]
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
            }
          ]
        }
      ]
    }

    // mMenu
  ];
}

export function getItemsMMenu({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: mMenuColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "mMenuColorHex", device }),
    defaultValueValue({ v, key: "mMenuColorPalette", device })
  );

  return [
    {
      id: "mMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 20,
      options: [
        {
          id: dvk("mMenuIconSize"),
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: dvv("mMenuIconSize")
          },
          onChange: ({ value }) => ({
            [dvk("mMenuIconSize")]: value
          })
        },
        {
          id: dvk("mMenuIconSpacing"),
          type: "slider",
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
            value: dvv("mMenuIconSpacing")
          },
          onChange: ({ value }) => ({
            [dvk("mMenuIconSpacing")]: value
          })
        }
      ]
    },
    {
      id: "mMenuToolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: device === DESKTOP ? "large" : "auto",
      title: t("Typography"),
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
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(mMenuColorHex, v.mMenuColorOpacity)
        }
      },
      roles: ["admin"],
      options: [
        {
          id: "mMenuColor",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "mMenuColorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
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
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "mMenuColorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
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
                    },
                    {
                      id: "hiddenTab",
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
    }
  ];
}
