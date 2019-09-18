import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing
} from "visual/utils/style2";

export function cssStyleTypography2FontFamily({ v, device }) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({ v, device })};`
    : "";
}

export function cssStyleTypography2FontSize({ v, device }) {
  return `font-size:${styleTypography2FontSize({ v, device })}px;`;
}

export function cssStyleTypography2LineHeight({ v, device }) {
  return `line-height:${styleTypography2LineHeight({ v, device })};`;
}

export function cssStyleTypography2FontWeight({ v, device }) {
  return `font-weight:${styleTypography2FontWeight({ v, device })};`;
}

export function cssStyleTypography2LetterSpacing({ v, device }) {
  return `letter-spacing:${styleTypography2LetterSpacing({ v, device })}px;`;
}
