import {
  getBlur,
  getHorizontal,
  getSpread,
  getVertical,
  setBlur,
  setHorizontal,
  setOpacity,
  setPalette,
  setSpread,
  setType,
  setVertical,
  setHex,
  getPalette,
  getOpacity,
  getType
} from "./model";
import * as ColorUtils from "visual/component/Options/types/dev/ColorPicker/utils";
import { get, _apply } from "visual/utils/model";
import { toBlur, toSpread } from "visual/utils/cssProps";
import { t } from "visual/utils/i18n";
import { toObject } from "visual/utils/object";
import * as T from "visual/component/Options/types/dev/BoxShadow/entities/type";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Hex from "visual/utils/color/isHex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { NumberSpec } from "visual/utils/math/number";

/**
 * Toggles shadow type
 *  - on enable, set opacity to the latest non empty value
 *  - on disable, set type to 0
 *
 * @param {boolean} enable
 * @param {object} m
 * @return {object}
 */
export const toggleColor = (enable, m) => {
  const opacity = enable ? getOpacity(m) || get("tempOpacity", m) : 0;
  const palette = enable ? getPalette(m) || get("tempPalette", m) : "";

  return _apply(
    [
      [setOpacity, opacity],
      [setPalette, palette]
    ],
    m
  );
};

/**
 * Toggles shadow type
 *  - on enable, set type to the latest non empty value
 *  - on disable, set type to NONE
 *
 * @param {boolean} enable
 * @param {object} m
 * @return {object}
 */
export const toggleType = (enable, m) => {
  const value = enable ? T.noEmpty(getType(m)) ?? T.read(m?.tempType) : T.NONE;

  return setType(value, m);
};

/**
 *
 * @param {boolean} enable
 * @param {object} m
 * @return {object}
 */
export const toggleFields = (enable, m) => {
  const u = undefined;
  const blur = getBlur(m, u) || get("tempBlur", m, 0);
  const spread = getSpread(m, u) || get("tempSpread", m, 0);
  const horizontal = getHorizontal(m, u) || get("tempHorizontal", m, 0);
  const vertical = getVertical(m, u) || get("tempVertical", m, 0);
  const model = { ...toObject(m) };

  model.blur = enable ? blur : 0;
  model.tempBlur = blur;
  model.spread = enable ? spread : 0;
  model.tempSpread = spread;
  model.vertical = enable ? vertical : 0;
  model.tempVertical = vertical;
  model.horizontal = enable ? horizontal : 0;
  model.tempHorizontal = horizontal;

  return model;
};

/**
 * Check if shadow options are enabled
 *
 * @param {object} m
 * @return {boolean}
 */
export const fieldsEnabled = m => !!(getBlur(m, 0) || getSpread(m, 0));

export const getTypeTitle = type => {
  switch (type) {
    case T.NONE:
      return t("None");
    case T.INSET:
      return t("Inset");
    case T.OUTSET:
      return t("Outset");
    default:
      return type;
  }
};

export const getTypesItems = () =>
  T.types.map(id => ({ id, title: getTypeTitle(id) }));

/**
 * Return setter for specific box shadow field
 *
 * @param {string} id
 * @return {(function(v: string|number, m:object):object)|undefined}
 */
export const getSetter = id => {
  switch (id) {
    case "type":
      return setType;
    case "palette":
      return setPalette;
    case "hex":
      return setHex;
    case "opacity":
      return setOpacity;
    case "blur":
      return setBlur;
    case "spread":
      return setSpread;
    case "vertical":
      return setVertical;
    case "horizontal":
      return setHorizontal;
    default:
      return undefined;
  }
};

/**
 * Converts a legacy box shadow value to a valid box shadow type value
 *
 * @param {string} v
 * @return {string}
 */
export const fromLegacyType = v => (v === "on" ? T.OUTSET : v);

/**
 * Converts a box shadow type value to a legacy value
 *
 * @param {string} v
 * @return {string}
 */
export const toLegacyType = v => {
  switch (v) {
    case T.NONE:
      return "";
    case T.OUTSET:
      return "on";
    default:
      return v;
  }
};

/**
 *
 * @param get
 * @return {object}
 */
