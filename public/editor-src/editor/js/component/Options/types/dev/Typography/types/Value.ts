import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { Weight } from "visual/utils/fonts/Weight";
import { Positive } from "visual/utils/math/Positive";

export interface FontStyle {
  fontStyle: string;
}

export interface FontFamily {
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontWeight: Weight;
}

export interface FontSettings {
  fontSize: Positive;
  fontSizeSuffix: SizeSuffix;
  fontWeight: Weight;
  letterSpacing: number;
  lineHeight: Positive;
}

export interface Value extends FontFamily, FontSettings, FontStyle {}
