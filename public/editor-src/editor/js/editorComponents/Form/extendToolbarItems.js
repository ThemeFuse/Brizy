import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { getWeightChoices, getWeight, getFontStyle } from "visual/utils/fonts";
import {
  defaultValueValue,
  onChangeTypography,
  onChangeTypographyTablet,
  onChangeTypographyMobile,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import {
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthOneField2
} from "visual/utils/toolbar";

import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  const device = "desktop";
  // Typography
  const fontStyle = v.fontStyle;
  const {
    fontSize,
    fontFamily,
    fontFamilyType,
    fontWeight,
    lineHeight,
    letterSpacing
  } = fontStyle === "" ? v : getFontStyle(fontStyle);

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
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-form-left",
      title: t("Field"),
      position: 60,
      options: [
        {
          id: "padding",
          label: t("Spacing"),
          type: "slider",
          roles: ["admin"],
          position: 50,
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
            value: v.padding
          },
          onChange: ({ value: padding }) => {
            return {
              padding,
              paddingRight: padding,
              paddingBottom: padding,
              paddingLeft: padding
            };
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "large",
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
                {
                  id: "fontFamily",
                  label: t("Font Family"),
                  type: "fontFamily",
                  value: fontFamily,
                  onChange: ({ id, weights, type }) =>
                    onChangeTypography(
                      {
                        fontFamily: id,
                        fontWeight: getWeight(fontWeight, weights),
                        fontFamilyType: type
                      },
                      v
                    )
                }
              ]
            },
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                {
                  id: "fontStyle",
                  type: "fontStyle",
                  label: t("Typography"),
                  className: "brz-ed-popover__font-style",
                  display: "block",
                  value: fontStyle,
                  onChange: newFontStyle => ({
                    fontStyle: newFontStyle
                  })
                },
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: "50",
                      options: [
                        {
                          id: "fontSize",
                          label: t("Size"),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 100,
                          step: 1,
                          value: fontSize,
                          onChange: newFontSize =>
                            onChangeTypography({ fontSize: newFontSize }, v)
                        },
                        {
                          id: "lineHeight",
                          label: t("Line Hgt."),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 10,
                          step: 0.1,
                          value: lineHeight,
                          onChange: newLineHeight =>
                            onChangeTypography({ lineHeight: newLineHeight }, v)
                        }
                      ]
                    },
                    {
                      width: "50",
                      options: [
                        {
                          id: "fontWeight",
                          label: t("Weight"),
                          type: "select",
                          display: "block",
                          choices: getWeightChoices({
                            family: fontFamily,
                            type: fontFamilyType
                          }),
                          value: fontWeight,
                          onChange: newFontWeight =>
                            onChangeTypography({ fontWeight: newFontWeight }, v)
                        },
                        {
                          id: "letterSpacing",
                          label: t("Letter Sp."),
                          type: "stepper",
                          display: "block",
                          min: -20,
                          max: 20,
                          step: 0.5,
                          value: letterSpacing,
                          onChange: newLetterSpacing =>
                            onChangeTypography(
                              { letterSpacing: newLetterSpacing },
                              v
                            )
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
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor:
            v.bgColorOpacity > 0
              ? hexToRgba(bgColorHex, v.bgColorOpacity)
              : hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
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
              label: t("Label"),
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
                          onChange: [
                            "onChangeBorderWidthGrouped2",
                            "onChangeBorderWidthGroupedDependencies2"
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
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}

export function getItemsForTablet(v) {
  // Typography
  const { fontFamily, fontFamilyType } =
    v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const tabletFontStyle = v.tabletFontStyle;
  const {
    tabletFontSize,
    tabletFontWeight,
    tabletLineHeight,
    tabletLetterSpacing
  } = tabletFontStyle === "" ? v : getFontStyle(tabletFontStyle);

  return [
    {
      id: "tabletToolbarCurrentShortcode",
      type: "popover",
      icon: "nc-form-left",
      title: t("Field"),
      roles: ["admin"],
      position: 60,
      options: [
        {
          id: "tabletPadding",
          label: t("Spacing"),
          type: "slider",
          position: 50,
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
            value: tabletSyncOnChange(v, "padding")
          },
          onChange: ({ value: tabletPadding }) => {
            return {
              tabletPadding,
              tabletPaddingRight: tabletPadding,
              tabletPaddingBottom: tabletPadding,
              tabletPaddingLeft: tabletPadding
            };
          }
        }
      ]
    },
    {
      id: "tabletToolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__typography",
          columns: [
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "tabletFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: tabletFontSize,
                  onChange: newTabletFontSize =>
                    onChangeTypographyTablet(
                      { tabletFontSize: newTabletFontSize },
                      v
                    )
                },
                {
                  id: "tabletLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: tabletLineHeight,
                  onChange: newTabletLineHeight =>
                    onChangeTypographyTablet(
                      { tabletLineHeight: newTabletLineHeight },
                      v
                    )
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "tabletFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices({
                    family: fontFamily,
                    type: fontFamilyType
                  }),
                  value: tabletFontWeight,
                  onChange: newTabletFontWeight =>
                    onChangeTypographyTablet(
                      { tabletFontWeight: newTabletFontWeight },
                      v
                    )
                },
                {
                  id: "tabletLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: tabletLetterSpacing,
                  onChange: newTabletLetterSpacing =>
                    onChangeTypographyTablet(
                      { tabletLetterSpacing: newTabletLetterSpacing },
                      v
                    )
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  // Typography
  const { fontFamily, fontFamilyType } =
    v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const mobileFontStyle = v.mobileFontStyle;
  const {
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing
  } = mobileFontStyle === "" ? v : getFontStyle(mobileFontStyle);

  return [
    {
      id: "mobileToolbarCurrentShortcode",
      type: "popover",
      icon: "nc-form-left",
      title: t("Field"),
      position: 60,
      options: [
        {
          id: "mobilePadding",
          label: t("Spacing"),
          type: "slider",
          roles: ["admin"],
          position: 50,
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
            value: mobileSyncOnChange(v, "padding")
          },
          onChange: ({ value: mobilePadding }) => {
            return {
              mobilePadding,
              mobilePaddingRight: mobilePadding,
              mobilePaddingBottom: mobilePadding,
              mobilePaddingLeft: mobilePadding
            };
          }
        }
      ]
    },
    {
      id: "mobileToolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__typography",
          columns: [
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "mobileFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: mobileFontSize,
                  onChange: newMobileFontSize =>
                    onChangeTypographyMobile(
                      { mobileFontSize: newMobileFontSize },
                      v
                    )
                },
                {
                  id: "mobileLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: mobileLineHeight,
                  onChange: newMobileLineHeight =>
                    onChangeTypographyMobile(
                      { mobileLineHeight: newMobileLineHeight },
                      v
                    )
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "mobileFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices({
                    family: fontFamily,
                    type: fontFamilyType
                  }),
                  value: mobileFontWeight,
                  onChange: newMobileFontWeight =>
                    onChangeTypographyMobile(
                      { mobileFontWeight: newMobileFontWeight },
                      v
                    )
                },
                {
                  id: "mobileLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: mobileLetterSpacing,
                  onChange: newMobileLetterSpacing =>
                    onChangeTypographyMobile(
                      { mobileLetterSpacing: newMobileLetterSpacing },
                      v
                    )
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
