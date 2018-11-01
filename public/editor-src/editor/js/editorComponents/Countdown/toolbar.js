import _ from "underscore";
import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { getArrayLanguages } from "./languages";
import { getFontStyle, getWeight, getWeightChoices } from "visual/utils/fonts";
import {
  onChangeTypography,
  tabletSyncOnChange,
  mobileSyncOnChange,
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

  return [
    {
      id: "toolbarCountdown",
      type: "popover",
      icon: "nc-countdown",
      title: t("Countdown"),
      position: 70,
      options: [
        {
          id: "date",
          label: t("Date"),
          type: "input",
          inputSize: "medium",
          placeholder: "dd/mm/yyyy",
          value: {
            value: v.date
          },
          onChange: ({ value: date }) => ({
            date
          })
        },
        {
          id: "hours",
          type: "select",
          label: t("Hour"),
          choices: _.times(24, index => {
            const hour = (index + 12) % 12 || 12;
            const suffix = index >= 12 ? "pm" : "am";

            return {
              title: `${hour} ${suffix}`,
              value: `${hour} ${suffix}`
            };
          }),
          value: v.hours
        },
        {
          id: "minutes",
          type: "select",
          label: t("Minutes"),
          choices: _.times(6, index => {
            const current = index * 10;
            return {
              title: `${index}0 m`,
              value: current
            };
          }),
          value: v.minutes
        },
        {
          id: "timeZone",
          label: t("Time Zone"),
          type: "select",
          choices: [
            {
              value: "660",
              title: t("- 11:00 (Niue)")
            },
            {
              value: "600",
              title: t("- 10:00 (Honolulu, Papeete)")
            },
            {
              value: "540",
              title: t("- 9:00 (Anchorage)")
            },
            {
              value: "480",
              title: t("- 8:00 (Los Angeles)")
            },
            {
              value: "420",
              title: t("- 7:00 (Denver, Phoenix)")
            },
            {
              value: "360",
              title: t("- 6:00 (Chicago, Dallas)")
            },
            {
              value: "300",
              title: t("- 5:00 (New York, Miami)")
            },
            {
              value: "240",
              title: t("- 4:00 (Halifax, Manaus)")
            },
            {
              value: "180",
              title: t("- 3:00 (Brasilia, Santiago)")
            },
            {
              value: "120",
              title: t("- 2:00 (Noronha)")
            },
            {
              value: "60",
              title: t("- 1:00 (Cape Verde)")
            },
            {
              value: "0",
              title: t("00:00 (London, Dublin)")
            },
            {
              value: "-60",
              title: t("+ 1:00 (Berlin, Paris)")
            },
            {
              value: "-120",
              title: t("+ 2:00 (Athens, Istanbul)")
            },
            {
              value: "-180",
              title: t("+ 3:00 (Moscow, Baghdad)")
            },
            {
              value: "-240",
              title: t("+ 4:00 (Dubai, Baku)")
            },
            {
              value: "-300",
              title: t("+ 5:00 (Yekaterinburg)")
            },
            {
              value: "-360",
              title: t("+ 6:00 (Astana)")
            },
            {
              value: "-420",
              title: t("+ 7:00 (Bangkok, Jakarta)")
            },
            {
              value: "-480",
              title: t("+ 8:00 (Singapore, Beijing)")
            },
            {
              value: "-540",
              title: t("+ 9:00 (Tokyo, Seoul)")
            },
            {
              value: "-600",
              title: t("+ 10:00 (Sidney, Melbourne)")
            },
            {
              value: "-660",
              title: t("+ 11:00 (Ponape)")
            },
            {
              value: "-720",
              title: t("+ 12:00 (Auckland)")
            }
          ],
          value: v.timeZone
        },
        {
          id: "language",
          label: t("Language"),
          type: "select",
          choices: getArrayLanguages(),
          value: v.language
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
          type: "colorPicker",
          position: 10,
          value: {
            hex: colorHex,
            opacity: v.colorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => {
            opacity =
              hex !== v.colorHex && v.colorOpacity === 0
                ? v.tempColorOpacity
                : opacity;

            return {
              colorHex: hex,
              colorOpacity: opacity,
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
          onChange: ({ value: width }) => ({ width })
        }
      ]
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
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: "tabletWidth",
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
            value: tabletSyncOnChange(v, "width")
          },
          onChange: ({ value: tabletWidth }) => ({ tabletWidth })
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
          onChange: ({ value: mobileWidth }) => ({ mobileWidth })
        }
      ]
    }
  ];
}
