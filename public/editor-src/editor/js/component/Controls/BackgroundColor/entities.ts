export type Type = "none" | "solid" | "gradient";
export type GradientType = "linear" | "radial";

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
};

export type Meta = {
  isChanged: keyof Value;
  opacityDragEnd?: boolean;
};
