import { cssStyleSizeFontSize } from "visual/utils/cssStyle";
import { stylePaddingUngrouped } from "visual/utils/style2";

export function cssStyleElementMediaIconFontSize({ v, device, state }) {
  return cssStyleSizeFontSize({ v, device, state, prefix: "iconCustom" });
}

export function cssStyleElementMediaPadding({ v, device, state }) {
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
