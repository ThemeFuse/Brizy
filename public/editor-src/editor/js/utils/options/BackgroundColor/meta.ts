import { ToMeta } from "visual/component/Options/Type";
import type { Value } from "./entities/Value";

export interface Meta {
  isDisabled: boolean;
  isSolid: boolean;
  isGradient: boolean;
  isLinearGradient: boolean;
  isRadialGradient: boolean;
  isAnimatedGradient: boolean;
}

const isDisabled = (m: Value): boolean => m.type === "none" || !m.type;
const isSolid = (m: Value): boolean => m.type === "solid";
const isGradient = (m: Value): boolean => m.type === "gradient";
const isAnimatedGradient = (m: Value): boolean =>
  m.type === "animated-gradient";
const isLinearGradient = (m: Value): boolean =>
  isGradient(m) && m.gradientType === "linear";
const isRadialGradient = (m: Value): boolean =>
  isGradient(m) && m.gradientType === "radial";

export const toMeta: ToMeta<"backgroundColor"> = (m) => ({
  isDisabled: isDisabled(m),
  isSolid: isSolid(m),
  isGradient: isGradient(m),
  isAnimatedGradient: isAnimatedGradient(m),
  isLinearGradient: isLinearGradient(m),
  isRadialGradient: isRadialGradient(m)
});
