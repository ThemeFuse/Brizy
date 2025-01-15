import { configSelector } from "visual/redux/selectors";
import { getFontCssStyle } from "visual/utils/fonts";
import { defaultValueValue } from "visual/utils/onChange";
import { getDetailsModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { isNullish } from "visual/utils/value";

export function styleTypographyFontFamily({
  v,
  device,
  state,
  store,
  renderContext
}) {
  const { fontFamily, fontFamilyType } = v;

  if (isNullish(fontFamily) || isNullish(fontFamilyType)) {
    return "";
  }

  const config = configSelector(store.getState());
  const fontStyle = defaultValueValue({ v, key: "fontStyle", device, state });

  return getDetailsModelFontFamily({
    data: {
      family: fontFamily,
      familyType: fontFamilyType,
      style: fontStyle,
      store
    },
    config,
    renderContext
  });
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
