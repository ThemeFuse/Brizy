import { VariationFont } from "visual/types";
import { Weight } from "visual/utils/fonts/Weight";
import { FontFamilyType } from "visual/utils/fonts/familyType";

export type FontsBlock = Partial<{
  config: Array<FontObject>;
  blocks: Array<FontObject>;
  [FontFamilyType.google]: Array<FontObject>;
  [FontFamilyType.adobe]: Array<FontObject>;
  [FontFamilyType.upload]: Array<FontObject>;
  [FontFamilyType.system]: Array<FontObject>;
}>;

export interface DividedFonts {
  variableFonts: FontObject[];
  normalFonts: FontsBlock;
}

export interface FontFamily {
  font: string;
  fontAddLabel: string;
  showFontFamily?: boolean;
  fonts: DividedFonts;
  fontAdd?: VoidFunction;
}

export interface FontObject {
  brizyId?: string;
  family: string;
  id: string;
  title: string;
  weights: Weight[];
  variations?: VariationFont[];
}

export interface Font {
  id: string;
  type: FontFamilyType;
  weights: Weight[];
}
