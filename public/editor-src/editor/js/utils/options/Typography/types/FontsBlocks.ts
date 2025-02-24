import { FontFamilyType } from "visual/types/Fonts";
import { FontObject } from "./FontObject";

export type FontsBlock = Partial<{
  config: FontObject[];
  blocks: FontObject[];
  [FontFamilyType.google]: FontObject[];
  [FontFamilyType.upload]: FontObject[];
}>;
