import {
  cssStyleColor,
  cssStyleTextTransforms,
  cssStyleTypography2FontVariation
} from "visual/utils/cssStyle";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import {
  styleElementCountdown2Spacing,
  styleTypographyElementCountdownLabelFontSize
} from "visual/utils/style2";

export function cssStyleTypographyElementCountdownLabelFontSize({
  v,
  device,
  store
}) {
  return `font-size:${styleTypographyElementCountdownLabelFontSize({
    v,
    store,
    device
  })};`;
}

export function cssStyleElementCountDown2SpacingLeft({ v, device, store }) {
  return `margin-left:${styleElementCountdown2Spacing({
    v,
    store,
    device
  })};`;
}

export function cssStyleElementCountDown2SpacingRight({ v, device, store }) {
  return `margin-right:${styleElementCountdown2Spacing({
    v,
    store,
    device
  })};`;
}

// Style Typography Number
export function cssStyleNumberTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "number",
    renderContext
  });
}

export function cssStyleNumberTypography2FontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "number" });
}

export function cssStyleNumberTypography2LineHeight({ v, device, store }) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "number" });
}

export function cssStyleNumberTypography2FontWeight({ v, device, store }) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "number" });
}

export function cssStyleNumberTypography2LetterSpacing({ v, device, store }) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "number"
  });
}

export function cssStyleNumberTypography2FontVariation({ v, device, store }) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "number"
  });
}

export function cssStyleNumberTypography2TextTransform({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "number" });
}
// Style Typography Title
export function cssStyleTitleTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "title",
    renderContext
  });
}

export function cssStyleTitleTypography2FontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "title" });
}

export function cssStyleTitleTypography2LineHeight({ v, device, store }) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "title" });
}

export function cssStyleTitleTypography2FontWeight({ v, device, store }) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "title" });
}

export function cssStyleTitleTypography2LetterSpacing({ v, device, store }) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "title"
  });
}

export function cssStyleTitleTypography2FontVariation({ v, device, store }) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "title"
  });
}

export function cssStyleCountdownTitleTextTransform({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "title" });
}

// Style Typography Message
export function cssStyleMessageTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "message",
    renderContext
  });
}

export function cssStyleMessageTypography2FontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "message" });
}

export function cssStyleMessageTypography2LineHeight({ v, device, store }) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "message" });
}

export function cssStyleMessageTypography2FontWeight({ v, device, store }) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "message" });
}

export function cssStyleMessageTypography2LetterSpacing({ v, device, store }) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "message"
  });
}

export function cssStyleMessageTypography2FontVariation({ v, device, store }) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "message"
  });
}

export function cssStyleCountdownMessageTextTransform({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "message" });
}
// Color
export function cssStyleElementCountDown2NumberColor({
  v,
  device,
  store,
  state
}) {
  return cssStyleColor({ v, device, state, store, prefix: "numberColor" });
}

export function cssStyleElementCountDown2TitleColor({
  v,
  device,
  store,
  state
}) {
  return cssStyleColor({ v, device, state, store, prefix: "titleColor" });
}

export function cssStyleElementCountDown2MessageColor({
  v,
  device,
  store,
  state
}) {
  return cssStyleColor({ v, device, state, store, prefix: "messageColor" });
}
