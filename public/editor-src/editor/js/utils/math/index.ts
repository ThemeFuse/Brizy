/**
 * Adjust the numeric value in the provided range
 *  - if is lower the min, return min
 *  - if is higher the max, return max
 *  - if is higher the min and lower then max, return number
 *
 * @param {number} number
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
import { MValue } from "visual/utils/value";

export function clamp(number: number, min: number, max: number): number {
  if (number < min) {
    return min;
  }

  if (number > max) {
    return max;
  }

  return number;
}

// was taken here - https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
export function roundTo(num: number, places: number): number {
  return +(Math.round(Number(num + "e+" + places)) + "e-" + places);
}

/**
 * Check is provided value is of type number
 *
 * @param {number} n
 * @returns {boolean}
 */
export const isNumber = (n: unknown): boolean => typeof n === "number";

/**
 * Converts a value to valid number
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {*} v
 * @return {number}
 */
export const toNumber = (v: unknown, orElse?: number): MValue<number> =>
  typeof v === "number" ? v : orElse;

/**
 * Converts value to a positive number
 *  - if value is not a positive number, return orElse
 *
 * @param {number} orElse
 * @param {*} v
 * @return {number}
 */
export const toNonNegative = (v: unknown, orElse?: number): MValue<number> =>
  typeof v === "number" && v >= 0 ? v : orElse;

/**
 * Converts value to a positive number higher then 0
 *  - if value is not a positive number, return orElse
 *
 * @param {number} orElse
 * @param {*} v
 * @return {number}
 */
export const toPositive = (v: unknown, orElse?: number): MValue<number> =>
  typeof v === "number" && v > 0 ? v : orElse;

/**
 * Check if the provided value is in provided range
 *  - if it is, return true
 *  - if it is not, return false
 *  - if the value is not a number, return false
 *
 * @param {number} min
 * @param {number} max
 * @param {number} n
 * @returns {boolean}
 */
export const inRange = (min: number, max: number, n: number): boolean =>
  n >= min && n <= max;
