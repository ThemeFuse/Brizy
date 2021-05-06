import { FontFamilyType } from "visual/utils/fonts/familyType";
import { Weight } from "visual/utils/fonts/Weight";

export interface Font {
  id: string;
  type: FontFamilyType;
  weights: Weight[];
}
