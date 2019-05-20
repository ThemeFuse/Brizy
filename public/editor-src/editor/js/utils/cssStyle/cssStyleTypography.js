import {
  styleTypographyFontFamily,
  styleTypographyFontSize,
  styleTypographyLineHeight,
  styleTypographyFontWeight,
  styleTypographyLetterSpacing
} from "visual/utils/style2";

export function cssStyleTypographyFontFamily({ v, device }) {
  return `font-family:${styleTypographyFontFamily({ v, device })};`;
}

export function cssStyleTypographyFontSize({ v, device }) {
  return `font-size:${styleTypographyFontSize({ v, device })};`;
}

export function cssStyleTypographyLineHeight({ v, device }) {
  return `line-height:${styleTypographyLineHeight({ v, device })};`;
}

export function cssStyleTypographyFontWeight({ v, device }) {
  return `font-weight:${styleTypographyFontWeight({ v, device })};`;
}

export function cssStyleTypographyLetterSpacing({ v, device }) {
  return `letter-spacing:${styleTypographyLetterSpacing({ v, device })};`;
}
