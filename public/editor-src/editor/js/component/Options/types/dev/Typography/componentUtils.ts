import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import * as FontType from "visual/utils/fonts/familyType";
import * as FontWeight from "visual/utils/fonts/Weight";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as Positive from "visual/utils/math/Positive";
import { getStore } from "visual/redux/store";
import { deviceModeSelector } from "visual/redux/selectors";
import { defaultValueValue } from "visual/utils/onChange";
import { getFontStyle } from "visual/utils/fonts";
import { GetElementModel, GetModel } from "visual/component/Options/Type";
import { FontFamily, Value } from "./types/Value";
import { mPipe } from "visual/utils/fp";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import * as Patch from "./types/Patch";
import { ElementModel } from "visual/component/Elements/Types";
import { Font } from "./types/Font";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import { match2, or, pass } from "fp-utilities";

export const DEFAULT_VALUE: Value = {
  fontFamily: "",
  fontFamilyType: FontType.FontFamilyType.google,
  fontStyle: undefined,
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
export const getModel: GetModel<Value> = get => {
  return {
    fontFamily:
      mPipe(() => get("fontFamily"), Str.read)() ?? DEFAULT_VALUE.fontFamily,
    fontFamilyType:
      mPipe(() => get("fontFamilyType"), Str.read, FontType.fromString)() ??
      DEFAULT_VALUE.fontFamilyType,
    fontStyle:
      mPipe(() => get("fontStyle"), Str.read, pass(NoEmptyString.is))() ??
      DEFAULT_VALUE.fontStyle,
    fontSize:
      mPipe(() => get("fontSize"), Num.read, Positive.fromNumber)() ??
      DEFAULT_VALUE.fontSize,
    fontSizeSuffix:
      mPipe(() => get("fontSizeSuffix"), Str.read, SizeSuffix.fromString)() ??
      DEFAULT_VALUE.fontSizeSuffix,
    fontWeight:
      mPipe(() => get("fontWeight"), Num.read, FontWeight.fromNumber)() ??
      DEFAULT_VALUE.fontWeight,
    letterSpacing:
      mPipe(() => get("letterSpacing"), Num.read)() ??
      DEFAULT_VALUE.letterSpacing,
    lineHeight:
      mPipe(() => get("lineHeight"), Num.read, Positive.fromNumber)() ??
      DEFAULT_VALUE.lineHeight
  };
};

const ifFn = (v: (k: string) => string): v is (k: string) => string => !!v;
export const getElementModel: GetElementModel<Patch.Patch> = or(
  match2(
    [
      Patch.isFontStyle,
      ifFn,
      (v, get): ElementModel => ({ [get("fontStyle")]: v.fontStyle })
    ],
    [
      Patch.isFontFamily,
      ifFn,
      (v, get): ElementModel => ({
        [get("fontFamily")]: v.fontFamily,
        [get("fontFamilyType")]: v.fontFamilyType,
        [get("fontSize")]: v.fontSize,
        [get("fontSizeSuffix")]: v.fontSizeSuffix,
        [get("fontWeight")]: v.fontWeight,
        [get("letterSpacing")]: v.letterSpacing,
        [get("lineHeight")]: v.lineHeight,
        [get("fontStyle")]: v.fontStyle
      })
    ],
    [
      Patch.isFontSettings,
      ifFn,
      (v, get): ElementModel => ({
        [get("fontSize")]: v.fontSize,
        [get("fontSizeSuffix")]: v.fontSizeSuffix,
        [get("fontWeight")]: v.fontWeight,
        [get("letterSpacing")]: v.letterSpacing,
        [get("lineHeight")]: v.lineHeight,
        [get("fontStyle")]: v.fontStyle
      })
    ]
  ),
  () => ({})
);

/**
 * @param {Typography} m
 * @return {Typography}
 */
export const fromGlobal = (m: Value): Value => {
  const v = getFontStyle(m.fontStyle) || m;
  const device = deviceModeSelector(getStore().getState());

  const get = (key: string): MValue<Literal> =>
    key === "fontStyle" ? m.fontStyle : defaultValueValue({ key, v, device });

  return { ...DEFAULT_VALUE, ...getModel(get) };
};

export const patchFontFamily = (
  { id, type, weights }: Font,
  m: Value
): FontFamily => {
  const weight = weights.includes(m.fontWeight)
    ? m.fontWeight
    : FontWeight.empty;

  return {
    fontFamily: id,
    fontFamilyType: type,
    fontWeight: weight,
    fontSizeSuffix: m.fontSizeSuffix,
    fontSize: m.fontSize,
    letterSpacing: m.letterSpacing,
    lineHeight: m.lineHeight,
    fontStyle: undefined
  };
};
