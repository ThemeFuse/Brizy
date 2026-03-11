import { styleBgColor } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";

export function cssStyleElementImageComparisonThumbArrowColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "thumbArrowColor"
  });
}

export function cssStyleElementImageComparisonThumbArrowBgColor({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const bgColor = styleBgColor({
    v,
    device,
    state,
    getConfig,
    prefix: "thumbArrowBg"
  });
  return bgColor ? `background-color:${bgColor};` : "";
}
