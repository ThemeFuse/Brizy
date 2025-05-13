import { Num, Str } from "@brizy/readers";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "./types";
import { gradientCssDeclaration } from "./utils";

export function styleElementRichTextGradient({
  v,
  device,
  getConfig,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const colorType = Str.read(dvv("colorType"));
  const gradientType = Str.read(dvv("gradientType"));

  const bgColorOpacity = Num.read(dvv("colorOpacity")) ?? 0;
  const gradientColorOpacity = Num.read(dvv("gradientColorOpacity")) ?? 0;

  const gradientStartPointer = Num.read(dvv("gradientStartPointer"));
  const gradientFinishPointer = Num.read(dvv("gradientFinishPointer"));

  const gradientLinearDegree = Num.read(dvv("gradientLinearDegree"));
  const gradientRadialDegree = Num.read(dvv("gradientRadialDegree"));

  const bgColor = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    bgColorOpacity,
    config
  );

  const gradientColor = getColor(
    dvv("gradientColorPalette"),
    dvv("gradientColorHex"),
    gradientColorOpacity,
    config
  );

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
  getConfig,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const colorType = Str.read(dvv("bgColorType"));
  const gradientType = Str.read(dvv("gradientType"));
  const bgColorOpacity = Num.read(dvv("bgColorOpacity")) ?? 0;

  const gradientColorOpacity = Num.read(dvv("gradientColorOpacity")) ?? 0;

  const gradientStartPointer = Num.read(dvv("gradientStartPointer"));
  const gradientFinishPointer = Num.read(dvv("gradientFinishPointer"));

  const gradientLinearDegree = Num.read(dvv("gradientLinearDegree"));
  const gradientRadialDegree = Num.read(dvv("gradientRadialDegree"));

  const modelBgColor = dvv("bgColorHex");
  const modelColor = dvv("colorHex");

  const mainColor = modelBgColor ? modelBgColor : modelColor;
  const bgColor = getColor(
    dvv("bgColorPalette"),
    mainColor,
    bgColorOpacity,
    config
  );

  const gradientColor = getColor(
    dvv("gradientColorPalette"),
    dvv("gradientColorHex"),
    gradientColorOpacity,
    config
  );

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
  getConfig,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const colorType = Str.read(dvv("textBgColorType"));
  const gradientType = Str.read(dvv("textGradientType"));

  const bgColorOpacity = Num.read(dvv("textBgColorOpacity")) ?? 1;
  const gradientColorOpacity = Num.read(dvv("textGradientColorOpacity")) ?? 1;

  const gradientStartPointer = Num.read(dvv("textGradientStartPointer"));
  const gradientFinishPointer = Num.read(dvv("textGradientFinishPointer"));

  const gradientLinearDegree = Num.read(dvv("textGradientLinearDegree"));
  const gradientRadialDegree = Num.read(dvv("textGradientRadialDegree"));

  const bgColor = getColor(
    dvv("textBgColorPalette"),
    dvv("textBgColorHex"),
    bgColorOpacity,
    config
  );
  const gradientColor = getColor(
    dvv("textGradientColorPalette"),
    dvv("textGradientColorHex"),
    gradientColorOpacity,
    config
  );

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
