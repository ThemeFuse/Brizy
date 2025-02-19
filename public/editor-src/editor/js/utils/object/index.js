import { mapValues } from "es-toolkit";

export { findDeep } from "./findDeep";
export { traverse as objectTraverse } from "./traverse";
export { traverse2 as objectTraverse2 } from "./traverse";
export { objectFromEntries } from "./fromEntries";

/**
 * Map a function over a value
 *  - if value is an array, map function over array items
 *  - if value is an object, map function over object keys values
 *  - otherwise, return value
 *
 * @param {function} f
 * @param {*} value
 * @return {*}
 */
export const map = (f, value) => {
  if (Array.isArray(value)) {
    return value.map(f);
  }

  if (value && typeof value === "object") {
    return mapValues(value, f);
  }

  return value;
};

/**
 * Check if object has own properties
 *
 * @param {string[]} ps properties
 * @param {object} o object
 * @return {boolean}
 */
export const hasProps = (ps, o) =>
  !!(o && ps.every((p) => o.hasOwnProperty(p)));

/**
 * Converts a value to object
 *  - if value is not an object return an empty object
 *
 * @param o
 * @return {*}
 */
export const toObject = (o) => (o !== null && typeof o === "object" ? o : {});
