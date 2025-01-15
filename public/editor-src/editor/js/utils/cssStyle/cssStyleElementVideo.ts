import {
  cssStyleSizeSize,
  cssStyleSizeSizeHeight
} from "visual/utils/cssStyle";
import {
  styleElementVideoCoverSrc,
  styleElementVideoIconFontSize
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

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
  state,
  store
}: CSSValue): string {
  const fontSize = styleElementVideoIconFontSize({ v, device, state, store });

  return fontSize === undefined ? "" : `font-size:${fontSize}px;`;
}

export function cssStyleElementVideoIconWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeSize({ v, device, state, store, prefix: "icon" });
}

export function cssStyleElementVideoIconHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeSizeHeight({ v, device, state, store, prefix: "icon" });
}

export function cssStyleElementVideoCoverSrc({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const coverSrc = styleElementVideoCoverSrc({ v, device, state, store });

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
