import {
  styleBorderWidth,
  styleBorderStyle,
  styleBorderColor
} from "visual/utils/style2";

export function cssStyleElementLineBorder({ v, device, state }) {
  return `border-top:${styleBorderWidth({
    v,
    device,
    state
  })} ${styleBorderStyle({ v, device, state })} ${styleBorderColor({
    v,
    device,
    state
  })};`;
}
