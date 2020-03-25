import {
  stylePaddingUngrouped,
  styleElementProgressBarPercentage
} from "visual/utils/style2";

export function cssStyleElementProgressBarPadding({ v, device, state }) {
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

export function cssStyleSizeProgressBarMaxWidthPercent({ v, device, state }) {
  const percentage = styleElementProgressBarPercentage({
    v,
    device,
    state
  });

  return percentage === undefined ? "" : `max-width:${percentage}%;`;
}

export function cssStyleElementProgressBarPropertyHoverTransition() {
  return "transition-property: color, box-shadow, background, border;";
}
