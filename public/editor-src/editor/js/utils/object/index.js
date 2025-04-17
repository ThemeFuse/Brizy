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
 * @param {object=} parentOption
 * @return {*}
 */
export const map = (f, value, parentOption) => {
  if (Array.isArray(value)) {
    return value.map((opt) => f(opt, parentOption));
  }

  if (value && typeof value === "object") {
    return mapValues(value, (opt) => f(opt, value));
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
