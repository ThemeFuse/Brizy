import {
  styleElementWOORatingSize,
  styleColor,
  styleSizeSpacing
} from "visual/utils/style2";

export function cssStyleElementWOORatingSize({ v, device, state }) {
  return `font-size: ${styleElementWOORatingSize({ v, device, state })}px;`;
}

export function cssStyleElementWOORatingTextColor({
  v,
  device,
  state,
  prefix = "textColor"
}) {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix
  })};`;
}

export function cssStyleElementWOORatingSpacing({ v, device, state }) {
  return `margin-left: ${styleSizeSpacing({
    v,
    device,
    state
  })}px;`;
}
