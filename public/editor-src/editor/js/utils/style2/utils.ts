import { isNullish } from "visual/utils/value";
import { clamp } from "../math";
import { GradientCssDeclaration, GradientStop } from "./types";

export const styleAnimatedGradient = (
  gradientStops: GradientStop[],
  gradientSpeed: number,
  gradientLinearDegree: number
): string => {
  const gradientLength = gradientStops.length;

  if (!gradientLength) {
    return "none";
  }

  const gradientValues = gradientStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  const MAX_SPEED = gradientLength * 10;
  const backgroundSize = gradientLength * 60;
  const hasGradientSpeed = gradientSpeed && gradientSpeed > 0;
  const normalizedGradientSpeed = hasGradientSpeed
    ? clamp(gradientSpeed, 1, MAX_SPEED)
    : 0;
  const speed = hasGradientSpeed ? MAX_SPEED / normalizedGradientSpeed : 0;
  const animation = hasGradientSpeed
    ? `gradient-animation ${speed}s ease infinite`
    : "none";

  const backgroundSizeValue = hasGradientSpeed
    ? `${backgroundSize}% ${backgroundSize}%`
    : "auto";

  return `linear-gradient(${gradientLinearDegree}deg, ${gradientValues}); animation:${animation}; background-size: ${backgroundSizeValue}`;
};

export const gradientCssDeclaration = (
  _data: GradientCssDeclaration
): string => {
  const { gradientSpeed = 1, gradientStops = [], ...data } = _data;
  const {
    colorType,
    gradientType,
    gradientLinearDegree = 0,
    gradientRadialDegree,
    gradientStartPointer,
    gradientFinishPointer,
    gradientColor,
    bgColor
  } = data;

  const isAnimatedGradient = colorType === "animated-gradient";
  const isGradient = colorType === "gradient";

  if (
    Object.values(data).some(isNullish) ||
    !(isGradient || isAnimatedGradient)
  ) {
    return "none";
  }

  if (isGradient) {
    const isLinear = gradientType === "linear";
    const gradientValue = `${
      isLinear ? `${gradientLinearDegree}deg` : `${gradientRadialDegree}px`
    }, ${bgColor} ${gradientStartPointer}%, ${gradientColor} ${gradientFinishPointer}%`;

    return isLinear
      ? `linear-gradient(${gradientValue})`
      : `radial-gradient(circle ${gradientValue})`;
  }

  return styleAnimatedGradient(
    gradientStops,
    gradientSpeed,
    gradientLinearDegree
  );
};

export const isCustomFontStyle = (style: string): boolean =>
  style === "" || style === "custom";
