import { WithRenderContext, isView } from "visual/providers/RenderProvider";
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
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  if (isView(renderContext)) {
    // INFO: is needed to avoid blinking, because in preview animation always starts from 0%
    return `max-width: 0%;`;
  }

  return cssStyleSizeMaxWidthPrefixEmpty({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "percentage"
  });
}

export function cssStyleSizeProgressBarStyle1Height({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeMinHeightPx({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "style1"
  });
}

export function cssStyleSizeProgressBarStyle2Height({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "style2"
  });
}
