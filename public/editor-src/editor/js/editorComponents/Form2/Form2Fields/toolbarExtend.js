import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing,
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthFourFields2,
  toolbarDisabledHorizontalAlign,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarElementForm2Size,
  toolbarElementForm2BorderRadius
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: checkboxColorHex } = getOptionColorHexByPalette(
    dvv("checkboxColorHex"),
    dvv("checkboxColorPalette")
  );

  return [
    {
      id: dvk("toolbarCurrentElement"),
      type: "popover",
      options: [
        {
          id: dvk("currentShortcodeTabs"),
          type: "tabs",
          tabs: [
            {
              id: dvk("background"),
              options: [
                toolbarElementForm2Size({ v, device, devices: "desktop" }),
                toolbarElementForm2BorderRadius({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop",
                  onChange: [
                    "onChangeBorderRadiusGrouped",
                    "onChangeBorderRadiusGroupedDependencies"
                  ]
                })
              ]
            }
          ]
        },
        toolbarElementForm2Size({ v, device, devices: "responsive" })
      ]
    },

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
                  state: "normal",
                  onChange: ["onChangeTypography2"]
                })
              ]
            },
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                toolbarTypography2FontStyle({ v, device, state: "normal" }),
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
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LineHeight({
                          v,
                          device,
                          state: "normal",
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
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LetterSpacing({
                          v,
                          device,
                          state: "normal",
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
      id: dvk("toolbarTypographyCheckbox"),
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
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
                  prefix: "checkbox",
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
                  prefix: "checkbox",
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
                          prefix: "checkbox",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LineHeight({
                          v,
                          device,
                          prefix: "checkbox",
                          state: "normal",
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
                          prefix: "checkbox",
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LetterSpacing({
                          v,
                          device,
                          prefix: "checkbox",
                          state: "normal",
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
      roles: ["admin"],
      position: 80,
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
              id: dvk("tabBg"),
              label: t("Bg"),
              options: [
                toolbarBgColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
                  showSelect: false,
                  onChangeHex: [
                    "onChangeBgColorHexAndOpacity2",
                    "onChangeBgColorHexAndOpacityPalette2",
                    "onChangeBgColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBgColorPalette2",
                    "onChangeBgColorPaletteOpacity2",
                    "onChangeBgColorHexAndOpacityDependencies2"
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
                          state,
                          states: [NORMAL, HOVER],
                          onChange: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
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
              id: dvk("tabBorder"),
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
                  devices: "desktop",
                  onChangeStyle: [
                    "onChangeBorderStyle2",
                    "onChangeElementBorderStyleDependencies2"
                  ],
                  onChangeHex: [
                    "onChangeBorderColorHexAndOpacity2",
                    "onChangeBorderColorHexAndOpacityPalette2",
                    "onChangeElementBorderColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBorderColorPalette2",
                    "onChangeBorderColorPaletteOpacity2",
                    "onChangeElementBorderColorHexAndOpacityDependencies2"
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
                          state,
                          states: [NORMAL, HOVER],
                          devices: "desktop",
                          onChange: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeElementBorderColorHexAndOpacityDependencies2"
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
                          state,
                          states: [NORMAL, HOVER],
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
              id: dvk("tabBoxShadow"),
              label: t("Shadow"),
              options: [
                toolbarBoxShadow2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
      id: dvk("toolbarColorCheckbox"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      devices: "desktop",
      icon: {
        style: {
          backgroundColor: hexToRgba(
            checkboxColorHex,
            dvv("checkboxColorOpacity")
          )
        }
      },
      options: [
        toolbarColor2({
          v,
          device,
          prefix: "checkboxColor",
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
                  prefix: "checkboxColor",
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

    toolbarDisabledHorizontalAlign({ device, devices: "desktop" })
  ];
}
