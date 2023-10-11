import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { getOptionFontByGlobal } from "visual/utils/options";
import { capByPrefix } from "visual/utils/string";
import { styleTypography2FontFamily } from "visual/utils/style2";
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

export function styleElementRichTextFontFamily({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string | undefined {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fontFamilyKey = capByPrefix(prefix, "fontFamily");
  const fontFamilyTypeKey = capByPrefix(prefix, "fontFamilyType");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle) {
    return styleTypography2FontFamily({ v, device, state, prefix });
  } else {
    const fontFamily = getOptionFontByGlobal(
      "fontFamily",
      v[fontFamilyKey],
      dvv(fontStyleKey)
    );
    const fontFamilyType = getOptionFontByGlobal(
      "fontFamilyType",
      v[fontFamilyTypeKey],
      dvv(fontStyleKey)
    );

    if (!fontFamily) {
      return undefined;
    }

    return getFontById({
      type: fontFamilyType,
      family: fontFamily
    }).family;
  }
}
