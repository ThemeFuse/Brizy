import { defaultValueValue } from "visual/utils/onChange";
import { getColor } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleBgGradient({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  const bgColorType = dvv("bgColorType");
  const gradientType = dvv("gradientType");

  const bgColorHex = dvv("bgColorHex");
  const bgColorPalette = dvv("bgColorPalette");

  const gradientColorHex = dvv("gradientColorHex");
  const gradientColorPalette = dvv("gradientColorPalette");

  const bgColorOpacity = dvv("bgColorOpacity");
  const gradientColorOpacity = dvv("gradientColorOpacity");

  const gradientStartPointer = dvv("gradientStartPointer");
  const gradientFinishPointer = dvv("gradientFinishPointer");

  const gradientLinearDegree = dvv("gradientLinearDegree");
  const gradientRadialDegree = dvv("gradientRadialDegree");

  const bgColor = getColor(bgColorPalette, bgColorHex, bgColorOpacity);
  const bgGradientColor = getColor(
    gradientColorPalette,
    gradientColorHex,
    gradientColorOpacity
  );

  return bgColorType === "gradient"
    ? gradientType === "linear"
      ? `linear-gradient(${gradientLinearDegree}deg, ${bgColor} ${gradientStartPointer}%, ${bgGradientColor} ${gradientFinishPointer}%)`
      : `radial-gradient(circle ${gradientRadialDegree}px, ${bgColor} ${gradientStartPointer}%, ${bgGradientColor} ${gradientFinishPointer}%)`
    : "none";
}

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;
