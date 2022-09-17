import { cssStyleColor, cssStyleSizeFontSize } from "visual/utils/cssStyle";
import { styleSizeSpacing } from "visual/utils/style2";

export function cssStyleElementWOORatingSize({ v, device, state }) {
  return cssStyleSizeFontSize({ v, device, state, prefix: "rating" });
}

export function cssStyleElementWOORatingTextColor({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "textColor"
  });
}

export function cssStyleElementWOORatingSpacing({ v, device, state }) {
  return `margin-left: ${styleSizeSpacing({
    v,
    device,
    state
  })}px;`;
}

export function cssStyleElementWOORatingBgStarColor({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "bgStarColor"
  });
}
