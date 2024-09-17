import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import * as Str from "visual/utils/reader/string";
import { CSSValue } from "./types";
import { gradientCssDeclaration } from "./utils";
import { Num } from "@brizy/readers";

export function styleElementRichTextGradient({
  v,
  device,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const colorType = Str.read(dvv("colorType"));
  const gradientType = Str.read(dvv("gradientType"));

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    dvv("gradientColorHex"),
    dvv("gradientColorPalette")
  );

  const bgColorOpacity = Num.read(dvv("colorOpacity"));
  const gradientColorOpacity = Num.read(dvv("gradientColorOpacity"));

  const gradientStartPointer = Num.read(dvv("gradientStartPointer"));
  const gradientFinishPointer = Num.read(dvv("gradientFinishPointer"));

  const gradientLinearDegree = Num.read(dvv("gradientLinearDegree"));
  const gradientRadialDegree = Num.read(dvv("gradientRadialDegree"));

  const bgColor = hexToRgba(bgColorHex, bgColorOpacity);
  const gradientColor = hexToRgba(gradientColorHex, gradientColorOpacity);

  return gradientCssDeclaration({
    colorType,
    gradientType,
    gradientLinearDegree,
    gradientRadialDegree,
    gradientStartPointer,
    gradientFinishPointer,
    gradientColor,
    bgColor
  });
}

export function styleElementRichTextDCGradient({
  v,
  device,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const colorType = Str.read(dvv("bgColorType"));
  const gradientType = Str.read(dvv("gradientType"));

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

  const bgColorOpacity = Num.read(dvv("bgColorOpacity"));
  const gradientColorOpacity = Num.read(dvv("gradientColorOpacity"));

  const gradientStartPointer = Num.read(dvv("gradientStartPointer"));
  const gradientFinishPointer = Num.read(dvv("gradientFinishPointer"));

  const gradientLinearDegree = Num.read(dvv("gradientLinearDegree"));
  const gradientRadialDegree = Num.read(dvv("gradientRadialDegree"));

  const bgColor =
    bgColorHex === null
      ? hexToRgba(colorHex, bgColorOpacity)
      : hexToRgba(bgColorHex, bgColorOpacity);

  const gradientColor = hexToRgba(gradientColorHex, gradientColorOpacity);

  return gradientCssDeclaration({
    colorType,
    gradientType,
    gradientLinearDegree,
    gradientRadialDegree,
    gradientStartPointer,
    gradientFinishPointer,
    gradientColor,
    bgColor
  });
}

export function styleElementRichTextDCGradientBackground({
  v,
  device,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const colorType = Str.read(dvv("textBgColorType"));
  const gradientType = Str.read(dvv("textGradientType"));

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("textBgColorHex"),
    dvv("textBgColorPalette")
  );

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    dvv("textGradientColorHex"),
    dvv("textGradientColorPalette")
  );

  const bgColorOpacity = Num.read(dvv("textBgColorOpacity"));
  const gradientColorOpacity = Num.read(dvv("textGradientColorOpacity"));

  const gradientStartPointer = Num.read(dvv("textGradientStartPointer"));
  const gradientFinishPointer = Num.read(dvv("textGradientFinishPointer"));

  const gradientLinearDegree = Num.read(dvv("textGradientLinearDegree"));
  const gradientRadialDegree = Num.read(dvv("textGradientRadialDegree"));

  const bgColor = hexToRgba(bgColorHex, bgColorOpacity);
  const gradientColor = hexToRgba(gradientColorHex, gradientColorOpacity);

  return gradientCssDeclaration({
    colorType,
    gradientType,
    gradientLinearDegree,
    gradientRadialDegree,
    gradientStartPointer,
    gradientFinishPointer,
    gradientColor,
    bgColor
  });
}
