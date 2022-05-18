import { styleColor } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleStroke({
  v,
  device,
  state,
  prefix = "strokeColor"
}: CSSValue): string {
  const stroke = styleColor({ v, device, state, prefix });

  return stroke === undefined ? "" : `stroke:${stroke};`;
}
