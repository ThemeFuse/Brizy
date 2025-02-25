import { Fonts } from "./Fonts";
import { ExtraFontStyle, Style } from "./Style";

export interface Project {
  id: string;
  dataVersion: number;
  data: {
    selectedKit: string;
    selectedStyle: string;
    styles: Style[];
    extraStyles: Style[];
    extraFontStyles: ExtraFontStyle[];
    font: string;
    fonts: Fonts;
    disabledElements: string[];
    pinnedElements: string[];
  };
}
