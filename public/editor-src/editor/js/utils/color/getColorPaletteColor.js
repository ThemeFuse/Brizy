import { getColorPaletteColors } from "./getColorPaletteColors";

export function getColorPaletteColor(id) {
  return getColorPaletteColors().find(color => color.id === id);
}
