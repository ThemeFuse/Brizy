import { isHex } from "visual/utils/color/isHex";
import { toOpacity } from "visual/utils/cssProps/opacity";
import { toObject } from "visual/utils/object";
import { apply, get, set } from "visual/utils/model";
import { toPalette } from "./entities/palette";

/**
 * @typedef {{
 *   hex: string,
 *   opacity: number,
 *   tempOpacity: number,
 *   palette: string,
 *   tempPalette: string,
 * }} Color
 */

/**
 * Return coloPicker option model opacity
 * - If the value is not a valid opacity value, return the orElse value
 *
 * @param {number} orElse
 * @param {Color} v
 * @returns {number}
 */
export const getOpacity = (orElse, v = {}) =>
  toOpacity(orElse, toObject(v).opacity);

/**
 * Set opacity value in the colorPicker model.
 *  - If the value is not a valid opacity return the original model
 *  - If current value is equal to new one, return original model
 *  - If opacity == 0, palette value is set to empty
 *  - If opacity == 0, tempPalette takes current palette value
 *  - If opacity == 0, tempOpacity takes current opacity value
 *  - If opacity > 0 and palette == '', palette takes temptPalette value
 *
 * @param {number} v
 * @param {Color} m
 * @returns {Color}
 */
export const setOpacity = (v, m = {}) => {
  const i = {};
  if (toOpacity(i, v) === i || getOpacity(i, m) === v) {
    return m;
  }

  const p = getPalette(undefined, m) || get("", "tempPalette", m);

  return apply(
    [
      [set, "tempOpacity", v === 0 ? getOpacity(undefined, m) : undefined],
      [set, "opacity", v],
      [set, "palette", v ? p : ""],
      [set, "tempPalette", !v ? p : undefined]
    ],
    m
  );
};

/**
 * Return coloPicker option model hex
 * - If the value is not a valid hex value, return the orElse value
 *
 * @param {string} orElse
 * @param {Color} v
 * @returns {string}
 */
export const getHex = (orElse, v = {}) =>
  isHex(toObject(v).hex) ? toObject(v).hex : orElse;

/**
 * Set hex value in the colorPicker model.
 *  - If the value is not a valid hex, return the original model
 *  - If the value is equal to current hex,  return the original model
 *  - If opacity == 0, take tempOpacity value
 *  - If palette has value, set to "",
 *  - If palette has value, tempPalette takes palette value
 *
 * @param {string} hex
 * @param {Color} v
 * @returns {Color}
 */
export const setHex = (hex, v = {}) => {
  if (!isHex(hex) || hex === toObject(v).hex) {
    return v;
  }
  const object = toObject(v);

  return apply(
    [
      [set, "hex", hex],
      [set, "opacity", hex ? object.opacity || object.tempOpacity || 1 : 0],
      [set, "tempOpacity", hex ? undefined : object.opacity],
      [set, "palette", hex ? "" : undefined],
      [set, "tempPalette", hex ? "" : undefined]
    ],
    v
  );
};

/**
 * Return color model palette
 * If value is empty, return orElse value
 *
 * @param {string} orElse
 * @param {Color} m
 * @returns {string}
 */
export const getPalette = (orElse, m = {}) =>
  toPalette(orElse, get(undefined, "palette", m));

/**
 * Set palette value in the colorPicker model.
 *  - If value is not a valid palette, return the original model
 *  - If value is equal to current palette, return the original model
 *  - If value == '', tempPalette takes palette current value
 *  - If opacity == 0, opacity takes tempOpacity value
 *
 * @param {string} v
 * @param {Color} m
 * @returns {Color}
 */
export const setPalette = (v, m = {}) => {
  const i = {};
  if (toPalette(i, v) === i || getPalette(i, m) === v) {
    return m;
  }

  const tempPalette =
    getPalette(undefined, m) || get(undefined, "tempPalette", m);
  const tempOpacity =
    getOpacity(undefined, m) || get(undefined, "tempOpacity", m);

  return apply(
    [
      [set, "tempPalette", !v ? tempPalette : undefined],
      [set, "palette", v],
      [set, "opacity", v ? getOpacity(0, m) || tempOpacity : undefined]
    ],
    m
  );
};
