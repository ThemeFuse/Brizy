import { VariationFont } from "visual/types/Fonts";
import { FontFamilyType } from "visual/types/Fonts";
import { TextScripts } from "visual/types/Style";
import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
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
