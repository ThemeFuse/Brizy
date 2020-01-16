import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementStarRatingLabel,
  toolbarElementStarRatingRating,
  toolbarSizeSpacing,
  toolbarIconSpacing,
  toolbarIconSize,
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarCustomCSS,
  toolbarHoverTransition,
  toolbarDisabledToolbarSettings
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
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
      icon: "nc-starrating",
      title: t("Rating"),
      position: 60,
      options: [
        {
          id: dvk("tabsCurrentElement"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabCurrentElement"),
              label: t("Rating"),
              roles: ["admin"],
              options: [
                toolbarElementStarRatingLabel({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarElementStarRatingRating({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarSizeSpacing({
                  v,
                  device,
                  state: "normal"
                })
              ]
            },
            {
              id: dvk("tabStarRatingIcons"),
              label: t("Icons"),
              roles: ["admin"],
              options: [
                toolbarIconSize({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarIconSpacing({
                  v,
                  device,
                  state: "normal"
                })
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
      devices: "desktop",
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsColor"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabText"),
              label: t("Text"),
              devices: "desktop",
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
              id: dvk("tabRating"),
              label: t("Rating"),
              devices: "desktop",
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
                  prefix: "ratingColor",
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
                          state,
                          states: [NORMAL, HOVER],
                          prefix: "ratingColor",
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
              id: dvk("tabBackground"),
              label: t("Background"),
              devices: "desktop",
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
                  prefix: "ratingBackgroundColor",
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
                          state,
                          states: [NORMAL, HOVER],
                          prefix: "ratingBackgroundColor",
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
    toolbarDisabledToolbarSettings({ device }),
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
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
  ];
}
