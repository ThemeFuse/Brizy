/**
 * @typedef {{
 *   hex: string,
 *   opacity: number,
 *   tempOpacity: number,
 *   palette: string,
 *   tempPalette: string,
 * }} Color
 */

import { _apply, get } from "visual/utils/model";
import * as ColorPicker from "./model";

/**
 * Alias to api.setOpacity with one exception. The tempOpacity will be updated only if `final` parameter is true
 *
 * @param {Setter} setOpacity
 * @param {number} n
 * @param {Color} m
 * @param {boolean} final
 * @returns {Color}
 */
export const setOpacity = (setOpacity, n, m, final) => ({
  ...setOpacity(n, m),
  tempOpacity: n !== 0 && final ? m.opacity : m.tempOpacity
});

/**
 * Toggles shadow type
 *  - on enable, set opacity to the latest non empty value
 *  - on disable, set type to 0
 *
 * @param {boolean} enable
 * @param {object} m
 * @return {object}
 */
export const toggleColor = (enable, m) => {
  const opacity = enable
    ? ColorPicker.getOpacity(m) || get("tempOpacity", m)
    : 0;
  const palette = enable
    ? ColorPicker.getPalette(m) || get("tempPalette", m)
    : "";

  return _apply(
    [
      [ColorPicker.setOpacity, opacity],
      [ColorPicker.setPalette, palette]
    ],
    m
  );
};
