import { FontFamilyType, VariationFont } from "visual/types/Fonts";

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
  fonts: FontsBlock;
  isAddNewFontDisabled?: boolean;
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


export type FontWithType = FontObject & {
  type: FontFamilyType;
};
