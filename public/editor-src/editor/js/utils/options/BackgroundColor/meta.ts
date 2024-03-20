import { ToMeta } from "visual/component/Options/Type";
import type { Value } from "./entities/Value";

export interface Meta {
  isDisabled: boolean;
  isSolid: boolean;
  isGradient: boolean;
  isLinearGradient: boolean;
  isRadialGradient: boolean;
}

const isDisabled = (m: Value): boolean => m.type === "none" || !m.type;
const isSolid = (m: Value): boolean => m.type === "solid";
const isGradient = (m: Value): boolean => m.type === "gradient";
const isLinearGradient = (m: Value): boolean =>
  isGradient(m) && m.gradientType === "linear";
const isRadialGradient = (m: Value): boolean =>
  isGradient(m) && m.gradientType === "radial";

export const toMeta: ToMeta<"backgroundColor"> = (m) => ({
  isDisabled: isDisabled(m),
  isSolid: isSolid(m),
  isGradient: isGradient(m),
  isLinearGradient: isLinearGradient(m),
  isRadialGradient: isRadialGradient(m)
});
