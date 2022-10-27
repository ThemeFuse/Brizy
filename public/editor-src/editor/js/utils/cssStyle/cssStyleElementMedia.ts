import { stylePaddingUngrouped } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleElementMediaPadding({
  v,
  device,
  state
}: CSSValue): string {
  const paddingTop = stylePaddingUngrouped({
    v,
    device,
    state,
    current: "paddingTop"
  });
  const paddingRight = stylePaddingUngrouped({
    v,
    device,
    state,
    current: "paddingRight"
  });
  return paddingTop === undefined && paddingRight === undefined
    ? ""
    : `padding:${paddingTop}px ${paddingRight}px;`;
}
