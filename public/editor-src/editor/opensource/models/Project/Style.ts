import { Literal } from "../common";
import { FontFamilyType } from "./Fonts";

export type PaletteType =
  | "color1"
  | "color2"
  | "color3"
  | "color4"
  | "color5"
  | "color6"
  | "color7"
  | "color8";

export type TextScripts = "" | "super" | "sub";

export interface FontStyle {
  id: string;
  title: string;
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  mobileFontSize: number;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;

  deletable?: "off" | "on";
  deleted?: boolean;
  variableFontWeight?: number;
  fontWidth?: number;
  fontSoftness?: number;
  tabletVariableFontWeight?: number;
  mobileVariableFontWeight?: number;
  tabletFontWidth?: number;
  tabletFontSoftness?: number;
  mobileFontWidth?: number;
  mobileFontSoftness?: number;
  fontSizeSuffix?: string;
  tabletFontSizeSuffix?: string;
  mobileFontSizeSuffix?: string;

  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  script?: TextScripts;
  [k: string]: Literal | boolean | undefined;
}

export interface Palette {
  id: PaletteType;
  hex: string;
}

export interface Style {
  id: string;
  title: string;
  fontStyles: FontStyle[];
  colorPalette: Palette[];
}

export interface ExtraFontStyle extends FontStyle {
  deletable: "on";
}

export type FontStyles = FontStyle | ExtraFontStyle;
