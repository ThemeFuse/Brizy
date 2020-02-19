import * as Value from "visual/utils/value";

/**
 * @typedef {"none"|"solid"|"dashed"|"dotted"} BorderStyle
 **/

export const NONE = "none";
export const SOLID = "solid";
export const DASHED = "dashed";
export const DOTTED = "dotted";

/**
 * Represents board style empty value
 * @type {BorderStyle}
 */
export const empty = NONE;

/**
 * @type {BorderStyle[]}
 */
export const styles = [NONE, SOLID, DASHED, DOTTED];

/**
 * Convert a value to valid border style instance
 *  - If value is not a valid boarder style, return orElse
 *
 * @param {BorderStyle} orElse
 * @param {*} v
 * @return {BorderStyle}
 */
export const toStyle = (v, orElse) => (styles.includes(v) ? v : orElse);

/**
 * Check if value is a valid none empty BorderStyle instance
 *  - if is not, return orElse
 *  - otherwise, return value
 *
 * @param {BorderStyle} orElse
 * @param {BorderStyle} v
 * @return {BorderStyle}
 */
export const onEmpty = (v, orElse = undefined) =>
  Value.onEmpty(empty, toStyle(v, empty), orElse);
