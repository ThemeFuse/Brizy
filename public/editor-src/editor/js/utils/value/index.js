/**
 * Return orElse value in case v parameter is undefined
 *
 * @param {*} orElse
 * @param {*} v
 * @return {*}
 */
export const onUndefined = (orElse, v) => (undefined === v ? orElse : v);

/**
 * Check if value is not an empty value
 * Empty value is considered undefined, and user specified value
 *  - If value is undefined, return orElse
 *  - If value is equal to specified value, return orElse
 *  - otherwise, return value
 *
 * @param {*} empty
 * @param {*} orElse
 * @param {*} v
 * @return {*}
 */
export const onEmpty = (empty, orElse, v) =>
  v !== undefined && v !== empty ? v : orElse;
