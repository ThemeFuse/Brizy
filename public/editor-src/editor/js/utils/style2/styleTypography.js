import { configSelector } from "visual/redux/selectors";
import { getFontCssStyle } from "visual/utils/fonts/getFontCssStyle";
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

export function styleTypographyFontSize({ v, device, state, store }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyle({
    fontStyle,
    key: "fontSize",
    device,
    config
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

export function styleTypographyLineHeight({ v, device, state, store }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());

  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyle({
    fontStyle,
    key: "lineHeight",
    device,
    config
  });

  return (
    globalStyle ?? defaultValueValue({ v, key: "lineHeight", device, state })
  );
}

export function styleTypographyFontWeight({ v, device, state, store }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());

  const fontStyle = dvv("fontStyle");
  const globalStyle = getFontCssStyle({
    fontStyle,
    key: "fontWeight",
    device,
    config
  });

  return (
    globalStyle ?? defaultValueValue({ v, key: "fontWeight", device, state })
  );
}

export function styleTypographyLetterSpacing({ v, device, state, store }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());

  const fontStyle = dvv("fontStyle");
  const suffix = fontStyle ? "" : "px";
  const globalStyle = getFontCssStyle({
    fontStyle,
    key: "letterSpacing",
    device,
    config
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
