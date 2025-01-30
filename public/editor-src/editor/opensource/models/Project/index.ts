import { Fonts } from "./Fonts";
import { ExtraFontStyle, Style } from "./Style";

export interface Project {
  selectedKit: string;
  selectedStyle: string;
  styles: Style[];
  font: string;
  fonts: Fonts;
  extraFontStyles?: ExtraFontStyle[];
  extraStyles?: Style[];
  disabledElements?: string[];
  pinnedElements?: string[];
}
