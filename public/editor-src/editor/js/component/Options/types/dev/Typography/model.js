import { _apply, get, set, setter } from "visual/utils/model";
import * as Patch from "visual/utils/patch";
import * as String from "visual/utils/string";
import * as FamilyType from "visual/utils/fonts/familyType";
import * as Weight from "visual/utils/fonts/weight";
import * as Math from "visual/utils/math";
import { toNumber } from "visual/utils/math";

/**
 * @typedef {{
 *   fontFamily: string,
 *   fontFamilyType: FamilyType,
 *}} FontFamily
 *
 * @typedef {{
 *   fontStyle: string,
 *   fontSize: number,
 *   fontWeight: number,
 *   letterSpacing: number,
 *   lineHeight: number,
 *}} FontSettings
 *
 * @typedef {{
 *   fontFamily: string,
 *   fontFamilyType: string,
 *   fontStyle: string,
 *   fontSize: number,
 *   fontWeight: number,
 *   letterSpacing: number,
 *   lineHeight: number,
 * }} Typography
 */

const _generalSetter = k => (v, m) =>
  _apply([[set, k, v], [setFontStyle, ""]], m);

/**
 * @param {string} k
 * @return {function(v:number, m:Typography): FontSettings}
 */
const _patchFontSettings = k => (v, m) => {
  return Patch.apply(
    [
      [
        () => ({
          fontSize: m.fontSize,
          fontWeight: m.fontWeight,
          letterSpacing: m.letterSpacing,
          lineHeight: m.lineHeight,
          [k]: v
        })
      ],
      [setFontStyle, ""]
    ],
    m
  );
};

/**
 * @param {string} k
 * @return {function(v:string, m:Typography): FontFamily}
 */
const _patchFontFamily = k => (v, m) => {
  return Patch.apply(
    [
      [
        () => ({
          fontFamily: m.fontFamily,
          fontFamilyType: m.fontFamilyType,
          [k]: v
        })
      ],
      [setFontStyle, ""]
    ],
    m
  );
};

/**
 * Get model font family
 *
 * @param {string} orElse
 * @param {Typography} m
 * @return {string}
 */
export const getFontFamily = (m, orElse = undefined) =>
  String.onEmpty(get("fontFamily", m), orElse);

/**
 * Patch font family
 *
 * @param {string} v
 * @param {Typography} m
 * @return {FontFamily}
 */
export const patchFontFamily = Patch.patcher(
  String.onEmpty,
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
export const setFontFamily = setter(
  String.onEmpty,
  getFontFamily,
  _generalSetter("fontFamily")
);

/**
 * Get model font family type
 *
 * @param {string} orElse
 * @param {Typography} m
 * @return {string}
 */
export const getFontFamilyType = (m, orElse) =>
  FamilyType.toType(get("fontFamilyType", m), orElse);

/**
 * Patch font family type
 *
 * @param {string} v
 * @param {Typography} m
 * @return {FontFamily}
 */
export const patchFontFamilyType = Patch.patcher(
  FamilyType.toType,
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
export const setFontFamilyType = setter(
  FamilyType.toType,
  getFontFamilyType,
  _generalSetter("fontFamilyType")
);

/**
 * Get model font style
 *
 * @param {string} orElse
 * @param {Typography} m
 * @return {string}
 */
export const getFontStyle = (m, orElse) =>
  String.toString(get("fontStyle", m), orElse);

/**
 * Set font style
 *
 * @param {string} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontStyle = setter(
  String.toString,
  getFontStyle,
  set.bind(null, "fontStyle")
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
export const patchFontStyle = Patch.patcher(
  String.toString,
  getFontStyle,
  v => ({ fontStyle: v })
);

/**
 * Get model font size
 *
 * @param {number} orElse
 * @param {Typography} m
 * @return {number}
 */
export const getFontSize = (m, orElse) =>
  Math.toPositive(get("fontSize", m), orElse);

/**
 * Patch font size
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchFontSize = Patch.patcher(
  Math.toPositive,
  getFontSize,
  _patchFontSettings("fontSize")
);

/**
 * Set model font size
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontSize = setter(
  Math.toPositive,
  getFontSize,
  _generalSetter("fontSize")
);

/**
 * Get model font weight
 *
 * @param {number} orElse
 * @param {Typography} m
 * @return {number}
 */
export const getFontWeight = (m, orElse = undefined) =>
  Weight.toWeight(get("fontWeight", m), orElse);

/**
 * Patch font weight
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchFontWeight = Patch.patcher(
  Weight.toWeight,
  getFontWeight,
  _patchFontSettings("fontWeight")
);

/**
 * Set model font weight
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setFontWeight = setter(
  Weight.toWeight,
  getFontWeight,
  _generalSetter("fontWeight")
);

/**
 * Get model letter spacing
 *
 * @param {number} orElse
 * @param {Typography} m
 * @return {number}
 */
export const getLetterSpacing = (m, orElse = undefined) =>
  toNumber(get("letterSpacing", m), orElse);

/**
 * Patch letter spacing
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchLetterSpacing = Patch.patcher(
  toNumber,
  getLetterSpacing,
  _patchFontSettings("letterSpacing")
);

/**
 * Set model letter spacing
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setLetterSpacing = setter(
  toNumber,
  getLetterSpacing,
  _generalSetter("letterSpacing")
);

/**
 * Get model line height
 *
 * @param {number} orElse
 * @param {Typography} m
 * @return {number}
 */
export const getLineHeight = (m, orElse) =>
  Math.toPositive(get("lineHeight", m), orElse);

/**
 * Patch line height
 *
 * @param {number} v
 * @param {Typography} m
 * @return {FontSettings}
 */
export const patchLineHeight = Patch.patcher(
  Math.toPositive,
  getLineHeight,
  _patchFontSettings("lineHeight")
);

/**
 * Set model line height
 *
 * @param {number} v
 * @param {Typography} m
 * @return {Typography}
 */
export const setLineHeight = setter(
  Math.toPositive,
  getLineHeight,
  _generalSetter("lineHeight")
);