export const fromElementModel = get => {
  const partial = {
    type: T.mRead(fromLegacyType(get("value"))),
    opacity: Opacity.mRead(get("colorOpacity")),
    blur: toBlur(get("blur"), 0),
    spread: toSpread(get("spread"), 0)
  };

  const isEmpty =
    partial.type === T.empty ||
    partial.opacity === Opacity.empty ||
    (partial.blur === 0 && partial.spread === 0);

  return {
    type: isEmpty ? T.empty : partial.type,
    tempType: T.read(fromLegacyType(get("tempValue"))) ?? T.OUTSET,
    hex: Hex.read(get("colorHex")) ?? "#000000",
    opacity: isEmpty ? Opacity.empty : partial.opacity,
    tempOpacity: Opacity.read(get("tempColorOpacity")) ?? 1,
    palette: isEmpty ? Palette.empty : Palette.mRead(get("colorPalette")),
    tempPalette: Palette.mRead(get("tempColorPalette")),
    blur: isEmpty ? 0 : partial.blur,
    tempBlur: toBlur(get("tempBlur"), 4),
    spread: isEmpty ? 0 : partial.spread,
    tempSpread: toSpread(get("tempSpread"), 2),
    vertical: isEmpty ? 0 : NumberSpec.read(get("vertical")) ?? 0,
    tempVertical: NumberSpec.read(get("tempVertical")) ?? 0,
    horizontal: isEmpty ? 0 : NumberSpec.read(get("horizontal")) ?? 0,
    tempHorizontal: NumberSpec.read(get("tempHorizontal")) ?? 0
  };
};

/**
 * Converts box shadow model to db model
 * @param {{
 *   type: string,
 *   tempType: string,
 *   hex: string,
 *   palette: string,
 *   tempPalette: string,
 *   opacity: number,
 *   tempOpacity: number,
 *   blur: number,
 *   tempBlur: number,
 *   spread: number,
 *   tempSpread: number,
 *   vertical: number,
 *   tempVertical: number,
 *   horizontal: number,
 *   tempHorizontal: number,
 * }} m
 *
 * @return {{
 *   value: string,
 *   tempValue: string,
 *   colorHex: string,
 *   colorPalette: string,
 *   tempColorPalette: string,
 *   colorOpacity: number,
 *   tempColorOpacity: number,
 *   blur: number,
 *   tempBlur: number,
 *   spread: number,
 *   tempSpread: number,
 *   vertical: number,
 *   tempVertical: number,
 *   horizontal: number,
 *   tempHorizontal: number,
 * }}
 */
export const toElementModel = m => {
  return {
    value: toLegacyType(m.type),
    tempValue: toLegacyType(m.tempType),
    colorHex: m.hex,
    colorPalette: m.palette,
    tempColorPalette: m.tempPalette,
    colorOpacity: m.opacity,
    tempColorOpacity: m.tempOpacity,
    blur: m.blur,
    tempBlur: m.tempBlur,
    spread: m.spread,
    tempSpread: m.tempSpread,
    vertical: m.vertical,
    tempVertical: m.tempVertical,
    horizontal: m.horizontal,
    tempHorizontal: m.tempHorizontal
  };
};

/**
 * Return config specific configuration
 *
 * @param {object} defaultConfig
 * @param {object} newConfig
 * @param {string} key
 * @return {*}
 */
export const getConfig = (defaultConfig, newConfig, key) => {
  const r = get(key, newConfig);
  return r === undefined ? get(key, defaultConfig) : r;
};

/**
 * Alias to api.setOpacity with one exception. The tempOpacity will be updated only if `final` parameter is true
 *
 * @param {number} n
 * @param {object} m
 * @param {boolean} final
 * @returns {{
 *   type: string,
 *   tempType: string,
 *   hex: string,
 *   palette: string,
 *   tempPalette: string,
 *   opacity: number,
 *   tempOpacity: number,
 *   blur: number,
 *   tempBlur: number,
 *   spread: number,
 *   tempSpread: number,
 *   vertical: number,
 *   tempVertical: number,
 *   horizontal: number,
 *   tempHorizontal: number,
 * }}
 */
export const _setOpacity = ColorUtils.setOpacity.bind(undefined, setOpacity);
