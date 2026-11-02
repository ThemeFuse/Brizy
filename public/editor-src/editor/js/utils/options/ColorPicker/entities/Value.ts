import type { Hex } from "visual/utils/color/Hex";
import type { Opacity } from "visual/utils/cssProps/opacity";
import type { Palette } from "./palette";

export type Value = {
  hex: Hex;
  opacity: Opacity;
  tempOpacity: Opacity;
  palette: Palette;
  tempPalette: Palette;
};
