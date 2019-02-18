import { hexToRgba } from "visual/utils/color";
import { getWeightChoices, getWeight, getFontStyle } from "visual/utils/fonts";
import { getOptionColor } from "visual/utils/options";
import {
  onChangeTypography,
  onChangeTypographyTablet,
  onChangeTypographyMobile,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import {
  toolbarDisabledShowOnTablet,
  toolbarDisabledShowOnMobile,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadowBlur,
  toolbarBoxShadowSpread,
  toolbarBoxShadowVertical,
  toolbarBoxShadowHorizontal
} from "visual/utils/toolbar";

import { t } from "visual/utils/i18n";

const subMenuKeys = {
  fontStyle: "subMenuFontStyle",
  fontFamily: "subMenuFontFamily",
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
  // Colors
  const { hex: mMenuColorHex } = getOptionColor(v, "mMenuColor");
  const { hex: mMenuHoverColorHex } = getOptionColor(v, "mMenuHoverColor");
  const { hex: mMenuBgColorHex } = getOptionColor(v, "mMenuBgColor");
  const { hex: mMenuBorderColorHex } = getOptionColor(v, "mMenuBorderColor");

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
                        {
                          id: "mMenuColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: mMenuColorHex,
                            opacity: v.mMenuColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.mMenuColorHex &&
                              v.mMenuColorOpacity == 0
                                ? v.mMenuTempColorOpacity
                                : opacity;

                            return {
                              mMenuColorHex: hex,
                              mMenuColorOpacity: opacity,
                              mMenuColorPalette:
                                isChanged === "hex" ? "" : v.mMenuColorPalette,

                              // Temporary Value changes
                              mMenuTempColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.mMenuTempColorOpacity,

                              // Normal + Hover Sync
                              mMenuHoverColorHex:
                                v.mMenuColorHex === v.mMenuHoverColorHex
                                  ? hex
                                  : v.mMenuHoverColorHex,

                              mMenuHoverColorOpacity:
                                v.mMenuColorOpacity === v.mMenuHoverColorOpacity
                                  ? opacity
                                  : v.mMenuHoverColorOpacity
                            };
                          }
                        },
                        {
                          id: "mMenuColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.mMenuColorPalette,
                          onChange: mMenuColorPalette => ({
                            mMenuColorPalette,

                            mMenuColorOpacity:
                              v.mMenuColorOpacity === 0
                                ? v.mMenuTempColorOpacity
                                : v.mMenuColorOpacity
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "mMenuColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: mMenuColorHex,
                                    opacity: v.mMenuColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    mMenuColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.mMenuColorPalette,
                                    mMenuColorHex: hex,
                                    mMenuColorOpacity: opacity
                                  })
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Background"),
                      options: [
                        {
                          id: "mMenuBgColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: mMenuBgColorHex,
                            opacity: v.mMenuBgColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.mMenuBgColorHex &&
                              v.mMenuBgColorOpacity == 0
                                ? v.mMenuTempBgColorOpacity
                                : opacity;

                            return {
                              mMenuBgColorHex: hex,
                              mMenuBgColorOpacity: opacity,
                              mMenuBgColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.mMenuBgColorPalette,

                              // Temporary Value changes
                              mMenuTempBgColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.mMenuTempBgColorOpacity
                            };
                          }
                        },
                        {
                          id: "mMenuBgColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.mMenuBgColorPalette,
                          onChange: mMenuBgColorPalette => ({
                            mMenuBgColorPalette,

                            mMenuBgColorOpacity:
                              v.mMenuBgColorOpacity === 0
                                ? v.mMenuTempBgColorOpacity
                                : v.mMenuBgColorOpacity
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "mMenuBgColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: mMenuBgColorHex,
                                    opacity: v.mMenuBgColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    mMenuBgColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.mMenuBgColorPalette,
                                    mMenuBgColorHex: hex,
                                    mMenuBgColorOpacity: opacity
                                  })
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Border"),
                      options: [
                        {
                          id: "mMenuBorderColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: mMenuBorderColorHex,
                            opacity: v.mMenuBorderColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.mMenuBorderColorHex &&
                              v.mMenuBorderColorOpacity == 0
                                ? v.mMenuTempBorderColorOpacity
                                : opacity;

                            return {
                              mMenuBorderColorHex: hex,
                              mMenuBorderColorOpacity: opacity,
                              mMenuBorderColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.mMenuBorderColorPalette,

                              // Temporary Value changes
                              mMenuTempBorderColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.mMenuTempBorderColorOpacity
                            };
                          }
                        },
                        {
                          id: "mMenuBorderColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.mMenuBorderColorPalette,
                          onChange: mMenuBorderColorPalette => ({
                            mMenuBorderColorPalette,

                            mMenuBorderColorOpacity:
                              v.mMenuBorderColorOpacity === 0
                                ? v.mMenuTempBorderColorOpacity
                                : v.mMenuBorderColorOpacity
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "mMenuBorderColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: mMenuBorderColorHex,
                                    opacity: v.mMenuBorderColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    mMenuBorderColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.mMenuBorderColorPalette,

                                    mMenuBorderColorHex: hex,
                                    mMenuBorderColorOpacity: opacity
                                  })
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
                        {
                          id: "mMenuHoverColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: mMenuHoverColorHex,
                            opacity: v.mMenuHoverColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            mMenuHoverColorHex: hex,
                            mMenuHoverColorOpacity:
                              hex !== v.mMenuHoverColorHex &&
                              v.mMenuHoverColorOpacity == 0
                                ? v.mMenuTempHoverColorOpacity
                                : opacity,

                            mMenuHoverColorPalette:
                              isChanged === "hex"
                                ? ""
                                : v.mMenuHoverColorPalette
                          })
                        },
                        {
                          id: "mMenuHoverColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.mMenuHoverColorPalette,
                          onChange: value => ({
                            mMenuHoverColorPalette: value,
                            mMenuHoverColorOpacity:
                              v.mMenuHoverColorOpacity === 0
                                ? v.mMenuTempHoverColorOpacity
                                : v.mMenuHoverColorOpacity
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "mMenuHoverColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: mMenuHoverColorHex,
                                    opacity: v.mMenuHoverColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    mMenuHoverColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.mMenuHoverColorPalette,
                                    mMenuHoverColorHex: hex,
                                    mMenuHoverColorOpacity: opacity
                                  })
                                }
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
                  onChange: ({ id }) => {
                    return onChangeCustomTypography(
                      v,
                      {
                        fontFamily: id,
                        fontWeight: getWeight(mMenuFontWeight, id)
                      },
                      onChangeTypography,
                      mMenuKeys
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
                          choices: getWeightChoices(mMenuFontFamily),
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
  const { fontSize, fontFamily, fontWeight, lineHeight, letterSpacing } =
    fontStyle === "" ? v : getFontStyle(fontStyle);

  const subMenuFontStyle = v.subMenuFontStyle;
  const {
    subMenuFontSize,
    subMenuFontFamily,
    subMenuFontWeight,
    subMenuLineHeight,
    subMenuLetterSpacing
  } =
    subMenuFontStyle === ""
      ? v
      : renameKeys(subMenuKeys, getFontStyle(subMenuFontStyle));

  // Colors
  const { hex: colorHex } = getOptionColor(v, "color");
  const { hex: hoverColorHex } = getOptionColor(v, "hoverColor");
  const { hex: subMenuColorHex } = getOptionColor(v, "subMenuColor");
  const { hex: subMenuHoverColorHex } = getOptionColor(v, "subMenuHoverColor");
  const { hex: subMenuBgColorHex } = getOptionColor(v, "subMenuBgColor");
  const { hex: subMenuHoverBgColorHex } = getOptionColor(
    v,
    "subMenuHoverBgColor"
  );
  const { hex: subMenuBorderColorHex } = getOptionColor(
    v,
    "subMenuBorderColor"
  );
  const { hex: boxShadowColorHex } = getOptionColor(v, "boxShadowColor");

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
                  onChange: ({ id }) => {
                    return onChangeTypography(
                      { fontFamily: id, fontWeight: getWeight(fontWeight, id) },
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
                          choices: getWeightChoices(fontFamily),
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
                  onChange: ({ id }) => {
                    return onChangeCustomTypography(
                      v,
                      {
                        fontFamily: id,
                        fontWeight: getWeight(subMenuFontWeight, id)
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
                          choices: getWeightChoices(subMenuFontFamily),
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
                        {
                          id: "color",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: colorHex,
                            opacity: v.colorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.colorHex && v.colorOpacity === 0
                                ? v.tempColorOpacity
                                : opacity;

                            return {
                              colorHex: hex,
                              colorOpacity: opacity,
                              colorPalette:
                                isChanged === "hex" ? "" : v.colorPalette,

                              // Temporary Value changes
                              tempColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.tempColorOpacity,

                              // Normal + Hover Sync
                              hoverColorHex:
                                v.colorHex === v.hoverColorHex
                                  ? hex
                                  : v.hoverColorHex,

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
                              v.colorOpacity === 0
                                ? v.tempColorOpacity
                                : v.colorOpacity,

                            // Normal + Hover Sync
                            hoverColorPalette:
                              v.colorPalette === v.hoverColorPalette
                                ? colorPalette
                                : v.hoverColorPalette
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "colorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: colorHex,
                                    opacity: v.colorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    colorPalette:
                                      isChanged === "hex" ? "" : v.colorPalette,
                                    colorHex: hex,
                                    colorOpacity: opacity,

                                    // Normal + Hover Sync
                                    hoverColorHex:
                                      v.colorHex === v.hoverColorHex
                                        ? hex
                                        : v.hoverColorHex,

                                    hoverColorOpacity:
                                      v.colorOpacity === v.hoverColorOpacity
                                        ? opacity
                                        : v.hoverColorOpacity
                                  })
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
                              hex !== v.hoverColorHex &&
                              v.hoverColorOpacity === 0
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
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
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
                                      isChanged === "hex"
                                        ? ""
                                        : v.hoverColorPalette,
                                    hoverColorHex: hex,
                                    hoverColorOpacity: opacity
                                  })
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
                        {
                          id: "subMenuColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: subMenuColorHex,
                            opacity: v.subMenuColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.subMenuColorHex &&
                              v.subMenuColorOpacity === 0
                                ? v.subMenuTempColorOpacity
                                : opacity;

                            return {
                              subMenuColorHex: hex,
                              subMenuColorOpacity: opacity,
                              subMenuColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.subMenuColorPalette,

                              // Temporary Value changes
                              subMenuTempColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.subMenuTempColorOpacity,

                              // Normal + Hover Sync
                              subMenuHoverColorHex:
                                v.subMenuColorHex === v.subMenuHoverColorHex
                                  ? hex
                                  : v.subMenuHoverColorHex,

                              subMenuHoverColorOpacity:
                                v.subMenuColorOpacity ===
                                v.subMenuHoverColorOpacity
                                  ? opacity
                                  : v.subMenuHoverColorOpacity,

                              // Sync MMenu
                              mMenuColorHex:
                                v.subMenuColorHex === v.mMenuColorHex
                                  ? hex
                                  : v.mMenuColorHex,
                              mMenuColorOpacity:
                                v.subMenuColorOpacity === v.mMenuColorOpacity
                                  ? opacity
                                  : v.mMenuColorOpacity,

                              // MMenu + Hover Sync
                              mMenuHoverColorHex:
                                v.subMenuColorHex === v.mMenuHoverColorHex
                                  ? hex
                                  : v.mMenuHoverColorHex,

                              mMenuHoverColorOpacity:
                                v.subMenuColorOpacity ===
                                v.mMenuHoverColorOpacity
                                  ? opacity
                                  : v.mMenuHoverColorOpacity
                            };
                          }
                        },
                        {
                          id: "subMenuColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.subMenuColorPalette,
                          onChange: subMenuColorPalette => ({
                            subMenuColorPalette,

                            subMenuColorOpacity:
                              v.subMenuColorOpacity === 0
                                ? v.subMenuTempColorOpacity
                                : v.subMenuColorOpacity,

                            // Normal + Hover Sync
                            subMenuHoverColorPalette:
                              v.subMenuColorPalette ===
                              v.subMenuHoverColorPalette
                                ? subMenuColorPalette
                                : v.subMenuHoverColorPalette,

                            // Sync MMenu
                            mMenuColorPalette:
                              v.subMenuColorPalette === v.mMenuColorPalette
                                ? subMenuColorPalette
                                : v.mMenuColorPalette,

                            mMenuHoverColorPalette:
                              v.subMenuColorPalette === v.mMenuHoverColorPalette
                                ? subMenuColorPalette
                                : v.mMenuHoverColorPalette
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "subMenuColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: subMenuColorHex,
                                    opacity: v.subMenuColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    subMenuColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.subMenuColorPalette,
                                    subMenuColorHex: hex,
                                    subMenuColorOpacity: opacity,

                                    // Normal + Hover Sync
                                    subMenuHoverColorHex:
                                      v.subMenuColorHex ===
                                      v.subMenuHoverColorHex
                                        ? hex
                                        : v.subMenuHoverColorHex,

                                    subMenuHoverColorOpacity:
                                      v.subMenuColorOpacity ===
                                      v.subMenuHoverColorOpacity
                                        ? hex
                                        : v.subMenuHoverColorOpacity,

                                    // Sync MMenu
                                    mMenuColorHex:
                                      v.subMenuColorHex === v.mMenuColorHex
                                        ? hex
                                        : v.mMenuBgColorHex,
                                    mMenuColorOpacity:
                                      v.subMenuColorOpacity ===
                                      v.mMenuColorOpacity
                                        ? opacity
                                        : v.mMenuColorOpacity,

                                    // MMenu + Hover Sync
                                    mMenuHoverColorHex:
                                      v.subMenuColorHex === v.mMenuHoverColorHex
                                        ? hex
                                        : v.mMenuHoverColorHex,

                                    mMenuHoverColorOpacity:
                                      v.subMenuColorOpacity ===
                                      v.mMenuHoverColorOpacity
                                        ? opacity
                                        : v.mMenuHoverColorOpacity
                                  })
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Background"),
                      options: [
                        {
                          id: "subMenuBgColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: subMenuBgColorHex,
                            opacity: v.subMenuBgColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.subMenuBgColorHex &&
                              v.subMenuBgColorOpacity === 0
                                ? v.subMenuTempBgColorOpacity
                                : opacity;

                            return {
                              subMenuBgColorHex: hex,
                              subMenuBgColorOpacity: opacity,
                              subMenuBgColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.subMenuBgColorPalette,

                              // Temporary Value chnges
                              subMenuTempBgColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.subMenuTempBgColorOpacity,

                              // Normal + Hover Sync
                              subMenuHoverBgColorHex:
                                v.subMenuBgColorHex === v.subMenuHoverBgColorHex
                                  ? hex
                                  : v.subMenuHoverBgColorHex,

                              subMenuHoverBgColorOpacity:
                                v.subMenuBgColorOpacity ===
                                v.subMenuHoverBgColorOpacity
                                  ? hex
                                  : v.subMenuHoverBgColorOpacity,

                              // Sync MMenu
                              mMenuBgColorHex:
                                v.subMenuBgColorHex === v.mMenuBgColorHex
                                  ? hex
                                  : v.mMenuBgColorHex,
                              mMenuBgColorOpacity:
                                v.subMenuBgColorOpacity ===
                                v.mMenuBgColorOpacity
                                  ? opacity
                                  : v.mMenuBgColorOpacity
                            };
                          }
                        },
                        {
                          id: "subMenuBgColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.subMenuBgColorPalette,
                          onChange: subMenuBgColorPalette => ({
                            subMenuBgColorPalette,

                            subMenuBgColorOpacity:
                              v.subMenuBgColorOpacity === 0
                                ? v.subMenuTempBgColorOpacity
                                : v.subMenuBgColorOpacity,

                            // Normal + Hover Sync
                            subMenuHoverBgColorPalette:
                              v.subMenuBgColorPalette ===
                              v.subMenuHoverBgColorPalette
                                ? subMenuBgColorPalette
                                : v.subMenuHoverBgColorPalette,

                            // Sync MMenu
                            mMenuBgColorPalette:
                              v.subMenuBgColorPalette === v.mMenuBgColorPalette
                                ? subMenuBgColorPalette
                                : v.mMenuBgColorPalette
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "subMenuBgColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: subMenuBgColorHex,
                                    opacity: v.subMenuBgColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    subMenuBgColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.subMenuBgColorPalette,
                                    subMenuBgColorHex: hex,
                                    subMenuBgColorOpacity: opacity,

                                    subMenuHoverBgColorHex:
                                      v.subMenuBgColorHex ===
                                      v.subMenuHoverBgColorHex
                                        ? hex
                                        : v.subMenuHoverBgColorHex,

                                    subMenuHoverBgColorOpacity:
                                      v.subMenuBgColorOpacity ===
                                      v.subMenuHoverBgColorOpacity
                                        ? hex
                                        : v.subMenuHoverBgColorOpacity,

                                    // Sync MMenu
                                    mMenuBgColorHex:
                                      v.subMenuBgColorHex === v.mMenuBgColorHex
                                        ? hex
                                        : v.mMenuBgColorHex,
                                    mMenuBgColorOpacity:
                                      v.subMenuBgColorOpacity ===
                                      v.mMenuBgColorOpacity
                                        ? opacity
                                        : v.mMenuBgColorOpacity
                                  })
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Border"),
                      options: [
                        {
                          id: "subMenuBorderColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: subMenuBorderColorHex,
                            opacity: v.subMenuBorderColorOpacity
                          },
                          onChange: ({
                            hex,
                            opacity,
                            isChanged,
                            opacityDragEnd
                          }) => {
                            opacity =
                              hex !== v.subMenuBorderColorHex &&
                              v.subMenuBorderColorOpacity === 0
                                ? v.subMenuTempBorderColorOpacity
                                : opacity;

                            return {
                              subMenuBorderColorHex: hex,
                              subMenuBorderColorOpacity: opacity,
                              subMenuBorderColorPalette:
                                isChanged === "hex"
                                  ? ""
                                  : v.subMenuBorderColorPalette,

                              // Temporary Value chnges
                              subMenuTempBorderColorOpacity:
                                opacity > 0 && opacityDragEnd
                                  ? opacity
                                  : v.subMenuTempBorderColorOpacity,

                              // Sync MMenu
                              mMenuBorderColorHex:
                                v.subMenuBorderColorHex ===
                                v.mMenuBorderColorHex
                                  ? hex
                                  : v.mMenuBorderColorHex,
                              mMenuBorderColorOpacity:
                                v.subMenuBorderColorOpacity ===
                                v.mMenuBorderColorOpacity
                                  ? opacity
                                  : v.mMenuBorderColorOpacity
                            };
                          }
                        },
                        {
                          id: "subMenuBorderColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.subMenuBorderColorPalette,
                          onChange: subMenuBorderColorPalette => ({
                            subMenuBorderColorPalette,

                            subMenuBorderColorOpacity:
                              v.subMenuBorderColorOpacity === 0
                                ? v.subMenuTempBorderColorOpacity
                                : v.subMenuBorderColorOpacity,

                            // Sync MMenu
                            mMenuBorderColorPalette:
                              v.subMenuBorderColorPalette ===
                              v.mMenuBorderColorPalette
                                ? subMenuBorderColorPalette
                                : v.mMenuBorderColorPalette
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "subMenuBorderColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: subMenuBorderColorHex,
                                    opacity: v.subMenuBorderColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    subMenuBorderColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.subMenuBorderColorPalette,
                                    subMenuBorderColorHex: hex,
                                    subMenuBorderColorOpacity: opacity,

                                    // Sync MMenu
                                    mMenuBorderColorHex:
                                      v.subMenuBorderColorHex ===
                                      v.mMenuBorderColorHex
                                        ? hex
                                        : v.mMenuBorderColorHex,
                                    mMenuBorderColorOpacity:
                                      v.subMenuBorderColorOpacity ===
                                      v.mMenuBorderColorOpacity
                                        ? opacity
                                        : v.mMenuBorderColorOpacity
                                  })
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
                        {
                          id: "subMenuHoverColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: subMenuHoverColorHex,
                            opacity: v.subMenuHoverColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            subMenuHoverColorHex: hex,
                            subMenuHoverColorOpacity:
                              hex !== v.subMenuHoverColorHex &&
                              v.subMenuHoverColorOpacity === 0
                                ? v.subMenuTempHoverColorOpacity
                                : opacity,
                            subMenuHoverColorPalette:
                              isChanged === "hex"
                                ? ""
                                : v.subMenuHoverColorPalette,

                            // MMenu + Hover Sync
                            mMenuHoverColorHex:
                              v.subMenuHoverColorHex === v.mMenuHoverColorHex
                                ? hex
                                : v.mMenuHoverColorHex,

                            mMenuHoverColorOpacity:
                              v.subMenuHoverColorOpacity ===
                              v.mMenuHoverColorOpacity
                                ? opacity
                                : v.mMenuHoverColorOpacity
                          })
                        },
                        {
                          id: "subMenuHoverColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.subMenuHoverColorPalette,
                          onChange: value => ({
                            subMenuHoverColorPalette: value,
                            subMenuHoverColorOpacity:
                              v.subMenuHoverColorOpacity === 0
                                ? v.subMenuTempHoverColorOpacity
                                : v.subMenuHoverColorOpacity,

                            // MMenu Sync
                            mMenuHoverColorPalette:
                              v.subMenuHoverColorPalette ===
                              v.mMenuHoverColorPalette
                                ? value
                                : v.mMenuHoverColorPalette
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "subMenuHoverColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: subMenuHoverColorHex,
                                    opacity: v.subMenuHoverColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    subMenuHoverColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.subMenuHoverColorPalette,
                                    subMenuHoverColorHex: hex,
                                    subMenuHoverColorOpacity: opacity,

                                    // Sync MMenu
                                    mMenuHoverColorHex:
                                      v.subMenuHoverColorHex ===
                                      v.mMenuHoverColorHex
                                        ? hex
                                        : v.mMenuHoverColorHex,
                                    mMenuHoverColorOpacity:
                                      v.subMenuHoverColorOpacity ===
                                      v.mMenuHoverColorOpacity
                                        ? opacity
                                        : v.mMenuHoverColorOpacity
                                  })
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      label: t("Background"),
                      options: [
                        {
                          id: "subMenuHoverBgColor",
                          type: "colorPicker",
                          position: 10,
                          value: {
                            hex: subMenuHoverBgColorHex,
                            opacity: v.subMenuHoverBgColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            subMenuHoverBgColorHex: hex,
                            subMenuHoverBgColorOpacity:
                              hex !== v.subMenuHoverBgColorHex &&
                              v.subMenuHoverBgColorOpacity === 0
                                ? v.subMenuTempHoverBgColorOpacity
                                : opacity,
                            subMenuHoverBgColorPalette:
                              isChanged === "hex"
                                ? ""
                                : v.subMenuHoverBgColorPalette
                          })
                        },
                        {
                          id: "subMenuHoverBgColorPalette",
                          type: "colorPalette",
                          position: 20,
                          value: v.subMenuHoverBgColorPalette,
                          onChange: value => ({
                            subMenuHoverBgColorPalette: value,
                            subMenuHoverBgColorOpacity:
                              v.subMenuHoverBgColorOpacity === 0
                                ? v.subMenuTempHoverBgColorOpacity
                                : v.subMenuHoverBgColorOpacity
                          })
                        },
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                {
                                  id: "subMenuHoverBgColorFields",
                                  type: "colorFields",
                                  position: 30,
                                  value: {
                                    hex: subMenuHoverBgColorHex,
                                    opacity: v.subMenuHoverBgColorOpacity
                                  },
                                  onChange: ({ hex, opacity, isChanged }) => ({
                                    subMenuHoverBgColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.subMenuHoverBgColorPalette,
                                    subMenuHoverBgColorHex: hex,
                                    subMenuHoverBgColorOpacity: opacity
                                  })
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
                },
                {
                  type: "multiPicker",
                  picker: {
                    id: "boxShadow",
                    label: t("Shadow"),
                    type: "switch",
                    value: v.boxShadow
                  },
                  choices: {
                    on: [
                      {
                        id: "boxShadowColors",
                        type: "popover",
                        size: "auto",
                        label: t("Color"),
                        title: t("Color"),
                        icon: {
                          style: {
                            backgroundColor: hexToRgba(
                              boxShadowColorHex,
                              v.boxShadowColorOpacity
                            )
                          }
                        },
                        options: [
                          toolbarBoxShadowHexAndOpacity({
                            v,
                            device,
                            state: "normal",
                            onChange: [
                              "onChangeBoxShadowHexAndOpacity",
                              "onChangeBoxShadowHexAndOpacityPalette"
                            ]
                          }),
                          toolbarBoxShadowPalette({
                            v,
                            device,
                            state: "normal",
                            onChange: [
                              "onChangeBoxShadowPalette",
                              "onChangeBoxShadowPaletteOpacity"
                            ]
                          }),
                          {
                            type: "grid",
                            className: "brz-ed-grid__color-fileds",
                            columns: [
                              {
                                width: 100,
                                options: [
                                  toolbarBoxShadowFields({
                                    v,
                                    device,
                                    state: "normal",
                                    onChange: [
                                      "onChangeBoxShadowHexAndOpacity",
                                      "onChangeBoxShadowHexAndOpacityPalette"
                                    ]
                                  })
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      toolbarBoxShadowBlur({ v, device, state: "normal" }),
                      toolbarBoxShadowSpread({
                        v,
                        device,
                        state: "normal"
                      }),
                      toolbarBoxShadowVertical({
                        v,
                        device,
                        state: "normal"
                      }),
                      toolbarBoxShadowHorizontal({
                        v,
                        device,
                        state: "normal"
                      })
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
  const { mMenuFontFamily } =
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
                  choices: getWeightChoices(mMenuFontFamily),
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
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const tabletFontStyle = v.tabletFontStyle;
  const {
    tabletFontSize,
    tabletFontWeight,
    tabletLineHeight,
    tabletLetterSpacing
  } = tabletFontStyle === "" ? v : getFontStyle(tabletFontStyle);

  const subMenuFontStyle = v.subMenuFontStyle;
  const { subMenuFontFamily } =
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
                  choices: getWeightChoices(subMenuFontFamily),
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
    toolbarDisabledShowOnTablet()
  ];
}

const getMobileMMenuToolbar = v => {
  const mMenuFontStyle = v.mMenuFontStyle;
  const { mMenuFontFamily } =
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
                  choices: getWeightChoices(mMenuFontFamily),
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
  const { fontFamily } = v.fontStyle === "" ? v : getFontStyle(v.fontStyle);

  const mobileFontStyle = v.mobileFontStyle;
  const {
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing
  } = mobileFontStyle === "" ? v : getFontStyle(mobileFontStyle);

  const subMenuFontStyle = v.subMenuFontStyle;
  const { subMenuFontFamily } =
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
                  choices: getWeightChoices(subMenuFontFamily),
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
    toolbarDisabledShowOnMobile()
  ];
}
