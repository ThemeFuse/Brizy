import { getStore } from "visual/redux/store";

export function getColorPaletteColors() {
  return getStore().getState().styles.colorPalette;
}
