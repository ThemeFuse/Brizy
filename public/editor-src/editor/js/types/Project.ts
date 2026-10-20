import type { Fonts } from "./Fonts";
import type { ExtraFontStyle, Style } from "./Style";

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
    editorVersion?: string;
  };
}
