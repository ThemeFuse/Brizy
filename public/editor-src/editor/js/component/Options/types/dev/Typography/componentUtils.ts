import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import * as FontType from "visual/utils/fonts/familyType";
import * as FontWeight from "visual/utils/fonts/Weight";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as Positive from "visual/utils/math/Positive";
import { defaultValueValue } from "visual/utils/onChange";
import { getFontStyle, fontTransform } from "visual/utils/fonts";
import { DefaultFont } from "visual/utils/fonts/getFontById";
import {
  ToElementModel,
  FromElementModel
} from "visual/component/Options/Type";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { Value } from "./types/Value";
import { mPipe } from "visual/utils/fp";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import {
  isFontFamily,
  isFontSettings,
  isFontStyle,
  isFullFont,
  Patch
} from "./types/Patch";
import { FontsBlock } from "./types/FontsBlocks";
import { DeviceMode } from "visual/types";

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
export const getModel: FromElementModel<Value> = get => {
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

export const getElementModel: ToElementModel<Patch> = v => {
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

const hasFont = (fonts: FontsBlock, fontId: string): boolean => {
  return Object.values(fonts).some(fontList =>
    fontList?.some(font => font.id === fontId)
  );
};

/**
 * @param device
 * @param fonts
 * @param defaultFont
 * @param {Typography} m
 * @return {Typography}
 */
export const getValue = (
  device: DeviceMode,
  fonts: FontsBlock,
  defaultFont: DefaultFont,
  m: Value
): Value => {
  const v = getFontStyle(m.fontStyle) || m;

  const get = (key: string): MValue<Literal> =>
    key === "fontStyle" ? m.fontStyle : defaultValueValue({ key, v, device });

  const model = {
    ...DEFAULT_VALUE,
    ...getModel(get)
  };

  if (hasFont(fonts, model.fontFamily)) {
    return model;
  }

  const { group, font } = defaultFont;
  const getFont = fontTransform[group];
  const family = getFont(font).id;

  switch (group) {
    case "config":
    case "blocks":
    case "google": {
      return {
        ...model,
        fontFamilyType: FontFamilyType.google,
        fontFamily: family
      };
    }
    case "upload": {
      return {
        ...model,
        fontFamilyType: FontFamilyType.upload,
        fontFamily: family
      };
    }
  }
};
