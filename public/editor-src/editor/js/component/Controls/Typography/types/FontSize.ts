import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";

export interface FontSize {
  size: number;
  sizeLabel?: string;
  sizeMax: number;
  sizeMin: number;
  sizeStep: number;
  sizeSuffix: SizeSuffix;
  sizeSuffixes: Array<{ title: string; value: SizeSuffix }>;
}
