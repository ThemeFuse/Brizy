import { ToValue } from "visual/utils/value";

/**
 * Converts a value to string
 *  - if value is not a string type, return an empty string
 *
 * @param v
 * @param orElse
 * @return {string}
 */
export const toString: ToValue<string> = (v, orElse) =>
  typeof v === "string" ? v : orElse;

/**
 * Checks if value is a valid string ad not empty
 *  - if is valid, return value
 *  - otherwise, return orElse
 */
export const onEmpty: ToValue<string> = (v, orElse) => toString(v) || orElse;

/**
 * Capitalize string
 *
 * @param {string} s
 * @returns {string}
 */
export const capitalize = (s: string): string =>
  s && s[0].toUpperCase() + s.slice(1);

/**
 * Capitalize word depending on prefix
 * - If prefix is empty, do not capitalize
 * - If prefix is not empty capitalize word
 *
 * @param {string} p
 * @param {string} s
 * @returns {string}
 */
export const capByPrefix = (p: string, s: string): string =>
  p === "" ? s : p + capitalize(s);

/**
 * Convert an array of strings in camelCase style string
 *
 * @param {string[]} strings
 * @returns {string}
 */
export const camelCase = (strings: Array<string>): string =>
  strings.reduce(capByPrefix, "");

export const printf = (s: string, ...replacements: Array<string>): string => {
  let i = 0;

  return s.replace(/%s/g, () => replacements[i++]);
};

export const encodeToString = (value: string): string => {
  return encodeURIComponent(JSON.stringify(value));
};

export const decodeFromString = (value: string): object => {
  return JSON.parse(decodeURIComponent(value));
};

export const toHashCode = (value: string): string => {
  let hash = 0;
  let chr;

  for (let i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return String(hash);
};
