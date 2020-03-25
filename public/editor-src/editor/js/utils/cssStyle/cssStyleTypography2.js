import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing
} from "visual/utils/style2";

export function cssStyleTypography2FontFamily({ v, device, prefix = "" }) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({ v, device, prefix })};`
    : "";
}

export function cssStyleTypography2FontSize({ v, device, prefix = "" }) {
  return `font-size:${styleTypography2FontSize({ v, device, prefix })}px;`;
}

export function cssStyleTypography2LineHeight({ v, device, prefix = "" }) {
  return `line-height:${styleTypography2LineHeight({ v, device, prefix })};`;
}

export function cssStyleTypography2FontWeight({ v, device, prefix = "" }) {
  return `font-weight:${styleTypography2FontWeight({ v, device, prefix })};`;
}

export function cssStyleTypography2LetterSpacing({ v, device, prefix = "" }) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleTypography3FontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "typography" });
}

export function cssStyleTypography3FontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "typography" });
}

export function cssStyleTypography3LineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "typography" });
}

export function cssStyleTypography3FontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "typography" });
}

export function cssStyleTypography3LetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "typography" });
}
