import { defaultValueValue } from "visual/utils/onChange";
import { getFontById } from "visual/utils/fonts";

export function styleTypographyFontFamily({ v }) {
  const { fontFamily, fontFamilyType } = v;
  return fontFamily === undefined
    ? fontFamily
    : getFontById({ family: fontFamily, type: fontFamilyType }).family;
}

export function styleTypographyFontSize({ v, device, state }) {
  const fontSize = defaultValueValue({
    v,
    key: "fontSize",
    device,
    state
  });

  return fontSize;
}

export function styleTypographyFontSizeSuffix({ v, device, state }) {
  const fontSizeSuffix = defaultValueValue({
    v,
    key: "fontSizeSuffix",
    device,
    state
  });

  return fontSizeSuffix;
}

export function styleTypographyLineHeight({ v, device, state }) {
  const lineHeight = defaultValueValue({ v, key: "lineHeight", device, state });

  return lineHeight;
}

export function styleTypographyFontWeight({ v, device, state }) {
  const fontWeight = defaultValueValue({ v, key: "fontWeight", device, state });

  return fontWeight;
}

export function styleTypographyLetterSpacing({ v, device, state }) {
  const letterSpacing = defaultValueValue({
    v,
    key: "letterSpacing",
    device,
    state
  });

  return letterSpacing;
}
