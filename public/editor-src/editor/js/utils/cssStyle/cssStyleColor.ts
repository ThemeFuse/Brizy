import { styleColor } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleColor({
  v,
  device,
  state,
  store,
  prefix
}: CSSValue): string {
  const color = styleColor({ v, device, state, store, prefix });

  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleLabelColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state, store, prefix: "labelColor" });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleCustomIconColor({
  v,
  device,
  state,
  store,
  prefix = "color"
}: CSSValue): string {
  const color = styleColor({ v, device, store, state, prefix });

  return color === undefined ? "" : `background-color:${color};`;
}
