import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import { Weight } from "visual/utils/fonts/Weight";
import * as FamilyType from "visual/utils/fonts/familyType";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { Positive } from "visual/utils/math/Positive";
import { Value } from "./Value";

// region FontStyle
export interface FontStyle {
  fontStyle: string;
}

export const fontStyle = (fontStyle: string): FontStyle => ({ fontStyle });

export const isFontStyle = (p: Patch): p is FontStyle =>
  typeof (p as Partial<FontStyle>).fontStyle === "string";
// endregion

// region FontFamily
export interface FontFamily {
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontWeight: Weight;
}

export const fontFamily = (v: Value): FontFamily => ({
  fontFamilyType: v.fontFamilyType,
  fontWeight: v.fontWeight,
  fontFamily: v.fontFamily
});

export const isFontFamily = (p: Patch): p is FontFamily =>
  FamilyType.is((p as FontFamily).fontFamilyType);
// endregion

// region FontSettings
export interface FontSettings {
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontSize: Positive;
  fontSizeSuffix: SizeSuffix.SizeSuffix;
  fontWeight: Weight;
  letterSpacing: number;
  lineHeight: Positive;
  variableFontWeight: number;
  fontWidth: number;
  fontSoftness: number;
}

export const fontSettings = (v: Value): FontSettings => ({
  fontFamily: v.fontFamily,
  fontFamilyType: v.fontFamilyType,
  fontSize: v.fontSize,
  fontWeight: v.fontWeight,
  fontSizeSuffix: v.fontSizeSuffix,
  letterSpacing: v.letterSpacing,
  lineHeight: v.lineHeight,
  variableFontWeight: v.variableFontWeight,
  fontWidth: v.fontWidth,
  fontSoftness: v.fontSoftness
});

export const isFontSettings = (p: Patch): p is FontSettings =>
  SizeSuffix.is((p as FontSettings).fontSizeSuffix);
// endregion

// region FullFont
export interface FullFont extends FontFamily, FontSettings {}

export const fullFont = (v: Value): FullFont => ({
  ...fontFamily(v),
  ...fontSettings(v)
});

export const isFullFont = (p: Patch): p is FullFont =>
  isFontFamily(p) && isFontSettings(p);
// endregion

export type Patch = FullFont | FontFamily | FontSettings | FontStyle;
