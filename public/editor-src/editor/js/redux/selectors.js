import { createSelector } from "reselect";
import Editor from "visual/global/Editor";

export const pageDataSelector = state => state.page.data || {};

export const pageBlocksSelector = createSelector(
  pageDataSelector,
  pageData => pageData.items || []
);

export const globalsSelector = state => state.globals.project;

export const currentStyleSelector = createSelector(globalsSelector, globals => {
  const { styles: globalStyles = {} } = globals;
  const currentStyleId =
    globalStyles._selected && Editor.getStyle(globalStyles._selected)
      ? globalStyles._selected
      : "default";
  const currentStyle = {
    ...Editor.getStyle(currentStyleId),
    ...globalStyles[currentStyleId]
  };

  const { colorPalette, fontStyles } = currentStyle;
  const { _extraFontStyles: extraFontStyles = [] } = globalStyles;
  const mergedFontStyles = fontStyles.concat(extraFontStyles);

  const generatedColorRules = colorPalette.reduce(
    (acc, color) => ({
      ...acc,
      [`${color.id}__color`]: {
        colorHex: color.hex
      },
      [`${color.id}__hoverColor`]: {
        hoverColorHex: color.hex
      },
      [`${color.id}__bg`]: {
        bgColorHex: color.hex
      },
      [`${color.id}__bg2`]: {
        bg2ColorHex: color.hex
      },
      [`${color.id}__hoverBg`]: {
        hoverBgColorHex: color.hex
      },
      [`${color.id}__border`]: {
        borderColorHex: color.hex
      },
      [`${color.id}__hoverBorder`]: {
        hoverBorderColorHex: color.hex
      },
      [`${color.id}__arrowsColor`]: {
        sliderArrowsColorHex: color.hex
      },
      [`${color.id}__dotsColor`]: {
        sliderDotsColorHex: color.hex
      },
      [`${color.id}__boxShadow`]: {
        boxShadowColorHex: color.hex
      },
      [`${color.id}__shapeTopColor`]: {
        shapeTopColorHex: color.hex
      },
      [`${color.id}__shapeBottomColor`]: {
        shapeBottomColorHex: color.hex
      },
      [`${color.id}__paginationColor`]: {
        paginationColorHex: color.hex
      },
      [`${color.id}__tabletBg`]: {
        tabletBgColorHex: color.hex
      },
      [`${color.id}__mobileBg`]: {
        mobileBgColorHex: color.hex
      },
      [`${color.id}__subMenuColor`]: {
        subMenuColorHex: color.hex
      },
      [`${color.id}__subMenuHoverColor`]: {
        subMenuHoverColorHex: color.hex
      },
      [`${color.id}__subMenuBgColor`]: {
        subMenuBgColorHex: color.hex
      },
      [`${color.id}__subMenuHoverBgColor`]: {
        subMenuHoverBgColorHex: color.hex
      },
      [`${color.id}__subMenuBorderColor`]: {
        subMenuBorderColorHex: color.hex
      },
      [`${color.id}__mMenuColor`]: {
        mMenuColorHex: color.hex
      },
      [`${color.id}__mMenuHoverColor`]: {
        mMenuHoverColorHex: color.hex
      },
      [`${color.id}__mMenuBgColor`]: {
        mMenuBgColorHex: color.hex
      },
      [`${color.id}__mMenuBorderColor`]: {
        mMenuBorderColorHex: color.hex
      },
      [`${color.id}__mMenuIconColor`]: {
        mMenuIconColorHex: color.hex
      },
      [`${color.id}__tabletMMenuIconColor`]: {
        tabletMMenuIconColorHex: color.hex
      },
      [`${color.id}__mobileMMenuIconColor`]: {
        mobileMMenuIconColorHex: color.hex
      },
    }),
    {}
  );
  const generatedFontRules = mergedFontStyles.reduce(
    (acc, font) => ({
      ...acc,
      [`${font.id}__fsDesktop`]: {
        fontFamily: font.fontFamily,
        fontSize: font.fontSize,
        fontWeight: font.fontWeight,
        lineHeight: font.lineHeight,
        letterSpacing: font.letterSpacing
      },
      [`${font.id}__fsTablet`]: {
        tabletFontSize: font.tabletFontSize,
        tabletFontWeight: font.tabletFontWeight,
        tabletLineHeight: font.tabletLineHeight,
        tabletLetterSpacing: font.tabletLetterSpacing
      },
      [`${font.id}__fsMobile`]: {
        mobileFontSize: font.mobileFontSize,
        mobileFontWeight: font.mobileFontWeight,
        mobileLineHeight: font.mobileLineHeight,
        mobileLetterSpacing: font.mobileLetterSpacing
      },
      [`${font.id}__subMenuFsDesktop`]: {
        subMenuFontFamily: font.fontFamily,
        subMenuFontSize: font.fontSize,
        subMenuFontWeight: font.fontWeight,
        subMenuLineHeight: font.lineHeight,
        subMenuLetterSpacing: font.letterSpacing
      },
      [`${font.id}__subMenuFsTablet`]: {
        tabletSubMenuFontSize: font.tabletFontSize,
        tabletSubMenuFontWeight: font.tabletFontWeight,
        tabletSubMenuLineHeight: font.tabletLineHeight,
        tabletSubMenuLetterSpacing: font.tabletLetterSpacing
      },
      [`${font.id}__subMenuFsMobile`]: {
        mobileSubMenuFontSize: font.mobileFontSize,
        mobileSubMenuFontWeight: font.mobileFontWeight,
        mobileSubMenuLineHeight: font.mobileLineHeight,
        mobileSubMenuLetterSpacing: font.mobileLetterSpacing
      },
      [`${font.id}__mMenuFsDesktop`]: {
        mMenuFontFamily: font.fontFamily,
        mMenuFontSize: font.fontSize,
        mMenuFontWeight: font.fontWeight,
        mMenuLineHeight: font.lineHeight,
        mMenuLetterSpacing: font.letterSpacing
      },
      [`${font.id}__mMenuFsTablet`]: {
        tabletMMenuFontSize: font.tabletFontSize,
        tabletMMenuFontWeight: font.tabletFontWeight,
        tabletMMenuLineHeight: font.tabletLineHeight,
        tabletMMenuLetterSpacing: font.tabletLetterSpacing
      },
      [`${font.id}__mMenuFsMobile`]: {
        mobileMMenuFontSize: font.mobileFontSize,
        mobileMMenuFontWeight: font.mobileFontWeight,
        mobileMMenuLineHeight: font.mobileLineHeight,
        mobileMMenuLetterSpacing: font.mobileLetterSpacing
      }
    }),
    {}
  );
  const rules = {
    ...Editor.getStyle("default").rules,
    ...currentStyle.rules,
    ...generatedColorRules,
    ...generatedFontRules
  };

  return {
    id: currentStyleId,
    colorPalette,
    fontStyles,
    extraFontStyles,
    mergedFontStyles,
    rules
  };
});

export const savedBlocksSelector = createSelector(
  globalsSelector,
  globals => globals.savedBlocks || []
);

export const globalBlocksSelector = createSelector(
  globalsSelector,
  globals => globals.globalBlocks || {}
);
