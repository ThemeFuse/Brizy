import type { FontFamilyType } from "visual/types/Fonts";
import type { Weight } from "visual/utils/fonts/Weight";

export interface Font {
  id: string;
  type: FontFamilyType;
  weights: Weight[];
}
