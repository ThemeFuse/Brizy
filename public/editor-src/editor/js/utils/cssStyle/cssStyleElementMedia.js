import {
  styleElementMediaIconCustomSize,
  stylePaddingUngrouped
} from "visual/utils/style2";

export function cssStyleElementMediaIconFontSize({ v, device, state }) {
  const iconCustomSize = styleElementMediaIconCustomSize({ v, device, state });

  return iconCustomSize === undefined ? "" : `font-size:${iconCustomSize}px;`;
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
