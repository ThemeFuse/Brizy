import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { Weight } from "visual/utils/fonts/Weight";
import { Positive } from "visual/utils/math/Positive";

export interface Value {
  fontStyle: string;
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontSize: Positive;
  fontSizeSuffix: SizeSuffix;
  fontWeight: Weight;
  letterSpacing: number;
  lineHeight: Positive;
}
