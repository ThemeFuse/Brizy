import { getStore } from "visual/redux/store";
import { currentStyleSelector } from "visual/redux/selectors";

export function getColorPaletteColors() {
  return currentStyleSelector(getStore().getState()).colorPalette;
}
