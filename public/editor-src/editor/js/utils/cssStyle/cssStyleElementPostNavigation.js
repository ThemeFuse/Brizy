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
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        store,
        v,
        device,
        prefix: "titleTypography",
        renderContext
      })};`
    : "";
}

export function cssStyleElementPostNavigation2TitleFontSize({
  v,
  device,
  store
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    prefix: "titleTypography"
  })}px;`;
}

export function cssStyleElementPostNavigation2TitleLineHeight({
  v,
  device,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleFontWeight({
  v,
  device,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleLetterSpacing({
  v,
  device,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "titleTypography"
  });
}

export function cssStyleElementPostNavigationTitleTextTransform({
  v,
  device,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    prefix: "titleTypography"
  });
}
export function cssStyleElementPostNavigation2PostFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        prefix: "postTypography",
        renderContext
      })};`
    : "";
}

export function cssStyleElementPostNavigation2PostFontSize({
  v,
  device,
  store
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    prefix: "postTypography"
  })}px;`;
}

export function cssStyleElementPostNavigation2PostLineHeight({
  v,
  device,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostFontWeight({
  v,
  device,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostLetterSpacing({
  v,
  device,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "postTypography"
  });
}

export function cssStyleElementPostNavigationPostTextTransform({
  v,
  device,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    prefix: "postTypography"
  });
}

export function cssStyleElementPostNavigationColorTitle({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({
    v,
    device,
    prefix: "titleColor",
    state,
    store
  });
}

export function cssStyleElementPostNavigationColorPost({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({
    v,
    device,
    prefix: "postColor",
    state,
    store
  });
}

export function cssStyleElementPostNavigationSpacing({
  v,
  device,
  state,
  store
}) {
  const spacing = styleElementPostNavigationSpacing({
    v,
    device,
    state,
    store
  });

  const showPost = styleElementPostNavigationShowPost({
    v,
    device,
    state,
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
  state,
  store
}) {
  const showSeparation = styleElementPostNavigationShowSeparation({
    v,
    device,
    state,
    store
  });

  return showSeparation === undefined || showSeparation !== "off"
    ? ""
    : "content: none;";
}
