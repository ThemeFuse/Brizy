import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { CSSValue } from "./types";

export function styleElementRichTextGradient({
  v,
  device,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

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

export function styleElementRichTextDCGradient({
  v,
  device,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const colorType = dvv("bgColorType");
  const gradientType = dvv("gradientType");

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("bgColorPalette")
  );

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    dvv("gradientColorHex"),
    dvv("gradientColorPalette")
  );

  const bgColorOpacity = dvv("bgColorOpacity");
  const gradientColorOpacity = dvv("gradientColorOpacity");

  const gradientStartPointer = dvv("gradientStartPointer");
  const gradientFinishPointer = dvv("gradientFinishPointer");

  const gradientLinearDegree = dvv("gradientLinearDegree");
  const gradientRadialDegree = dvv("gradientRadialDegree");

  const bgColor =
    bgColorHex === null
      ? hexToRgba(colorHex, bgColorOpacity)
      : hexToRgba(bgColorHex, bgColorOpacity);

  const gradientColor = hexToRgba(gradientColorHex, gradientColorOpacity);

  return colorType === "gradient"
    ? gradientType === "linear"
      ? `linear-gradient(${gradientLinearDegree}deg, ${bgColor} ${gradientStartPointer}%, ${gradientColor} ${gradientFinishPointer}%)`
      : `radial-gradient(circle ${gradientRadialDegree}px, ${bgColor} ${gradientStartPointer}%, ${gradientColor} ${gradientFinishPointer}%)`
    : "none";
}
