import {
  styleBgColor,
  styleBgColorHex,
  styleBgGradient
} from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleBgColor({
  v,
  device,
  state,
  store,
  prefix = "bg"
}: CSSValue): string {
  const bgColor = styleBgColor({ v, device, state, store, prefix });

  const bgGradient = styleBgGradient({
    v,
    device,
    state,
    store
  });

  return bgColor === undefined || bgGradient !== "none"
    ? "background-color:transparent;"
    : `background-color:${bgColor};`;
}

export function cssStyleBgColorHex({
  v,
  device,
  state,
  store,
  prefix = "bg"
}: CSSValue): string {
  const bgColorHex = styleBgColorHex({ v, device, state, store, prefix });

  return bgColorHex === undefined ? "" : `background-color:${bgColorHex};`;
}

export function cssStyleBg2Color({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "bg2" });
}
