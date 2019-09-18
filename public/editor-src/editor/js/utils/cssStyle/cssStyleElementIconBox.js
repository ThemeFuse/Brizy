import {
  styleElementIconBoxIconPosition,
  styleElementIconBoxMarginRight,
  styleElementIconBoxMarginLeft
} from "visual/utils/style2";

export function cssStyleElementIconBoxFlexDirection({ v, device, state }) {
  return `flex-direction:${styleElementIconBoxIconPosition({
    v,
    device,
    state
  })};`;
}

export function cssStyleElementIconBoxMarginRight({ v, device, state }) {
  return `margin-right:${styleElementIconBoxMarginRight({
    v,
    device,
    state
  })};`;
}

export function cssStyleElementIconBoxMarginLeft({ v, device, state }) {
  return `margin-left:${styleElementIconBoxMarginLeft({
    v,
    device,
    state
  })};`;
}
