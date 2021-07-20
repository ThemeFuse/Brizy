import { pass } from "visual/utils/fp";

export type SpacingUnit = "px" | "%";

export const units = ["px", "%"] as const;

export const is = (s: string): s is SpacingUnit =>
  units.includes(s as SpacingUnit);

export const fromString = pass(is);
