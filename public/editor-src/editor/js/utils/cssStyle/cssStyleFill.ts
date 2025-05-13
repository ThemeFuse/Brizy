import { styleColor } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleFill({
  v,
  device,
  state,
  getConfig,
  prefix = "fillColor"
}: CSSValue): string {
  const fill = styleColor({ v, device, state, getConfig, prefix });

  return fill === undefined ? "" : `fill:${fill};`;
}
