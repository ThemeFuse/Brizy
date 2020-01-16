export const COLOR1 = "color1";
export const COLOR2 = "color2";
export const COLOR3 = "color3";
export const COLOR4 = "color4";
export const COLOR5 = "color5";
export const COLOR6 = "color6";
export const COLOR7 = "color7";
export const COLOR8 = "color8";

export const palettes = [
  COLOR1,
  COLOR2,
  COLOR3,
  COLOR4,
  COLOR5,
  COLOR6,
  COLOR7,
  COLOR8
];

/**
 * Converts a valid to a valid palette value
 * - If the value is not a valid palette value return orElse
 *
 * @param {string} orElse
 * @param {string} v
 * @returns {string}
 */
export const toPalette = (orElse, v) => (palettes.includes(v) ? v : orElse);
