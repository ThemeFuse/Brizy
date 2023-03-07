import { Value } from "./types/Value";
import * as FontType from "visual/utils/fonts/familyType";
import * as Positive from "visual/utils/math/Positive";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as FontWeight from "visual/utils/fonts/Weight";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { mPipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import {
  isFontFamily,
  isFontSettings,
  isFontStyle,
  isFullFont
} from "./types/Patch";

export const defaultValue: Value = {
  fontFamily: "",
  fontFamilyType: FontType.FontFamilyType.google,
  fontStyle: "",
  fontSize: Positive.unsafe(17),
  fontSizeSuffix: SizeSuffix.empty,
  fontWeight: FontWeight.empty,
  letterSpacing: 0.0,
  lineHeight: Positive.unsafe(1)
};

/**
 * @param {function(k:string):string|number} get
 * @return {Typography}
 */
export const fromElementModel: FromElementModel<"typography-dev"> = get => {
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
      defaultValue.lineHeight
  };
};

export const toElementModel: ToElementModel<"typography-dev"> = v => {
  if (isFullFont(v)) {
    return {
      fontStyle: "",
      fontFamily: v.fontFamily,
      fontFamilyType: v.fontFamilyType,
      fontSize: v.fontSize,
      fontSizeSuffix: v.fontSizeSuffix,
      fontWeight: v.fontWeight,
      letterSpacing: v.letterSpacing,
      lineHeight: v.lineHeight
    };
  }

  if (isFontFamily(v)) {
    return {
      fontStyle: "",
      fontFamily: v.fontFamily,
      fontFamilyType: v.fontFamilyType,
      fontWeight: v.fontWeight
    };
  }

  if (isFontSettings(v)) {
    return {
      fontStyle: "",
      fontSize: v.fontSize,
      fontSizeSuffix: v.fontSizeSuffix,
      fontWeight: v.fontWeight,
      letterSpacing: v.letterSpacing,
      lineHeight: v.lineHeight
    };
  }

  if (isFontStyle(v)) {
    return { fontStyle: v.fontStyle };
  }

  return {};
};
