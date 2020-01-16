import { inRange } from "visual/utils/math";
import * as Value from "visual/utils/value";

export const empty = 0;

/**
 * Converts a value to valid CSS opacity value
 *  - Value should be a number
 *  - Value should be >= 0
 *  - Value should be <= 1
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {number} v
 * @returns {number}
 */
export const toOpacity = (orElse, v) => (inRange(0, 1, v) ? v : orElse);

/**
 * Check if value is a valid opacity type and if it is not 0
 * - If value is a non empty opacity value, return value
 * - If value is empty, return orElse
 *
 * @param {number} orElse
 * @param {number} v
 * @return {number}
 */
export const onEmpty = (orElse, v) =>
  Value.onEmpty(empty, orElse, toOpacity(undefined, v));
