import { Type } from "./Type";
import { Palette } from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { Blur } from "visual/utils/cssProps/Blur";
import { Spread } from "visual/utils/cssProps/Spread";
import { Hex } from "visual/utils/color/Hex";
import { Opacity } from "visual/utils/cssProps/opacity";

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
  spread: Spread;
  tempSpread: Spread;
  vertical: number;
  tempVertical: number;
  horizontal: number;
  tempHorizontal: number;
}
