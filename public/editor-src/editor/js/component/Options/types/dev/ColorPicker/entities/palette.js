import * as P from "visual/utils/color/toPalette";
import * as Value from "visual/utils/value";

export const empty = "";

export const palettes = [empty, ...P.palettes];

/**
 * A wrapper for for original `toPalette` function, that consider empty string as a valid palette value.
 *
 * @param {string} orElse
 * @param {string} v
 * @return {string}
 */
export const toPalette = (orElse, v) => (palettes.includes(v) ? v : orElse);

/**
 * @param {string} orElse
 * @param {string} v
 * @return {string}
 */
export const onEmpty = (orElse, v) =>
  Value.onEmpty(empty, orElse, toPalette(empty, v));
