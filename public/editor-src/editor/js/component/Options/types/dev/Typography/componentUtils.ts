import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import * as FontType from "visual/utils/fonts/familyType";
import * as FontWeight from "visual/utils/fonts/Weight";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as Patcher from "visual/utils/patch";
import * as Model from "./model";
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
import { Weight } from "visual/utils/fonts/Weight";
import {
  isFontFamily,
  isFontSettings,
  isFontStyle,
  Patch
} from "./types/Patch";
import { ElementModel } from "visual/component/Elements/Types";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { Font } from "./types/Font";

export const DEFAULT_VALUE: Value = {
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
export const getModel: GetModel<Value> = get => {
  return {
    fontFamily:
      mPipe(() => get("fontFamily"), Str.read)() ?? DEFAULT_VALUE.fontFamily,
    fontFamilyType:
      mPipe(() => get("fontFamilyType"), Str.read, FontType.fromString)() ??
      DEFAULT_VALUE.fontFamilyType,
    fontStyle:
      mPipe(() => get("fontStyle"), Str.read)() ?? DEFAULT_VALUE.fontStyle,
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

export const getElementModel: GetElementModel<Patch> = (v, get) => {
  let patch: ElementModel = {};

  if (isFontStyle(v)) {
    return { ...patch, [get("fontStyle")]: v.fontStyle };
  }

  if (isFontFamily(v)) {
    patch = {
      ...patch,
      [get("fontFamily")]: v.fontFamily,
      [get("fontFamilyType")]: v.fontFamilyType
    };
  }

  if (isFontSettings(v)) {
    patch = {
      ...patch,
      [get("fontSize")]: v.fontSize,
      [get("fontSizeSuffix")]: v.fontSizeSuffix,
      [get("fontWeight")]: v.fontWeight,
      [get("letterSpacing")]: v.letterSpacing,
      [get("lineHeight")]: v.lineHeight
    };
  }

  return patch;
};

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
): FontFamily | undefined => {
  const weight = weights.includes(m.fontWeight)
    ? m.fontWeight
    : FontWeight.empty;

  return Patcher.apply<
    string,
    FontFamilyType,
    Weight,
    FontFamily,
    FontFamily,
    FontFamily,
    Value
  >(
    [
      [Model.patchFontFamily, id],
      [Model.patchFontFamilyType, type],
      [Model.patchFontWeight2, weight]
    ],
    m
  );
};
