/**
 * @typedef {""|"color1"|"color2"|"color3"|"color4"|"color5"|"color6"|"color7"|"color8"} Palette
 */
import * as P from "visual/utils/color/toPalette";
import * as Value from "visual/utils/value";

export const empty = "";

export const palettes = [empty, ...P.palettes];

/**
 * A wrapper for for original `toPalette` function, that consider empty string as a valid palette value.
 *
 * @param {Palette} orElse
 * @param {Palette} v
 * @return {Palette}
 */
export const toPalette = (v, orElse = undefined) =>
  palettes.includes(v) ? v : orElse;

/**
 * @param {Palette} orElse
 * @param {*} v
 * @return {Palette}
 */
export const onEmpty = (v, orElse) =>
  Value.onEmpty(empty, toPalette(v, empty), orElse);
