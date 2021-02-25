import { Palette } from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { Type } from "./Type";
import { GradientType } from "./GradientType";
import { GradientActivePointer } from "./GradientActivePointer";
import { Hex } from "visual/utils/color/Hex";
import { Opacity } from "visual/utils/cssProps/opacity";

export type Value = {
  hex: Hex;
  opacity: Opacity;
  tempOpacity: Opacity;
  palette: Palette;
  tempPalette: Palette;
  gradientHex: Hex;
  gradientOpacity: Opacity;
  tempGradientOpacity: Opacity;
  gradientPalette: Palette;
  tempGradientPalette: Palette;
  type: Type;
  tempType: Type;
  gradientType: GradientType;
  start: number;
  end: number;
  active: GradientActivePointer;
  linearDegree: number;
  radialDegree: number;
};
