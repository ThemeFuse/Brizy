import {
  stylePadding,
  styleElementProgressBarPercentage
} from "visual/utils/style2";

export function cssStyleElementProgressBarPadding({ v, device, state }) {
  return `padding:${stylePadding({
    v,
    device,
    state,
    current: "paddingTop"
  })} ${stylePadding({
    v,
    device,
    state,
    current: "paddingRight"
  })};`;
}

export function cssStyleSizeMaxWidthPercent({ v, device, state }) {
  return `max-width:${styleElementProgressBarPercentage({
    v,
    device,
    state
  })};`;
}
