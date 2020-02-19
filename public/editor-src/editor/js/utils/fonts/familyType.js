/**
 * @typedef {"google"|"upload"} FontFamilyType
 */

export const GOOGLE = "google";

export const UPLOAD = "upload";

/**
 * @type {(FontFamilyType)[]}
 */
export const types = [GOOGLE, UPLOAD];

/**
 * Converts value to a valid font family type
 *  - if value is not a valid type, return orElse
 *
 * @param {FontFamilyType} orElse
 * @param {*} v
 * @return {FontFamilyType}
 */
export const toType = (v, orElse) => (types.includes(v) ? v : orElse);
