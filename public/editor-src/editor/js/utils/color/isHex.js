const hexRegex = /^#(?:[A-Fa-f0-9]{3}){1,2}$/; // taken from http://stackoverflow.com/questions/32673760/how-can-i-know-if-a-given-string-is-hex-rgb-rgba-or-hsl-color-using-javascipt#answer-32685393

export function isHex(colorString) {
  return hexRegex.test(colorString);
}

/**
 * Converts value to a valid hex string
 *  - If value is not a valid hex, return orElse
 *
 * @param {string} orElse
 * @param {string} v
 * @return {string}
 */
export const toHex = (orElse, v) => (isHex(v) ? v : orElse);
