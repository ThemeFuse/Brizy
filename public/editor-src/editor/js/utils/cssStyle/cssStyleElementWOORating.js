import { cssStyleColor, cssStyleSizeFontSize } from "visual/utils/cssStyle";
import { styleSizeSpacing } from "visual/utils/style2";

export function cssStyleElementWOORatingSize({ v, device, store, state }) {
  return cssStyleSizeFontSize({ v, device, store, state, prefix: "rating" });
}

export function cssStyleElementWOORatingTextColor({ v, device, store, state }) {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "textColor"
  });
}

export function cssStyleElementWOORatingSpacing({ v, device, store, state }) {
  return `margin-left: ${styleSizeSpacing({
    v,
    device,
    store,
    state
  })}px;`;
}

export function cssStyleElementWOORatingBgStarColor({
  v,
  device,
  store,
  state
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "bgStarColor"
  });
}
