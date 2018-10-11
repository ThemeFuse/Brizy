import { hexToRgba } from "visual/utils/color";
import { getWeightChoices, getWeight, getFontStyle } from "visual/utils/fonts";
import { getOptionColor } from "visual/utils/options";
import {
  onChangeTypography,
  onChangeTypographyMobile,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  // Typography
  const fontStyle = v.fontStyle;
  const { fontSize, fontFamily, fontWeight, lineHeight, letterSpacing } =
    fontStyle === "" ? v : getFontStyle(fontStyle);

  // ...
  const maxBorderRadius = Math.round(
    (v.fontSize * v.lineHeight + v.paddingTop * 2) / 2
  );

  // ...
  const { hex: colorHex } = getOptionColor(v, "color");
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: bg2ColorHex } = getOptionColor(v, "bg2Color");

  return [
    {
      id: "toolbarProgressBar",
      type: "popover",
      icon: "nc-progress",
      title: t("Progress"),
      position: 70,
      options: [
        {
          id: "percentage",
          label: t("Percentage"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.percentage
          },
          onChange: ({ value: percentage }) => {
            return {
              percentage
            };
          }
        },
        {
          id: "showPercentage",
          label: t("Show Percentage"),
          type: "switch",
          value: v.showPercentage
        }
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
                          label: t("Letter Spc."),
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
                {
                  id: "color",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: colorHex,
                    opacity: v.colorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    return {
                      colorHex: hex,
                      bgColorOpacity: opacity,
                      colorPalette: isChanged === "hex" ? "" : v.colorPalette
                    };
                  }
                },
                {
                  id: "colorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.colorPalette,
                  onChange: colorPalette => ({
                    colorPalette
                  })
                },
                {
                  id: "colorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: colorHex,
                    opacity: v.colorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    colorHex: hex,
                    colorOpacity: opacity,
                    colorPalette: isChanged === "hex" ? "" : v.colorPalette
                  })
                }
              ]
            },
            {
              label: t("Bar"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: bgColorHex,
                    opacity: v.bgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    return {
                      bgColorHex: hex,
                      bgColorOpacity: opacity,
                      bgColorPalette:
                        isChanged === "hex" ? "" : v.bgColorPalette
                    };
                  }
                },
                {
                  id: "bgColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.bgColorPalette,
                  onChange: bgColorPalette => ({
                    bgColorPalette
                  })
                },
                {
                  id: "bgColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: bgColorHex,
                    opacity: v.bgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    bgColorHex: hex,
                    bgColorOpacity: opacity,
                    bgColorPalette: isChanged === "hex" ? "" : v.bgColorPalette
                  })
                }
              ]
            },
            {
              label: t("Background"),
              options: [
                {
                  id: "bg2Color",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: bg2ColorHex,
                    opacity: v.bg2ColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    return {
                      bg2ColorHex: hex,
                      bg2ColorOpacity: opacity,
                      bg2ColorPalette:
                        isChanged === "hex" ? "" : v.bg2ColorPalette
                    };
                  }
                },
                {
                  id: "bg2ColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.bg2ColorPalette,
                  onChange: bg2ColorPalette => ({
                    bg2ColorPalette
                  })
                },
                {
                  id: "bg2ColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: bg2ColorHex,
                    opacity: v.bg2ColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    bg2ColorHex: hex,
                    bg2ColorOpacity: opacity,
                    bg2ColorPalette:
                      isChanged === "hex" ? "" : v.bg2ColorPalette
                  })
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
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.width
          },
          onChange: ({ value: width }) => {
            return {
              width
            };
          }
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  // Typography
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const mobileFontStyle = v.mobileFontStyle;
  const {
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing
  } =
    mobileFontStyle === "" ? v : getFontStyle(mobileFontStyle);

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
          columns: [
            {
              width: 50,
              className: "brz-ed-popover__typography--mobile",
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
              className: "brz-ed-popover__typography--mobile",
              options: [
                {
                  id: "mobileFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices(fontFamily),
                  value: mobileFontWeight,
                  onChange: newMobileFontWeight =>
                    onChangeTypography({ mobileFontWeight: newMobileFontWeight }, v)
                },
                {
                  id: "mobileLetterSpacing",
                  label: t("Letter Spc."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: mobileLetterSpacing,
                  onChange: newMobileLetterSpacing =>
                    onChangeTypography(
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
      options: [
        {
          id: "mobileWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "width")
          },
          onChange: ({ value: mobileWidth }) => {
            return {
              mobileWidth
            };
          }
        }
      ]
    }
  ];
}
