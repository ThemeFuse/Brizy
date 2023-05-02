import { FontFamilyType } from "../types/fonts/familyType";
import { Weight } from "../types/fonts/weight";

export type FontsBlock = Partial<{
  config: Array<FontObject>;
  blocks: Array<FontObject>;
  [FontFamilyType.google]: Array<FontObject>;
  [FontFamilyType.upload]: Array<FontObject>;
}>;

export interface Props {
  addFont?: VoidFunction;
  onChange: (font: FontWithType) => void;
  value: string;
  className?: string;
  addFontLabel?: string;
  fonts: FontsBlock;
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
  weights: Array<Weight>;
}

export interface FontWithType {
  id: string;
  type: FontFamilyType;
  weights: Array<Weight>;
}

export interface FontList {
  fonts: Array<FontObject>;
  type: FontFamilyType;
}
