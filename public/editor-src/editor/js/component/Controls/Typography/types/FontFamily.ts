import { Weight } from "visual/utils/fonts/Weight";
import { FontFamilyType } from "visual/utils/fonts/familyType";

export type FontsBlock = Partial<{
  config: Array<FontObject>;
  blocks: Array<FontObject>;
  [FontFamilyType.google]: Array<FontObject>;
  [FontFamilyType.upload]: Array<FontObject>;
}>;

export interface FontFamily {
  font: string;
  fontAddLabel: string;
  showFontFamily?: boolean;
  fonts: FontsBlock;
  fontAdd?: VoidFunction;
}

export interface FontObject {
  brizyId?: string;
  family: string;
  id: string;
  title: string;
  weights: Weight[];
}

export interface Font {
  id: string;
  type: FontFamilyType;
  weights: Weight[];
}
