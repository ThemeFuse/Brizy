import { DividedFonts } from "visual/component/Controls/Typography/types/FontFamily";
import { VariationFont } from "visual/types";
import { Weight } from "visual/utils/fonts/Weight";
import { FontFamilyType } from "visual/utils/fonts/familyType";

export type FontsBlock = Partial<{
  config: Array<FontObject>;
  blocks: Array<FontObject>;
  [FontFamilyType.google]: Array<FontObject>;
  [FontFamilyType.adobe]: Array<FontObject>;
  [FontFamilyType.system]: Array<FontObject>;
  [FontFamilyType.upload]: Array<FontObject>;
}>;

export interface Props {
  addFont?: VoidFunction;
  onChange: (font: FontWithType) => void;
  value: string;
  className?: string;
  addFontLabel: string;
  fonts: DividedFonts;
}
export interface FontSizes {
  default: string;
  great_vibes: string;
  alex_brush: string;
  allura: string;
  parisienne: string;
}

export interface FontObject {
  brizyId?: string;
  family: string;
  id: string;
  title: string;
  weights: number[];
  variations?: VariationFont[];
}

export interface FontWithType {
  id: string;
  type: FontFamilyType;
  weights: Weight[];
}

export interface FontList {
  fonts: Array<FontObject>;
  type: FontFamilyType;
}
