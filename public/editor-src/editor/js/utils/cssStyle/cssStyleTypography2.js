import {
  cssStyleTextScript,
  cssStyleTextTransforms
} from "visual/utils/cssStyle/cssStyleTextTransform";
import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2FontSizeSuffix,
  styleTypography2FontVariation,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "visual/utils/style2";

export function cssStyleTypography2FontFamily({
  v,
  device,
  store,
  prefix = "",
  renderContext
}) {
  const fontFamily = styleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
  return fontFamily ? `font-family:${fontFamily};` : "";
}

export function cssStyleTypography2FontSize({ v, device, store, prefix = "" }) {
  const fontSize = styleTypography2FontSize({ v, device, store, prefix });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({
    v,
    device,
    store,
    prefix
  });

  return `font-size:${fontSize}${fontSizeSuffix};`;
}

export function cssStyleTypography2LineHeight({
  v,
  device,
  store,
  prefix = ""
}) {
  return `line-height:${styleTypography2LineHeight({ v, device, store, prefix })};`;
}

export function cssStyleTypography2FontWeight({
  v,
  device,
  store,
  prefix = ""
}) {
  return `font-weight:${styleTypography2FontWeight({ v, device, store, prefix })};`;
}

export function cssStyleTypography2LetterSpacing({
  v,
  device,
  state,
  store,
  prefix = ""
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix
  })};`;
}

export function cssStyleTypography2FontVariation({
  v,
  device,
  store,
  prefix = ""
}) {
  const fontVariation = styleTypography2FontVariation({
    v,
    device,
    store,
    prefix
  });
  return fontVariation ? `font-variation-settings:${fontVariation};` : "";
}

export function cssStyleTypography3FontFamily({
  v,
  device,
  store,
  prefix = "typography",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleTypography3FontSize({
  v,
  device,
  store,
  prefix = "typography"
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleTypography3LineHeight({
  v,
  device,
  store,
  prefix = "typography"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix });
}

export function cssStyleTypography3FontWeight({
  v,
  device,
  store,
  prefix = "typography"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleTypography3LetterSpacing({
  v,
  device,
  store,
  prefix = "typography"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix });
}

export function cssStyleTypography3FontVariation({
  v,
  device,
  store,
  prefix = "typography"
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix });
}

export function cssStyleTypography3TextTransform({
  v,
  device,
  prefix = "typography",
  state,
  store
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix });
}

export function cssStyleTypography3Script({
  v,
  device,
  prefix = "typography",
  state,
  store
}) {
  return cssStyleTextScript({ v, device, state, store, prefix });
}

export function getAllCssStyleTypography({
  v,
  device,
  state,
  store,
  prefix = "typography",
  renderContext
}) {
  const fontFamily = cssStyleTypography3FontFamily({
    v,
    device,
    state,
    store,
    prefix,
    renderContext
  });
  const fontSize = cssStyleTypography3FontSize({
    v,
    device,
    state,
    store,
    prefix
  });
  const lineHeight = cssStyleTypography3LineHeight({
    v,
    device,
    state,
    store,
    prefix
  });
  const fontWeight = cssStyleTypography3FontWeight({
    v,
    device,
    state,
    store,
    prefix
  });
  const letterSpacing = cssStyleTypography3LetterSpacing({
    v,
    device,
    state,
    store,
    prefix
  });

  const fontVariation = cssStyleTypography2FontVariation({
    v,
    device,
    state,
    store,
    prefix
  });

  const textTransforms = cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    prefix
  });

  return `${fontFamily} ${fontSize} ${lineHeight} ${fontWeight} ${letterSpacing} ${fontVariation} ${textTransforms}`;
}
