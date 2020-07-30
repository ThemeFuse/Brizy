import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleColor,
  styleElementPostNavigationSpacing,
  styleElementPostNavigationShowPost,
  styleSizeHeight,
  styleElementPostNavigationShowSeparation
} from "visual/utils/style2";

export function cssStyleElementPostNavigation2TitleFontFamily({ v, device }) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "titleTypography"
      })};`
    : "";
}

export function cssStyleElementPostNavigation2TitleFontSize({ v, device }) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "titleTypography"
  })}px;`;
}

export function cssStyleElementPostNavigation2TitleLineHeight({ v, device }) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleFontWeight({ v, device }) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "titleTypography"
  })};`;
}

export function cssStyleElementPostNavigation2TitleLetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "titleTypography"
  })}px;`;
}

export function cssStyleElementPostNavigation2PostFontFamily({ v, device }) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "postTypography"
      })};`
    : "";
}

export function cssStyleElementPostNavigation2PostFontSize({ v, device }) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "postTypography"
  })}px;`;
}

export function cssStyleElementPostNavigation2PostLineHeight({ v, device }) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostFontWeight({ v, device }) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "postTypography"
  })};`;
}

export function cssStyleElementPostNavigation2PostLetterSpacing({ v, device }) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "postTypography"
  })}px;`;
}

export function cssStyleElementPostNavigationColorTitle({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "titleColor",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementPostNavigationColorPost({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "postColor",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementPostNavigationSpacing({ v, device, state }) {
  const spacing = styleElementPostNavigationSpacing({
    v,
    device,
    state
  });

  const showPost = styleElementPostNavigationShowPost({ v, device, state });

  return spacing === undefined
    ? ""
    : showPost === "off"
    ? "margin-bottom: 0;"
    : `margin-bottom:${spacing}px`;
}

export function cssStyleElementPostNavigationSeparationHeight({
  v,
  device,
  state
}) {
  const height = styleSizeHeight({ v, device, state });
  return height === undefined ? "" : `height:${height}%;`;
}

export function cssStyleElementPostNavigationShowSeparation({
  v,
  device,
  state
}) {
  const showSeparation = styleElementPostNavigationShowSeparation({
    v,
    device,
    state
  });

  return showSeparation === undefined || showSeparation !== "off"
    ? ""
    : "content: none;";
}
