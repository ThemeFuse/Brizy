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
export const toType = (orElse, v) => (types.includes(v) ? v : orElse);

/**
 * @param {string} orElse
 * @param {string} v
 * @return {string}
 */
export const onEmpty = (orElse, v) => {
  const value = toType(empty, v);

  return value === empty ? orElse : v;
};
