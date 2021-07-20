import { isNumber, toNumber } from "visual/utils/math";

/**
 * Converts a value to valid CSS blur value
 *  - Value should be a number
 *  - Value should be >= 0
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {*} v
 * @returns {number}
 *
 * @deprecated, use utils/cssProps/Blur.fromNumber
 */
export const toBlur = (v, orElse = undefined) =>
  isNumber(v) && v >= 0 ? v : orElse;

/**
 * Converts a value to valid CSS spread value
 *  - Value should be a number
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {*} v
 * @returns {number}
 *
 * @deprecated, use utils/cssProps/Spread.fromNumber
 */
export const toSpread = toNumber;
