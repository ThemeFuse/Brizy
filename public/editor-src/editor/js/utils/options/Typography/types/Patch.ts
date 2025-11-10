import { Str } from "@brizy/readers";
import { FontFamilyType } from "visual/types/Fonts";
import { FontTransform } from "visual/types/Style";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import { Weight } from "visual/utils/fonts/Weight";
import * as FamilyType from "visual/utils/fonts/familyType";
import { Positive } from "visual/utils/math/Positive";
import * as Obj from "visual/utils/reader/object";
import { Value } from "./Value";

// region FontStyle
export interface FontStyle {
  fontStyle: string;
}

export const fontStyle = (fontStyle: string): FontStyle => ({ fontStyle });

export const isFontStyle = (p: Patch): p is FontStyle =>
  "fontStyle" in p && Str.is(p.fontStyle);
// endregion

// region FontFamily
export interface FontFamily {
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontWeight: Weight;
}

type WithFontStyle<T> = T & FontStyle

export const fontFamily = (v: Value): WithFontStyle<FontFamily> => ({
  fontStyle: "",
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

export const fontSettings = (v: Value): WithFontStyle<FontSettings> => ({
  fontStyle: "",
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

// region FontTransform
export const isFontTransform = (p: Patch): p is FontTransform =>
  Obj.isObject(p) &&
  Obj.hasSomeKey(
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "uppercase",
      "lowercase",
      "script"
    ],
    p
  );

export const textTransform = (v: Value): WithFontStyle<FontTransform> => ({
  fontStyle: "",
  bold: v.bold,
  italic: v.italic,
  underline: v.underline,
  strike: v.strike,
  uppercase: v.uppercase,
  lowercase: v.lowercase,
  script: v.script
});
// endregion

// region FullFont
export interface FullFont extends FontFamily, FontSettings, FontTransform {}

export const fullFont = (v: Value): FullFont => ({
  ...fontFamily(v),
  ...fontSettings(v),
  ...textTransform(v)
});

export const isFullFont = (p: Patch): p is FullFont =>
  isFontFamily(p) && isFontSettings(p);
// endregion

export type Patch =
  | FullFont
  | FontFamily
  | FontSettings
  | FontStyle
  | FontTransform;
