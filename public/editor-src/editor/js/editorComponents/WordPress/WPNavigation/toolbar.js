import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { getFontStyle, getWeight, getWeightChoices } from "visual/utils/fonts";
import {
  onChangeTypography,
  onChangeTypographyMobile
} from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export default menus => {
  const menuList = menus.map(item => ({ title: item.name, value: item.slug }));

  return {
    getItemsForDesktop: getItemsForDesktop(menuList),
    getItemsForMobile
  };
};

const getItemsForDesktop = menuList => v => {
  const { hex: colorHex } = getOptionColor(v, "color");

  // Typography
  const fontStyle = v.fontStyle;
  const { fontSize, fontFamily, fontWeight, lineHeight, letterSpacing } =
    fontStyle === "" ? v : getFontStyle(fontStyle);

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
      id: "toolbarWPNavigation",
      type: "popover",
      icon: "nc-wp-shortcode",
      position: 60,
      options: [
        {
          id: "menuName",
          label: t("Menu"),
          type: "select",
          choices: menuList,
          value: v.menuName
        },
        {
          id: "itemPadding",
          label: t("Spacing"),
          type: "slider",
          roles: ["admin"],
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
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: v.itemPadding
          },
          onChange: ({ value: itemPadding }) => {
            return {
              itemPadding,
              mobileItemPadding:
                v.itemPadding === v.mobileItemPadding
                  ? itemPadding
                  : v.mobileItemPadding
            };
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      roles: ["admin"],
      icon: "nc-font",
      size: "large",
      title: t("Typography"),
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
                      fontStyle: newFontStyle,

                      mobileFontStyle:
                        fontStyle === mobileFontStyle && mobileFontStyle !== ""
                          ? newFontStyle
                          : mobileFontStyle
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
      roles: ["admin"],
      size: "auto",
      position: 80,
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
          onChange: ({ hex, opacity, isChanged }) => ({
            colorHex: hex,
            colorOpacity: opacity,
            colorPalette: isChanged === "hex" ? "" : v.colorPalette
          })
        },
        {
          id: "colorPalette",
          type: "colorPalette",
          position: 20,
          value: v.colorPalette
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
      options: []
    }
  ];
};

const getItemsForMobile = v => {
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
      id: "mobileToolbarWPNavigation",
      type: "popover",
      roles: ["admin"],
      icon: "nc-wp-shortcode",
      position: 60,
      options: [
        {
          id: "mobileToggleMenu",
          label: t("Toggle Menu"),
          type: "switch",
          value: v.mobileToggleMenu
        },
        {
          id: "mobileItemPadding",
          label: t("Spacing"),
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
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: v.mobileItemPadding
          },
          onChange: ({ value: mobileItemPadding }) => {
            return {
              mobileItemPadding
            };
          }
        }
      ]
    },
    {
      id: "mobileToolbarTypography",
      type: "popover",
      roles: ["admin"],
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
                    onChangeTypography(
                      { mobileFontWeight: newMobileFontWeight },
                      v
                    )
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
      options: []
    }
  ];
};
