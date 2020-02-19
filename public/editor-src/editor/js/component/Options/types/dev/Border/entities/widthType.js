/**
 * @typedef {"grouped"|"ungrouped"} BorderWidthType
 */

import * as Value from "visual/utils/value";

export const GROUPED = "grouped";
export const UNGROUPED = "ungrouped";

/**
 * @type {BorderWidthType[]}
 */
export const types = [GROUPED, UNGROUPED];

/**
 * Represents board width type empty value
 *
 * @type {BorderWidthType}
 */
export const empty = GROUPED;

/**
 * Convert a value to valid border width type instance
 *  - If value is not a valid border width type, return orElse
 *
 * @param {BorderWidthType} orElse
 * @param {*} v
 * @return {BorderWidthType}
 */
export const toType = (v, orElse = undefined) =>
  types.includes(v) ? v : orElse;

/**
 * Check if value is a valid none empty border width type instance
 *  - if is not, return orElse
 *  - otherwise, return value
 *
 * @param {BorderWidthType} orElse
 * @param {BorderWidthType} v
 * @return {BorderWidthType}
 */
export const onEmpty = (v, orElse = undefined) =>
  Value.onEmpty(empty, toType(v, empty), orElse);
