import { toArray } from "visual/utils/array";

/**
 * Capitalize string
 *
 * @param {string} s
 * @returns {string}
 */
export const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

/**
 * Capitalize word depending on prefix
 * - If prefix is empty, do not capitalize
 * - If prefix is not empty capitalize word
 *
 * @param {string} p
 * @param {string} s
 * @returns {string}
 */
export const capByPrefix = (p, s) => (p === "" ? s : p + capitalize(s));

/**
 * Convert an array of strings in camelCase style string
 *
 * @param {string[]} strings
 * @returns {string}
 */
export const camelCase = strings => toArray(strings).reduce(capByPrefix, "");

export const printf = (s, ...replacements) => {
  let i = 0;

  return s.replace(/%s/g, () => replacements[i++]);
};

export const encodeToString = value => {
  return encodeURIComponent(JSON.stringify(value));
};

export const decodeFromString = value => {
  return JSON.parse(decodeURIComponent(value));
};
