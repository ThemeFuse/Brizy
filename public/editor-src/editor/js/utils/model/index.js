import { onUndefined } from "visual/utils/value";
import { toObject } from "visual/utils/object";
import { toArray } from "visual/utils/array";

/**
 * Return value from model under specific key
 *  - if model is not an object, return orElse
 *  - if model key is missing, return orElse
 *  - if model key is undefined, return orElse
 *
 * @param {*} orElse
 * @param {string} key
 * @param {object} m
 * @return {*}
 */
export const get = (orElse, key, m) => onUndefined(orElse, toObject(m)[key]);

/**
 * Set value under specific key in model
 *  - if value is undefined, return original model
 *
 * @param {string} key
 * @param {*} value
 * @param {object} m
 * @return {object}
 */
export const set = (key, value, m) =>
  value === undefined || value === get(undefined, key, m)
    ? m
    : { ...toObject(m), [key]: value };

/**
 * Apply model to a list of setters
 *
 * @param {[function(m:object, ...a:*):object, args][]} fs
 * @param {object} m
 * @return {object}
 */
export const apply = (fs, m) =>
  toArray(fs).reduce((m, [f, ...args]) => (f && f(...args, m)) || m, m);
