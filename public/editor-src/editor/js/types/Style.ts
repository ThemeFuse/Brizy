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

export enum TextScripts {
  "None" = "",
  "Super" = "super",
  "Sub" = "sub"
}

export interface FontTransform {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  uppercase: boolean;
  lowercase: boolean;
  script?: TextScripts;
}

export interface FontStyle extends FontTransform {
  deletable: "off" | "on";
  deleted?: boolean;
  id: string;
  title: string;
  fontFamily: string;
  fontFamilyType: FontFamilyType;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  variableFontWeight?: number;
  fontWidth?: number;
  fontSoftness?: number;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  tabletVariableFontWeight?: number;
  tabletFontWidth?: number;
  tabletFontSoftness?: number;
  mobileFontSize: number;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;
  mobileVariableFontWeight?: number;
  mobileFontWidth?: number;
  mobileFontSoftness?: number;
  fontSizeSuffix?: string;
  tabletFontSizeSuffix?: string;
  mobileFontSizeSuffix?: string;
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
