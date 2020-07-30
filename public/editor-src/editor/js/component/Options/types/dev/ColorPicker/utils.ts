import { _apply, get, Setter } from "visual/utils/model";
import * as ColorPicker from "./model";
import { Value } from "visual/component/Options/types/dev/ColorPicker/entities/Value";
import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import { MValue } from "visual/utils/value";

/**
 * Alias to api.setOpacity with one exception. The tempOpacity will be updated only if `final` parameter is true
 */
export const setOpacity = <V extends Value>(
  setOpacity: Setter<number, V>,
  n: number,
  m: V,
  final: boolean
): V => ({
  ...setOpacity(n, m),
  tempOpacity: n !== 0 && final ? m.opacity : m.tempOpacity
});

/**
 * Toggles shadow type
 *  - on enable, set opacity to the latest non empty value
 *  - on disable, set type to 0
 */
export const toggleColor = (enable: boolean, m: Value): Value => {
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

export const paletteHex = (
  id: PaletteObject["id"],
  palettes: PaletteObject[]
): MValue<string> => palettes.find(p => p.id === id)?.hex;
