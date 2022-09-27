import { styleColor } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleColor({ v, device, state, prefix }: CSSValue): string {
  const color = styleColor({ v, device, state, prefix });

  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleLabelColor({ v, device, state }: CSSValue): string {
  const color = styleColor({ v, device, state, prefix: "labelColor" });
  return color === undefined ? "" : `color:${color};`;
}
