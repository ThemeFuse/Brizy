import { Reader } from "visual/utils/types/Type";

export type GradientType = "linear" | "radial";

export const read: Reader<GradientType> = v =>
  v === "linear" || v === "radial" ? v : undefined;
