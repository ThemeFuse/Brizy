import {
  stylePaddingUngrouped,
  styleElementProgressBarPercentage
} from "visual/utils/style2";
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
  const percentage = styleElementProgressBarPercentage({
    v,
    device,
    state
  });

  return percentage === undefined ? "" : `max-width:${percentage}%;`;
}

export function cssStyleElementProgressBarPropertyHoverTransition(): string {
  return "transition-property: color, background, box-shadow;";
}
