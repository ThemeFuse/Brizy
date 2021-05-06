import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleElementRichTextMarginTop({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("marginTop");
}

export function styleElementRichTextMarginBottom({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("marginBottom");
}

export function styleElementRichTextGradient({ v, device, state = "normal" }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const colorType = dvv("colorType");
  const gradientType = dvv("gradientType");

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    dvv("gradientColorHex"),
    dvv("gradientColorPalette")
  );

  const bgColorOpacity = dvv("colorOpacity");
  const gradientColorOpacity = dvv("gradientColorOpacity");

  const gradientStartPointer = dvv("gradientStartPointer");
  const gradientFinishPointer = dvv("gradientFinishPointer");

  const gradientLinearDegree = dvv("gradientLinearDegree");
  const gradientRadialDegree = dvv("gradientRadialDegree");

  return colorType === "gradient"
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
