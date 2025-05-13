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
  getConfig,
  store
}) {
  return `font-size:${styleTypographyElementCountdownLabelFontSize({
    v,
    store,
    getConfig,
    device
  })};`;
}

export function cssStyleElementCountDown2SpacingLeft({
  v,
  device,
  getConfig,
  store
}) {
  return `margin-left:${styleElementCountdown2Spacing({
    v,
    store,
    getConfig,
    device
  })};`;
}

export function cssStyleElementCountDown2SpacingRight({
  v,
  device,
  getConfig,
  store
}) {
  return `margin-right:${styleElementCountdown2Spacing({
    v,
    store,
    getConfig,
    device
  })};`;
}

// Style Typography Number
export function cssStyleNumberTypography2FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "number",
    renderContext
  });
}

export function cssStyleNumberTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "number"
  });
}

export function cssStyleNumberTypography2LineHeight({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "number"
  });
}

export function cssStyleNumberTypography2FontWeight({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "number"
  });
}

export function cssStyleNumberTypography2LetterSpacing({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "number"
  });
}

export function cssStyleNumberTypography2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "number"
  });
}

export function cssStyleNumberTypography2TextTransform({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "number"
  });
}
// Style Typography Title
export function cssStyleTitleTypography2FontFamily({
  v,
  device,
  getConfig,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "title",
    renderContext
  });
}

export function cssStyleTitleTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleTitleTypography2LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleTitleTypography2FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleTitleTypography2LetterSpacing({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleTitleTypography2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "title"
  });
}

export function cssStyleCountdownTitleTextTransform({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "title"
  });
}

// Style Typography Message
export function cssStyleMessageTypography2FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "message",
    renderContext
  });
}

export function cssStyleMessageTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "message"
  });
}

export function cssStyleMessageTypography2LineHeight({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "message"
  });
}

export function cssStyleMessageTypography2FontWeight({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "message"
  });
}

export function cssStyleMessageTypography2LetterSpacing({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "message"
  });
}

export function cssStyleMessageTypography2FontVariation({
  v,
  getConfig,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "message"
  });
}

export function cssStyleCountdownMessageTextTransform({
  v,
  device,
  getConfig,
  store,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "message"
  });
}
// Color
export function cssStyleElementCountDown2NumberColor({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "numberColor"
  });
}

export function cssStyleElementCountDown2TitleColor({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "titleColor"
  });
}

export function cssStyleElementCountDown2MessageColor({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "messageColor"
  });
}
