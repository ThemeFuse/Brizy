import { hexToRgba } from "visual/utils/color";
import { getWeightChoices, getWeight, getFontStyle } from "visual/utils/fonts";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueValue,
  onChangeTypography,
  onChangeTypographyTablet,
  onChangeTypographyMobile,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import {
  toolbarDisabledShowOnTablet,
  toolbarDisabledShowOnMobile,
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarBorder2,
  toolbarBorderColorHexField2
} from "visual/utils/toolbar";

import { t } from "visual/utils/i18n";

const subMenuKeys = {
  fontStyle: "subMenuFontStyle",
  fontFamily: "subMenuFontFamily",
  fontFamilyType: "subMenuFontFamilyType",
  fontSize: "subMenuFontSize",
  fontWeight: "subMenuFontWeight",
  letterSpacing: "subMenuLetterSpacing",
  lineHeight: "subMenuLineHeight"
};
const tabletSubMenuKeys = {
  tabletFontStyle: "tabletSubMenuFontStyle",
  tabletFontFamily: "tabletSubMenuFontFamily",
  tabletFontSize: "tabletSubMenuFontSize",
  tabletFontWeight: "tabletSubMenuFontWeight",
  tabletLetterSpacing: "tabletSubMenuLetterSpacing",
  tabletLineHeight: "tabletSubMenuLineHeight"
};
const mobileSubMenuKeys = {
  mobileFontStyle: "mobileSubMenuFontStyle",
  mobileFontFamily: "mobileSubMenuFontFamily",
  mobileFontSize: "mobileSubMenuFontSize",
  mobileFontWeight: "mobileSubMenuFontWeight",
  mobileLetterSpacing: "mobileSubMenuLetterSpacing",
  mobileLineHeight: "mobileSubMenuLineHeight"
};
const mMenuKeys = {
  fontStyle: "mMenuFontStyle",
  fontFamily: "mMenuFontFamily",
  fontFamilyType: "mMenuFontFamilyType",
  fontSize: "mMenuFontSize",
  fontWeight: "mMenuFontWeight",
  letterSpacing: "mMenuLetterSpacing",
  lineHeight: "mMenuLineHeight"
};
const tabletMMenuKeys = {
  tabletFontStyle: "tabletMMenuFontStyle",
  tabletFontFamily: "tabletMMenuFontFamily",
  tabletFontSize: "tabletMMenuFontSize",
  tabletFontWeight: "tabletMMenuFontWeight",
  tabletLetterSpacing: "tabletMMenuLetterSpacing",
  tabletLineHeight: "tabletMMenuLineHeight"
};
const mobileMMenuKeys = {
  mobileFontStyle: "mobileMMenuFontStyle",
  mobileFontFamily: "mobileMMenuFontFamily",
  mobileFontSize: "mobileMMenuFontSize",
  mobileFontWeight: "mobileMMenuFontWeight",
  mobileLetterSpacing: "mobileMMenuLetterSpacing",
  mobileLineHeight: "mobileMMenuLineHeight"
};

const renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );

const invert = obj => {
  let newObj = {};

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[obj[prop]] = prop;
    }
  }

  return newObj;
};

const onChangeCustomTypography = (oldValue, newValue, onChange, keysMap) => {
  const newKey = invert(keysMap);
  const newV = renameKeys(newKey, oldValue);
  const onChangeTypography = onChange(newValue, newV);

  return renameKeys(keysMap, onChangeTypography);
};

