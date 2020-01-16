import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarDisabledShowOnResponsive,
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
  toolbarBorderWidthOneField2,
  toolbarDisabledHorizontalAlign,
  toolbarPaddingFourFields,
  toolbarDisabledToolbarSettings
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device }),
    defaultValueValue({ v, key: "colorPalette", device })
  );

  return [
    toolbarDisabledShowOnResponsive({ device }),
    {
      id: defaultValueKey({ key: "popoverTypography", device }),
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
      id: defaultValueKey({ key: "popoverColor", device, state: "normal" }),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor:
            defaultValueValue({ v, key: "bgColorOpacity", device }) > 0
              ? hexToRgba(bgColorHex, v.bgColorOpacity)
              : hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          value: v.tabsColor,
          tabs: [
            {
              id: defaultValueKey({ key: "tabBackground", device }),
              label: t("Background"),
              options: [
                toolbarBgColor2({
                  v,
                  device,
                  state: "normal",
                  showSelect: false,
                  onChangeHex: [
                    "onChangeBgColorHexAndOpacity2",
                    "onChangeBgColorHexAndOpacityPalette2"
                  ],
                  onChangePalette: [
                    "onChangeBgColorPalette2",
                    "onChangeBgColorPaletteOpacity2"
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
                          onChange: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: defaultValueKey({ key: "tabText", device }),
              label: t("Text"),
              options: [
                toolbarColor2({
                  v,
                  device,
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
              id: defaultValueKey({ key: "tabBorder", device }),
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  state: "normal",
                  showSelect: false,
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
                          state: "normal",
                          onChange: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeElementBorderColorHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 62,
                      options: [
                        toolbarBorderWidthOneField2({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeBorderWidthGrouped2"]
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
    toolbarDisabledHorizontalAlign({ device }),
    {
      id: defaultValueKey({
        key: "advancedSettings",
        device,
        state: "normal"
      }),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        toolbarPaddingFourFields({
          v,
          device,
          state: "normal"
        })
      ]
    },
    toolbarDisabledToolbarSettings({ device })
  ];
}
