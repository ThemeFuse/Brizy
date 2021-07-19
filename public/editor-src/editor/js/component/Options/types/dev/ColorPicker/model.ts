import { _apply, set, setter2 } from "visual/utils/model";
import * as Palette from "./entities/palette";
import { Value } from "./entities/Value";

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
 * Return coloPicker option model opacity
 * - If the value is not a valid opacity value, return the orElse value
 */
export const getOpacity = <V extends Value>(m: V): V["opacity"] => m.opacity;

/**
 * Set opacity value in the colorPicker model.
 *  - If the value is not a valid opacity return the original model
 *  - If current value is equal to new one, return original model
 *  - If opacity == 0, palette value is set to empty
 *  - If opacity == 0, tempPalette takes current palette value
 *  - If opacity == 0, tempOpacity takes current opacity value
 *  - If opacity > 0 and palette == '', palette takes temptPalette value
 */
export const setOpacity = setter2(getOpacity, (v, m) => {
  const p = Palette.append(m.palette, m.tempPalette);

  return _apply(
    [
      [set, "tempOpacity", v === 0 ? getOpacity(m) : undefined],
      [set, "opacity", v],
      [set, "palette", v ? p : ""],
      [set, "tempPalette", !v ? p : undefined]
    ],
    m
  );
});

/**
 * Return coloPicker option model hex
 * - If the value is not a valid hex value, return the orElse value
 */
export const getHex = <V extends Value>(m: V): V["hex"] => m.hex;

/**
 * Set hex value in the colorPicker model.
 *  - If the value is not a valid hex, return the original model
 *  - If the value is equal to current hex,  return the original model
 *  - If opacity == 0, take tempOpacity value
 *  - If palette has value, set to "",
 *  - If palette has value, tempPalette takes palette value
 */
export const setHex = setter2(getHex, (v, m) => {
  return _apply(
    [
      [set, "hex", v],
      [set, "opacity", v ? m.opacity || m.tempOpacity || 1 : 0],
      [set, "tempOpacity", v ? undefined : m.opacity],
      [set, "palette", v ? "" : undefined],
      [set, "tempPalette", v ? "" : undefined]
    ],
    m
  );
});

/**
 * Return color model palette
 * If value is empty, return orElse value
 */
export const getPalette = <V extends Value>(m: V): V["palette"] => m.palette;
/**
 * Set palette value in the colorPicker model.
 *  - If value is not a valid palette, return the original model
 *  - If value is equal to current palette, return the original model
 *  - If value == '', tempPalette takes palette current value
 *  - If opacity == 0, opacity takes tempOpacity value
 */
export const setPalette = setter2(getPalette, (v, m) => {
  const tempPalette = getPalette(m) || m.tempPalette;
  const tempOpacity = getOpacity(m) || m.tempOpacity;

  return _apply(
    [
      [set, "tempPalette", !v ? tempPalette : undefined],
      [set, "palette", v],
      [set, "opacity", v ? getOpacity(m) || tempOpacity : undefined]
    ],
    m
  );
});
