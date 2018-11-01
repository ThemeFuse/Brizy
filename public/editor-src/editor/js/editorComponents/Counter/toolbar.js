import { hexToRgba } from "visual/utils/color";
import { getWeightChoices, getWeight, getFontStyle } from "visual/utils/fonts";
import { getOptionColor } from "visual/utils/options";
import {
  onChangeTypography,
  onChangeTypographyTablet,
  onChangeTypographyMobile
} from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  // Typography
  const fontStyle = v.fontStyle;
  const { fontSize, fontFamily, fontWeight, lineHeight, letterSpacing } =
    fontStyle === "" ? v : getFontStyle(fontStyle);

  // ...
  const { hex: colorHex } = getOptionColor(v, "color");
  const { hex: hoverColorHex } = getOptionColor(v, "hoverColor");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-counter-outline",
      title: t("Counter"),
      position: 70,
      options: [
        {
          id: "start",
          label: t("Start"),
          type: "input",
          inputType: "number",
          inputSize: "small",
          value: {
            value: v.start
          },
          onChange: ({ value: start }) => ({
            start
          })
        },
        {
          id: "end",
          label: t("End"),
          type: "input",
          inputType: "number",
          inputSize: "small",
          value: {
            value: v.end
          },
          onChange: ({ value: end }) => ({
            end: end !== "" ? end : 0
          })
        },
        {
          id: "duration",
          label: t("Duration"),
          type: "slider",
          slider: {
            min: 0,
            step: 0.5,
            max: 25
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "sec",
                value: "sec"
              }
            ]
          },
          value: {
            value: v.duration
          },
          onChange: ({ value: duration }) => {
            return {
              duration
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
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
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
                  id: "color",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: colorHex,
                    opacity: v.colorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    opacity =
                      hex !== v.colorHex && v.colorOpacity === 0
                        ? v.tempColorOpacity
                        : opacity;

                    return {
                      colorHex: hex,
                      colorOpacity: opacity,
                      colorPalette: isChanged === "hex" ? "" : v.colorPalette,

                      // Temporary Value changes
                      tempColorOpacity:
                        opacity > 0 && opacityDragEnd
                          ? opacity
                          : v.tempColorOpacity,

                      // Normal + Hover Sync
                      hoverColorHex:
                        v.colorHex === v.hoverColorHex ? hex : v.hoverColorHex,

                      hoverColorOpacity:
                        v.colorOpacity === v.hoverColorOpacity
                          ? opacity
                          : v.hoverColorOpacity
                    };
                  }
                },
                {
                  id: "colorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.colorPalette,
                  onChange: colorPalette => ({
                    colorPalette,

                    colorOpacity:
                      v.colorOpacity === 0 ? v.tempColorOpacity : v.colorOpacity
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
                    colorPalette: isChanged === "hex" ? "" : v.colorPalette,
                    colorHex: hex,
                    colorOpacity: opacity
                  })
                }
              ]
            },
            {
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "hoverColor",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: hoverColorHex,
                    opacity: v.hoverColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    hoverColorHex: hex,

                    hoverColorOpacity:
                      hex !== v.hoverColorHex && v.hoverColorOpacity === 0
                        ? v.tempHoverColorOpacity
                        : opacity,

                    hoverColorPalette:
                      isChanged === "hex" ? "" : v.hoverColorPalette
                  })
                },
                {
                  id: "hoverColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.hoverColorPalette,
                  onChange: value => ({
                    hoverColorPalette: value,

                    hoverColorOpacity:
                      v.hoverColorOpacity === 0
                        ? v.tempHoverColorOpacity
                        : v.hoverColorOpacity
                  })
                },
                {
                  id: "hoverColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: hoverColorHex,
                    opacity: v.hoverColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    hoverColorPalette:
                      isChanged === "hex" ? "" : v.hoverColorPalette,
                    hoverColorHex: hex,
                    hoverColorOpacity: opacity
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
      options: []
    }
  ];
}

export function getItemsForTablet(v) {
  // Typography
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const tabletFontStyle = v.tabletFontStyle;
  const {
    tabletFontSize,
    tabletFontWeight,
    tabletLineHeight,
    tabletLetterSpacing
  } =
    tabletFontStyle === "" ? v : getFontStyle(tabletFontStyle);

  return [
    {
      id: "tabletToolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: "auto",
      title: t("Typography"),
      position: 70,
      options: [
        {
          type: "grid",
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
      options: []
    }
  ];
}
