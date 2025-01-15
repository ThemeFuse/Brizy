import { CSSValue } from "../style2/types";
import { cssStyleIconPosition } from "./cssStylePosition";
import { cssStyleIconMargin } from "./cssStyleSize";

export function cssStyleElementPaypalBtnSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleIconMargin({ v, device, state, store, prefix: "icon" });
}

export function cssStyleElementPaypalIconPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleIconPosition({ v, device, state, store, prefix: "icon" });
}
