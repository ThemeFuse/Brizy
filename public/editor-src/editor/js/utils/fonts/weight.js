export const THIN = 100;
export const EXTRA_LIGHT = 200;
export const LIGHT = 300;
export const NORMAL = 400;
export const MEDIUM = 500;
export const SEMI_BOLD = 600;
export const BOLD = 700;
export const EXTRA_BOLD = 800;
export const BLACK = 900;

/**
 *
 * @type {number[]}
 */
export const weights = [
  THIN,
  EXTRA_LIGHT,
  LIGHT,
  NORMAL,
  MEDIUM,
  SEMI_BOLD,
  BOLD,
  EXTRA_BOLD,
  BLACK
];

/**
 * Default font weight value
 *
 * @type {number}
 */
export const empty = NORMAL;

/**
 * Convert a value to valid font weight
 *  - If value is not a valid font weight, return orElse
 *
 * @param {number} orElse
 * @param {*} v
 * @return {number}
 */
export const toWeight = (v, orElse = undefined) =>
  weights.includes(v) ? v : orElse;

/**
 * Convert a value to valid none empty font weight
 *  - If value is not a valid none empty font weight, return orElse
 *
 * @param orElse
 * @param v
 * @return {*}
 */
export const onEmpty = (v, orElse = undefined) =>
  toWeight(v, empty) === empty ? orElse : v;
