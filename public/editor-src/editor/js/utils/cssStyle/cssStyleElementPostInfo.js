import { styleTypography2FontSize, styleColor } from "visual/utils/style2";

export function cssStyleElementPostInfoIconSize({ v, device, state }) {
  return `font-size: ${styleTypography2FontSize({ v, device, state })}px;`;
}

export function cssStyleElementPostInfoColorIcons({
  v,
  device,
  state,
  prefix = "iconsColor"
}) {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix
  })};`;
}

export function cssStyleElementPostInfoColorText({
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
