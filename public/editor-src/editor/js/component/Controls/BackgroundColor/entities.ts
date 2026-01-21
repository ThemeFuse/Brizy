export type Type = "none" | "solid" | "gradient" | "animated-gradient";
export type GradientType = "linear" | "radial";

export type GradientStop = {
  position: number;
  hex: string;
  opacity: number;
  palette: string;
};

export type Value = {
  hex: string;
  palette: string;
  opacity: number;
  type: Type;
  gradientType: GradientType;
  start: number;
  end: number;
  active: "start" | "end";
  degree: number;
  // For animated gradients with multiple stops
  gradientSpeed?: number;
  gradientStops?: GradientStop[];
  activeStopIndex?: number;
  gradientHex?: string;
  gradientOpacity?: number;
  gradientPalette?: string;
};

export type Meta = {
  isChanged: keyof Value;
  isChanging?: boolean;
};
