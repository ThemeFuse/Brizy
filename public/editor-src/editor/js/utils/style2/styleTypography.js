import { defaultValueValue } from "visual/utils/onChange";
import { getFontById, getFontCssStyleOldType } from "visual/utils/fonts";

export function styleTypographyFontFamily({ v, device, state }) {
  const { fontFamily, fontFamilyType } = v;

  const fontStyle = defaultValueValue({
    v,
    key: "fontStyle",
    device,
    state
  });

  if (fontStyle) {
    // Keys is lowercase because have problems in backend export HTML
    return `var(--brz-${fontStyle}fontFamily)`.toLowerCase();
  } else {
    return fontFamily === undefined
      ? fontFamily
      : getFontById({ family: fontFamily, type: fontFamilyType }).family;
  }
}

export function styleTypographyFontSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyleOldType({
    fontStyle,
    key: "fontSize",
    device
  });

  return (
    globalStyle ??
    defaultValueValue({
      v,
      key: "fontSize",
      device,
      state
    })
  );
}

export function styleTypographyFontSizeSuffix({ v, device, state }) {
  const fontStyle = defaultValueValue({
    v,
    key: "fontStyle",
    device,
    state
  });

  if (fontStyle) {
    return "";
  } else {
    const fontSizeSuffix = defaultValueValue({
      v,
      key: "fontSizeSuffix",
      device,
      state
    });

    return fontSizeSuffix || "px";
  }
}

export function styleTypographyLineHeight({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyleOldType({
    fontStyle,
    key: "lineHeight",
    device
  });

  return (
    globalStyle ?? defaultValueValue({ v, key: "lineHeight", device, state })
  );
}

export function styleTypographyFontWeight({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyleOldType({
    fontStyle,
    key: "fontWeight",
    device
  });

  return (
    globalStyle ?? defaultValueValue({ v, key: "fontWeight", device, state })
  );
}

export function styleTypographyLetterSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("fontStyle");
  const suffix = fontStyle ? "" : "px";
  const globalStyle = getFontCssStyleOldType({
    fontStyle,
    key: "letterSpacing",
    device
  });

  return (
    globalStyle ??
    `${defaultValueValue({
      v,
      key: "letterSpacing",
      device,
      state
    })}${suffix}`
  );
}
