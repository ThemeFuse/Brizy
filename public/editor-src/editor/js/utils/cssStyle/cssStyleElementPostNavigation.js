import { cssStyleColor } from "visual/utils/cssStyle";
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
  return cssStyleColor({
    v,
    device,
    prefix: "titleColor",
    state
  });
}

export function cssStyleElementPostNavigationColorPost({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    prefix: "postColor",
    state
  });
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
