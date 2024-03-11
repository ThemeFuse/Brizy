import { PaletteObject } from "visual/component/Controls/ColorPalette/entities/PaletteObject";
import { Hex } from "visual/utils/color/Hex";
import { Opacity } from "visual/utils/cssProps/opacity";
import { Setter, _apply, get } from "visual/utils/model";
import { Value } from "visual/utils/options/ColorPicker/entities/Value";
import { MValue } from "visual/utils/value";
import * as ColorPicker from "./model";

/**
 * Alias to api.setOpacity with one exception. The tempOpacity will be updated only if `final` parameter is true
 */
export const setOpacity = <V extends Value>(
  setOpacity: Setter<Opacity, V>,
  n: Opacity,
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
): MValue<Hex> => palettes.find((p) => p.id === id)?.hex;
