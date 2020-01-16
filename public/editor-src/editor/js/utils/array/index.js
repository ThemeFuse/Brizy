export { flatMap } from "./flatMap";

/**
 * Check is the values is an array.
 *  - if it is, return that value
 *  - otherwise, return an empty array
 *
 * @param a
 * @return {Array}
 */
export const toArray = a => (Array.isArray(a) ? a : []);

/**
 * Return a predefined value in case the array is empty
 *
 * @param {*} orElse
 * @param {array} a
 * @return {array|*}
 */
export const onEmpty = (orElse, a) => (toArray(a).length > 0 ? a : orElse);
