import { isNumber } from "visual/utils/math";

/**
 * Converts a value to valid CSS blur value
 *  - Value should be a number
 *  - Value should be >= 0
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {number} v
 * @returns {number}
 */
export const toBlur = (orElse, v) => (isNumber(v) && v >= 0 ? v : orElse);

/**
 * Converts a value to valid CSS spread value
 *  - Value should be a number
 *  - Value should be >= 0
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {number} v
 * @returns {number}
 */
export const toSpread = toBlur;
