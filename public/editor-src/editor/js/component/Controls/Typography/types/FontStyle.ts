import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";

export interface FontStyle {
  style: string;
  styleLabel?: string;
  styleOpenSettings?: VoidFunction;
  styles: Array<StylesCustom | Styles>;
}

interface StylesCustom {
  id: string;
  title: string;
}

interface Styles extends StylesMobile, StylesTablet {
  deletable: string;
  fontFamily: string;
  fontFamilyType: string;
  fontSize: number;
  fontSizeSuffix: SizeSuffix;
  fontWeight: number;
  id: string;
  letterSpacing: number;
  lineHeight: number;
  title: string;
}

interface StylesTablet {
  tabletFontSize: number;
  tabletFontSizeSuffix: string;
  tabletFontWeight: number;
  tabletLetterSpacing: number;
  tabletLineHeight: number;
}
interface StylesMobile {
  mobileFontSize: number;
  mobileFontSizeSuffix: string;
  mobileFontWeight: number;
  mobileLetterSpacing: number;
  mobileLineHeight: number;
}
