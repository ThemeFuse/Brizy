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
  getConfig,
  prefix = "bg"
}: CSSValue): string {
  const bgColor = styleBgColor({ v, device, state, getConfig, prefix });

  const bgGradient = styleBgGradient({
    v,
    device,
    state,
    getConfig,
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
  getConfig,
  prefix = "bg"
}: CSSValue): string {
  const bgColorHex = styleBgColorHex({ v, device, state, getConfig, prefix });

  return bgColorHex === undefined ? "" : `background-color:${bgColorHex};`;
}

export function cssStyleBg2Color({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, getConfig, store, prefix: "bg2" });
}