const getMMenuToolbarColor = v => {
  const device = "desktop";
  // Colors

  const { hex: mMenuColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "mMenuColorHex", device }),
    defaultValueValue({ v, key: "mMenuColorPalette", device })
  );

  return [
    {
      id: "mMenuToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(mMenuColorHex, v.mMenuColorOpacity)
        }
      },
      roles: ["admin"],
      options: [
        {
          id: "mMenuColor",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "mMenuColorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "mMenuColor",
                          state: "normal",
                          onChangeHex: ["onChangeColorHexMMenu2"],
                          onChangePalette: ["onChangeColorPaletteMMenu2"]
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
                                  prefix: "mMenuColor",
                                  state: "normal",
                                  onChange: ["onChangeColorFieldsMMenu2"]
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
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "mMenuBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgColorHexMMenu2"],
                          onChangePalette: ["onChangeBgColorPaletteMMenu2"]
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
                                  prefix: "mMenuBg",
                                  onChange: ["onChangeBgColorFieldsMMenu2"]
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
                          prefix: "mMenuBorder",
                          showSelect: false,
                          onChangeHex: ["onChangeBorderColorHexMMenu2"],
                          onChangePalette: ["onChangeBorderColorPaletteMMenu2"]
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
                                  prefix: "mMenuBorder",
                                  state: "normal",
                                  onChange: ["onChangeBorderColorFieldsMMenu2"]
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
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "mMenuColorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "mMenuHoverColor",
                          onChangeHex: ["onChangeHoverColorHexMMenu2"],
                          onChangePalette: ["onChangeHoverColorPaletteMMenu2"]
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
                                  prefix: "mMenuHoverColor",
                                  onChange: ["onChangeHoverColorFieldsMMenu2"]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "hiddenTab",
                      options: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

const getMMenuToolbar = v => {
  const mMenuFontStyle = v.mMenuFontStyle;
  const {
    mMenuFontSize,
    mMenuFontFamily,
    mMenuFontFamilyType,
    mMenuFontWeight,
    mMenuLineHeight,
    mMenuLetterSpacing
  } =
    mMenuFontStyle === ""
      ? v
      : renameKeys(mMenuKeys, getFontStyle(mMenuFontStyle));

  return [
    {
      id: "mMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 20,
      options: [
        {
          id: "mMenuIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.mMenuIconSize
          },
          onChange: ({ value: mMenuIconSize }) => ({ mMenuIconSize })
        },
        {
          id: "mMenuIconSpacing",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
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
            value: v.mMenuIconSpacing
          },
          onChange: ({ value: mMenuIconSpacing }) => ({
            mMenuIconSpacing
          })
        }
      ]
    },
    {
      id: "mMenuToolbarTypography",
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
                  id: "mMenuFontFamily",
                  label: t("Font Family"),
                  type: "fontFamily",
                  value: mMenuFontFamily,
                  onChange: ({ id, weights, type }) =>
                    onChangeCustomTypography(
                      v,
                      {
                        fontFamily: id,
                        fontFamilyType: type,
                        fontWeight: getWeight(mMenuFontWeight, weights)
                      },
                      onChangeTypography,
                      mMenuKeys
                    )
                }
              ]
            },
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                {
                  id: "mMenuFontStyle",
                  type: "fontStyle",
                  label: t("Typography"),
                  className: "brz-ed-popover__font-style",
                  display: "block",
                  value: mMenuFontStyle,
                  onChange: fontStyle => {
                    return {
                      mMenuFontStyle: fontStyle,

                      tabletMMenuFontStyle:
                        mMenuFontStyle === v.tabletMMenuFontStyle
                          ? fontStyle
                          : v.tabletMMenuFontStyle,

                      mobileMMenuFontStyle:
                        mMenuFontStyle === v.mobileMMenuFontStyle
                          ? fontStyle
                          : v.mobileMMenuFontStyle
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
                          id: "mMenuFontSize",
                          label: t("Size"),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 100,
                          step: 1,
                          value: mMenuFontSize,
                          onChange: fontSize => {
                            return onChangeCustomTypography(
                              v,
                              { fontSize },
                              onChangeTypography,
                              mMenuKeys
                            );
                          }
                        },
                        {
                          id: "mMenuLineHeight",
                          label: t("Line Hgt."),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 10,
                          step: 0.1,
                          value: mMenuLineHeight,
                          onChange: lineHeight => {
                            return onChangeCustomTypography(
                              v,
                              { lineHeight },
                              onChangeTypography,
                              mMenuKeys
                            );
                          }
                        }
                      ]
                    },
                    {
                      width: "50",
                      options: [
                        {
                          id: "mMenuFontWeight",
                          label: t("Weight"),
                          type: "select",
                          display: "block",
                          choices: getWeightChoices({
                            family: mMenuFontFamily,
                            type: mMenuFontFamilyType
                          }),
                          value: mMenuFontWeight,
                          onChange: fontWeight => {
                            return onChangeCustomTypography(
                              v,
                              { fontWeight },
                              onChangeTypography,
                              mMenuKeys
                            );
                          }
                        },
                        {
                          id: "mMenuLetterSpacing",
                          label: t("Letter Sp."),
                          type: "stepper",
                          display: "block",
                          min: -20,
                          max: 20,
                          step: 0.5,
                          value: mMenuLetterSpacing,
                          onChange: letterSpacing => {
                            return onChangeCustomTypography(
                              v,
                              { letterSpacing },
                              onChangeTypography,
                              mMenuKeys
                            );
                          }
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
      id: "mMenuItemHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ],
      value: v.mMenuItemHorizontalAlign
    },
    ...getMMenuToolbarColor(v)
  ];
};

