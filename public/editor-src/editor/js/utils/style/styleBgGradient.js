import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleBgGradient({ v, device, state }) {
  const isHover = styleState({ v, state });
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

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorPalette", device, state })
  );

  const bgColorOpacity = defaultValueValue({
    v,
    key: "bgColorOpacity",
    device,
    state
  });
  const gradientStartPointer = defaultValueValue({
    v,
    key: "gradientStartPointer",
    device,
    state
  });

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "gradientColorHex", device, state }),
    defaultValueValue({ v, key: "gradientColorPalette", device, state })
  );

  const gradientColorOpacity = defaultValueValue({
    v,
    key: "gradientColorOpacity",
    device,
    state
  });
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

  const { hex: hoverBgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state: "hover" }),
    defaultValueValue({ v, key: "bgColorPalette", device, state: "hover" })
  );

  const hoverBgColorOpacity = defaultValueValue({
    v,
    key: "bgColorOpacity",
    device,
    state: "hover"
  });
  const hoverGradientStartPointer = defaultValueValue({
    v,
    key: "gradientStartPointer",
    device,
    state: "hover"
  });

  const { hex: hoverGradientColorHex } = getOptionColorHexByPalette(
    defaultValueValue({
      v,
      key: "gradientColorHex",
      device,
      state: "hover"
    }),
    defaultValueValue({
      v,
      key: "gradientColorPalette",
      device,
      state: "hover"
    })
  );

  const hoverGradientColorOpacity = defaultValueValue({
    v,
    key: "gradientColorOpacity",
    device,
    state: "hover"
  });
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

  return isHover === "hover" && hoverBgColorType === "gradient"
    ? hoverGradientType === "linear"
      ? `linear-gradient(${hoverGradientLinearDegree}deg, ${hexToRgba(
          hoverBgColorHex,
          hoverBgColorOpacity
        )} ${hoverGradientStartPointer}%, ${hexToRgba(
          hoverGradientColorHex,
          hoverGradientColorOpacity
        )} ${hoverGradientFinishPointer}%)`
      : `radial-gradient(circle ${hoverGradientRadialDegree}px,${hexToRgba(
          hoverBgColorHex,
          hoverBgColorOpacity
        )} ${hoverGradientStartPointer}%, ${hexToRgba(
          hoverGradientColorHex,
          hoverGradientColorOpacity
        )} ${hoverGradientFinishPointer}%)`
    : isHover === "hover" && hoverBgColorType === "solid"
    ? "none"
    : bgColorType === "gradient"
    ? gradientType === "linear"
      ? `linear-gradient(${gradientLinearDegree}deg, ${hexToRgba(
          bgColorHex,
          bgColorOpacity
        )} ${gradientStartPointer}%, ${hexToRgba(
          gradientColorHex,
          gradientColorOpacity
        )} ${gradientFinishPointer}%)`
      : `radial-gradient(circle ${gradientRadialDegree}px, ${hexToRgba(
          bgColorHex,
          bgColorOpacity
        )} ${gradientStartPointer}%, ${hexToRgba(
          gradientColorHex,
          gradientColorOpacity
        )} ${gradientFinishPointer}%)`
    : "none";
}
