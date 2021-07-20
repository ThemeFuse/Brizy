import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { Weight } from "visual/utils/fonts/Weight";
import { Positive } from "visual/utils/math/Positive";
import { NoEmptyString } from "visual/utils/string/NoEmptyString";

export interface FontStyle {
  fontStyle: NoEmptyString;
}

export interface FontSettings {
  fontSize: Positive;
  fontSizeSuffix: SizeSuffix;
  fontWeight: Weight;
  letterSpacing: number;
  lineHeight: Positive;
  fontStyle: undefined;
}

export interface FontFamily extends FontSettings {
  fontFamily: string;
  fontFamilyType: FontFamilyType;
}

export interface Value
  extends Omit<FontFamily, "fontStyle">,
    Omit<FontSettings, "fontStyle"> {
  fontStyle: undefined | NoEmptyString;
}
