import { FontObject } from "./FontObject";
import { FontFamilyType } from "visual/utils/fonts/familyType";

export type FontsBlock = Partial<{
  config: FontObject[];
  blocks: FontObject[];
  [FontFamilyType.google]: FontObject[];
  [FontFamilyType.upload]: FontObject[];
}>;
