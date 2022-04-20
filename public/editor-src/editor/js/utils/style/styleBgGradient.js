import { defaultValueValue } from "visual/utils/onChange";
import { getColor } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleBgGradient({ v, device, state }) {
  const isHover = styleState({ v, state }) === "hover";

  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvvH = key => defaultValueValue({ v, key, device, state: "hover" });

  const bgColorType = defaultValueValue({
    v,
    key: "bgColorType",
    device,
    state
  });
  const gradientType = defaultValueValue({
    v,
    key: "gradientType",
    device,
    state
  });
  const gradientLinearDegree = defaultValueValue({
    v,
    key: "gradientLinearDegree",
    device,
    state
  });

  const bgColorHex = dvv("bgColorHex");
  const bgColorPalette = dvv("bgColorPalette");
  const bgColorOpacity = dvv("bgColorOpacity");

  const gradientStartPointer = defaultValueValue({
    v,
    key: "gradientStartPointer",
    device,
    state
  });

  const gradientColorHex = dvv("gradientColorHex");
  const gradientColorPalette = dvv("gradientColorPalette");
  const gradientColorOpacity = dvv("gradientColorOpacity");

  const gradientFinishPointer = defaultValueValue({
    v,
    key: "gradientFinishPointer",
    device,
    state
  });
  const gradientRadialDegree = defaultValueValue({
    v,
    key: "gradientRadialDegree",
    device,
    state
  });

  const hoverBgColorType = defaultValueValue({
    v,
    key: "bgColorType",
    device,
    state: "hover"
  });
  const hoverGradientType = defaultValueValue({
    v,
    key: "gradientType",
    device,
    state: "hover"
  });
  const hoverGradientLinearDegree = defaultValueValue({
    v,
    key: "gradientLinearDegree",
    device,
    state: "hover"
  });

  const hoverBgColorHex = dvvH("bgColorHex");
  const hoverBgColorPalette = dvvH("bgColorPalette");
  const hoverBgColorOpacity = dvvH("bgColorOpacity");
  const hoverGradientStartPointer = defaultValueValue({
    v,
    key: "gradientStartPointer",
    device,
    state: "hover"
  });

  const hoverGradientColorHex = dvvH("gradientColorHex");
  const hoverGradientColorPalette = dvvH("gradientColorPalette");
  const hoverGradientColorOpacity = dvvH("gradientColorOpacity");

  const hoverGradientFinishPointer = defaultValueValue({
    v,
    key: "gradientFinishPointer",
    device,
    state: "hover"
  });
  const hoverGradientRadialDegree = defaultValueValue({
    v,
    key: "gradientRadialDegree",
    device,
    state: "hover"
  });

  const hoverBg = getColor(
    hoverBgColorPalette,
    hoverBgColorHex,
    hoverBgColorOpacity
  );

  const hoverGradient = getColor(
    hoverGradientColorPalette,
    hoverGradientColorHex,
    hoverGradientColorOpacity
  );

  const bg = getColor(bgColorPalette, bgColorHex, bgColorOpacity);

  const bgGradient = getColor(
    gradientColorPalette,
    gradientColorHex,
    gradientColorOpacity
  );

  return isHover && hoverBgColorType === "gradient"
    ? hoverGradientType === "linear"
      ? `linear-gradient(${hoverGradientLinearDegree}deg, ${hoverBg} ${hoverGradientStartPointer}%,
         ${hoverGradient} ${hoverGradientFinishPointer}%)`
      : `radial-gradient(circle ${hoverGradientRadialDegree}px,${hoverBg} ${hoverGradientStartPointer}%,
         ${hoverGradient} ${hoverGradientFinishPointer}%)`
    : isHover && hoverBgColorType === "solid"
    ? "none"
    : bgColorType === "gradient"
    ? gradientType === "linear"
      ? `linear-gradient(${gradientLinearDegree}deg, ${bg} ${gradientStartPointer}%,
         ${bgGradient} ${gradientFinishPointer}%)`
      : `radial-gradient(circle ${gradientRadialDegree}px, ${bg} ${gradientStartPointer}%,
         ${bgGradient} ${gradientFinishPointer}%)`
    : "none";
}
