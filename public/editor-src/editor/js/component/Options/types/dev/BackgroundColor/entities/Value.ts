import { Palette } from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { Type } from "./Type";
import { GradientType } from "./GradientType";
import { GradientActivePointer } from "./GradientActivePointer";

export type Value = {
  hex: string;
  opacity: number;
  tempOpacity: number;
  palette: Palette;
  tempPalette: Palette;
  hex2: string;
  opacity2: number;
  tempOpacity2: number;
  palette2: Palette;
  tempPalette2: Palette;
  type: Type;
  tempType: Type;
  gradientType: GradientType;
  start: number;
  end: number;
  active: GradientActivePointer;
  linearDegree: number;
  radialDegree: number;
};
