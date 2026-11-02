import type { FontFamilyType } from "visual/types/Fonts";
import type { TextScripts } from "visual/types/Style";
import type { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import type { Weight } from "visual/utils/fonts/Weight";

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
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  uppercase: boolean;
  lowercase: boolean;
  script?: TextScripts;
}
