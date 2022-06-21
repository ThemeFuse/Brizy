import { styleColor } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleFill({
  v,
  device,
  state,
  prefix = "fillColor"
}: CSSValue): string {
  const fill = styleColor({ v, device, state, prefix });

  return fill === undefined ? "" : `fill:${fill};`;
}
