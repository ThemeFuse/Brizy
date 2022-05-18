import { Positive } from "visual/utils/math/Positive";

export interface Value {
  hue: number;
  saturation: Positive;
  brightness: Positive;
  contrast: Positive;
}