const getToolbar = v => {
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

  const subMenuFontStyle = v.subMenuFontStyle;
  const {
    subMenuFontSize,
    subMenuFontFamily,
    subMenuFontFamilyType,
    subMenuFontWeight,
    subMenuLineHeight,
    subMenuLetterSpacing
  } =
    subMenuFontStyle === ""
      ? v
      : renameKeys(subMenuKeys, getFontStyle(subMenuFontStyle));

  // Colors
  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device }),
    defaultValueValue({ v, key: "colorPalette", device })
  );
  const { hex: subMenuColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "subMenuColorHex", device }),
    defaultValueValue({ v, key: "subMenuColorPalette", device })
  );

  return [
    {
      id: "toolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 20,
      options: [
        {
          id: "iconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.iconSize
          },
          onChange: ({ value: iconSize }) => ({ iconSize })
        },
        {
          id: "iconSpacing",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
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
            value: v.iconSpacing
          },
          onChange: ({ value: iconSpacing }) => ({ iconSpacing })
        }
      ]
    },
    {
      id: "subMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 20,
      options: [
        {
          id: "subMenuIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.subMenuIconSize
          },
          onChange: ({ value: subMenuIconSize }) => ({ subMenuIconSize })
        },
        {
          id: "subMenuIconSpacing",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
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
            value: v.subMenuIconSpacing
          },
          onChange: ({ value: subMenuIconSpacing }) => ({
            subMenuIconSpacing,

            mMenuIconSpacing:
              v.subMenuIconSpacing === v.mMenuIconSpacing
                ? subMenuIconSpacing
                : v.mMenuIconSpacing
          })
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
                  onChange: ({ id, weights, type }) => {
                    return onChangeTypography(
                      {
                        fontFamily: id,
                        fontFamilyType: type,
                        fontWeight: getWeight(fontWeight, weights)
                      },
                      v
                    );
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

                      tabletFontStyle:
                        fontStyle === v.tabletFontStyle
                          ? newFontStyle
                          : v.tabletFontStyle,

                      mobileFontStyle:
                        fontStyle === v.mobileFontStyle
                          ? newFontStyle
                          : v.mobileFontStyle
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
                          onChange: newFontSize => {
                            return onChangeTypography(
                              { fontSize: newFontSize },
                              v
                            );
                          }
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
                          onChange: newLineHeight => {
                            return onChangeTypography(
                              { lineHeight: newLineHeight },
                              v
                            );
                          }
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
                          onChange: newFontWeight => {
                            return onChangeTypography(
                              { fontWeight: newFontWeight },
                              v
                            );
                          }
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
                          onChange: newLetterSpacing => {
                            return onChangeTypography(
                              { letterSpacing: newLetterSpacing },
                              v
                            );
                          }
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
      id: "subMenuToolbarTypography",
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
                  id: "subMenuFontFamily",
                  label: t("Font Family"),
                  type: "fontFamily",
                  value: subMenuFontFamily,
                  onChange: ({ id, weights, type }) => {
                    return onChangeCustomTypography(
                      v,
                      {
                        fontFamily: id,
                        fontFamilyType: type,
                        fontWeight: getWeight(subMenuFontWeight, weights)
                      },
                      onChangeTypography,
                      subMenuKeys
                    );
                  }
                }
              ]
            },
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                {
                  id: "subMenuFontStyle",
                  type: "fontStyle",
                  label: t("Typography"),
                  className: "brz-ed-popover__font-style",
                  display: "block",
                  value: subMenuFontStyle,
                  onChange: newFontStyle => {
                    return {
                      subMenuFontStyle: newFontStyle,

                      // Tablet
                      tabletSubMenuFontStyle:
                        subMenuFontStyle === v.tabletSubMenuFontStyle
                          ? newFontStyle
                          : v.tabletSubMenuFontStyle,

                      tabletMMenuFontStyle:
                        subMenuFontStyle === v.tabletMMenuFontStyle
                          ? newFontStyle
                          : v.tabletMMenuFontStyle,

                      // Mobile
                      mobileSubMenuFontStyle:
                        subMenuFontStyle === v.mobileSubMenuFontStyle
                          ? newFontStyle
                          : v.mobileSubMenuFontStyle,

                      mobileMMenuFontStyle:
                        subMenuFontStyle === v.mobileMMenuFontStyle
                          ? newFontStyle
                          : v.mobileMMenuFontStyle
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
                          id: "subMenuFontSize",
                          label: t("Size"),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 100,
                          step: 1,
                          value: subMenuFontSize,
                          onChange: fontSize => {
                            return onChangeCustomTypography(
                              v,
                              { fontSize },
                              onChangeTypography,
                              subMenuKeys
                            );
                          }
                        },
                        {
                          id: "subMenuLineHeight",
                          label: t("Line Hgt."),
                          type: "stepper",
                          display: "block",
                          min: 1,
                          max: 10,
                          step: 0.1,
                          value: subMenuLineHeight,
                          onChange: lineHeight => {
                            return onChangeCustomTypography(
                              v,
                              { lineHeight },
                              onChangeTypography,
                              subMenuKeys
                            );
                          }
                        }
                      ]
                    },
                    {
                      width: "50",
                      options: [
                        {
                          id: "subMenuFontWeight",
                          label: t("Weight"),
                          type: "select",
                          display: "block",
                          choices: getWeightChoices({
                            family: subMenuFontFamily,
                            type: subMenuFontFamilyType
                          }),
                          value: subMenuFontWeight,
                          onChange: fontWeight => {
                            return onChangeCustomTypography(
                              v,
                              { fontWeight },
                              onChangeTypography,
                              subMenuKeys
                            );
                          }
                        },
                        {
                          id: "subMenuLetterSpacing",
                          label: t("Letter Sp."),
                          type: "stepper",
                          display: "block",
                          min: -20,
                          max: 20,
                          step: 0.5,
                          value: subMenuLetterSpacing,
                          onChange: letterSpacing => {
                            return onChangeCustomTypography(
                              v,
                              { letterSpacing },
                              onChangeTypography,
                              subMenuKeys
                            );
                          }
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
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      roles: ["admin"],
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
                  id: "colorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "normal",
                          onChangeHex: ["onChangeMenuColorHex2"],
                          onChangePalette: ["onChangeMenuColorPalette2"]
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
                                  onChange: ["onChangeMenuColorFields2"]
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
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "colorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "hover",
                          onChangeHex: ["onChangeMenuHoverColorHex2"],
                          onChangePalette: ["onChangeMenuHoverColorPalette2"]
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
                                  state: "hover",
                                  onChange: ["onChangeMenuHoverColorFields2"]
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
            }
          ]
        }
      ]
    },
    {
      id: "subMenuToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(subMenuColorHex, v.subMenuColorOpacity)
        }
      },
      roles: ["admin"],
      options: [
        {
          id: "subMenuColor",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "subMenuColorTabs",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "subMenuColor",
                          onChangeHex: ["onChangeColorHexSubMenu2"],
                          onChangePalette: ["onChangeColorPaletteSubMenu2"]
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
                                  prefix: "subMenuColor",
                                  onChange: ["onChangeColorFieldsSubMenu2"]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Bg"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "subMenuBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgColorHexSubMenu2"],
                          onChangePalette: ["onChangeBgColorPaletteSubMenu2"]
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
                                  prefix: "subMenuBg",
                                  onChange: ["onChangeBgColorFieldsSubMenu2"]
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
                          prefix: "subMenuBorder",
                          showSelect: false,
                          onChangeHex: ["onChangeBorderColorHexSubMenu2"],
                          onChangePalette: [
                            "onChangeBorderColorPaletteSubMenu2"
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
                                  prefix: "subMenuBorder",
                                  state: "normal",
                                  onChange: [
                                    "onChangeBorderColorFieldsSubMenu2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          choices: "outset",
                          state: "normal",
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
                                  state: "normal",
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
                                  state: "normal",
                                  choices: "outset",
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
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "subMenuHoverColorTabs",
                  className: "",
                  type: "tabs",
                  tabs: [
                    {
                      label: t("Text"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          prefix: "subMenuHoverColor",
                          onChangeHex: ["onChangeHoverColorHexSubMenu2"],
                          onChangePalette: ["onChangeHoverColorPaletteSubMenu2"]
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
                                  prefix: "subMenuHoverColor",
                                  onChange: ["onChangeHoverColorFieldsSubMenu2"]
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
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "subMenuHoverBg",
                          showSelect: false,
                          onChangeHex: ["onChangeBgHoverColorHexSubMenu2"],
                          onChangePalette: ["onChangeBorderColorPaletteMMenu2"]
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
                                  prefix: "subMenuHoverBg",
                                  onChange: [
                                    "onChangeBgHoverColorFieldsSubMenu2"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },

                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          choices: "outset",
                          state: "hover",
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
                                  state: "hover",
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
                                  state: "hover",
                                  choices: "outset",
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
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    },
    {
      id: "subMenuAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings"),
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
              options: [
                {
                  type: "multiPicker",
                  picker: {
                    id: "borderRadiusType",
                    label: t("Corner"),
                    type: "radioGroup",
                    choices: [
                      {
                        value: "grouped",
                        icon: "nc-corners-all"
                      },
                      {
                        value: "ungrouped",
                        icon: "nc-corners-individual"
                      }
                    ],
                    value: v.borderRadiusType
                  },
                  choices: {
                    grouped: [
                      {
                        id: "borderRadius",
                        type: "slider",
                        slider: {
                          min: 0,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: 0
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
                          value: v.borderRadius
                        },
                        onChange: (
                          { value: borderRadius },
                          { sliderDragEnd }
                        ) => {
                          return {
                            borderRadius,
                            borderTopLeftRadius: borderRadius,
                            borderTopRightRadius: borderRadius,
                            borderBottomLeftRadius: borderRadius,
                            borderBottomRightRadius: borderRadius,

                            tempBorderRadius: sliderDragEnd
                              ? borderRadius
                              : v.tempBorderRadius,

                            tempBorderTopLeftRadius:
                              borderRadius > 0 && sliderDragEnd
                                ? borderRadius
                                : v.tempBorderTopLeftRadius,

                            tempBorderTopRightRadius:
                              borderRadius > 0 && sliderDragEnd
                                ? borderRadius
                                : v.tempBorderTopRightRadius,

                            tempBorderBottomRightRadius:
                              borderRadius > 0 && sliderDragEnd
                                ? borderRadius
                                : v.tempBorderBottomRightRadius,

                            tempBorderBottomLeftRadius:
                              borderRadius > 0 && sliderDragEnd
                                ? borderRadius
                                : v.tempBorderBottomLeftRadius
                          };
                        }
                      }
                    ],
                    ungrouped: [
                      {
                        id: "borderTopLeftRadius",
                        icon: "nc-corners-top-left",
                        type: "slider",
                        slider: {
                          min: 0,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: 0
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
                          value: v.borderTopLeftRadius
                        },
                        onChange: (
                          { value: borderTopLeftRadius },
                          { sliderDragEnd }
                        ) => {
                          return {
                            borderTopLeftRadius,

                            borderTopRightRadius:
                              borderTopLeftRadius > 0
                                ? v.tempBorderTopRightRadius
                                : v.borderTopRightRadius,

                            borderBottomLeftRadius:
                              borderTopLeftRadius > 0
                                ? v.tempBorderBottomLeftRadius
                                : v.borderBottomLeftRadius,

                            borderBottomRightRadius:
                              borderTopLeftRadius > 0
                                ? v.tempBorderBottomRightRadius
                                : v.borderBottomRightRadius,

                            borderRadius:
                              borderTopLeftRadius === v.borderTopRightRadius &&
                              borderTopLeftRadius ===
                                v.borderBottomRightRadius &&
                              borderTopLeftRadius === v.borderBottomLeftRadius
                                ? borderTopLeftRadius
                                : v.borderRadius,

                            tempBorderTopLeftRadius: borderTopLeftRadius,

                            tempBorderRadius:
                              sliderDragEnd &&
                              borderTopLeftRadius === v.borderTopRightRadius &&
                              borderTopLeftRadius ===
                                v.borderBottomRightRadius &&
                              borderTopLeftRadius === v.borderBottomLeftRadius
                                ? borderTopLeftRadius
                                : v.tempBorderRadius
                          };
                        }
                      },
                      {
                        id: "borderTopRightRadius",
                        icon: "nc-corners-top-right",
                        type: "slider",
                        slider: {
                          min: 0,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: 0
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
                          value: v.borderTopRightRadius
                        },
                        onChange: (
                          { value: borderTopRightRadius },
                          { sliderDragEnd }
                        ) => {
                          return {
                            borderTopRightRadius,

                            borderTopLeftRadius:
                              borderTopRightRadius > 0
                                ? v.tempBorderTopLeftRadius
                                : v.borderTopLeftRadius,

                            borderBottomLeftRadius:
                              borderTopRightRadius > 0
                                ? v.tempBorderBottomLeftRadius
                                : v.borderBottomLeftRadius,

                            borderBottomRightRadius:
                              borderTopRightRadius > 0
                                ? v.tempBorderBottomRightRadius
                                : v.borderBottomRightRadius,

                            borderRadius:
                              borderTopRightRadius === v.borderTopLeftRadius &&
                              borderTopRightRadius ===
                                v.borderBottomRightRadius &&
                              borderTopRightRadius === v.borderBottomLeftRadius
                                ? borderTopRightRadius
                                : v.borderRadius,

                            tempBorderTopRightRadius: borderTopRightRadius,

                            tempBorderRadius:
                              sliderDragEnd &&
                              borderTopRightRadius === v.borderTopLeftRadius &&
                              borderTopRightRadius ===
                                v.borderBottomRightRadius &&
                              borderTopRightRadius === v.borderBottomLeftRadius
                                ? borderTopRightRadius
                                : v.tempBorderRadius
                          };
                        }
                      },
                      {
                        id: "borderBottomRightRadius",
                        icon: "nc-corners-bottom-right",
                        type: "slider",
                        slider: {
                          min: 0,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: 0
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
                          value: v.borderBottomRightRadius
                        },
                        onChange: (
                          { value: borderBottomRightRadius },
                          { sliderDragEnd }
                        ) => {
                          return {
                            borderBottomRightRadius,

                            borderTopLeftRadius:
                              borderBottomRightRadius > 0
                                ? v.tempBorderTopLeftRadius
                                : v.borderTopLeftRadius,

                            borderBottomLeftRadius:
                              borderBottomRightRadius > 0
                                ? v.tempBorderBottomLeftRadius
                                : v.borderBottomLeftRadius,

                            borderTopRightRadius:
                              borderBottomRightRadius > 0
                                ? v.tempBorderTopRightRadius
                                : v.borderTopRightRadius,

                            borderRadius:
                              borderBottomRightRadius ===
                                v.borderTopLeftRadius &&
                              borderBottomRightRadius ===
                                v.borderTopRightRadius &&
                              borderBottomRightRadius ===
                                v.borderBottomLeftRadius
                                ? borderBottomRightRadius
                                : v.borderRadius,

                            tempBorderBottomRightRadius: borderBottomRightRadius,

                            tempBorderRadius:
                              sliderDragEnd &&
                              borderBottomRightRadius ===
                                v.borderTopLeftRadius &&
                              borderBottomRightRadius ===
                                v.borderTopRightRadius &&
                              borderBottomRightRadius ===
                                v.borderBottomLeftRadius
                                ? borderBottomRightRadius
                                : v.tempBorderRadius
                          };
                        }
                      },
                      {
                        id: "borderBottomLeftRadius",
                        icon: "nc-corners-bottom-left",
                        type: "slider",
                        slider: {
                          min: 0,
                          max: 100
                        },
                        input: {
                          show: true,
                          min: 0
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
                          value: v.borderBottomLeftRadius
                        },
                        onChange: (
                          { value: borderBottomLeftRadius },
                          { sliderDragEnd }
                        ) => {
                          return {
                            borderBottomLeftRadius,

                            borderTopLeftRadius:
                              borderBottomLeftRadius > 0
                                ? v.tempBorderTopLeftRadius
                                : v.borderTopLeftRadius,

                            borderBottomRightRadius:
                              borderBottomLeftRadius > 0
                                ? v.tempBorderBottomRightRadius
                                : v.borderBottomRightRadius,

                            borderTopRightRadius:
                              borderBottomLeftRadius > 0
                                ? v.tempBorderTopRightRadius
                                : v.borderTopRightRadius,

                            borderRadius:
                              borderBottomLeftRadius ===
                                v.borderTopLeftRadius &&
                              borderBottomLeftRadius ===
                                v.borderTopRightRadius &&
                              borderBottomLeftRadius ===
                                v.borderBottomRightRadius
                                ? borderBottomLeftRadius
                                : v.borderRadius,

                            tempBorderBottomLeftRadius: borderBottomLeftRadius,

                            tempBorderRadius:
                              sliderDragEnd &&
                              borderBottomLeftRadius ===
                                v.borderTopLeftRadius &&
                              borderBottomLeftRadius ===
                                v.borderTopRightRadius &&
                              borderBottomLeftRadius ===
                                v.borderBottomRightRadius
                                ? borderBottomLeftRadius
                                : v.tempBorderRadius
                          };
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

export function getItemsForDesktop(v) {
  return [
    ...(v.mMenu === "on" ? getMMenuToolbar(v) : getToolbar(v)),

    {
      id: "toolbarSettings",
      type: "popover",
      disabled: true
    }
  ];
}

const getTabletMMenuToolbar = v => {
  const mMenuFontStyle = v.mMenuFontStyle;
  const { mMenuFontFamily, mMenuFontFamilyType } =
    mMenuFontStyle === ""
      ? v
      : renameKeys(mMenuKeys, getFontStyle(mMenuFontStyle));

  const tabletMMenuFontStyle = v.tabletMMenuFontStyle;
  const {
    tabletMMenuFontSize,
    tabletMMenuFontWeight,
    tabletMMenuLineHeight,
    tabletMMenuLetterSpacing
  } =
    tabletMMenuFontStyle === ""
      ? v
      : renameKeys(tabletMMenuKeys, getFontStyle(tabletMMenuFontStyle));

  return [
    {
      id: "tabletMMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      roles: ["admin"],
      position: 20,
      options: [
        {
          id: "tabletMMenuIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.tabletMMenuIconSize
          },
          onChange: ({ value: tabletMMenuIconSize }) => ({
            tabletMMenuIconSize
          })
        },
        {
          id: "tabletMMenuIconSpacing",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
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
            value: v.tabletMMenuIconSpacing
          },
          onChange: ({ value: tabletMMenuIconSpacing }) => ({
            tabletMMenuIconSpacing
          })
        }
      ]
    },
    {
      id: "tabletMMenuToolbarTypography",
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
                  id: "tabletMMenuFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: tabletMMenuFontSize,
                  onChange: tabletFontSize => {
                    return onChangeCustomTypography(
                      v,
                      { tabletFontSize },
                      onChangeTypographyTablet,
                      tabletMMenuKeys
                    );
                  }
                },
                {
                  id: "tabletMMenuLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: tabletMMenuLineHeight,
                  onChange: tabletLineHeight => {
                    return onChangeCustomTypography(
                      v,
                      { tabletLineHeight },
                      onChangeTypographyTablet,
                      tabletMMenuKeys
                    );
                  }
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "tabletMMenuFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices({
                    family: mMenuFontFamily,
                    type: mMenuFontFamilyType
                  }),
                  value: tabletMMenuFontWeight,
                  onChange: tabletFontWeight => {
                    return onChangeCustomTypography(
                      v,
                      { tabletFontWeight },
                      onChangeTypographyTablet,
                      tabletMMenuKeys
                    );
                  }
                },
                {
                  id: "tabletMMenuLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: tabletMMenuLetterSpacing,
                  onChange: tabletLetterSpacing => {
                    return onChangeCustomTypography(
                      v,
                      { tabletLetterSpacing },
                      onChangeTypographyTablet,
                      tabletMMenuKeys
                    );
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "tabletMMenuItemHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ],
      value: tabletSyncOnChange(v, "mMenuItemHorizontalAlign")
    },
    ...getMMenuToolbarColor(v)
  ];
};

const getTabletToolbar = v => {
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

  const subMenuFontStyle = v.subMenuFontStyle;
  const { subMenuFontFamily, subMenuFontFamilyType } =
    subMenuFontStyle === ""
      ? v
      : renameKeys(subMenuKeys, getFontStyle(subMenuFontStyle));

  const tabletSubMenuFontStyle = v.tabletSubMenuFontStyle;
  const {
    tabletSubMenuFontSize,
    tabletSubMenuFontWeight,
    tabletSubMenuLineHeight,
    tabletSubMenuLetterSpacing
  } =
    tabletSubMenuFontStyle === ""
      ? v
      : renameKeys(tabletSubMenuKeys, getFontStyle(tabletSubMenuFontStyle));

  return [
    {
      id: "tabletToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      roles: ["admin"],
      position: 20,
      options: [
        {
          id: "tabletIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.tabletIconSize
          },
          onChange: ({ value: tabletIconSize }) => ({ tabletIconSize })
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
      id: "tabletSubMenuToolbarTypography",
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
                  id: "tabletSubMenuFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: tabletSubMenuFontSize,
                  onChange: tabletFontSize => {
                    return onChangeCustomTypography(
                      v,
                      { tabletFontSize },
                      onChangeTypographyTablet,
                      tabletSubMenuKeys
                    );
                  }
                },
                {
                  id: "tabletSubMenuLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: tabletSubMenuLineHeight,
                  onChange: tabletLineHeight => {
                    return onChangeCustomTypography(
                      v,
                      { tabletLineHeight },
                      onChangeTypographyTablet,
                      tabletSubMenuKeys
                    );
                  }
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "tabletSubMenuFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices({
                    family: subMenuFontFamily,
                    type: subMenuFontFamilyType
                  }),
                  value: tabletSubMenuFontWeight,
                  onChange: tabletFontWeight => {
                    return onChangeCustomTypography(
                      v,
                      { tabletFontWeight },
                      onChangeTypographyTablet,
                      tabletSubMenuKeys
                    );
                  }
                },
                {
                  id: "tabletSubMenuLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: tabletSubMenuLetterSpacing,
                  onChange: tabletLetterSpacing => {
                    return onChangeCustomTypography(
                      v,
                      { tabletLetterSpacing },
                      onChangeTypographyTablet,
                      tabletSubMenuKeys
                    );
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "tabletHorizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
};

export function getItemsForTablet(v) {
  return [
    ...(v.tabletMMenu === "on"
      ? getTabletMMenuToolbar(v)
      : getTabletToolbar(v)),
    {
      id: "tabletToolbarSettings",
      type: "popover",
      disabled: true
    },
    toolbarDisabledShowOnTablet({})
  ];
}

const getMobileMMenuToolbar = v => {
  const mMenuFontStyle = v.mMenuFontStyle;
  const { mMenuFontFamily, mMenuFontFamilyType } =
    mMenuFontStyle === ""
      ? v
      : renameKeys(mMenuKeys, getFontStyle(mMenuFontStyle));

  const mobileMMenuFontStyle = v.mobileMMenuFontStyle;
  const {
    mobileMMenuFontSize,
    mobileMMenuFontWeight,
    mobileMMenuLineHeight,
    mobileMMenuLetterSpacing
  } =
    mobileMMenuFontStyle === ""
      ? v
      : renameKeys(mobileMMenuKeys, getFontStyle(mobileMMenuFontStyle));

  return [
    {
      id: "mobileMMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      roles: ["admin"],
      position: 20,
      options: [
        {
          id: "mobileMMenuIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.mobileMMenuIconSize
          },
          onChange: ({ value: mobileMMenuIconSize }) => ({
            mobileMMenuIconSize
          })
        },
        {
          id: "mobileMMenuIconSpacing",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
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
            value: v.mobileMMenuIconSpacing
          },
          onChange: ({ value: mobileMMenuIconSpacing }) => ({
            mobileMMenuIconSpacing
          })
        }
      ]
    },
    {
      id: "mobileMMenuToolbarTypography",
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
                  id: "mobileMMenuFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: mobileMMenuFontSize,
                  onChange: mobileFontSize => {
                    return onChangeCustomTypography(
                      v,
                      { mobileFontSize },
                      onChangeTypographyMobile,
                      mobileMMenuKeys
                    );
                  }
                },
                {
                  id: "mobileMMenuLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: mobileMMenuLineHeight,
                  onChange: mobileLineHeight => {
                    return onChangeCustomTypography(
                      v,
                      { mobileLineHeight },
                      onChangeTypographyMobile,
                      mobileMMenuKeys
                    );
                  }
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "mobileMMenuFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices({
                    family: mMenuFontFamily,
                    type: mMenuFontFamilyType
                  }),
                  value: mobileMMenuFontWeight,
                  onChange: mobileFontWeight => {
                    return onChangeCustomTypography(
                      v,
                      { mobileFontWeight },
                      onChangeTypographyMobile,
                      mobileMMenuKeys
                    );
                  }
                },
                {
                  id: "mobileMMenuLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: mobileMMenuLetterSpacing,
                  onChange: mobileLetterSpacing => {
                    return onChangeCustomTypography(
                      v,
                      { mobileLetterSpacing },
                      onChangeTypographyMobile,
                      mobileMMenuKeys
                    );
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileMMenuItemHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ],
      value: mobileSyncOnChange(v, "mMenuItemHorizontalAlign")
    },
    ...getMMenuToolbarColor(v)
  ];
};

const getMobileToolbar = v => {
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

  const subMenuFontStyle = v.subMenuFontStyle;
  const { subMenuFontFamily, subMenuFontFamilyType } =
    subMenuFontStyle === ""
      ? v
      : renameKeys(subMenuKeys, getFontStyle(subMenuFontStyle));

  const mobileSubMenuFontStyle = v.mobileSubMenuFontStyle;
  const {
    mobileSubMenuFontSize,
    mobileSubMenuFontWeight,
    mobileSubMenuLineHeight,
    mobileSubMenuLetterSpacing
  } =
    mobileSubMenuFontStyle === ""
      ? v
      : renameKeys(mobileSubMenuKeys, getFontStyle(mobileSubMenuFontStyle));

  return [
    {
      id: "mobileToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      roles: ["admin"],
      position: 20,
      options: [
        {
          id: "mobileIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
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
            value: v.mobileIconSize
          },
          onChange: ({ value: mobileIconSize }) => ({ mobileIconSize })
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
    },
    {
      id: "mobileSubMenuToolbarTypography",
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
                  id: "mobileSubMenuFontSize",
                  label: t("Size"),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 100,
                  step: 1,
                  value: mobileSubMenuFontSize,
                  onChange: mobileFontSize => {
                    return onChangeCustomTypography(
                      v,
                      { mobileFontSize },
                      onChangeTypographyMobile,
                      mobileSubMenuKeys
                    );
                  }
                },
                {
                  id: "mobileSubMenuLineHeight",
                  label: t("Line Hgt."),
                  type: "stepper",
                  display: "block",
                  min: 1,
                  max: 10,
                  step: 0.1,
                  value: mobileSubMenuLineHeight,
                  onChange: mobileLineHeight => {
                    return onChangeCustomTypography(
                      v,
                      { mobileLineHeight },
                      onChangeTypographyMobile,
                      mobileSubMenuKeys
                    );
                  }
                }
              ]
            },
            {
              width: 50,
              className: "brz-ed-popover__typography--small",
              options: [
                {
                  id: "mobileSubMenuFontWeight",
                  label: t("Weight"),
                  type: "select",
                  display: "block",
                  choices: getWeightChoices({
                    family: subMenuFontFamily,
                    type: subMenuFontFamilyType
                  }),
                  value: mobileSubMenuFontWeight,
                  onChange: mobileFontWeight => {
                    return onChangeCustomTypography(
                      v,
                      { mobileFontWeight },
                      onChangeTypographyMobile,
                      mobileSubMenuKeys
                    );
                  }
                },
                {
                  id: "mobileSubMenuLetterSpacing",
                  label: t("Letter Sp."),
                  type: "stepper",
                  display: "block",
                  min: -20,
                  max: 20,
                  step: 0.5,
                  value: mobileSubMenuLetterSpacing,
                  onChange: mobileLetterSpacing => {
                    return onChangeCustomTypography(
                      v,
                      { mobileLetterSpacing },
                      onChangeTypographyMobile,
                      mobileSubMenuKeys
                    );
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileHorizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
};

export function getItemsForMobile(v) {
  return [
    ...(v.mobileMMenu === "on"
      ? getMobileMMenuToolbar(v)
      : getMobileToolbar(v)),
    {
      id: "mobileToolbarSettings",
      type: "popover",
      disabled: true
    },
    toolbarDisabledShowOnMobile({})
  ];
}
