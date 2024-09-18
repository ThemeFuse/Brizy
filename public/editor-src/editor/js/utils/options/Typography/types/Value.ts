import { TextScripts, VariationFont } from "visual/types";
import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { Weight } from "visual/utils/fonts/Weight";
import { FontFamilyType } from "visual/utils/fonts/familyType";
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
  variableFontWeight: number;
  fontWidth: number;
  fontSoftness: number;
  variations?: VariationFont[];
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  uppercase: boolean;
  lowercase: boolean;
  script?: TextScripts;
}
