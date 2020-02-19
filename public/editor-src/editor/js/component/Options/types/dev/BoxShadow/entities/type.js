export const NONE = "none";
export const INSET = "inset";
export const OUTSET = "outset";
export const types = [NONE, INSET, OUTSET];

export const empty = NONE;

/**
 * @param {string} orElse
 * @param {string} v
 * @return {string}
 */
export const toType = (v, orElse = undefined) =>
  types.includes(v) ? v : orElse;

/**
 * @param {string} orElse
 * @param {string} v
 * @return {string}
 */
export const onEmpty = (orElse, v) => {
  const value = toType(v, empty);

  return value === empty ? orElse : v;
};
