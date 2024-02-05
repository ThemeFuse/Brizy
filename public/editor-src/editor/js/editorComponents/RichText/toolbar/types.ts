export enum ColorOption {
  Color = "Color",
  Background = "Background"
}

export interface Value {
  [key: string]: unknown;
}

export interface GradientValue {
  startHex?: string;
  startOpacity?: string;
  finishOpacity?: string;
  startPalette?: string;
  finishPalette?: string;
  finishHex?: string;
  startPointer?: string;
  finishPointer?: string;
  activePointer?: string;
  type: "linear-gradient" | "radial-gradient";
  linearAngle?: string;
  radialPosition?: string;
}

export interface GradientBgValues {
  background: null;
  textBgColorPalette?: string;
  textBackgroundGradient: GradientValue;
}

export interface GradientColorValues {
  color?: string;
  colorPalette?: string;
  backgroundGradient: GradientValue;
  opacity: null;
}

export interface ColorBgValues {
  textBackgroundGradient: null;
  textBgColorPalette?: string;
  background?: string;
}

export interface ColorValues {
  backgroundGradient: null;
  opacity: null;
  color?: string;
  colorPalette?: string;
}

export interface HexToString {
  palette: string;
  opacity: string;
  hex: string;
}
