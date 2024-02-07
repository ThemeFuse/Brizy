import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { getOptionFontByGlobal } from "visual/utils/options";
import * as Str from "visual/utils/reader/string";
import { capByPrefix } from "visual/utils/string";
import { styleTypography2FontFamily } from "visual/utils/style2";
import { CSSValue } from "./types";
import { gradientCssDeclaration } from "./utils";

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

  const bgColorOpacity = dvv("colorOpacity");
  const gradientColorOpacity = dvv("gradientColorOpacity");

  const gradientStartPointer = Str.read(dvv("gradientStartPointer"));
  const gradientFinishPointer = Str.read(dvv("gradientFinishPointer"));

  const gradientLinearDegree = Str.read(dvv("gradientLinearDegree"));
  const gradientRadialDegree = Str.read(dvv("gradientRadialDegree"));

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

  const bgColorOpacity = dvv("bgColorOpacity");
  const gradientColorOpacity = dvv("gradientColorOpacity");

  const gradientStartPointer = Str.read(dvv("gradientStartPointer"));
  const gradientFinishPointer = Str.read(dvv("gradientFinishPointer"));

  const gradientLinearDegree = Str.read(dvv("gradientLinearDegree"));
  const gradientRadialDegree = Str.read(dvv("gradientRadialDegree"));

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

  const bgColorOpacity = dvv("textBgColorOpacity");
  const gradientColorOpacity = dvv("textGradientColorOpacity");

  const gradientStartPointer = Str.read(dvv("textGradientStartPointer"));
  const gradientFinishPointer = Str.read(dvv("textGradientFinishPointer"));

  const gradientLinearDegree = Str.read(dvv("textGradientLinearDegree"));
  const gradientRadialDegree = Str.read(dvv("textGradientRadialDegree"));

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
