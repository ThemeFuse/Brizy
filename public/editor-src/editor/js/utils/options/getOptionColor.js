import { getColorPaletteColor } from "visual/utils/color";

export function getOptionColor(v, prefix) {
  let hex = v[`${prefix}Hex`];
  let palette = v[`${prefix}Palette`];

  if (palette) {
    const paletteColor = getColorPaletteColor(palette);
    hex = paletteColor.hex;
  }

  return { hex };
}
