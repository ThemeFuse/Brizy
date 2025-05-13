import { styleColor } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleColor({
  v,
  device,
  state,
  getConfig,
  prefix
}: CSSValue): string {
  const color = styleColor({ v, device, state, getConfig, prefix });

  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleLabelColor({
  v,
  device,
  getConfig,
  state
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "labelColor"
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleCustomIconColor({
  v,
  device,
  state,
  getConfig,
  prefix = "color"
}: CSSValue): string {
  const color = styleColor({ v, device, getConfig, state, prefix });

  return color === undefined ? "" : `background-color:${color};`;
}
