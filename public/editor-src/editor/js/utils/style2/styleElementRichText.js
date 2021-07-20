import { capByPrefix } from "visual/utils/string";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { getOptionFontByGlobal } from "visual/utils/options";
import { getFontById } from "visual/utils/fonts";

export function styleElementRichTextMarginTop({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("marginTop");
}

export function styleElementRichTextMarginBottom({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("marginBottom");
}

export function styleElementRichTextBGImagePositionX({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("bgPositionX");
}

export function styleElementRichTextBGImagePositionY({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("bgPositionY");
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

export function styleElementRichTextFontFamily({
  v,
  device,
  state,
  prefix = ""
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const fontFamilyKey = capByPrefix(prefix, "fontFamily");
  const fontFamilyTypeKey = capByPrefix(prefix, "fontFamilyType");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");

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
