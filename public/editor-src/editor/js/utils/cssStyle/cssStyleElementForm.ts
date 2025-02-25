import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";

export function cssStyleElementFormMargin({ v, device, state }: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const padding = dvv("padding");

  return padding === undefined
    ? ""
    : `margin: 0 -${padding / 2}px 0 -${padding / 2}px;`;
}
