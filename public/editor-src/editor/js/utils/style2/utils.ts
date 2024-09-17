import { isNullish } from "visual/utils/value";
import { GradientCssDeclaration } from "./types";

export const gradientCssDeclaration = (
  data: GradientCssDeclaration
): string => {
  const {
    colorType,
    gradientType,
    gradientLinearDegree,
    gradientRadialDegree,
    gradientStartPointer,
    gradientFinishPointer,
    gradientColor,
    bgColor
  } = data;

  if (Object.values(data).some(isNullish) || colorType !== "gradient")
    return "none";

  const isLinear = gradientType === "linear";
  const gradientValue = `${
    isLinear ? `${gradientLinearDegree}deg` : `${gradientRadialDegree}px`
  }, ${bgColor} ${gradientStartPointer}%, ${gradientColor} ${gradientFinishPointer}%`;

  return isLinear
    ? `linear-gradient(${gradientValue})`
    : `radial-gradient(circle ${gradientValue})`;
};

export const isCustomFontStyle = (style: string): boolean =>
  style === "" || style === "custom";
