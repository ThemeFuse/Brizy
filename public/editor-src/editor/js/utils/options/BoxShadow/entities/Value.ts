import type { Hex } from "visual/utils/color/Hex";
import type { Blur } from "visual/utils/cssProps/Blur";
import type { Opacity } from "visual/utils/cssProps/opacity";
import type { Palette } from "visual/utils/options/ColorPicker/entities/palette";
import type { Type } from "./Type";

export interface Value {
  type: Type;
  tempType: Type;
  hex: Hex;
  opacity: Opacity;
  tempOpacity: Opacity;
  palette: Palette;
  tempPalette: Palette;
  blur: Blur;
  tempBlur: Blur;
  spread: number;
  tempSpread: number;
  vertical: number;
  tempVertical: number;
  horizontal: number;
  tempHorizontal: number;
}
