import { createSelector } from "reselect";
import Editor from "visual/global/Editor";

const globalsSelector = state => state.globals.project;

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
      [`${color.id}__mobileBg`]: {
        mobileBgColorHex: color.hex
      }
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
      [`${font.id}__fsMobile`]: {
        mobileFontSize: font.mobileFontSize,
        mobileFontWeight: font.mobileFontWeight,
        mobileLineHeight: font.mobileLineHeight,
        mobileLetterSpacing: font.mobileLetterSpacing
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
