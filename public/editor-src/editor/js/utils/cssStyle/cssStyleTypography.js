import {
  styleTypographyFontFamily,
  styleTypographyFontSize,
  styleTypographyFontSizeSuffix,
  styleTypographyFontWeight,
  styleTypographyLetterSpacing,
  styleTypographyLineHeight
} from "visual/utils/style2";

export function cssStyleTypographyFontFamily({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}) {
  const fontFamily = styleTypographyFontFamily({
    v,
    device,
    state,
    store,
    getConfig,
    renderContext
  });
  return fontFamily === undefined ? "" : `font-family:${fontFamily};`;
}

export function cssStyleTypographyFontSize({
  v,
  device,
  state,
  getConfig,
  store
}) {
  const fontSize = styleTypographyFontSize({
    v,
    device,
    state,
    getConfig,
    store
  });
  const fontSizeSuffix = styleTypographyFontSizeSuffix({
    v,
    device,
    getConfig,
    state
  });
  return fontSize === undefined
    ? ""
    : `font-size:${fontSize}${fontSizeSuffix};`;
}

export function cssStyleTypographyLineHeight({
  v,
  device,
  state,
  getConfig,
  store
}) {
  const lineHeight = styleTypographyLineHeight({
    v,
    device,
    state,
    getConfig,
    store
  });
  return lineHeight === undefined ? "" : `line-height:${lineHeight};`;
}

export function cssStyleTypographyFontWeight({
  v,
  device,
  state,
  getConfig,
  store
}) {
  const fontWeight = styleTypographyFontWeight({
    v,
    device,
    state,
    getConfig,
    store
  });
  return fontWeight === undefined ? "" : `font-weight:${fontWeight};`;
}

export function cssStyleTypographyLetterSpacing({
  v,
  device,
  state,
  getConfig,
  store
}) {
  const letterSpacing = styleTypographyLetterSpacing({
    v,
    device,
    state,
    getConfig,
    store
  });
  return letterSpacing === undefined ? "" : `letter-spacing:${letterSpacing};`;
}
