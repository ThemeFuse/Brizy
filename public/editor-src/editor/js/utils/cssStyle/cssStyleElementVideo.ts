import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleColor,
  cssStylePadding,
  cssStyleSizeFontSize,
  cssStyleSizeSize,
  cssStyleSizeSizeHeight
} from "visual/utils/cssStyle";
import {
  styleElementVideoCoverSrc,
  styleElementVideoIconFontSize,
  styleElementVideoRatio
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleElementVideoRatio({
  v,
  device,
  state
}: CSSValue): string {
  const ratio = styleElementVideoRatio({ v, device, state });

  return ratio === undefined ? "" : `aspect-ratio:${ratio};`;
}

export function cssStyleElementVideoBgSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const coverZoom = dvv("coverZoom");

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
  return cssStyleSizeSize({ v, device, state, prefix: "icon" });
}

export function cssStyleElementVideoIconHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeSizeHeight({ v, device, state, prefix: "icon" });
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
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const positionX = dvv("coverPositionX");
  const positionY = dvv("coverPositionY");

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

  const isCustomVideo = v.type === "custom";

  const bottomMarginGrouped =
    v.controls === "on" && isCustomVideo ? "margin-bottom:0;" : "";

  const bottomMarginUngrouped =
    v.controls === "on" && isCustomVideo
      ? 0
      : `${p.paddingBottom}${p.paddingBottomSuffix}`;

  return noEmptyGrouped
    ? `margin: ${p.paddingTop}${p.paddingTopSuffix};${bottomMarginGrouped}`
    : `margin: ${p.paddingTop}${p.paddingTopSuffix} ${p.paddingRight}${p.paddingRightSuffix} ${bottomMarginUngrouped} ${p.paddingLeft}${p.paddingLeftSuffix};`;
}
