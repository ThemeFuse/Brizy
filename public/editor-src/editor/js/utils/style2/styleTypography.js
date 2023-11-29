import Config from "visual/global/Config";
import {
  getFontById,
  getFontCssStyle,
  makeStyleCSSVar
} from "visual/utils/fonts";
import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP } from "visual/utils/responsiveMode";
import { FONT_INITIAL } from "../fonts/utils";

export function styleTypographyFontFamily({ v, device, state }) {
  const { fontFamily, fontFamilyType } = v;

  const fontStyle = defaultValueValue({
    v,
    key: "fontStyle",
    device,
    state
  });

  if (fontStyle) {
    return `var(${makeStyleCSSVar({
      id: fontStyle,
      device: DESKTOP,
      key: "fontFamily",
      config: Config.getAll()
    })}, ${FONT_INITIAL})`;
  } else {
    return fontFamily === undefined
      ? fontFamily
      : getFontById({ family: fontFamily, type: fontFamilyType }).family;
  }
}

export function styleTypographyFontSize({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyle({
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
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyle({
    fontStyle,
    key: "lineHeight",
    device
  });

  return (
    globalStyle ?? defaultValueValue({ v, key: "lineHeight", device, state })
  );
}

export function styleTypographyFontWeight({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyle({
    fontStyle,
    key: "fontWeight",
    device
  });

  return (
    globalStyle ?? defaultValueValue({ v, key: "fontWeight", device, state })
  );
}

export function styleTypographyLetterSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("fontStyle");
  const suffix = fontStyle ? "" : "px";
  const globalStyle = getFontCssStyle({
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
