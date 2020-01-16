import { setOpacity as _setOpacity } from "visual/component/Options/types/dev/ColorPicker/model";

/**
 * @typedef {{
 *   hex: string,
 *   opacity: number,
 *   tempOpacity: number,
 *   palette: string,
 *   tempPalette: string,
 * }} Color
 */

/**
 * Alias to api.setOpacity with one exception. The tempOpacity will be updated only if `final` parameter is true
 *
 * @param {number} n
 * @param {Color} v
 * @param {boolean} final
 * @returns {Color}
 */
export const setOpacity = (n, v, final) => ({
  ..._setOpacity(n, v),
  tempOpacity: n !== 0 && final ? v.opacity : v.tempOpacity
});
