import { defaultValueValue } from "visual/utils/onChange";
import { getFontById } from "visual/utils/fonts";

export function styleTypographyFontFamily({ v }) {
  const { fontFamily } = v;
  return getFontById(fontFamily).family;
}

export function styleTypographyFontSize({ v, device }) {
  return `${defaultValueValue({ v, key: "fontSize", device })}px`;
}

export function styleTypographyLineHeight({ v, device }) {
  return defaultValueValue({ v, key: "lineHeight", device });
}

export function styleTypographyFontWeight({ v, device }) {
  return defaultValueValue({ v, key: "fontWeight", device });
}

export function styleTypographyLetterSpacing({ v, device }) {
  return `${defaultValueValue({ v, key: "letterSpacing", device })}px`;
}
