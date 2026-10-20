import type { FontFamilyType, VariationFont } from "visual/types/Fonts";
import type { TextScripts } from "visual/types/Style";
import type { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import type { Weight } from "visual/utils/fonts/Weight";
import type { Positive } from "visual/utils/math/Positive";

export interface Value {
  [k: string]: unknown;
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
