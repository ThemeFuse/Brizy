import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import {
  toolbarBgImage,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarGradientType,
  toolbarBgColorHexField2,
  toolbarBgColor2,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree
} from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  const tabsColor = defaultValueValue({
    v,
    key: "tabsColor",
    device,
    state: "normal"
  });

  return [
    {
      id: defaultValueKey({ key: "toolbarPopup", device, state: "normal" }),
      type: "popover",
      icon: "nc-popup",
      title: "Popup",
      devices: "desktop",
      position: 70,
      options: [
        {
          id: defaultValueKey({ key: "makeItGlobal", device, state: "normal" }),
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
      id: defaultValueKey({ key: "toolbarMedia", device, state: "normal" }),
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
      id: defaultValueKey({ key: "toolbarColor", device, state: "normal" }),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            bgColorHex,
            defaultValueValue({
              v,
              key: "bgColorOpacity",
              device,
              state: "normal"
            })
          )
        }
      },
      options: [
        {
          id: defaultValueKey({ key: "tabsState", device, state: "normal" }),
          tabsPosition: "left",
          type: "tabs",
          value: defaultValueValue({
            v,
            key: "tabsState",
            device,
            state: "normal"
          }),
          tabs: [
            {
              id: defaultValueKey({
                key: "tabNormal",
                device,
                state: "normal"
              }),
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: defaultValueKey({
                    key: "tabsColor",
                    device,
                    state: "normal"
                  }),
                  type: "tabs",
                  value: tabsColor,
                  tabs: [
                    {
                      id: defaultValueKey({
                        key: "tabOverlay",
                        device,
                        state: "normal"
                      }),
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
                                    defaultValueValue({
                                      v,
                                      key: "gradientActivePointer",
                                      device,
                                      state: "normal"
                                    }) === "startPointer"
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
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "normal"
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
                                  state: "normal",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "normal"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "normal"
                                    }) === "radial"
                                }),
                                toolbarGradientRadialDegree({
                                  v,
                                  device,
                                  state: "normal",
                                  disabled:
                                    defaultValueValue({
                                      v,
                                      key: "bgColorType",
                                      device,
                                      state: "normal"
                                    }) === "solid" ||
                                    defaultValueValue({
                                      v,
                                      key: "gradientType",
                                      device,
                                      state: "normal"
                                    }) === "linear"
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: defaultValueKey({
                        key: "tabClose",
                        device,
                        state: "normal",
                        devices: "desktop"
                      }),
                      label: t("Close"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "normal",
                          devices: "desktop",
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
                                  state: "normal",
                                  devices: "desktop",
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
              id: defaultValueKey({ key: "tabHover", device, state: "normal" }),
              tabIcon: "nc-hover",
              title: t("Hover"),
              devices: "desktop",
              options: [
                {
                  id: defaultValueKey({
                    key: "tabsColor",
                    device,
                    state: "normal"
                  }),
                  type: "tabs",
                  value: tabsColor,
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: defaultValueKey({
                        key: "tabClose",
                        device,
                        state: "normal"
                      }),
                      label: t("Close"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "hover",
                          devices: "desktop",
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
                                  state: "hover",
                                  devices: "desktop",
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
        tabsColor: !isOpen ? "" : tabsColor
      })
    },
    {
      id: defaultValueKey({ key: "makeItSaved", device, state: "normal" }),
      type: "buttonTooltip",
      icon: "nc-save-section",
      position: 100,
      title: t("Save"),
      devices: "desktop",
      tooltipContent: t("Saved"),
      onChange: () => {
        component.becomeSaved();
      }
    },
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop",
      position: 110,
      options: [
        {
          id: defaultValueKey({
            key: "advancedSettings",
            device,
            state: "normal"
          }),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: defaultValueKey({
                key: "settingsTabs",
                device,
                state: "normal"
              }),
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: defaultValueKey({
                    key: "moreSettingsAdvanced",
                    device,
                    state: "normal"
                  }),
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
