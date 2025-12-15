import { isNothing } from "fp-utilities";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { FontFamilyType } from "visual/types/Fonts";
import { fromStringToScript } from "visual/types/utils";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as FontWeight from "visual/utils/fonts/Weight";
import * as FontType from "visual/utils/fonts/familyType";
import { mPipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";
import {
  isFontFamily,
  isFontSettings,
  isFontStyle,
  isFontTransform,
  isFullFont
} from "./types/Patch";
import { Value } from "./types/Value";

export const defaultValue: Value = {
  fontFamily: "",
  fontFamilyType: FontFamilyType.google,
  fontStyle: "",
  fontSize: Positive.unsafe(17),
  fontSizeSuffix: SizeSuffix.empty,
  fontWeight: FontWeight.empty,
  letterSpacing: 0.0,
  lineHeight: Positive.unsafe(1),
  variableFontWeight: FontWeight.empty,
  fontWidth: 100,
  fontSoftness: 0,
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  uppercase: false,
  lowercase: false
};

/**
 * @param {function(k:string):string|number} get
 * @return {Typography}
 */
export const fromElementModel: FromElementModel<"typography"> = (get) => {
  return {
    fontFamily:
      mPipe(() => get("fontFamily"), Str.read)() ?? defaultValue.fontFamily,
    fontFamilyType:
      mPipe(() => get("fontFamilyType"), Str.read, FontType.fromString)() ??
      defaultValue.fontFamilyType,
    fontStyle:
      mPipe(() => get("fontStyle"), Str.read)() ?? defaultValue.fontStyle,
    fontSize:
      mPipe(() => get("fontSize"), Num.read, Positive.fromNumber)() ??
      defaultValue.fontSize,
    fontSizeSuffix:
      mPipe(() => get("fontSizeSuffix"), Str.read, SizeSuffix.fromString)() ??
      defaultValue.fontSizeSuffix,
    fontWeight:
      mPipe(() => get("fontWeight"), Num.read, FontWeight.fromNumber)() ??
      defaultValue.fontWeight,
    letterSpacing:
      mPipe(() => get("letterSpacing"), Num.read)() ??
      defaultValue.letterSpacing,
    lineHeight:
      mPipe(() => get("lineHeight"), Num.read, Positive.fromNumber)() ??
      defaultValue.lineHeight,
    variableFontWeight:
      mPipe(() => get("variableFontWeight"), Num.read)() ??
      defaultValue.variableFontWeight,
    fontWidth:
      mPipe(() => get("fontWidth"), Num.read)() ?? defaultValue.fontWidth,
    fontSoftness:
      mPipe(() => get("fontSoftness"), Num.read)() ?? defaultValue.fontSoftness,
    bold: mPipe(() => get("bold"), Boolean)() ?? defaultValue.bold,
    italic: mPipe(() => get("italic"), Boolean)() ?? defaultValue.italic,
    underline:
      mPipe(() => get("underline"), Boolean)() ?? defaultValue.underline,
    strike: mPipe(() => get("strike"), Boolean)() ?? defaultValue.strike,
    uppercase:
      mPipe(() => get("uppercase"), Boolean)() ?? defaultValue.uppercase,
    lowercase:
      mPipe(() => get("lowercase"), Boolean)() ?? defaultValue.lowercase,
    script: mPipe(() => get("script"), Str.read, fromStringToScript)()
  };
};

export const toElementModel: ToElementModel<"typography"> = (v) => {
  const patch: Partial<Value> = {};

  if (isFontStyle(v)) {
    patch["fontStyle"] = v.fontStyle;
  }

  if (isFullFont(v)) {
    return {
      ...patch,
      fontFamily: v.fontFamily,
      fontFamilyType: v.fontFamilyType,
      fontSize: v.fontSize,
      fontSizeSuffix: v.fontSizeSuffix,
      fontWeight: v.fontWeight,
      letterSpacing: v.letterSpacing,
      lineHeight: v.lineHeight,
      variableFontWeight: v.variableFontWeight,
      fontWidth: v.fontWidth,
      fontSoftness: v.fontSoftness,
      bold: v.bold,
      italic: v.italic,
      underline: v.underline,
      strike: v.strike,
      uppercase: v.uppercase,
      lowercase: v.lowercase,
      ...(!isNothing(v.script) ? { script: v.script } : {})
    };
  }

  if (isFontFamily(v)) {
    return {
      ...patch,
      fontFamily: v.fontFamily,
      fontFamilyType: v.fontFamilyType,
      fontWeight: v.fontWeight
    };
  }

  if (isFontSettings(v)) {
    return {
      ...patch,
      fontFamily: v.fontFamily,
      fontFamilyType: v.fontFamilyType,
      fontSize: v.fontSize,
      fontSizeSuffix: v.fontSizeSuffix,
      fontWeight: v.fontWeight,
      letterSpacing: v.letterSpacing,
      lineHeight: v.lineHeight,
      variableFontWeight: v.variableFontWeight,
      fontWidth: v.fontWidth,
      fontSoftness: v.fontSoftness
    };
  }

  if (isFontTransform(v)) {
    return {
      bold: v.bold,
      italic: v.italic,
      underline: v.underline,
      strike: v.strike,
      uppercase: v.uppercase,
      lowercase: v.lowercase,
      ...(!isNothing(v.script) ? { script: v.script } : {})
    };
  }

  return patch;
};
