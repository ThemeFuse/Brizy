import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { getFontStyle, getWeight, getWeightChoices } from "visual/utils/fonts";
import {
  defaultValueValue,
  onChangeTypography,
  onChangeTypographyTablet,
  onChangeTypographyMobile,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import { toolbarColor2, toolbarColorHexField2 } from "visual/utils/toolbar";

import { t } from "visual/utils/i18n";

export default menus => {
  const menuList = menus.map(item => ({ title: item.name, value: item.slug }));

  return {
    getItemsForDesktop: getItemsForDesktop(menuList),
    getItemsForTablet,
    getItemsForMobile
  };
};

const getItemsForDesktop = menuList => v => {
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

  // Colors
  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device }),
    defaultValueValue({ v, key: "colorPalette", device })
  );

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
          onChange: ({ value: itemPadding }) => ({ itemPadding })
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
                        fontFamilyType: type,
                        fontWeight: getWeight(fontWeight, weights)
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
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
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

const getItemsForTablet = v => {
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
      id: "tabletToolbarWPNavigation",
      type: "popover",
      icon: "nc-wp-shortcode",
      roles: ["admin"],
      position: 60,
      options: [
        {
          id: "tabletToggleMenu",
          label: t("Toggle Menu"),
          type: "switch",
          value: v.tabletToggleMenu
        },
        {
          id: "tabletItemPadding",
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
            value: tabletSyncOnChange(v, "itemPadding")
          },
          onChange: ({ value: tabletItemPadding }) => ({ tabletItemPadding })
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
    },
    {
      id: "tabletToolbarSettings",
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
            value: mobileSyncOnChange(v, "itemPadding")
          },
          onChange: ({ value: mobileItemPadding }) => ({ mobileItemPadding })
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
