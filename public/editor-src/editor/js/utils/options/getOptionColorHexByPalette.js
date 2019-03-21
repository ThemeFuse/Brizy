import { getColorPaletteColor } from "visual/utils/color";

export function getOptionColorHexByPalette(hex, palette) {
  if (palette) {
    const paletteColor = getColorPaletteColor(palette);
    hex = paletteColor.hex;
  }

  return { hex };
}
