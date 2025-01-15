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

export function cssStyleTypographyFontSize({ v, device, state }) {
  const fontSize = styleTypographyFontSize({ v, device, state });
  const fontSizeSuffix = styleTypographyFontSizeSuffix({ v, device, state });
  return fontSize === undefined
    ? ""
    : `font-size:${fontSize}${fontSizeSuffix};`;
}

export function cssStyleTypographyLineHeight({ v, device, state }) {
  const lineHeight = styleTypographyLineHeight({
    v,
    device,
    state
  });
  return lineHeight === undefined ? "" : `line-height:${lineHeight};`;
}

export function cssStyleTypographyFontWeight({ v, device, state }) {
  const fontWeight = styleTypographyFontWeight({
    v,
    device,
    state
  });
  return fontWeight === undefined ? "" : `font-weight:${fontWeight};`;
}

export function cssStyleTypographyLetterSpacing({ v, device, state }) {
  const letterSpacing = styleTypographyLetterSpacing({
    v,
    device,
    state
  });
  return letterSpacing === undefined ? "" : `letter-spacing:${letterSpacing};`;
}
