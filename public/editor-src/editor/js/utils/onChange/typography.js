import { getFontStyle } from "visual/utils/fonts";

export function onChangeTypography(newValues, currentValues) {
  const {
    fontSize,
    fontFamily,
    fontFamilyType,
    lineHeight,
    letterSpacing,
    fontWeight
  } =
    currentValues.fontStyle === ""
      ? currentValues
      : getFontStyle(currentValues.fontStyle);

  return {
    fontSize,
    fontFamily,
    fontFamilyType,
    lineHeight,
    letterSpacing,
    fontWeight,
    fontStyle: "",
    ...newValues
  };
}

export function onChangeTypographyTablet(newValues, currentValues) {
  const {
    tabletFontSize,
    tabletLineHeight,
    tabletLetterSpacing,
    tabletFontWeight
  } =
    currentValues.tabletFontStyle === ""
      ? currentValues
      : getFontStyle(currentValues.tabletFontStyle);

  return {
    tabletFontSize,
    tabletLineHeight,
    tabletLetterSpacing,
    tabletFontWeight,
    tabletFontStyle: "",
    ...newValues
  };
}

export function onChangeTypographyMobile(newValues, currentValues) {
  const {
    mobileFontSize,
    mobileLineHeight,
    mobileLetterSpacing,
    mobileFontWeight
  } =
    currentValues.mobileFontStyle === ""
      ? currentValues
      : getFontStyle(currentValues.mobileFontStyle);

  return {
    mobileFontSize,
    mobileLineHeight,
    mobileLetterSpacing,
    mobileFontWeight,
    mobileFontStyle: "",
    ...newValues
  };
}
