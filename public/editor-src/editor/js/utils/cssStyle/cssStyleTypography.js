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
  renderContext
}) {
  const fontFamily = styleTypographyFontFamily({
    v,
    device,
    state,
    store,
    renderContext
  });
  return fontFamily === undefined ? "" : `font-family:${fontFamily};`;
}

export function cssStyleTypographyFontSize({ v, device, state, store }) {
  const fontSize = styleTypographyFontSize({ v, device, state, store });
  const fontSizeSuffix = styleTypographyFontSizeSuffix({ v, device, state });
  return fontSize === undefined
    ? ""
    : `font-size:${fontSize}${fontSizeSuffix};`;
}

export function cssStyleTypographyLineHeight({ v, device, state, store }) {
  const lineHeight = styleTypographyLineHeight({
    v,
    device,
    state,
    store
  });
  return lineHeight === undefined ? "" : `line-height:${lineHeight};`;
}

export function cssStyleTypographyFontWeight({ v, device, state, store }) {
  const fontWeight = styleTypographyFontWeight({
    v,
    device,
    state,
    store
  });
  return fontWeight === undefined ? "" : `font-weight:${fontWeight};`;
}

export function cssStyleTypographyLetterSpacing({ v, device, state, store }) {
  const letterSpacing = styleTypographyLetterSpacing({
    v,
    device,
    state,
    store
  });
  return letterSpacing === undefined ? "" : `letter-spacing:${letterSpacing};`;
}
