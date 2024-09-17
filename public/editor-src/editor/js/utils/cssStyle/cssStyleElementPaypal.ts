import { CSSValue } from "../style2/types";
import { cssStyleIconPosition } from "./cssStylePosition";
import { cssStyleIconMargin } from "./cssStyleSize";

export function cssStyleElementPaypalBtnSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleIconMargin({ v, device, state, prefix: "icon" });
}

export function cssStyleElementPaypalIconPosition({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleIconPosition({ v, device, state, prefix: "icon" });
}
