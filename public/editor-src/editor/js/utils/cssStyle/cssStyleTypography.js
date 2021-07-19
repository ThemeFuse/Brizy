import {
  styleTypographyFontFamily,
  styleTypographyFontSize,
  styleTypographyFontSizeSuffix,
  styleTypographyLineHeight,
  styleTypographyFontWeight,
  styleTypographyLetterSpacing
} from "visual/utils/style2";

export function cssStyleTypographyFontFamily({ v, device, state }) {
  const fontFamily = styleTypographyFontFamily({ v, device, state });
  return fontFamily === undefined ? "" : `font-family:${fontFamily};`;
}

export function cssStyleTypographyFontSize({ v, device, state }) {
  const fontSize = styleTypographyFontSize({ v, device, state });
  const fontSizeSuffix = styleTypographyFontSizeSuffix({ v, device, state });
  return fontSize === undefined
    ? ""
    : `font-size:${fontSize}${fontSizeSuffix || "px"};`;
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
  return letterSpacing === undefined
    ? ""
    : `letter-spacing:${letterSpacing}px;`;
}
