import * as Value from "visual/utils/value";
import { isNumber } from "visual/utils/math";

/**
 * Represents board style empty value
 * @type {number}
 */
export const empty = 0;

/**
 * Convert a value to valid border width instance
 *  - If value is not a valid border width, return orElse
 *
 * @param {number} orElse
 * @param {*} v
 * @return {number}
 */
export const toWidth = (v, orElse = undefined) =>
  isNumber(v) && v >= 0 ? v : orElse;

/**
 * Check if value is a valid none empty border width instance
 *  - if is not, return orElse
 *  - otherwise, return value
 *
 * @param {number} orElse
 * @param {number} v
 * @return {number}
 */
export const onEmpty = (v, orElse) =>
  Value.onEmpty(empty, toWidth(v, empty), orElse);
