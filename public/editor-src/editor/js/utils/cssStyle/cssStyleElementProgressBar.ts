import {
  cssStyleSizeHeight,
  cssStyleSizeMaxWidthPrefixEmpty,
  cssStyleSizeMinHeightPx
} from "visual/utils/cssStyle";
import { stylePaddingUngrouped } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleElementProgressBarPadding({
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

export function cssStyleSizeProgressBarMaxWidthPercent({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMaxWidthPrefixEmpty({
    v,
    device,
    state,
    prefix: "percentage"
  });
}

export function cssStyleSizeProgressBarStyle1Height({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMinHeightPx({
    v,
    device,
    state,
    prefix: "style1"
  });
}

export function cssStyleSizeProgressBarStyle2Height({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    prefix: "style2"
  });
}
