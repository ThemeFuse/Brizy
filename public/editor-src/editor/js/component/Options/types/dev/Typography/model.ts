import {
  FontFamily,
  FontSettings,
  FontStyle,
  Value
} from "visual/component/Options/types/dev/Typography/types/Value";
import { NoEmptyString } from "visual/utils/string/NoEmptyString";

export const patchFontStyle = (v: NoEmptyString): FontStyle => ({
  fontStyle: v
});

export const patchFontSettings = <K extends keyof FontSettings>(
  k: K,
  v: FontSettings[K],
  m: Value
): FontSettings => {
  return {
    fontSize: m.fontSize,
    fontSizeSuffix: m.fontSizeSuffix,
    fontWeight: m.fontWeight,
    letterSpacing: m.letterSpacing,
    lineHeight: m.lineHeight,
    fontStyle: undefined,
    [k]: v
  };
};

export const patchFontFamily = <K extends keyof FontFamily>(
  k: K,
  v: FontFamily[K],
  m: Value
): FontFamily => {
  return {
    fontFamily: m.fontFamily,
    fontFamilyType: m.fontFamilyType,
    fontWeight: m.fontWeight,
    fontSize: m.fontSize,
    fontSizeSuffix: m.fontSizeSuffix,
    letterSpacing: m.letterSpacing,
    lineHeight: m.lineHeight,
    fontStyle: undefined,
    [k]: v
  };
};
