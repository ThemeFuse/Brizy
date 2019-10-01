import { styleElementBreadcrumbsSpacing } from "visual/utils/style2";
import { styleTypography2FontSize, styleColor } from "visual/utils/style2";

export function cssStyleElementBreadcrumbsWidth() {
  return `width: auto;`;
}

export function cssStyleElementBreadcrumbsSpacing({ v, device, state }) {
  return `margin-right: ${styleElementBreadcrumbsSpacing({
    v,
    device,
    state
  })}px;`;
}

export function cssStyleElementBreadcrumbsArrowSize({ v, device, state }) {
  return `font-size: ${styleTypography2FontSize({ v, device, state }) / 2}px;`;
}

export function cssStyleElementBreadcrumbsColorActive({
  v,
  device,
  state,
  prefix = "activeColor"
}) {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix
  })};`;
}

export function cssStyleElementBreadcrumbsColorArrows({
  v,
  device,
  state,
  prefix = "arrowsColor"
}) {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix
  })};`;
}
