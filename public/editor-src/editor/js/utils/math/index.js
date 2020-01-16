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
export function clamp(number, min, max) {
  if (number < min) {
    return min;
  }

  if (number > max) {
    return max;
  }

  return number;
}

// was taken here - https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
export function roundTo(num, places) {
  return +(Math.round(num + "e+" + places) + "e-" + places);
}

/**
 * Check is provided value is of type number
 *
 * @param {number} n
 * @returns {boolean}
 */
export const isNumber = n => typeof n === "number";

/**
 * Converts a value to valid number
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {number} n
 * @return {number}
 */
export const toNumber = (orElse, n) => (isNumber(n) ? n : orElse);

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
export const inRange = (min, max, n) => isNumber(n) && n >= min && n <= max;
