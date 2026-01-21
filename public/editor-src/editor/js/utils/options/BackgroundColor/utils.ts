import { Value as BgValue } from "visual/component/Controls/BackgroundColor/entities";
import { inRange } from "visual/utils/math/";
import * as Num from "visual/utils/math/number";
import { Value } from "visual/utils/options/BackgroundColor/entities/Value";
import { Value as Color } from "visual/utils/options/ColorPicker/entities/Value";
import { Reader } from "visual/utils/types/Type";
import { mApply } from "visual/utils/value";

export const toBgControlValue = (v: Value): BgValue => {
  const isEnd = v.type === "gradient" && v.active === "end";
  return {
    hex: isEnd ? v.gradientHex : v.hex,
    opacity: isEnd ? v.gradientOpacity : v.opacity,
    palette: isEnd ? v.gradientPalette : v.palette,
    type: v.type,
    start: v.start,
    end: v.end,
    active: v.active,
    degree: v.gradientType === "radial" ? v.linearDegree : v.linearDegree,
    gradientType: v.gradientType,
    gradientSpeed: v.gradientSpeed,
    gradientStops: v.gradientStops,
    activeStopIndex: v.activeStopIndex,
    gradientHex: v.gradientHex,
    gradientOpacity: v.gradientOpacity,
    gradientPalette: v.gradientPalette
  };
};

export const gradientToColor = (v: Value): Color => ({
  hex: v.gradientHex,
  opacity: v.gradientOpacity,
  tempOpacity: v.tempGradientOpacity,
  palette: v.gradientPalette,
  tempPalette: v.tempGradientPalette
});

export const colorToGradient = (
  v: Color
): {
  gradientHex: Value["gradientHex"];
  gradientOpacity: Value["gradientOpacity"];
  tempGradientOpacity: Value["tempGradientOpacity"];
  gradientPalette: Value["gradientPalette"];
  tempGradientPalette: Value["tempGradientPalette"];
} => ({
  gradientHex: v.hex,
  gradientOpacity: v.opacity,
  tempGradientOpacity: v.tempOpacity,
  gradientPalette: v.palette,
  tempGradientPalette: v.tempPalette
});

export const readPercent: Reader<number> = (v) =>
  mApply((v) => (inRange(0, 100, v) ? v : undefined), Num.read(v));
