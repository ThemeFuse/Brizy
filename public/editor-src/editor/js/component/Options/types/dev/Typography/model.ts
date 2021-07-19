import { _apply, set, setter2 } from "visual/utils/model";
import * as Patch from "visual/utils/patch";
import {
  FontFamily,
  FontSettings,
  Value
} from "visual/component/Options/types/dev/Typography/types/Value";
import { MValue } from "visual/utils/value";

/**
 * Get model font style
 *
 * @param {Typography} m
 * @return {string}
 */
export const getFontStyle = <V extends { fontStyle: string }>(
  m: V
): V["fontStyle"] => m.fontStyle;

/**
 * Set font style
 *
 * @param {string} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontStyle = setter2(getFontStyle, (v, m) =>
  set("fontStyle", v, m)
);

/**
 * Set font style
 *
 * @param {string} v
 * @param {Typography} m
 * @return {{
 *  fontStyle: string
 * }}
 */
export const patchFontStyle = Patch.patcher(getFontStyle, v => ({
  fontStyle: v
}));

const _generalSetter = <K extends keyof Value>(k: K) => (
  v: Value[K],
  m: Value
): Value =>
  _apply(
    [
      [set, k, v],
      [setFontStyle, ""]
    ],
    m
  );

const _patchFontSettings = <K extends keyof FontSettings>(
  k: K
): ((v: FontSettings[K], m: Value) => MValue<FontSettings>) => (
  v,
  m
): MValue<FontSettings> => {
  return Patch.apply(
    [
      [
        (v: FontSettings[K]): FontSettings => ({
          fontSize: m.fontSize,
          fontSizeSuffix: m.fontSizeSuffix,
          fontWeight: m.fontWeight,
          letterSpacing: m.letterSpacing,
          lineHeight: m.lineHeight,
          [k]: v
        }),
        v
      ],
      [patchFontStyle, ""]
    ],
    m
  );
};

const _patchFontFamily = <K extends keyof FontFamily>(k: K) => (
  v: FontFamily[K],
  m: Value
): FontFamily | undefined => {
  return Patch.apply(
    [
      [
        (v: FontFamily[K]): FontFamily => ({
          fontFamily: m.fontFamily,
          fontFamilyType: m.fontFamilyType,
          fontWeight: m.fontWeight,
          [k]: v
        }),
        v
      ],
      [patchFontStyle, ""]
    ],
    m
  );
};

/**
 * Get model font family
 *
 * @param {Typography} m
 * @return {string}
 */
export const getFontFamily = (m: Value): Value["fontFamily"] => m.fontFamily;
/**
 * Patch font family
 *
 * @param {string} v
 * @param {Typography} m
 * @return {FontFamily}
 */
export const patchFontFamily = Patch.patcher(
  getFontFamily,
  _patchFontFamily("fontFamily")
);

/**
 * Set font family
 *
 * @param {string} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontFamily = setter2(
  getFontFamily,
  _generalSetter("fontFamily")
);

/**
 * Get model font family type
 *
 * @param {Typography} m
 * @return {string}
 */
export const getFontFamilyType = (m: Value): Value["fontFamilyType"] =>
  m.fontFamilyType;

/**
 * Patch font family type
 *
 * @param {string} v
 * @param {Typography} m
 * @return {FontFamily}
 */
export const patchFontFamilyType = Patch.patcher(
  getFontFamilyType,
  _patchFontFamily("fontFamilyType")
);

/**
 * Set font family
 *
 * @param {FontFamilyType} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontFamilyType = setter2(
  getFontFamilyType,
  _generalSetter("fontFamilyType")
);

/**
 * Get model font size
 *
 * @param {Typography} m
 * @return {number}
 */
export const getFontSize = (m: Value): Value["fontSize"] => m.fontSize;
/**
 * Patch font size
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchFontSize = Patch.patcher(
  getFontSize,
  _patchFontSettings<"fontSize">("fontSize")
);

/**
 * Set model font size
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontSize = setter2(getFontSize, _generalSetter("fontSize"));

/**
 * Get model font size suffix
 *
 * @param {Typography} m
 * @return {string}
 */
export const getFontSizeSuffix = (m: Value): Value["fontSizeSuffix"] =>
  m.fontSizeSuffix;

/**
 * Patch font size suffix
 *
 * @param {string} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchFontSizeSuffix = Patch.patcher(
  getFontSizeSuffix,
  _patchFontSettings<"fontSizeSuffix">("fontSizeSuffix")
);

/**
 * Set model font size suffix
 *
 * @param {string} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontSizeSuffix = setter2(
  getFontSizeSuffix,
  _generalSetter("fontSizeSuffix")
);

/**
 * Get model font weight
 *
 * @param {Typography} m
 * @return {number}
 */
export const getFontWeight = (m: Value): Value["fontWeight"] => m.fontWeight;

/**
 * Patch font weight
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchFontWeight = Patch.patcher(
  getFontWeight,
  _patchFontSettings<"fontWeight">("fontWeight")
);

export const patchFontWeight2 = Patch.patcher(
  getFontWeight,
  _patchFontFamily<"fontWeight">("fontWeight")
);

/**
 * Set model font weight
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontWeight = setter2(
  getFontWeight,
  _generalSetter("fontWeight")
);

/**
 * Get model letter spacing
 *
 * @param {Typography} m
 * @return {number}
 */
export const getLetterSpacing = (m: Value): Value["letterSpacing"] =>
  m.letterSpacing;

/**
 * Patch letter spacing
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchLetterSpacing = Patch.patcher(
  getLetterSpacing,
  _patchFontSettings<"letterSpacing">("letterSpacing")
);

/**
 * Set model letter spacing
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setLetterSpacing = setter2(
  getLetterSpacing,
  _generalSetter("letterSpacing")
);

/**
 * Get model line height
 *
 * @param {Typography} m
 * @return {number}
 */
export const getLineHeight = (m: Value): Value["lineHeight"] => m.lineHeight;

/**
 * Patch line height
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchLineHeight = Patch.patcher(
  getLineHeight,
  _patchFontSettings<"lineHeight">("lineHeight")
);

/**
 * Set model line height
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setLineHeight = setter2(
  getLineHeight,
  _generalSetter("lineHeight")
);
