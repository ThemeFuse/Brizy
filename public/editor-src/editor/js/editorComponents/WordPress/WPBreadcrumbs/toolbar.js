import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementBreadcrumbsSpacing,
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarCustomCSS,
  toolbarHoverTransition
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  return [
    {
      id: dvk("toolbarCurrentShortcode"),
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Breadcrumbs"),
      position: 60,
      devices: "desktop",
      options: [
        toolbarElementBreadcrumbsSpacing({
          v,
          device,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: dvk("toolbarTypography"),
      type: "popover",
      icon: "nc-font",
      size: "large",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      devices: "desktop",
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__typography",
          devices: "desktop",
          columns: [
            {
              width: 54,
              options: [
                toolbarTypography2FontFamily({
                  v,
                  device,
                  devices: "desktop",
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
                  devices: "desktop",
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
                          devices: "desktop",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LineHeight({
                          v,
                          device,
                          state: "normal",
                          devices: "desktop",
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
                          devices: "desktop",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LetterSpacing({
                          v,
                          device,
                          state: "normal",
                          devices: "desktop",
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
      id: dvk("toolbarTypography"),
      type: "popover",
      icon: "nc-font",
      size: "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      devices: "responsive",
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__typography",
          columns: [
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                toolbarTypography2FontStyle({
                  v,
                  device,
                  devices: "responsive",
                  state: "normal"
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  devices: "responsive",
                  columns: [
                    {
                      width: "50",
                      options: [
                        toolbarTypography2FontSize({
                          v,
                          device,
                          state: "normal",
                          devices: "responsive",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LineHeight({
                          v,
                          device,
                          state: "normal",
                          devices: "responsive",
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
                          devices: "responsive",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LetterSpacing({
                          v,
                          device,
                          state: "normal",
                          devices: "responsive",
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
                      id: dvk("tabLinks"),
                      label: t("Links"),
                      devices: "desktop",
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
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: dvk("colorActive"),
                      label: t("Active"),
                      devices: "desktop",
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "activeColor",
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
                                  prefix: "activeColor",
                                  devices: "desktop",
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
                      id: dvk("colorArrows"),
                      label: t("Arrows"),
                      devices: "desktop",
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "arrowsColor",
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
                                  prefix: "arrowsColor",
                                  devices: "desktop",
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
                  devices: "desktop",
                  value: dvv("tabsColor"),
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: dvk("tabLinks"),
                      label: t("Links"),
                      devices: "desktop",
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
        [dvk("tabsState")]: !isOpen ? "" : dvv("tabsState"),
        [dvk("tabsColor")]: !isOpen ? "" : dvv("tabsColor")
      })
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
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
                    toolbarCustomCSS({ v, devices: "desktop" }),
                    toolbarHoverTransition({
                      v,
                      device,
                      state: "normal",
                      position: 70,
                      devices: "desktop"
                    })
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
