export type DesktopFontsKey =
  | "fontSize"
  | "fontSizeSuffix"
  | "fontWeight"
  | "lineHeight"
  | "letterSpacing";

export type TabletFontsKey =
  | "tabletFontSize"
  | "tabletFontWeight"
  | "tabletLineHeight"
  | "tabletLetterSpacing";

export type MobileFontsKey =
  | "mobileFontSize"
  | "mobileFontWeight"
  | "mobileLineHeight"
  | "mobileLetterSpacing";

export type ResponsiveFont = TabletFontsKey | MobileFontsKey;
export type FontKey = DesktopFontsKey | ResponsiveFont;

export type FontStyles = "fontStyle" | "tabletFontStyle" | "mobileFontStyle";

export type SingleStyles = "fontFamily" | "fontFamilyType";

export type DesktopSimpleKey = "horizontalAlign" | "marginTop" | "marginBottom";
export type TabletSimpleKey =
  | "tabletHorizontalAlign"
  | "tabletMarginTop"
  | "tabletMarginBottom";
export type MobileSimpleKey =
  | "mobileHorizontalAlign"
  | "mobileMarginTop"
  | "mobileMarginBottom";

export type ResponsiveSimpleKey = TabletSimpleKey | MobileSimpleKey;
export type SimpleKey = DesktopSimpleKey | ResponsiveSimpleKey;

export type AllKeys = FontKey | SimpleKey | FontStyles | SingleStyles;
