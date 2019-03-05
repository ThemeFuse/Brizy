import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getWeightChoices, getWeight, getFontStyle } from "visual/utils/fonts";
import {
  onChangeTypography,
  onChangeTypographyTablet,
  onChangeTypographyMobile
} from "visual/utils/onChange";
import {
  toolbarElementProgressBarPercentage,
  toolbarElementProgressBarShowPercentage,
  toolbarColorHexAndOpacity,
  toolbarColorPalette,
  toolbarColorFields,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarElementProgressBarBg2ColorHexAndOpacity,
  toolbarElementProgressBarBg2ColorPalette,
  toolbarElementProgressBarBg2ColorFields,
  toolbarSizeWidthWidthPercent,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  // Typography
  const fontStyle = v.fontStyle;
  const { fontSize, fontFamily, fontWeight, lineHeight, letterSpacing } =
    fontStyle === "" ? v : getFontStyle(fontStyle);

  // ...
  const maxBorderRadius = Math.round(
    (v.fontSize * v.lineHeight + v.paddingTop * 2) / 2
  );

  return [
    {
      id: "toolbarProgressBar",
      type: "popover",
      icon: "nc-progress",
      title: t("Progress"),
      position: 70,
      options: [
        toolbarElementProgressBarPercentage({ v }),
        toolbarElementProgressBarShowPercentage({ v })
        /*{
          id: "borderRadius",
          label: t("Corner"),
          type: "slider",
          slider: {
            min: 0,
            max: maxBorderRadius,
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
          }
          value: {
            value: v.borderRadius
          },
          onChange: ({value: borderRadius}) => ({
            borderRadius
          })
        }*/
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "large",
      title: t("Typography"),
      roles: ["admin"],
      position: 80,
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
                  onChange: ({ id }) => {
                    return {
                      ...onChangeTypography(
                        {
                          fontFamily: id,
                          fontWeight: getWeight(fontWeight, id)
                        },
                        v
                      )
                    };
                  }
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
                  onChange: newFontStyle => {
                    return {
                      fontStyle: newFontStyle
                    };
                  }
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
                          choices: getWeightChoices(fontFamily),
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
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(v.bgColorHex, v.bgColorOpacity)
        }
      },
      options: [
        {
          id: "colorTabs",
          type: "tabs",
          tabs: [
            {
              label: t("Text"),
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
                      width: 100,
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
                    }
                  ]
                }
              ]
            },
            {
              label: t("Bar"),
              options: [
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  prefix: "bg",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state: "normal",
                  prefix: "bg",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
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
                            "onChangeBgColorHexAndOpacityPalette"
                          ]
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
                toolbarElementProgressBarBg2ColorHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeElementProgressBarBg2ColorHexAndOpacity",
                    "onChangeElementProgressBarBg2ColorHexAndOpacityPalette",
                    "onChangeElementProgressBarBg2ColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarElementProgressBarBg2ColorPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeElementProgressBarBg2ColorPalette",
                    "onChangeElementProgressBarBg2ColorPaletteOpacity",
                    "onChangeElementProgressBarBg2ColorHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
                      options: [
                        toolbarElementProgressBarBg2ColorFields({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeElementProgressBarBg2ColorHexAndOpacity",
                            "onChangeElementProgressBarBg2ColorHexAndOpacityPalette",
                            "onChangeElementProgressBarBg2ColorHexAndOpacityDependencies"
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
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({ v, device, state: "normal" }),
        {
          id: "advancedSettings",
          type: "advancedSettings",
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
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
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

export function getItemsForTablet(v) {
  const device = "tablet";
  const state = "normal";

  // Typography
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const tabletFontStyle = v.tabletFontStyle;
  const {
    tabletFontSize,
    tabletFontWeight,
    tabletLineHeight,
    tabletLetterSpacing
  } = tabletFontStyle === "" ? v : getFontStyle(tabletFontStyle);

  return [
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
                  choices: getWeightChoices(fontFamily),
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
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeWidthWidthPercent({ v, device, state })]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";

  // Typography
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const mobileFontStyle = v.mobileFontStyle;
  const {
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing
  } = mobileFontStyle === "" ? v : getFontStyle(mobileFontStyle);

  return [
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
                  choices: getWeightChoices(fontFamily),
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
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeWidthWidthPercent({ v, device, state })]
    }
  ];
}
