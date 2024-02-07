import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2FontSizeSuffix,
  styleTypography2FontVariation,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "visual/utils/style2";

export function cssStyleTypography2FontFamily({ v, device, prefix = "" }) {
  const fontFamily = styleTypography2FontFamily({ v, device, prefix });
  return fontFamily ? `font-family:${fontFamily};` : "";
}

export function cssStyleTypography2FontSize({ v, device, prefix = "" }) {
  const fontSize = styleTypography2FontSize({ v, device, prefix });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({ v, device, prefix });

  return `font-size:${fontSize}${fontSizeSuffix};`;
}

export function cssStyleTypography2LineHeight({ v, device, prefix = "" }) {
  return `line-height:${styleTypography2LineHeight({ v, device, prefix })};`;
}

export function cssStyleTypography2FontWeight({ v, device, prefix = "" }) {
  return `font-weight:${styleTypography2FontWeight({ v, device, prefix })};`;
}

export function cssStyleTypography2LetterSpacing({
  v,
  device,
  state,
  prefix = ""
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix
  })};`;
}

export function cssStyleTypography2FontVariation({ v, device, prefix = "" }) {
  const fontVariation = styleTypography2FontVariation({ v, device, prefix });
  return fontVariation ? `font-variation-settings:${fontVariation};` : "";
}

export function cssStyleTypography3FontFamily({
  v,
  device,
  prefix = "typography"
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleTypography3FontSize({
  v,
  device,
  prefix = "typography"
}) {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleTypography3LineHeight({
  v,
  device,
  prefix = "typography"
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}

export function cssStyleTypography3FontWeight({
  v,
  device,
  prefix = "typography"
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleTypography3LetterSpacing({
  v,
  device,
  prefix = "typography"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix });
}

export function cssStyleTypography3FontVariation({
  v,
  device,
  prefix = "typography"
}) {
  return cssStyleTypography2FontVariation({ v, device, prefix });
}

export function getAllCssStyleTypography({
  v,
  device,
  state,
  prefix = "typography"
}) {
  const fontFamily = cssStyleTypography3FontFamily({
    v,
    device,
    state,
    prefix
  });
  const fontSize = cssStyleTypography3FontSize({
    v,
    device,
    state,
    prefix
  });
  const lineHeight = cssStyleTypography3LineHeight({
    v,
    device,
    state,
    prefix
  });
  const fontWeight = cssStyleTypography3FontWeight({
    v,
    device,
    state,
    prefix
  });
  const letterSpacing = cssStyleTypography3LetterSpacing({
    v,
    device,
    state,
    prefix
  });

  const fontVariation = cssStyleTypography2FontVariation({
    v,
    device,
    state,
    prefix
  });

  return `${fontFamily} ${fontSize} ${lineHeight} ${fontWeight} ${letterSpacing} ${fontVariation}`;
}
