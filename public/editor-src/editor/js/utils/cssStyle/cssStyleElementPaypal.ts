import { CSSValue } from "../style2/types";
import { cssStyleIconPosition } from "./cssStylePosition";
import { cssStyleIconMargin } from "./cssStyleSize";

export function cssStyleElementPaypalBtnSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleIconMargin({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "icon"
  });
}

export function cssStyleElementPaypalIconPosition({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleIconPosition({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "icon"
  });
}
