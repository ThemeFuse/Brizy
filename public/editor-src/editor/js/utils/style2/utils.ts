import { GradientCssDeclaration } from "./types";

export const gradientCssDeclaration = ({
  colorType,
  gradientType,
  gradientLinearDegree,
  gradientRadialDegree,
  gradientStartPointer,
  gradientFinishPointer,
  gradientColor,
  bgColor
}: GradientCssDeclaration) => {
  if (colorType !== "gradient") return "none";

  const isLinear = gradientType === "linear";
  const gradientValue = `${
    isLinear ? `${gradientLinearDegree}deg` : `${gradientRadialDegree}px`
  }, ${bgColor} ${gradientStartPointer}%, ${gradientColor} ${gradientFinishPointer}%`;

  return isLinear
    ? `linear-gradient(${gradientValue})`
    : `radial-gradient(circle ${gradientValue})`;
};
