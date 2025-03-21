import {
  cssStyleColor,
  cssStyleTextTransforms,
  cssStyleTypography2FontVariation
} from "visual/utils/cssStyle";
import {
  styleElementPostNavigationShowPost,
  styleElementPostNavigationShowSeparation,
  styleElementPostNavigationSpacing,
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "visual/utils/style2";

export function cssStyleElementPostNavigation2TitleFontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        store,
        v,
        device,
        getConfig,
        prefix: "titleTypography",
        renderContext
      })};`
    : "";
}

export function cssStyleElementPostNavigation2TitleFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "titleTypography"
  })}px;`;
}

export function cssStyleElementPostNavigation2TitleLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleFontVariation({
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
    prefix: "titleTypography"
  });
}

export function cssStyleElementPostNavigationTitleTextTransform({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    prefix: "titleTypography"
  });
}
export function cssStyleElementPostNavigation2PostFontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        getConfig,
        prefix: "postTypography",
        renderContext
      })};`
    : "";
}

export function cssStyleElementPostNavigation2PostFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    getConfig,
    store,
    prefix: "postTypography"
  })}px;`;
}

export function cssStyleElementPostNavigation2PostLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostFontVariation({
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
    prefix: "postTypography"
  });
}

export function cssStyleElementPostNavigationPostTextTransform({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    prefix: "postTypography"
  });
}

export function cssStyleElementPostNavigationColorTitle({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    prefix: "titleColor",
    getConfig,
    state,
    store
  });
}

export function cssStyleElementPostNavigationColorPost({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    prefix: "postColor",
    state,
    getConfig,
    store
  });
}

export function cssStyleElementPostNavigationSpacing({
  v,
  device,
  state,
  getConfig,
  store
}) {
  const spacing = styleElementPostNavigationSpacing({
    v,
    device,
    state,
    getConfig,
    store
  });

  const showPost = styleElementPostNavigationShowPost({
    v,
    device,
    state,
    getConfig,
    store
  });

  return spacing === undefined
    ? ""
    : showPost === "off"
      ? "margin-bottom: 0;"
      : `margin-bottom:${spacing}px`;
}

export function cssStyleElementPostNavigationShowSeparation({
  v,
  device,
  getConfig,
  state,
  store
}) {
  const showSeparation = styleElementPostNavigationShowSeparation({
    v,
    device,
    getConfig,
    state,
    store
  });

  return showSeparation === undefined || showSeparation !== "off"
    ? ""
    : "content: none;";
}
