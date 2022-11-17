import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleColor,
  cssStylePadding,
  cssStyleSizeFontSize,
  cssStyleSizeHeight,
  cssStyleSizeWidth
} from "visual/utils/cssStyle";
import {
  styleElementVideoBgColorRatio,
  styleElementVideoCoverPositionX,
  styleElementVideoCoverPositionY,
  styleElementVideoCoverSrc,
  styleElementVideoCoverZoom,
  styleElementVideoIconFontSize,
  styleElementVideoPaddingRatio
} from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleElementVideoPaddingRatio({
  v,
  device,
  state
}: CSSValue): string {
  const paddingRatio = styleElementVideoPaddingRatio({ v, device, state });

  return paddingRatio === undefined ? "" : `padding-top:${paddingRatio};`;
}

export function cssStyleElementVideoBgSize({
  v,
  device,
  state
}: CSSValue): string {
  const coverZoom = styleElementVideoCoverZoom({ v, device, state });

  return coverZoom === undefined ? "" : `background-size:${coverZoom}%;`;
}

export function cssStyleElementVideoIconFontSize({
  v,
  device,
  state
}: CSSValue): string {
  const fontSize = styleElementVideoIconFontSize({ v, device, state });

  return fontSize === undefined ? "" : `font-size:${fontSize}px;`;
}

export function cssStyleElementVideoIconWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "iconSize" });
}

export function cssStyleElementVideoIconHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix: "iconSize" });
}

export function cssStyleElementVideoBgColorRatio({
  v,
  device,
  state
}: CSSValue): string {
  const backgroundColor = styleElementVideoBgColorRatio({
    v,
    device,
    state
  });

  return backgroundColor === undefined
    ? ""
    : `background-color:${backgroundColor};`;
}

export function cssStyleElementVideoCoverSrc({
  v,
  device,
  state
}: CSSValue): string {
  const coverSrc = styleElementVideoCoverSrc({ v, device, state });

  return coverSrc ? `background-image:${coverSrc};` : "";
}

export function cssStyleElementVideoCoverPosition({
  v,
  device,
  state
}: CSSValue): string {
  const positionX = styleElementVideoCoverPositionX({ v, device, state });
  const positionY = styleElementVideoCoverPositionY({ v, device, state });

  return positionX === undefined && positionY === undefined
    ? ""
    : `background-position:${positionX}% ${positionY}%;`;
}

export function cssStyleVideoControlsBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "controlsBg" });
}

export function cssStyleVideoIconControls({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "iconControlsColor" });
}

export function cssStyleElementVideoControlsIconFontSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeFontSize({
    v,
    device,
    state,
    prefix: "controlsIconCustom"
  });
}

export function cssStyleElementVideoBgColorPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "paddingBg" });
}

export function cssStyleElementVideoBgGradientPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "padding" });
}

export function cssStyleElementVideoCoverPaddingBG({
  v,
  device,
  state
}: CSSValue): string {
  const p = cssStylePadding({ v, device, state, prefix: "bg" });

  const noEmptyGrouped =
    p.paddingTop === p.paddingRight &&
    p.paddingTop === p.paddingBottom &&
    p.paddingTop === p.paddingLeft &&
    p.paddingTop > 0;

  const empty =
    p.paddingTop === 0 &&
    p.paddingRight === 0 &&
    p.paddingBottom === 0 &&
    p.paddingLeft === 0;

  if (empty) {
    return "margin:0;";
  } else if (noEmptyGrouped) {
    return `margin:${p.paddingTop}${p.paddingTopSuffix};`;
  } else {
    return `margin:${p.paddingTop}${p.paddingTopSuffix} ${p.paddingRight}${p.paddingRightSuffix} ${p.paddingBottom}${p.paddingBottomSuffix} ${p.paddingLeft}${p.paddingLeftSuffix};`;
  }
}
