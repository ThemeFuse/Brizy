import {
  styleBorderWidthUngrouped,
  styleBorderStyle,
  styleBorderColor
} from "visual/utils/style2";

export function cssStyleElementLineBorder({ v, device, state }) {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    current: "borderTopWidth"
  });
  const borderStyle = styleBorderStyle({ v, device, state });

  const borderColor = styleBorderColor({
    v,
    device,
    state
  });

  return borderWidth === undefined
    ? ""
    : `border-top:${borderWidth}px ${borderStyle} ${borderColor};`;
}
