import { Hex } from "visual/utils/color/Hex";
import { Blur } from "visual/utils/cssProps/Blur";
import { Opacity } from "visual/utils/cssProps/opacity";
import { Palette } from "visual/utils/options/ColorPicker/entities/palette";
import { Type } from "./Type";

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
