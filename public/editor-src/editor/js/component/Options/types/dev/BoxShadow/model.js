import { apply, get, set } from "visual/utils/model";
import {
  getHex,
  getOpacity,
  getPalette
} from "visual/component/Options/types/dev/ColorPicker/model";
import * as ColorPicker from "visual/component/Options/types/dev/ColorPicker/model";
import { toBlur, toSpread } from "visual/utils/cssProps";
import { toNumber } from "visual/utils/math";
import {
  setField,
  toggleColor,
  toggleFields,
  toggleType
} from "visual/component/Options/types/dev/BoxShadow/utils";
import { toObject } from "visual/utils/object";
import { toPalette } from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { toHex } from "visual/utils/color/isHex";
import {
  NONE,
  toType
} from "visual/component/Options/types/dev/BoxShadow/entities/type";
import { toOpacity } from "visual/utils/cssProps/opacity";

/**
 * @param {string} orElse
 * @param {object} m
 * @return {string}
 */
export const getType = (orElse, m) => toType(orElse, toObject(m).type);

/**
 * Set box shadow type
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setType = (v, m) => {
  if (undefined === toType(undefined, v) || getType(undefined, m) === v) {
    return m;
  }

  const isNone = v === NONE;
  const setters = [
    [set, "tempType", isNone ? get(undefined, "type", m) : undefined],
    [set, "type", v],
    [toggleFields, !isNone],
    [toggleColor, !isNone]
  ];

  return apply(setters, m);
};

/**
 * Set box shadow opacity
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setOpacity = (v, m) => {
  if (toOpacity(undefined, v) === undefined || getOpacity(undefined, m) === v) {
    return m;
  }

  const enable = v > 0;
  return apply([[ColorPicker.setOpacity, v], [toggleType, enable]], m);
};

/**
 * Set box shadow hex
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setHex = (v, m) => {
  if (toHex(undefined, v) === undefined || getHex(undefined, m) === v) {
    return m;
  }

  const enable = v !== "";
  return apply([[ColorPicker.setHex, v], [toggleType, enable]], m);
};

/**
 * Set box shadow palette
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setPalette = (v, m) => {
  const i = {};
  if (toPalette(i, v) === i || getPalette(i, m) === v) {
    return m;
  }

  const enable = v !== NONE;

  return apply([[ColorPicker.setPalette, v], [toggleType, enable]], m);
};

/**
 * @param {number} orElse
 * @param {object} m
 * @return {number}
 */
export const getBlur = (orElse, m) => toBlur(orElse, toObject(m).blur);

/**
 * Set box shadow blur
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setBlur = (v, m) => setField("blur", v, m);

/**
 * @param {number} orElse
 * @param {object} m
 */
export const getSpread = (orElse, m) => toSpread(orElse, toObject(m).spread);

/**
 * Set box shadow spread
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setSpread = (v, m) => setField("spread", v, m);

/**
 * @param {number} orElse
 * @param {object} m
 */
export const getHorizontal = (orElse, m) =>
  toNumber(orElse, get(orElse, "horizontal", m));

/**
 * Set box shadow horizontal
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setHorizontal = (v, m) => setField("horizontal", v, m);

/**
 * @param {number} orElse
 * @param {object} m
 */
export const getVertical = (orElse, m) =>
  toNumber(orElse, get(orElse, "vertical", m));

/**
 * Set box shadow vertical
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setVertical = (v, m) => setField("vertical", v, m);

export { getHex, getOpacity, getPalette };
