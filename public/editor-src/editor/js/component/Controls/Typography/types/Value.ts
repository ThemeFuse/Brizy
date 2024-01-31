import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { Weight } from "visual/utils/fonts/Weight";
import { FontFamilyType } from "visual/utils/fonts/familyType";

export interface Value {
  fontStyle: string;
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontSize: number;
  fontSizeSuffix: SizeSuffix;
  fontWeight: Weight;
  letterSpacing: number;
  lineHeight: number;
  variableFontWeight: number;
  fontWidth: number;
  fontSoftness: number;
}
